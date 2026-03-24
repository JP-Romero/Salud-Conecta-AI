/**
═══════════════════════════════════════════════════════════════
SALUD-CONECTA AI — Cloudflare Worker (Backend Proxy)
═══════════════════════════════════════════════════════════════
IA: Groq (Llama 3.3 70B) — Gratis, sin restricciones por país
14,400 peticiones/día gratis · Funciona en Nicaragua

DESPLIEGUE:
  1. wrangler secret put GROQ_API_KEY      ← pegar gsk_...
  2. wrangler secret put ALLOWED_ORIGIN    ← URL de GitHub Pages
  3. wrangler deploy
═══════════════════════════════════════════════════════════════
*/

const GROQ_MODEL     = 'llama-3.3-70b-versatile';
const MAX_TOKENS     = 800;
const RATE_LIMIT_RPM = 20;
const RATE_LIMIT_RPH = 200;

const rateLimitMap = new Map();

const SYSTEM_PROMPT = `Eres SaludConecta AI, asistente de orientación de salud preventiva para Granada, Nicaragua. No eres médico ni reemplazas la consulta médica profesional.

RECURSOS LOCALES EN GRANADA (SILAIS/MINSA):
• Emergencias nacionales: 128 (Bomberos/SILAIS - gratuito, 24h)
• Cruz Roja Granada: 2552-5555
• Hospital Amistad Japón Nicaragua: 2552-7050 — Hospital Departamental público principal (24h, urgencias gratuitas)
• Hospital SERMESA Granada: 2552-4444 — Hospital privado (Atención INSS y particular, 24h)
• C.S. Jorge Sinforoso Bravo: 2552-0600 — Centro de Salud principal (Frente Parque Sandino)
• C.S. Pedro José Chamorro: 2552-0550 — Barrio Calle Palmira
• Farmacia Del Pueblo: 2552-5000 — 24 horas, Parque Central

INSTRUCCIONES:
1. Responde SIEMPRE en español sencillo y empático (como un familiar de confianza).
2. Comienza SIEMPRE con el nivel de urgencia:
   🔴 URGENCIA ALTA — Ir a urgencias o llamar al 128 de inmediato.
   🟡 URGENCIA MEDIA — Consultar médico en las próximas 24-48 horas.
   🟢 URGENCIA BAJA — Manejo en casa con vigilancia de síntomas.
3. Para ALTA: La acción inmediata es siempre llamar al 128 o acudir al Hospital Amistad Japón Nicaragua.
4. Para MEDIA: Recomienda acudir al Centro de Salud Jorge Sinforoso Bravo o su centro de salud local más cercano.
5. Para BAJA: Proporciona 4-6 consejos de autocuidado seguros, claros y útiles.
6. Proporciona respuestas detalladas y completas si el usuario lo necesita, sin cortarlas artificialmente.
7. NUNCA proporciones diagnósticos médicos definitivos.
8. NUNCA prescribas ni recomiendes dosis específicas de medicamentos.
9. Usa un tono preventivo y orientador.
10. Termina SIEMPRE con: "⚕️ Esto es orientación informativa. Consulta con un profesional de salud."`;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return corsPreflightResponse(env);
    if (request.method !== 'POST')    return jsonError('Método no permitido', 405);

    const url = new URL(request.url);
    if (url.pathname !== '/chat')     return jsonError('Ruta no encontrada', 404);

    // CORS
    const origin        = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    if (allowedOrigin !== '*' && !origin.startsWith(allowedOrigin)) {
      return jsonError('Origen no permitido', 403);
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rl  = checkRateLimit(ip);
    if (!rl.allowed) {
      return jsonError(
        `Demasiadas consultas seguidas. Espera ${rl.waitSeconds} segundos.`,
        429,
        { 'Retry-After': String(rl.waitSeconds) }
      );
    }

    // Leer body
    let body;
    try { body = await request.json(); }
    catch { return jsonError('Petición inválida', 400); }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonError('El campo "messages" es requerido', 400);
    }

    // Sanitizar — Groq usa el mismo formato que OpenAI (role: user/assistant)
    const sanitized = messages
      .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }))
      .slice(-20);

    if (!sanitized.length || sanitized[sanitized.length - 1].role !== 'user') {
      return jsonError('El último mensaje debe ser del usuario', 400);
    }

    if (!env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY no configurada');
      return jsonError('Servicio no disponible. Contacta al administrador.', 503);
    }

    // Llamar a Groq (API compatible con OpenAI)
    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model:       GROQ_MODEL,
          max_tokens:  MAX_TOKENS,
          temperature: 0.4,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...sanitized
          ]
        })
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error('Groq error:', resp.status, txt);
        const msg = resp.status === 429
          ? 'El servicio de IA está temporalmente ocupado. Intenta en unos segundos.'
          : 'Error al consultar el servicio de IA. Intenta de nuevo.';
        return jsonError(msg, 502);
      }

      const data = await resp.json();
      const text = data.choices?.[0]?.message?.content || '';

      return new Response(
        JSON.stringify({ response: text }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders(allowedOrigin) } }
      );

    } catch (err) {
      console.error('Worker error:', err);
      return jsonError('Error de conexión con el servicio de IA.', 502);
    }
  }
};

function checkRateLimit(ip) {
  const now       = Date.now();
  const minKey    = `${ip}:${Math.floor(now / 60000)}`;
  const hourKey   = `${ip}:${Math.floor(now / 3600000)}:h`;
  const minCount  = (rateLimitMap.get(minKey)  || 0) + 1;
  const hourCount = (rateLimitMap.get(hourKey) || 0) + 1;

  if (minCount  > RATE_LIMIT_RPM) return { allowed: false, waitSeconds: 60   - ((now % 60000)   / 1000 | 0) };
  if (hourCount > RATE_LIMIT_RPH) return { allowed: false, waitSeconds: 3600 - ((now % 3600000) / 1000 | 0) };

  rateLimitMap.set(minKey,  minCount);
  rateLimitMap.set(hourKey, hourCount);

  if (rateLimitMap.size > 5000) {
    const cutoff = now - 3600000;
    for (const [k] of rateLimitMap) {
      if (parseInt(k.split(':')[1]) * 60000 < cutoff) rateLimitMap.delete(k);
    }
  }
  return { allowed: true };
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400'
  };
}

function corsPreflightResponse(env) {
  return new Response(null, { status: 204, headers: corsHeaders(env.ALLOWED_ORIGIN || '*') });
}

function jsonError(message, status, extra = {}) {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', ...extra } }
  );
}

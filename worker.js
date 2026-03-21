/**
═══════════════════════════════════════════════════════════════
SALUD-CONECTA AI — Cloudflare Worker (Backend Proxy)
═══════════════════════════════════════════════════════════════
PROPÓSITO: Recibir mensajes del frontend y reenviarlos a la
API de Anthropic añadiendo la clave de forma segura.
El usuario NUNCA ve la API key.

DESPLIEGUE (una sola vez):
  1. npm install -g wrangler
  2. wrangler login
  3. wrangler secret put ANTHROPIC_API_KEY   ← pegar la clave aquí
  4. wrangler secret put ALLOWED_ORIGIN      ← ej: https://jp-romero.github.io
  5. wrangler deploy

DESPUÉS: copiar la URL del worker en app.js → WORKER_URL
═══════════════════════════════════════════════════════════════
*/

const GEMINI_MODEL   = 'gemini-2.0-flash';
const MAX_TOKENS     = 800;
const RATE_LIMIT_RPM = 20;
const RATE_LIMIT_RPH = 200;

const rateLimitMap = new Map();

const SYSTEM_PROMPT = `Eres SaludConecta AI, asistente de orientación de salud preventiva para Granada, Nicaragua. No eres médico ni reemplazas la consulta médica profesional.

RECURSOS LOCALES EN GRANADA:
• Emergencias nacionales: 133 (gratuito, 24h)
• Cruz Roja Granada: 2552-5555
• Hospital Virgen de la Asistencia: 2552-2600 — 24h, público, urgencias gratuitas
• Hospital Alemán Nicaragüense: 2552-3000 — 24h, privado
• Hospital Carlos Roberto Huembes: 2552-5100 — 24h
• Farmacia Del Pueblo: 24h, Parque Central
• Clínica Familiar (MINSA): Lun-Vie 7am-7pm, Barrio El Calvario

INSTRUCCIONES:
1. Responde SIEMPRE en español sencillo, como hablaría un familiar de confianza
2. Comienza SIEMPRE con el nivel de urgencia:
   🔴 URGENCIA ALTA — ir a urgencias o llamar al 133 ahora
   🟡 URGENCIA MEDIA — consultar médico en 24-48 horas
   🟢 URGENCIA BAJA — cuidado en casa con vigilancia
3. Para ALTA: primera acción es siempre llamar al 133 o ir al hospital
4. Para MEDIA: menciona el centro de salud específico más apropiado
5. Para BAJA: da 3-5 cuidados caseros seguros y concretos
6. NUNCA menciones diagnósticos de enfermedades específicas
7. NUNCA prescribas medicamentos
8. Máximo 4 párrafos cortos
9. Termina SIEMPRE con: "⚕️ Esto es orientación informativa. Consulta con un profesional de salud."`;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return corsPreflightResponse(env);
    if (request.method !== 'POST')    return jsonError('Método no permitido', 405);

    const url = new URL(request.url);
    if (url.pathname !== '/chat')     return jsonError('Ruta no encontrada', 404);

    // Verificar origen CORS
    const origin        = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    if (allowedOrigin !== '*' && !origin.startsWith(allowedOrigin)) {
      return jsonError('Origen no permitido', 403);
    }

    // Rate limiting por IP
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

    // Sanitizar mensajes
    const sanitized = messages
      .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }))
      .slice(-20);

    if (!sanitized.length || sanitized[sanitized.length - 1].role !== 'user') {
      return jsonError('El último mensaje debe ser del usuario', 400);
    }

    if (!env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY no configurada');
      return jsonError('Servicio no disponible. Contacta al administrador.', 503);
    }

    // Convertir historial al formato de Gemini
    // Gemini usa 'user' y 'model' (no 'assistant')
    const geminiContents = sanitized.map(m => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Llamar a Gemini
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

      const resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents:          geminiContents,
          generationConfig: {
            maxOutputTokens: MAX_TOKENS,
            temperature:     0.4
          }
        })
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error('Gemini error:', resp.status, txt);
        const msg = resp.status === 429
          ? 'El servicio de IA está temporalmente ocupado. Intenta en unos segundos.'
          : 'Error al consultar el servicio de IA. Intenta de nuevo.';
        return jsonError(msg, 502);
      }

      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

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

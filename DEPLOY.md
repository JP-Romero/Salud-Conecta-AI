# Guía de despliegue — Salud-Conecta AI v6.0.0

## Arquitectura

```
Usuario (Granada) → GitHub Pages (frontend) → Cloudflare Worker (backend) → Anthropic Claude API
```

La API key de Anthropic vive únicamente en el Worker de Cloudflare.
El usuario final nunca la ve ni la necesita.

---

## Paso 1 — Desplegar el Worker en Cloudflare (una sola vez)

### Requisitos
- Cuenta gratuita en cloudflare.com
- Node.js instalado
- La API key de Anthropic (sk-ant-...)

### Comandos

```bash
# Instalar Wrangler (CLI de Cloudflare)
npm install -g wrangler

# Iniciar sesión en Cloudflare
wrangler login

# Ir a la carpeta del proyecto
cd salud-conecta

# Guardar la API key como Secret (seguro, nunca en código)
wrangler secret put ANTHROPIC_API_KEY
# → te pedirá pegar la clave: sk-ant-api03-...

# Guardar el origen permitido (URL de tu GitHub Pages)
wrangler secret put ALLOWED_ORIGIN
# → pegar: https://jp-romero.github.io

# Desplegar el worker
wrangler deploy
```

Al finalizar, Wrangler muestra la URL del worker:
```
https://salud-conecta-api.TU-USUARIO.workers.dev
```

---

## Paso 2 — Conectar el frontend con el Worker

Abrir `app.js` y actualizar la línea 32:

```javascript
// ANTES (placeholder)
const WORKER_URL = 'https://salud-conecta-api.TU-USUARIO.workers.dev/chat';

// DESPUÉS (con tu URL real)
const WORKER_URL = 'https://salud-conecta-api.jp-romero.workers.dev/chat';
```

---

## Paso 3 — Publicar el frontend en GitHub Pages

```bash
git add .
git commit -m "v6.0.0: backend proxy, voz, bugs corregidos"
git push origin main
```

GitHub Pages publicará automáticamente desde la rama `main`.

---

## Tier gratuito de Cloudflare Workers

| Recurso         | Límite gratuito     |
|-----------------|---------------------|
| Peticiones/día  | 100,000             |
| CPU por petición| 10ms                |
| Memoria         | 128MB               |
| Dominios custom | Incluido            |

Para una app comunitaria de Granada, 100,000 peticiones/día es más que suficiente.

---

## Actualizar la API key en el futuro

```bash
wrangler secret put ANTHROPIC_API_KEY
# → pegar la nueva clave
wrangler deploy
```

No es necesario tocar el frontend.

---

## Verificar que el Worker funciona

```bash
curl -X POST https://salud-conecta-api.TU-USUARIO.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola, tengo fiebre"}]}'
```

Debe devolver:
```json
{"response":"🟡 URGENCIA MEDIA — ..."}
```

# Salud-Conecta AI

Salud-Conecta AI es una plataforma digital diseñada para reducir la brecha entre los ciudadanos y los servicios de salud preventiva. Es una Aplicación Web Progresiva (PWA) que utiliza Inteligencia Artificial para ofrecer un triaje preliminar (pre-clasificación de síntomas) y geolocalización de centros médicos cercanos.

## Características Principales

- **Triaje por IA:** Sistema de chat interactivo para la pre-clasificación de síntomas basada en palabras clave y lógica conversacional.
- **Centros Médicos Cercanos:** Mapa interactivo integrado con Leaflet y Google Maps que muestra automáticamente los centros de salud más cercanos a la ubicación del usuario.
- **PWA (Progressive Web App):** Instalable en dispositivos móviles y funcional sin conexión gracias al uso de Service Workers.
- **Interfaz Moderna:** Diseño limpio, responsivo y optimizado para una experiencia de usuario fluida en salud digital.
- **Seguridad:** Implementación de protección contra ataques XSS en el chat y manejo robusto de permisos de geolocalización.

## Requisitos de Instalación (Local)

1. Clona el repositorio.
2. Abre `salud-conecta-pwa/index.html` en un servidor web local (como Live Server de VS Code).
3. (Opcional) Para habilitar completamente Google Maps, reemplaza `YOUR_GOOGLE_MAPS_API_KEY` en `index.html` con una clave de API válida.

## Estado del Proyecto

Para una revisión técnica detallada de las últimas mejoras e implementaciones, consulta [REVISION_TECNICA.md](./REVISION_TECNICA.md).

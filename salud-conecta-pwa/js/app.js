// app.js - Versión Mejorada
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registrado con éxito:', registration.scope);
      }, function(err) {
        console.log('Error al registrar el ServiceWorker:', err);
      });
  });
}

document.addEventListener('DOMContentLoaded', function() {
    const btnTriage = document.getElementById('btn-triage');
    const btnMap = document.getElementById('btn-map');
    const dynamicContent = document.getElementById('dynamic-content');

    // Función para manejar el estado activo de los botones de navegación
    function setActiveNav(buttonId) {
        [btnTriage, btnMap].forEach(btn => btn.classList.remove('active'));
        document.getElementById(buttonId).classList.add('active');
    }

    // Función para cargar la interfaz de triaje
    function loadTriageInterface() {
        setActiveNav('btn-triage');
        dynamicContent.innerHTML = `
            <div id="triage-container">
                <div id="chat-messages">
                    <p class="bot-message"><strong>Asistente Salud-Conecta AI:</strong> Hola, soy tu asistente virtual de salud. Estoy aquí para escucharte y darte una orientación preliminar. ¿Cómo te sientes hoy?</p>
                </div>
                <div id="input-area">
                    <input type="text" id="user-input" placeholder="Describe cómo te sientes..." autocomplete="off">
                    <button id="send-btn">Enviar</button>
                </div>
                <p style="font-size: 0.75rem; color: #888; text-align: center; margin-top: 1rem;">
                    *Esta es una orientación preliminar. Si es una emergencia, llama al número local de urgencias.*
                </p>
            </div>
        `;
        setupChatLogic();
    }

    // Función para cargar la interfaz del mapa
    function loadMapInterface() {
        setActiveNav('btn-map');
        const mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        mapContainer.innerHTML = `<h3>Centros Médicos Cercanos</h3><p id="map-loading">Buscando tu ubicación...</p>`;
        dynamicContent.innerHTML = '';
        dynamicContent.appendChild(mapContainer);

        if (!navigator.geolocation) {
            document.getElementById('map-loading').textContent = 'La geolocalización no es soportada por tu navegador.';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapIframe = document.createElement('iframe');
                mapIframe.width = '100%';
                mapIframe.height = '450';
                mapIframe.style.border = '0';
                mapIframe.loading = 'lazy';
                mapIframe.allowFullscreen = true;
                mapIframe.referrerpolicy = 'no-referrer-when-downgrade';

                // Usamos la API de visualización de Google Maps (sin clave para este ejemplo básico o con placeholder)
                mapIframe.src = `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${latitude},${longitude}&zoom=14`;

                document.getElementById('map-loading').remove();
                mapContainer.appendChild(mapIframe);
            },
            (error) => {
                let errorMessage = 'Error al obtener tu ubicación: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += "Permiso denegado. Por favor, habilita la geolocalización.";
                        break;
                    default:
                        errorMessage += "Información no disponible.";
                        break;
                }
                document.getElementById('map-loading').innerHTML = `<p>${errorMessage}</p><p style="font-size: 0.9rem;">Mientras tanto, puedes buscar manualmente en Google Maps.</p>`;
            }
        );
    }

    // Lógica del chat mejorada
    function setupChatLogic() {
        const input = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const messagesDiv = document.getElementById('chat-messages');

        function addMessage(text, sender) {
            const messageWrapper = document.createElement('div');
            messageWrapper.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
            messageWrapper.innerHTML = `<strong>${sender === 'user' ? 'Tú' : 'Asistente'}:</strong> ${text}`;
            messagesDiv.appendChild(messageWrapper);
            messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' });
        }

        function getBotResponse(userMessage) {
            const msg = userMessage.toLowerCase();

            // Lógica de respuesta más estructurada
            if (msg.length < 3) {
                return "Por favor, cuéntame un poco más sobre cómo te sientes para poder orientarte mejor.";
            }

            if (msg.includes("hola") || msg.includes("buenos días") || msg.includes("buenas tardes")) {
                return "¡Hola! Estoy listo para ayudarte con un triaje preliminar. ¿Qué síntomas o molestias presentas?";
            }

            if (msg.includes("pecho") || msg.includes("respirar") || msg.includes("aire")) {
                return "⚠️ Detecto síntomas que podrían ser graves. Si sientes opresión en el pecho o gran dificultad para respirar, te recomiendo acudir de inmediato a urgencias o llamar a emergencias.";
            }

            if (msg.includes("dolor de cabeza") || msg.includes("migraña")) {
                return "Entiendo, el dolor de cabeza puede tener muchas causas. ¿Es un dolor intenso, repentino, o viene acompañado de fiebre o visión borrosa?";
            }

            if (msg.includes("fiebre") || msg.includes("temperatura")) {
                return "La fiebre es una señal de que tu cuerpo está combatiendo algo. ¿Has medido tu temperatura? Si supera los 39°C o persiste por más de 48h, consulta a un médico.";
            }

            if (msg.includes("estomago") || msg.includes("vómito") || msg.includes("diarrea")) {
                return "Los problemas estomacales son comunes. Recuerda mantenerte muy bien hidratado con suero oral. Si el dolor es muy fuerte en el lado derecho del abdomen, busca atención médica.";
            }

            if (msg.includes("gracias") || msg.includes("adios") || msg.includes("chau")) {
                return "¡De nada! Espero que te sientas mejor pronto. No olvides que estoy aquí si necesitas más información.";
            }

            return "He tomado nota de lo que comentas. Recuerda que soy una IA y mi consejo no reemplaza a un médico. ¿Hay algún otro síntoma que deba saber?";
        }

        sendBtn.addEventListener('click', function() {
            const message = input.value.trim();
            if (message) {
                addMessage(message, 'user');
                input.value = '';

                // Efecto de "escribiendo..."
                const typing = document.createElement('div');
                typing.classList.add('bot-message');
                typing.id = 'typing-indicator';
                typing.innerHTML = "<em>Escribiendo...</em>";
                messagesDiv.appendChild(typing);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;

                setTimeout(() => {
                    const indicator = document.getElementById('typing-indicator');
                    if (indicator) indicator.remove();
                    const botReply = getBotResponse(message);
                    addMessage(botReply, 'bot');
                }, 1000);
            }
        });

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });

        // Focus inicial
        input.focus();
    }

    btnTriage.addEventListener('click', loadTriageInterface);
    btnMap.addEventListener('click', loadMapInterface);

    loadTriageInterface();
});

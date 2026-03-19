// app.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
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

    // Función para cargar la interfaz de triaje
    function loadTriageInterface() {
        dynamicContent.innerHTML = `
            <div id="triage-container">
                <h3>Chat de Triaje de Síntomas</h3>
                <div id="chat-messages">
                    <p class="bot-message">Hola, soy tu asistente de triaje. ¿Cómo te sientes hoy?</p>
                </div>
                <div id="input-area">
                    <input type="text" id="user-input" placeholder="Describe tus síntomas...">
                    <button id="send-btn">Enviar</button>
                </div>
            </div>
        `;
        setupChatLogic();
    }

    // Función para cargar la interfaz del mapa con geolocalización
    function loadMapInterface() {
        const mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        mapContainer.innerHTML = `<h3>Centros Médicos Cercanos</h3><p id="map-loading">Buscando tu ubicación...</p>`;
        dynamicContent.innerHTML = ''; // Limpiar contenido anterior
        dynamicContent.appendChild(mapContainer);

        if (!navigator.geolocation) {
            document.getElementById('map-loading').textContent = 'La geolocalización no es soportada por tu navegador.';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Crear el iframe de Google Maps con la ubicación del usuario
                const mapIframe = document.createElement('iframe');
                mapIframe.width = '100%';
                mapIframe.height = '400';
                mapIframe.style.border = '0';
                mapIframe.loading = 'lazy';
                mapIframe.allowFullscreen = true;
                mapIframe.referrerpolicy = 'no-referrer-when-downgrade';

                // IMPORTANTE: Reemplaza YOUR_GOOGLE_MAPS_API_KEY con una clave válida si planeas usarla en producción.
                mapIframe.src = `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${latitude},${longitude}&zoom=14`;

                document.getElementById('map-loading').remove(); // Quitar el mensaje de carga
                mapContainer.appendChild(mapIframe);

                console.log(`Ubicación obtenida: Lat ${latitude}, Lon ${longitude}`);
            },
            (error) => {
                let errorMessage = 'Error obteniendo tu ubicación: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += "Permiso denegado. Por favor, habilita la geolocalización en tu navegador.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += "La información de ubicación no está disponible.";
                        break;
                    case error.TIMEOUT:
                        errorMessage += "La solicitud para obtener la ubicación ha expirado.";
                        break;
                    default:
                        errorMessage += "Un error desconocido ocurrió.";
                        break;
                }
                document.getElementById('map-loading').textContent = errorMessage;
            }
        );
    }

    // Función para manejar la lógica del chat
    function setupChatLogic() {
        const input = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const messagesDiv = document.getElementById('chat-messages');

        function addMessage(text, sender) {
            const messageElement = document.createElement('p');
            messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
            messageElement.textContent = text;
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // Hacer scroll hacia abajo
        }

        function getBotResponse(userMessage) {
            // Lógica muy simple de ejemplo. En una verdadera IA, esto sería más complejo.
            userMessage = userMessage.toLowerCase();
            if (userMessage.includes("dolor")) {
                return "Entiendo. ¿Podrías especificar dónde sientes dolor?";
            } else if (userMessage.includes("fiebre") || userMessage.includes("calentura")) {
                return "¿Has tomado tu temperatura? ¿Cuánto marcó?";
            } else if (userMessage.includes("tos") || userMessage.includes("respirar")) {
                return "¿Tienes dificultad para respirar o tos persistente?";
            } else {
                return "Gracias por compartir. Por favor, describe tus síntomas con más detalle.";
            }
        }

        sendBtn.addEventListener('click', function() {
            const message = input.value.trim();
            if (message) {
                addMessage(message, 'user');
                input.value = '';

                // Simulación de respuesta del bot después de un pequeño delay
                setTimeout(() => {
                    const botReply = getBotResponse(message);
                    addMessage(botReply, 'bot');
                }, 500);
            }
        });

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }

    // Eventos de click para los botones de navegación
    btnTriage.addEventListener('click', loadTriageInterface);
    btnMap.addEventListener('click', loadMapInterface);

    // Cargar la interfaz de triaje por defecto al iniciar
    loadTriageInterface();
});
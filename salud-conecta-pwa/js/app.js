// app.js - Versión Leaflet
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

    function setActiveNav(buttonId) {
        [btnTriage, btnMap].forEach(btn => btn.classList.remove('active'));
        document.getElementById(buttonId).classList.add('active');
    }

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

    // Nueva interfaz con Leaflet
    function loadMapInterface() {
        setActiveNav('btn-map');
        dynamicContent.innerHTML = `
            <div id="map-container">
                <h3>Centros Médicos Cercanos</h3>
                <div id="map" style="height: 450px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>
                <p id="map-status" style="text-align: center; margin-top: 10px; color: #666;">Buscando tu ubicación...</p>
            </div>
        `;

        if (!navigator.geolocation) {
            document.getElementById('map-status').textContent = 'La geolocalización no es soportada por tu navegador.';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                document.getElementById('map-status').textContent = 'Ubicación encontrada. Mostrando centros cercanos.';

                // Inicializar mapa de Leaflet
                const map = L.map('map').setView([latitude, longitude], 14);

                // Capas base
                const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });

                // Capas de Google Maps usando GoogleMutant
                const googleRoadmap = L.gridLayer.googleMutant({ type: 'roadmap' });
                const googleSatellite = L.gridLayer.googleMutant({ type: 'satellite' });
                const googleHybrid = L.gridLayer.googleMutant({ type: 'hybrid' });
                const googleTerrain = L.gridLayer.googleMutant({ type: 'terrain' });

                // Añadir la capa inicial
                osm.addTo(map);

                // Control de capas
                const baseMaps = {
                    "OpenStreetMap": osm,
                    "Google Roadmap": googleRoadmap,
                    "Google Satélite": googleSatellite,
                    "Google Híbrido": googleHybrid,
                    "Google Terreno": googleTerrain
                };

                L.control.layers(baseMaps, null, { collapsed: false }).addTo(map);

                // Marcador para la posición del usuario
                const userIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                L.marker([latitude, longitude], {icon: userIcon})
                    .addTo(map)
                    .bindPopup('<b>Tú estás aquí</b>')
                    .openPopup();

                // Simular centros médicos cercanos (ejemplos a pocos metros/km)
                const mockCenters = [
                    { name: "Hospital Central", lat: latitude + 0.005, lon: longitude + 0.003, type: "Hospital" },
                    { name: "Clínica Salud", lat: latitude - 0.004, lon: longitude - 0.002, type: "Clínica" },
                    { name: "Farmacia 24h", lat: latitude + 0.002, lon: longitude - 0.005, type: "Farmacia" }
                ];

                const medicalIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                mockCenters.forEach(center => {
                    L.marker([center.lat, center.lon], {icon: medicalIcon})
                        .addTo(map)
                        .bindPopup(`<b>${center.name}</b><br>${center.type}`);
                });

                console.log(`Mapa inicializado en: ${latitude}, ${longitude}`);
            },
            (error) => {
                document.getElementById('map-status').textContent = 'No se pudo obtener la ubicación. Mostrando vista predeterminada.';
                // Vista por defecto (ej. CDMX o ubicación central)
                const map = L.map('map').setView([19.4326, -99.1332], 12);

                const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                });

                const googleRoadmap = L.gridLayer.googleMutant({ type: 'roadmap' });
                googleRoadmap.addTo(map);

                const baseMaps = {
                    "OpenStreetMap": osm,
                    "Google Roadmap": googleRoadmap
                };
                L.control.layers(baseMaps).addTo(map);
            }
        );
    }

    function setupChatLogic() {
        const input = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const messagesDiv = document.getElementById('chat-messages');

        function addMessage(text, sender) {
            const messageWrapper = document.createElement('div');
            messageWrapper.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

            const senderLabel = document.createElement('strong');
            senderLabel.textContent = (sender === 'user' ? 'Tú' : 'Asistente') + ': ';

            const textSpan = document.createElement('span');
            textSpan.textContent = text;

            messageWrapper.appendChild(senderLabel);
            messageWrapper.appendChild(textSpan);

            messagesDiv.appendChild(messageWrapper);
            messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' });
        }

        function getBotResponse(userMessage) {
            const msg = userMessage.toLowerCase();
            if (msg.length < 3) return "Por favor, cuéntame un poco más sobre cómo te sientes.";
            if (msg.includes("hola")) return "¡Hola! ¿En qué puedo orientarte hoy?";
            if (msg.includes("pecho") || msg.includes("respirar")) return "⚠️ Síntomas de alerta. Busca atención médica inmediata si sientes opresión en el pecho.";
            if (msg.includes("fiebre")) return "¿Has medido tu temperatura? Si supera los 39°C o persiste, consulta a un médico.";
            return "He tomado nota. Recuerda que esta es una orientación informativa. ¿Tienes algún otro síntoma?";
        }

        sendBtn.addEventListener('click', function() {
            const message = input.value.trim();
            if (message) {
                addMessage(message, 'user');
                input.value = '';
                const typing = document.createElement('div');
                typing.classList.add('bot-message');
                typing.id = 'typing-indicator';
                const typingContent = document.createElement('em');
                typingContent.textContent = "Escribiendo...";
                typing.appendChild(typingContent);
                messagesDiv.appendChild(typing);
                setTimeout(() => {
                    const indicator = document.getElementById('typing-indicator');
                    if (indicator) indicator.remove();
                    addMessage(getBotResponse(message), 'bot');
                }, 1000);
            }
        });

        input.addEventListener('keypress', (e) => e.key === 'Enter' && sendBtn.click());
        input.focus();
    }

    btnTriage.addEventListener('click', loadTriageInterface);
    btnMap.addEventListener('click', loadMapInterface);

    loadTriageInterface();
});

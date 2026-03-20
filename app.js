document.addEventListener('DOMContentLoaded', () => {
  // === 1. PRIVACY MODAL LOGIC ===
  const modal = document.getElementById('privacy-modal');
  const appContent = document.getElementById('app-content');
  const checkbox = document.getElementById('accept-terms');
  const btnEnter = document.getElementById('btn-enter');

  const hasAccepted = localStorage.getItem('saludConecta_consent');
  if (hasAccepted === 'true') {
    showModal(false);
  } else {
    showModal(true);
  }

  checkbox.addEventListener('change', (e) => {
    btnEnter.disabled = !e.target.checked;
  });

  btnEnter.addEventListener('click', () => {
    localStorage.setItem('saludConecta_consent', 'true');
    showModal(false);
  });

  function showModal(show) {
    modal.style.display = show ? 'flex' : 'none';
    appContent.style.display = show ? 'none' : 'block';
  }

  // === 2. ESTADO GLOBAL ===
  const appState = {
    medicationSearches: [],
    userLocation: null,
    conversationStartTime: new Date(),
    map: null, // Referencia al mapa Leaflet
    userMarker: null // Marcador de usuario
  };

  // === 3. PWA INSTALL LOGIC ===
  let deferredPrompt = null;
  const installBanner = document.getElementById('install-banner');
  const btnInstall = document.getElementById('btn-install');
  const btnDismissInstall = document.getElementById('btn-dismiss-install');
  const btnInstallHeader = document.getElementById('btn-install-header');
  const installInstructionsModal = document.getElementById('install-instructions-modal');
  const btnCloseInstallInstructions = document.getElementById('btn-close-install-instructions');
  const installStepsChrome = document.getElementById('install-steps-chrome');
  const installStepsSafari = document.getElementById('install-steps-safari');

  const installDismissed = localStorage.getItem('saludConecta_installDismissed');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installDismissed !== 'true') {
      installBanner.style.display = 'block';
      btnInstallHeader.style.display = 'block';
    }
    console.log('✅ beforeinstallprompt');
  });

  window.addEventListener('appinstalled', () => {
    installBanner.style.display = 'none';
    btnInstallHeader.style.display = 'none';
    deferredPrompt = null;
    localStorage.setItem('saludConecta_installed', 'true');
  });

  btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) { showInstallInstructions(); return; }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBanner.style.display = 'none';
      btnInstallHeader.style.display = 'none';
    }
    deferredPrompt = null;
  });

  btnInstallHeader.addEventListener('click', async () => {
    if (!deferredPrompt) { showInstallInstructions(); return; }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') btnInstallHeader.style.display = 'none';
    deferredPrompt = null;
  });

  btnDismissInstall.addEventListener('click', () => {
    installBanner.style.display = 'none';
    localStorage.setItem('saludConecta_installDismissed', 'true');
  });

  function showInstallInstructions() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    installStepsChrome.style.display = isSafari ? 'none' : 'block';
    installStepsSafari.style.display = isSafari ? 'block' : 'none';
    installInstructionsModal.style.display = 'flex';
  }

  btnCloseInstallInstructions.addEventListener('click', () => {
    installInstructionsModal.style.display = 'none';
  });
  installInstructionsModal.addEventListener('click', (e) => {
    if (e.target === installInstructionsModal) installInstructionsModal.style.display = 'none';
  });

  // === 4. CHAT & TRIAGE LOGIC ===
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const btnSend = document.getElementById('btn-send');
  const typingIndicator = document.getElementById('typing-indicator');
  const quickBtns = document.querySelectorAll('.quick-btn');
  
  const btnEmergency = document.getElementById('btn-emergency');
  const emergencyModal = document.getElementById('emergency-modal');
  const btnCloseEmergency = document.getElementById('btn-close-emergency');
  const btnShowMapEmergency = document.getElementById('btn-show-map-emergency');
  
  const btnExport = document.getElementById('btn-export');
  const exportModal = document.getElementById('export-modal');
  const btnCloseExport = document.getElementById('btn-close-export');
  const btnExportTxt = document.getElementById('btn-export-txt');
  const btnExportCopy = document.getElementById('btn-export-copy');
  const exportFeedback = document.getElementById('export-feedback');
  const anonymizeCheckbox = document.getElementById('anonymize-export');
  const includeLocationCheckbox = document.getElementById('include-location');
  const includeMedHistoryCheckbox = document.getElementById('include-med-history');
  const includeSummaryCheckbox = document.getElementById('include-summary');

  // Mapa
  const mapContainer = document.getElementById('map-container');
  const mapElement = document.getElementById('map');
  const mapLoading = document.getElementById('map-loading');
  const mapResults = document.getElementById('map-results');
  const btnCloseMap = document.getElementById('btn-close-map');

  const URGENCY_KEYWORDS = {
    HIGH: ['dolor de pecho', 'dificultad para respirar', 'sangrado', 'inconsciente', 'infarto'],
    MEDIUM: ['fiebre alta', 'vómitos', 'dolor intenso', 'mareos'],
    LOW: ['dolor de cabeza', 'cansancio', 'gripe', 'resfriado']
  };

  const DRUG_KEYWORDS = ['pastilla', 'medicamento', 'droga', 'jarabe', 'tratamiento', 'para qué sirve', 'dosis'];
  const COMMON_DRUGS = ['ibuprofeno', 'paracetamol', 'aspirina', 'amoxicilina', 'omeprazol', 'loratadina'];

  // === FUNCIONES DE UTILIDAD ===
  function getLocalTimestamp() {
    return new Date().toLocaleString('es-NI', { 
      timeZone: 'America/Managua',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function getShortTime() {
    return new Date().toLocaleTimeString('es-NI', { 
      timeZone: 'America/Managua',
      hour: '2-digit', minute: '2-digit'
    });
  }

  // === GEOLOCALIZACIÓN Y MAPA ===
  
  // Obtener ubicación del usuario
  async function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Error de geolocalización:', error);
          // Fallback: Coordenadas aproximadas de Granada, Nicaragua
          resolve({ lat: 11.9344, lng: -85.9560, fallback: true });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  // Inicializar mapa Leaflet
  function initMap(lat, lng) {
    // Si ya existe un mapa, removerlo
    if (appState.map) {
      appState.map.remove();
    }
    
    // Crear nuevo mapa centrado en la ubicación
    appState.map = L.map('map').setView([lat, lng], 14);
    
    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(appState.map);
    
    // Agregar marcador del usuario
    appState.userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div style="background:#0077b6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }).addTo(appState.map).bindPopup('📍 Tu ubicación aproximada').openPopup();
    
    // Forzar redibujado del mapa (soluciona problemas de renderizado)
    setTimeout(() => {
      appState.map.invalidateSize();
    }, 100);
  }

  // Buscar centros de salud con Overpass API
  async function searchHealthFacilities(lat, lng, radius = 2000) {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius},${lat},${lng});
        way["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius},${lat},${lng});
      );
      out center;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en Overpass API');
      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error buscando centros de salud:', error);
      // Fallback: lista estática de Granada (reemplazar con datos reales)
      return getFallbackGranadaCenters(lat, lng);
    }
  }

  // Fallback: centros conocidos en Granada (REEMPLAZAR CON DATOS REALES)
  function getFallbackGranadaCenters(userLat, userLng) {
    // ⚠️ IMPORTANTE: Juan, reemplaza estos con datos reales de Granada
    const knownCenters = [
      { name: "Hospital Virgen de la Asistencia", type: "hospital", lat: 11.9350, lng: -85.9570, address: "Centro, Granada" },
      { name: "Hospital Alemán Nicaragüense", type: "hospital", lat: 11.9320, lng: -85.9540, address: "Barrio San Antonio" },
      { name: "Farmacia Del Pueblo", type: "pharmacy", lat: 11.9340, lng: -85.9565, address: "Parque Central" },
      { name: "Centro Médico Sandoval", type: "clinic", lat: 11.9360, lng: -85.9550, address: "Calle La Calzada" }
    ];
    
    // Calcular distancia aproximada y ordenar
    return knownCenters.map(center => ({
      ...center,
      distance: calculateDistance(userLat, userLng, center.lat, center.lng)
    })).sort((a, b) => a.distance - b.distance);
  }

  // Calcular distancia aproximada (fórmula de Haversine simplificada)
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 1000); // Retornar en metros
  }

  // Mostrar centros en el mapa y en lista
  function displayHealthFacilities(facilities, userLat, userLng) {
    // Limpiar resultados anteriores
    mapResults.innerHTML = '';
    
    if (!facilities || facilities.length === 0) {
      mapResults.innerHTML = '<p style="text-align:center;color:var(--gray-text);">No se encontraron centros de salud en esta zona. Intenta ampliar la búsqueda.</p>';
      return;
    }
    
    // Iconos por tipo
    const icons = {
      hospital: '🏥',
      clinic: '🏥',
      doctors: '👨‍⚕️',
      pharmacy: '💊',
      default: '🏥'
    };
    
    facilities.forEach(facility => {
      const lat = facility.lat || facility.center?.lat;
      const lng = facility.lon || facility.center?.lon;
      if (!lat || !lng) return;
      
      const name = facility.tags?.name || facility.tags?.addr?.street || 'Sin nombre';
      const type = facility.tags?.amenity || 'health';
      const address = facility.tags?.addr?.street || facility.address || '';
      const distance = calculateDistance(userLat, userLng, lat, lng);
      const icon = icons[type] || icons.default;
      
      // Agregar marcador al mapa
      const marker = L.marker([lat, lng]).addTo(appState.map)
        .bindPopup(`
          <strong>${icon} ${name}</strong><br>
          <small>${type.toUpperCase()} • ${distance}m</small><br>
          ${address ? `<small>📍 ${address}</small>` : ''}
        `);
      
      // Agregar a la lista de resultados
      const resultItem = document.createElement('div');
      resultItem.className = 'map-result-item';
      resultItem.innerHTML = `
        <div class="map-result-info">
          <div class="map-result-name">${icon} ${name}</div>
          <div class="map-result-type">${type.toUpperCase()} • ${distance}m ${address ? '• ' + address : ''}</div>
        </div>
        <a href="https://www.openstreetmap.org/directions?from=${userLat},${userLng}&to=${lat},${lng}" 
           class="btn-directions" target="_blank" rel="noopener">
          🗺️ Ir
        </a>
      `;
      mapResults.appendChild(resultItem);
    });
    
    // Ajustar vista del mapa para mostrar todos los marcadores
    const group = new L.featureGroup(appState.map._layers);
    if (group.getLayers().length > 0) {
      appState.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  // Función principal para mostrar mapa con centros cercanos
  async function showNearbyHealthCenters() {
    // Mostrar contenedor del mapa
    mapContainer.style.display = 'block';
    chatMessages.parentElement.style.display = 'none'; // Ocultar chat temporalmente
    
    // Mostrar loading
    mapLoading.style.display = 'block';
    mapResults.innerHTML = '';
    
    try {
      // 1. Obtener ubicación del usuario
      const location = await getUserLocation();
      appState.userLocation = location;
      
      // 2. Inicializar mapa
      initMap(location.lat, location.lng);
      
      // 3. Buscar centros de salud
      const facilities = await searchHealthFacilities(location.lat, location.lng);
      
      // 4. Mostrar resultados
      displayHealthFacilities(facilities, location.lat, location.lng);
      
      if (location.fallback) {
        addMessage('🗺️ Usando ubicación aproximada de Granada. Para resultados más precisos, permite el acceso a tu ubicación en tiempo real.', 'ai', null, getShortTime());
      }
      
    } catch (error) {
      console.error('Error mostrando mapa:', error);
      mapResults.innerHTML = '<p style="color:var(--danger);text-align:center;">❌ No se pudo cargar el mapa. Verifica tu conexión a internet.</p>';
    } finally {
      mapLoading.style.display = 'none';
    }
  }

  // === SEND MESSAGE FUNCTION ===
  function sendMessage(text) {
    if (!text.trim()) return;

    const timestamp = getShortTime();
    addMessage(text, 'user', null, timestamp);
    userInput.value = '';
    btnSend.disabled = true;
    showTyping(true);

    // Detectar consulta de mapa/centros de salud
    if (text.toLowerCase().includes('mapa') || text.toLowerCase().includes('centro') || 
        text.toLowerCase().includes('hospital') || text.toLowerCase().includes('farmacia') ||
        text.toLowerCase().includes('clínica') || text.toLowerCase().includes('cerca')) {
      setTimeout(() => {
        showTyping(false);
        showNearbyHealthCenters();
        btnSend.disabled = false;
        userInput.focus();
      }, 1000);
      return;
    }

    // Detectar medicamento
    const isDrugQuery = DRUG_KEYWORDS.some(keyword => text.toLowerCase().includes(keyword));
    const foundDrug = COMMON_DRUGS.find(drug => text.toLowerCase().includes(drug));

    if (isDrugQuery && foundDrug) {
      appState.medicationSearches.push({
        drug: foundDrug,
        timestamp: getLocalTimestamp(),
        query: text
      });
      
      setTimeout(() => {
        fetchDrugInfo(foundDrug);
        btnSend.disabled = false;
        userInput.focus();
      }, 1000);
      return;
    }

    // Triage normal
    const delay = Math.random() * 1500 + 1500;
    setTimeout(() => {
      showTyping(false);
      const urgency = detectUrgency(text);
      const response = generateResponse(urgency);
      addMessage(response.text + '\n\n' + response.action, 'ai', response.urgency, getShortTime());
      scrollToBottom();
      btnSend.disabled = false;
      userInput.focus();
    }, delay);
  }

  function detectUrgency(text) {
    const lowerText = text.toLowerCase();
    if (URGENCY_KEYWORDS.HIGH.some(k => lowerText.includes(k))) return 'HIGH';
    if (URGENCY_KEYWORDS.MEDIUM.some(k => lowerText.includes(k))) return 'MEDIUM';
    return 'LOW';
  }

  function generateResponse(urgency) {
    const MOCK_RESPONSES = {
      HIGH: {
        text: "⚠️ **Atención:** Los síntomas que describes pueden indicar una condición grave.",
        action: "Te recomiendo buscar atención médica inmediata. Usa el botón 🗺️ para ver centros cercanos.",
        urgency: 'ALTA'
      },
      MEDIUM: {
        text: "🩺 **Recomendación:** Tus síntomas sugieren que deberías consultar con un profesional pronto.",
        action: "Programa una cita en una clínica de Granada. ¿Quieres ver centros cercanos en el mapa?",
        urgency: 'MEDIA'
      },
      LOW: {
        text: "✅ **Cuidados en Casa:** Tus síntomas parecen leves.",
        action: "• Descansa adecuadamente\n• Mantente hidratado\n• Si empeoran, consulta un médico",
        urgency: 'BAJA'
      }
    };
    return MOCK_RESPONSES[urgency];
  }

  async function fetchDrugInfo(drugName) {
    try {
      const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${drugName}+OR+openfda.brand_name:${drugName}&limit=1`);
      if (!response.ok) throw new Error('No encontrado');
      const data = await response.json();
      const result = data.results[0];
      
      const drugData = {
        name: result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || drugName,
        usage: result.indications_and_usage?.[0] || 'Información no disponible.',
        warnings: result.warnings_and_cautions?.[0] || result.adverse_reactions?.[0] || 'Consulte a su médico.',
        source: 'Fuente: openFDA (EE.UU.) • Verificar disponibilidad en Nicaragua'
      };
      showTyping(false);
      addDrugCard(drugData, getShortTime());
    } catch (error) {
      showTyping(false);
      addMessage(`No encontré información específica sobre "${drugName}" en la base internacional. 🌍\n\nEn Granada, consulta en farmacias locales para información precisa.`, 'ai', null, getShortTime());
    }
  }

  function addMessage(text, sender, urgency = null, timestamp = getShortTime()) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    const avatar = sender === 'ai' ? '🤖' : '👤';
    
    let urgencyBadge = '';
    if (sender === 'ai' && urgency) {
      const urgencyColors = { 'ALTA': '#d90429', 'MEDIA': '#f77f00', 'BAJA': '#0077b6' };
      const urgencyLabels = { 'ALTA': '🚨 Urgente', 'MEDIA': '⚠️ Moderado', 'BAJA': '✅ Leve' };
      urgencyBadge = `<div class="urgency-badge" style="background: ${urgencyColors[urgency]}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; margin-bottom: 8px; display: inline-block;">${urgencyLabels[urgency]}</div>`;
    }
    
    const formattedText = text.replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        ${urgencyBadge}
        <p>${formattedText}</p>
        ${sender === 'ai' ? '<p class="message-disclaimer">⚠️ Esto es orientación informativa. Consulta a un profesional para diagnóstico.</p>' : ''}
        <span class="message-time">${timestamp}</span>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  function addDrugCard(data, timestamp = getShortTime()) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    messageDiv.innerHTML = `
      <div class="message-avatar">💊</div>
      <div class="message-content">
        <p>Información sobre <strong>${data.name}</strong>:</p>
        <div class="drug-card">
          <div class="drug-card-header">
            <span class="drug-icon">💊</span>
            <h4 class="drug-title">${data.name}</h4>
          </div>
          <div class="drug-section">
            <div class="drug-section-title">Uso indicado</div>
            <div class="drug-section-content">${truncateText(data.usage, 100)}</div>
            <button class="btn-expand-drug" onclick="this.previousElementSibling.style.webkitLineClamp='10'">Leer más</button>
          </div>
          <div class="drug-section">
            <div class="drug-section-title">Advertencias</div>
            <div class="drug-section-content" style="color: var(--danger);">${truncateText(data.warnings, 100)}</div>
          </div>
          <div class="drug-footer">${data.source}</div>
        </div>
        <p class="message-disclaimer">⚠️ No te automediques. Esta información es referencial.</p>
        <span class="message-time">${timestamp}</span>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // === EXPORT LOGIC ===
  function generateClinicalSummary() {
    const messages = Array.from(document.querySelectorAll('.chat-messages .message'));
    const userMessages = messages.filter(m => m.classList.contains('user-message'));
    
    const symptoms = [];
    userMessages.forEach(msg => {
      const text = msg.textContent.toLowerCase();
      Object.values(URGENCY_KEYWORDS).flat().forEach(keyword => {
        if (text.includes(keyword) && !symptoms.includes(keyword)) symptoms.push(keyword);
      });
    });

    let maxUrgency = 'BAJA';
    if (symptoms.some(s => URGENCY_KEYWORDS.HIGH.includes(s))) maxUrgency = 'ALTA';
    else if (symptoms.some(s => URGENCY_KEYWORDS.MEDIUM.includes(s))) maxUrgency = 'MEDIA';

    return {
      symptoms: symptoms.length > 0 ? symptoms.join(', ') : 'No especificados',
      urgency: maxUrgency,
      drugSearches: appState.medicationSearches.map(m => m.drug).join(', ') || 'Ninguno',
      duration: Math.round((new Date() - appState.conversationStartTime) / 60000) + ' minutos'
    };
  }

  function getChatHistory() {
    const lines = [];
    const now = getLocalTimestamp();
    const summary = generateClinicalSummary();
    
    lines.push('╔════════════════════════════════════════════════════════╗');
    lines.push('║     SALUD-CONECTA AI - REPORTE DE CONSULTA            ║');
    lines.push('╚════════════════════════════════════════════════════════╝');
    lines.push('');
    lines.push(`📅 Fecha: ${now}`);
    lines.push(`📍 Ubicación: ${includeLocationCheckbox.checked ? 'Granada, Nicaragua' : '[Ocultada]'}`);
    lines.push(`🔖 Versión: 4.0.0`);
    lines.push('');
    
    if (includeSummaryCheckbox.checked) {
      lines.push('┌────────────────────────────────────────────────────┐');
      lines.push('│ 📋 RESUMEN CLÍNICO                                 │');
      lines.push('└────────────────────────────────────────────────────┘');
      lines.push(`• Síntomas: ${summary.symptoms}`);
      lines.push(`• Urgencia: ${summary.urgency}`);
      lines.push(`• Medicamentos: ${summary.drugSearches || 'Ninguno'}`);
      lines.push(`• Duración: ${summary.duration}`);
      lines.push('');
    }
    
    if (includeMedHistoryCheckbox.checked && appState.medicationSearches.length > 0) {
      lines.push('┌────────────────────────────────────────────────────┐');
      lines.push('│ 💊 HISTORIAL DE MEDICAMENTOS                       │');
      lines.push('└────────────────────────────────────────────────────┘');
      appState.medicationSearches.forEach((s, i) => {
        lines.push(`${i+1}. [${s.timestamp}] ${s.drug}`);
      });
      lines.push('');
    }
    
    if (anonymizeCheckbox.checked) {
      lines.push('[DATOS ANONIMIZADOS]');
      lines.push('');
    }
    
    lines.push('┌────────────────────────────────────────────────────┐');
    lines.push('│ 💬 CONVERSACIÓN                                    │');
    lines.push('└────────────────────────────────────────────────────┘');
    lines.push('');
    
    document.querySelectorAll('.chat-messages .message').forEach(msg => {
      const isUser = msg.classList.contains('user-message');
      const sender = isUser ? '👤 Usuario' : '🤖 IA';
      const time = msg.querySelector('.message-time')?.textContent || '';
      const content = msg.querySelector('.message-content')?.cloneNode(true);
      if (content) content.querySelectorAll('.message-disclaimer, .urgency-badge, .drug-card').forEach(el => el.remove());
      const cleanContent = content?.textContent?.trim() || msg.textContent.trim();
      lines.push(`[${time}] ${sender}: ${cleanContent}`);
      lines.push('');
    });
    
    lines.push('─────────────────────────────────────────────────────');
    lines.push('⚠️ ADVERTENCIA: No es diagnóstico médico. Emergencias: 133');
    lines.push('Salud-Conecta AI • https://jp-romero.github.io/Salud-Conecta-AI/');
    
    return lines.join('\n');
  }

  function downloadTxt(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard) return navigator.clipboard.writeText(text);
    const textarea = document.createElement('textarea');
    textarea.value = text; document.body.appendChild(textarea);
    textarea.select(); document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function showExportFeedback() {
    exportFeedback.style.display = 'block';
    setTimeout(() => exportFeedback.style.display = 'none', 3000);
  }

  function truncateText(text, limit) {
    if (!text) return 'Sin información.';
    const clean = text.replace(/<[^>]*>?/gm, '');
    return clean.length > limit ? clean.substring(0, limit) + '...' : clean;
  }

  function showTyping(show) {
    typingIndicator.style.display = show ? 'flex' : 'none';
    if (show) scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // === EVENT LISTENERS ===
  btnSend.addEventListener('click', () => sendMessage(userInput.value));
  userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(userInput.value); });
  
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.getAttribute('data-symptom')));
  });

  btnEmergency.addEventListener('click', () => emergencyModal.style.display = 'flex');
  btnCloseEmergency.addEventListener('click', () => emergencyModal.style.display = 'none');
  btnShowMapEmergency.addEventListener('click', () => {
    emergencyModal.style.display = 'none';
    showNearbyHealthCenters();
  });
  emergencyModal.addEventListener('click', (e) => {
    if (e.target === emergencyModal) emergencyModal.style.display = 'none';
  });

  btnExport.addEventListener('click', () => { exportModal.style.display = 'flex'; exportFeedback.style.display = 'none'; });
  btnCloseExport.addEventListener('click', () => exportModal.style.display = 'none');
  exportModal.addEventListener('click', (e) => { if (e.target === exportModal) exportModal.style.display = 'none'; });
  btnExportTxt.addEventListener('click', () => {
    downloadTxt(`salud-conecta-${new Date().toISOString().slice(0,10).replace(/-/g,'')}.txt`, getChatHistory());
    showExportFeedback();
  });
  btnExportCopy.addEventListener('click', async () => {
    try { await copyToClipboard(getChatHistory()); showExportFeedback(); }
    catch { alert('Copia manual requerida'); }
  });

  // Mapa
  btnCloseMap.addEventListener('click', () => {
    mapContainer.style.display = 'none';
    chatMessages.parentElement.style.display = 'flex';
    if (appState.map) appState.map.remove();
  });

  // Inicialización
  if (hasAccepted === 'true') {
    // No solicitamos ubicación automáticamente para respetar privacidad
    console.log('App iniciada - ubicación se solicitará solo cuando el usuario busque centros');
  }
});

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
    map: null,
    userMarker: null,
    healthMarkers: []
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

  const mapContainer = document.getElementById('map-container');
  const mapElement = document.getElementById('map');
  const mapLoading = document.getElementById('map-loading');
  const mapResults = document.getElementById('map-results');
  const btnCloseMap = document.getElementById('btn-close-map');
  const btnAddCenter = document.getElementById('btn-add-center');
  
  const reportFormContainer = document.getElementById('report-form-container');
  const reportForm = document.getElementById('report-form');
  const btnCloseForm = document.getElementById('btn-close-form');
  const btnCancelReport = document.getElementById('btn-cancel-report');
  const locationStatus = document.getElementById('location-status');
  const centerLatInput = document.getElementById('center-lat');
  const centerLngInput = document.getElementById('center-lng');
  
  const reportsListContainer = document.getElementById('reports-list-container');
  const reportsListContent = document.getElementById('reports-list-content');
  const btnCloseReports = document.getElementById('btn-close-reports');
  const btnExportReportsJSON = document.getElementById('btn-export-reports-json');
  const btnExportReportsCSV = document.getElementById('btn-export-reports-csv');
  const btnClearReports = document.getElementById('btn-clear-reports');

  // === PALABRAS CLAVE ===
  const URGENCY_KEYWORDS = {
    HIGH: ['dolor de pecho', 'dificultad para respirar', 'sangrado', 'inconsciente', 'infarto'],
    MEDIUM: ['fiebre alta', 'vomitos', 'dolor intenso', 'mareos'],
    LOW: ['dolor de cabeza', 'cansancio', 'gripe', 'resfriado']
  };

  const DRUG_KEYWORDS = ['pastilla', 'medicamento', 'droga', 'jarabe', 'tratamiento', 'para que sirve', 'dosis'];
  
  const COMMON_DRUGS = [
    'ibuprofeno', 'paracetamol', 'aspirina', 'amoxicilina', 'omeprazol', 
    'loratadina', 'metformina', 'losartan', 'amlodipino', 'diclofenaco',
    'acetaminofen', 'naproxeno', 'cetirizina', 'prednisona', 'azitromicina'
  ];

  // === MAPEO DE NOMBRES: Español -> Ingles (openFDA) ===
  const DRUG_NAME_MAPPING = {
    'paracetamol': 'acetaminophen',
    'acetaminofen': 'acetaminophen',
    'ibuprofeno': 'ibuprofen',
    'aspirina': 'aspirin',
    'amoxicilina': 'amoxicillin',
    'omeprazol': 'omeprazole',
    'loratadina': 'loratadine',
    'metformina': 'metformin',
    'losartan': 'losartan',
    'amlodipino': 'amlodipine',
    'diclofenaco': 'diclofenac',
    'naproxeno': 'naproxen',
    'cetirizina': 'cetirizine',
    'prednisona': 'prednisone',
    'azitromicina': 'azithromycin'
  };

  function getEnglishDrugName(spanishName) {
    const lower = spanishName.toLowerCase().trim();
    return DRUG_NAME_MAPPING[lower] || lower;
  }

  // === HOSPITALES EN GRANADA ===
  const GRANADA_HOSPITALS = [
    { name: "Hospital Virgen de la Asistencia", type: "hospital", lat: 11.9350, lng: -85.9570, address: "Centro, Granada" },
    { name: "Hospital Aleman Nicaraguense", type: "hospital", lat: 11.9320, lng: -85.9540, address: "Barrio San Antonio" },
    { name: "Farmacia Del Pueblo", type: "pharmacy", lat: 11.9340, lng: -85.9565, address: "Parque Central" },
    { name: "Centro Medico Sandoval", type: "clinic", lat: 11.9360, lng: -85.9550, address: "Calle La Calzada" }
  ];

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

  // === GEOLOCALIZACION ===
  async function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalizacion no soportada'));
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
          console.error('Error de geolocalizacion:', error);
          resolve({ lat: 11.9344, lng: -85.9560, fallback: true });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  function initMap(lat, lng) {
    if (appState.map) {
      appState.map.remove();
      appState.healthMarkers = [];
    }
    
    appState.map = L.map('map').setView([lat, lng], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(appState.map);
    
    appState.userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div style="background:#0077b6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }).addTo(appState.map).bindPopup('Tu ubicacion').openPopup();
    
    setTimeout(() => {
      appState.map.invalidateSize();
    }, 100);
  }

  async function searchHealthFacilities(lat, lng, radius = 2000) {
    const query = `[out:json][timeout:25];(node["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius},${lat},${lng});way["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius},${lat},${lng}););out center;`;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en Overpass API');
      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error buscando centros:', error);
      return getFallbackGranadaCenters(lat, lng);
    }
  }

  function getFallbackGranadaCenters(userLat, userLng) {
    return GRANADA_HOSPITALS.map(center => ({
      ...center,
      distance: calculateDistance(userLat, userLng, center.lat, center.lng)
    })).sort((a, b) => a.distance - b.distance);
  }

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 1000);
  }

  function displayHealthFacilities(facilities, userLat, userLng) {
    mapResults.innerHTML = '';
    appState.healthMarkers.forEach(m => appState.map.removeLayer(m));
    appState.healthMarkers = [];
    
    if (!facilities || facilities.length === 0) {
      mapResults.innerHTML = '<p style="text-align:center;color:var(--gray-text);">No se encontraron centros. Intenta ampliar la busqueda o reporta uno nuevo.</p>';
      return;
    }
    
    const icons = {
      hospital: 'H', clinic: 'H', doctors: 'MD', pharmacy: 'Rx', default: 'H'
    };
    
    facilities.forEach(facility => {
      const lat = facility.lat || facility.center?.lat;
      const lng = facility.lon || facility.center?.lon;
      if (!lat || !lng) return;
      
      const name = facility.tags?.name || facility.tags?.addr?.street || 'Sin nombre';
      const type = facility.tags?.amenity || 'health';
      const address = facility.tags?.addr?.street || facility.address || '';
      const distance = calculateDistance(userLat, userLng, lat, lng);
      
      const marker = L.marker([lat, lng]).addTo(appState.map)
        .bindPopup(`<strong>${name}</strong><br>${type.toUpperCase()} - ${distance}m<br>${address ? address : ''}<br><br><a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" style="background:#2a9d8f;color:white;padding:4px 8px;border-radius:4px;text-decoration:none;font-size:0.8rem;">Ir</a>`);
      
      appState.healthMarkers.push(marker);
      
      const resultItem = document.createElement('div');
      resultItem.className = 'map-result-item';
      resultItem.innerHTML = `
        <div class="map-result-info">
          <div class="map-result-name">${name}</div>
          <div class="map-result-type">${type.toUpperCase()} - ${distance}m ${address ? '- ' + address : ''}</div>
        </div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&origin=${userLat},${userLng}" 
           class="btn-directions" target="_blank" rel="noopener">Ir</a>
      `;
      mapResults.appendChild(resultItem);
    });
    
    const group = new L.featureGroup([...appState.healthMarkers, appState.userMarker]);
    if (group.getLayers().length > 0) {
      appState.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  async function showNearbyHealthCenters() {
    mapContainer.style.display = 'block';
    reportFormContainer.style.display = 'none';
    reportsListContainer.style.display = 'none';
    chatMessages.parentElement.style.display = 'none';
    
    mapLoading.style.display = 'block';
    mapResults.innerHTML = '';
    
    try {
      const location = await getUserLocation();
      appState.userLocation = location;
      
      initMap(location.lat, location.lng);
      const facilities = await searchHealthFacilities(location.lat, location.lng);
      displayHealthFacilities(facilities, location.lat, location.lng);
      
      if (location.fallback) {
        addMessage('Usando ubicacion aproximada de Granada. Permite acceso a ubicacion para resultados precisos.', 'ai', null, getShortTime());
      }
      
    } catch (error) {
      console.error('Error mostrando mapa:', error);
      mapResults.innerHTML = '<p style="color:var(--danger);text-align:center;">No se pudo cargar el mapa.</p>';
    } finally {
      mapLoading.style.display = 'none';
    }
  }

  // === CROWDSOURCING: REPORTAR CENTRO ===
  async function initReportForm() {
    reportFormContainer.style.display = 'block';
    mapContainer.style.display = 'none';
    reportsListContainer.style.display = 'none';
    chatMessages.parentElement.style.display = 'none';
    
    locationStatus.innerHTML = '<span class="loading">Obteniendo ubicacion...</span>';
    locationStatus.className = 'location-status';
    
    try {
      const location = await getUserLocation();
      centerLatInput.value = location.lat;
      centerLngInput.value = location.lng;
      
      locationStatus.innerHTML = 'Ubicacion capturada: ' + location.lat.toFixed(6) + ', ' + location.lng.toFixed(6);
      locationStatus.className = 'location-status success';
    } catch (error) {
      locationStatus.innerHTML = 'No se pudo obtener ubicacion. Ingresa manualmente.';
      locationStatus.className = 'location-status error';
    }
    
    reportForm.reset();
  }

  function saveReport(reportData) {
    const reports = JSON.parse(localStorage.getItem('saludConecta_reports') || '[]');
    const report = {
      id: Date.now(),
      timestamp: getLocalTimestamp(),
      ...reportData
    };
    reports.push(report);
    localStorage.setItem('saludConecta_reports', JSON.stringify(reports));
    return report;
  }

  function getReports() {
    return JSON.parse(localStorage.getItem('saludConecta_reports') || '[]');
  }

  function deleteReport(id) {
    let reports = getReports();
    reports = reports.filter(r => r.id !== id);
    localStorage.setItem('saludConecta_reports', JSON.stringify(reports));
    showReportsList();
  }

  function clearAllReports() {
    if (confirm('¿Estas seguro de eliminar todos los reportes? Esta accion no se puede deshacer.')) {
      localStorage.removeItem('saludConecta_reports');
      showReportsList();
    }
  }

  function showReportsList() {
    reportsListContainer.style.display = 'block';
    mapContainer.style.display = 'none';
    reportFormContainer.style.display = 'none';
    chatMessages.parentElement.style.display = 'none';
    
    const reports = getReports();
    
    if (reports.length === 0) {
      reportsListContent.innerHTML = '<p style="text-align:center;color:var(--gray-text);padding:2rem;">No hay reportes guardados. ¡Se el primero en reportar un centro!</p>';
      return;
    }
    
    const typeLabels = {
      hospital: 'Hospital', clinic: 'Clinica', pharmacy: 'Farmacia',
      doctors: 'Consultorio', laboratory: 'Laboratorio', other: 'Otro'
    };
    
    reportsListContent.innerHTML = '<p style="margin-bottom:1rem;color:var(--gray-text);">Tienes <strong>' + reports.length + '</strong> reporte(s) guardado(s) localmente.</p><div id="reports-list"></div>';
    
    const listContainer = document.getElementById('reports-list');
    reports.sort((a, b) => b.id - a.id).forEach(report => {
      const item = document.createElement('div');
      item.className = 'report-item';
      item.innerHTML = '<div class="report-item-header"><span class="report-item-name">' + report.name + '</span><span class="report-item-type">' + (typeLabels[report.type] || report.type) + '</span></div>' +
        (report.address ? '<div class="report-item-details">Direccion: ' + report.address + '</div>' : '') +
        (report.phone ? '<div class="report-item-details">Telefono: ' + report.phone + '</div>' : '') +
        (report.hours ? '<div class="report-item-details">Horario: ' + report.hours + '</div>' : '') +
        (report.notes ? '<div class="report-item-details">Notas: ' + report.notes + '</div>' : '') +
        '<div class="report-item-location">Reportado: ' + report.timestamp + ' - Coordenadas: ' + report.lat.toFixed(4) + ', ' + report.lng.toFixed(4) + '</div>' +
        '<div class="report-item-actions"><button class="btn-delete-report" onclick="window.deleteReport(' + report.id + ')">Eliminar</button></div>';
      listContainer.appendChild(item);
    });
  }

  function exportReportsJSON() {
    const reports = getReports();
    if (reports.length === 0) {
      alert('No hay reportes para exportar');
      return;
    }
    
    const dataStr = JSON.stringify(reports, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salud-conecta-reportes-' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Exportados ' + reports.length + ' reportes. Puedes compartir este archivo con OpenStreetMap o autoridades de salud.');
  }

  function exportReportsCSV() {
    const reports = getReports();
    if (reports.length === 0) {
      alert('No hay reportes para exportar');
      return;
    }
    
    const headers = ['ID', 'Fecha', 'Nombre', 'Tipo', 'Direccion', 'Telefono', 'Horario', 'Notas', 'Latitud', 'Longitud'];
    const rows = reports.map(r => [r.id, r.timestamp, r.name, r.type, r.address || '', r.phone || '', r.hours || '', r.notes || '', r.lat, r.lng]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => '"' + cell + '"').join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salud-conecta-reportes-' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Exportados ' + reports.length + ' reportes en formato CSV.');
  }

  window.deleteReport = deleteReport;

  // === FETCH DRUG INFO ===
  async function fetchDrugInfo(drugName) {
    showTyping(true);
    
    const englishName = getEnglishDrugName(drugName);
    const spanishName = drugName;
    
    try {
      let response = await fetch('https://api.fda.gov/drug/label.json?search=openfda.generic_name:' + englishName + '&limit=1');
      
      if (!response.ok) {
        response = await fetch('https://api.fda.gov/drug/label.json?search=openfda.brand_name:' + englishName + '&limit=1');
      }
      
      if (!response.ok && englishName !== spanishName.toLowerCase()) {
        response = await fetch('https://api.fda.gov/drug/label.json?search=openfda.generic_name:' + spanishName.toLowerCase() + '&limit=1');
      }
      
      if (!response.ok) throw new Error('No encontrado');
      
      const data = await response.json();
      const result = data.results[0];
      
      const drugData = {
        name: result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || drugName,
        usage: result.indications_and_usage?.[0] || 'Informacion no disponible.',
        warnings: result.warnings_and_cautions?.[0] || result.adverse_reactions?.[0] || 'Consulte a su medico.',
        source: 'Fuente: openFDA (EE.UU.) - Verificar disponibilidad en Nicaragua'
      };
      
      showTyping(false);
      addDrugCard(drugData, getShortTime());
      
    } catch (error) {
      showTyping(false);
      console.error('Error fetchDrugInfo:', error);
      
      let suggestion = '';
      if (DRUG_NAME_MAPPING[drugName.toLowerCase()]) {
        suggestion = ' En EE.UU. se conoce como: ' + DRUG_NAME_MAPPING[drugName.toLowerCase()];
      }
      
      addMessage('No encontre informacion especifica sobre "' + drugName + '" en la base internacional.' + suggestion + ' En Granada, consulta en farmacias locales para informacion precisa.', 'ai', null, getShortTime());
    }
  }
  // === SEND MESSAGE FUNCTION (ACTUALIZADA) ===
function sendMessage(text) {
  if (!text.trim()) return;

  const timestamp = getShortTime();
  addMessage(text, 'user', null, timestamp);
  userInput.value = '';
  btnSend.disabled = true;
  showTyping(true);

  const lowerText = text.toLowerCase();

  // 1. Detectar acción de buscar medicamento (desde botón rápido)
  if (lowerText === 'buscar medicamento' || lowerText === 'medicamento') {
    setTimeout(() => {
      showTyping(false);
      addMessage('Claro, puedo ayudarte a buscar información sobre un medicamento. 💊\n\nPor favor, escribe el **nombre del medicamento** que buscas (ej: Paracetamol, Ibuprofeno, Omeprazol).', 'ai', null, getShortTime());
      btnSend.disabled = false;
      userInput.focus();
      userInput.placeholder = 'Escribe el nombre del medicamento...';
    }, 500);
    return;
  }

  // 2. Detectar medicamento DIRECTO en el texto del usuario
  const foundDrugDirect = COMMON_DRUGS.find(drug => 
    lowerText === drug || 
    lowerText.includes(' ' + drug + ' ') || 
    lowerText.includes(' ' + drug) || 
    lowerText.startsWith(drug + ' ') ||
    lowerText.endsWith(' ' + drug)
  );

  // 3. Detectar palabras clave + medicamento
  const isDrugQuery = DRUG_KEYWORDS.some(keyword => lowerText.includes(keyword));
  const foundDrugWithKeyword = COMMON_DRUGS.find(drug => lowerText.includes(drug));

  // ✅ PRIORIDAD 1: Nombre de medicamento directo
  if (foundDrugDirect) {
    appState.medicationSearches.push({
      drug: foundDrugDirect,
      timestamp: getLocalTimestamp(),
      query: text
    });
    
    setTimeout(() => {
      fetchDrugInfo(foundDrugDirect);
      btnSend.disabled = false;
      userInput.placeholder = 'Describe tus síntomas...';
      userInput.focus();
    }, 1000);
    return;
  }

  // ✅ PRIORIDAD 2: Palabras clave + medicamento
  if (isDrugQuery && foundDrugWithKeyword) {
    appState.medicationSearches.push({
      drug: foundDrugWithKeyword,
      timestamp: getLocalTimestamp(),
      query: text
    });
    
    setTimeout(() => {
      fetchDrugInfo(foundDrugWithKeyword);
      btnSend.disabled = false;
      userInput.placeholder = 'Describe tus síntomas...';
      userInput.focus();
    }, 1000);
    return;
  }

  // 4. Mapa/centros de salud
  if (lowerText.includes('mapa') || lowerText.includes('centro') || 
      lowerText.includes('hospital') || lowerText.includes('farmacia') ||
      lowerText.includes('clinica') || lowerText.includes('cerca')) {
    setTimeout(() => {
      showTyping(false);
      showNearbyHealthCenters();
      btnSend.disabled = false;
      userInput.focus();
    }, 1000);
    return;
  }

  // 5. Reportar centro
  if (lowerText.includes('reportar') || lowerText.includes('agregar centro')) {
    setTimeout(() => {
      showTyping(false);
      initReportForm();
      btnSend.disabled = false;
    }, 1000);
    return;
  }

  // 6. Ver reportes
  if (lowerText.includes('mis reportes') || lowerText.includes('ver reportes')) {
    setTimeout(() => {
      showTyping(false);
      showReportsList();
      btnSend.disabled = false;
    }, 1000);
    return;
  }

  // 7. Triage normal
  const delay = Math.random() * 1500 + 1500;
  setTimeout(() => {
    showTyping(false);
    const urgency = detectUrgency(text);
    const response = generateResponse(urgency);
    addMessage(response.text + '\n\n' + response.action, 'ai', response.urgency, getShortTime());
    scrollToBottom();
    btnSend.disabled = false;
    userInput.placeholder = 'Describe tus síntomas...';
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
        text: 'Atencion: Los sintomas que describes pueden indicar una condicion grave.',
        action: 'Te recomiendo buscar atencion medica inmediata. Usa el mapa para ver centros cercanos o llama al 133.',
        urgency: 'ALTA'
      },
      MEDIUM: {
        text: 'Recomendacion: Deberias consultar con un profesional pronto.',
        action: 'Programa una cita en Granada. ¿Quieres ver centros en el mapa o reportar uno nuevo?',
        urgency: 'MEDIA'
      },
      LOW: {
        text: 'Cuidados en Casa: Tus sintomas parecen leves.',
        action: '- Descansa adecuadamente\n- Mantente hidratado\n- Si empeoran, consulta un medico',
        urgency: 'BAJA'
      }
    };
    return MOCK_RESPONSES[urgency];
  }

  function addMessage(text, sender, urgency = null, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender + '-message';
    const avatar = sender === 'ai' ? 'AI' : 'TU';
    
    let urgencyBadge = '';
    if (sender === 'ai' && urgency) {
      const urgencyColors = { 'ALTA': '#d90429', 'MEDIA': '#f77f00', 'BAJA': '#0077b6' };
      const urgencyLabels = { 'ALTA': 'Urgente', 'MEDIA': 'Moderado', 'BAJA': 'Leve' };
      urgencyBadge = '<div style="background: ' + urgencyColors[urgency] + '; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; margin-bottom: 8px; display: inline-block;">' + urgencyLabels[urgency] + '</div>';
    }
    
    const formattedText = text.replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = '<div class="message-avatar">' + avatar + '</div>' +
      '<div class="message-content">' +
      urgencyBadge +
      '<p>' + formattedText + '</p>' +
      (sender === 'ai' ? '<p class="message-disclaimer">Esto es orientacion informativa. Consulta a un profesional.</p>' : '') +
      '<span class="message-time">' + timestamp + '</span>' +
      '</div>';
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }
  function addDrugCard(data, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  
  // Crear IDs únicos para cada tarjeta
  const cardId = 'drug-card-' + Date.now();
  const contentId = 'drug-content-' + Date.now();
  
  messageDiv.innerHTML = '<div class="message-avatar">Rx</div>' +
    '<div class="message-content">' +
    '<p>Información sobre <strong>' + data.name + '</strong>:</p>' +
    '<div class="drug-card" id="' + cardId + '">' +
    '<div class="drug-card-header"><span class="drug-icon">Rx</span><h4 class="drug-title">' + data.name + '</h4></div>' +
    '<div class="drug-section"><div class="drug-section-title">Uso indicado</div>' +
    '<div class="drug-section-content drug-content" id="' + contentId + '">' + translateMedicalText(truncateText(data.usage, 150)) + '</div>' +
    '<button class="btn-expand-drug" onclick="expandDrugContent(\'' + contentId + '\', this)">Leer más</button></div>' +
    '<div class="drug-section"><div class="drug-section-title">Advertencias</div>' +
    '<div class="drug-section-content drug-content">' + translateMedicalText(truncateText(data.warnings, 150)) + '</div></div>' +
    '<div class="drug-footer">' + data.source + '</div>' +
    '</div>' +
    '<p class="message-disclaimer">No te automediques. Consulta a un farmacéutico en Nicaragua.</p>' +
    '<span class="message-time">' + timestamp + '</span>' +
    '</div>';
  
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

// Función global para expandir contenido
window.expandDrugContent = function(contentId, btn) {
  const content = document.getElementById(contentId);
  if (content) {
    content.style.webkitLineClamp = 'unset';
    content.style.maxHeight = 'none';
    content.style.overflow = 'visible';
    btn.style.display = 'none';
  }
};

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
    
    lines.push('SALUD-CONECTA AI - REPORTE DE CONSULTA');
    lines.push('=====================================');
    lines.push('');
    lines.push('Fecha: ' + now);
    lines.push('Ubicacion: ' + (includeLocationCheckbox.checked ? 'Granada, Nicaragua' : '[Ocultada]'));
    lines.push('Version: 5.0.0');
    lines.push('');
    
    if (includeSummaryCheckbox.checked) {
      lines.push('RESUMEN CLINICO');
      lines.push('---------------');
      lines.push('- Sintomas: ' + summary.symptoms);
      lines.push('- Urgencia: ' + summary.urgency);
      lines.push('- Medicamentos: ' + (summary.drugSearches || 'Ninguno'));
      lines.push('- Duracion: ' + summary.duration);
      lines.push('');
    }
    
    if (includeMedHistoryCheckbox.checked && appState.medicationSearches.length > 0) {
      lines.push('HISTORIAL DE MEDICAMENTOS');
      lines.push('-------------------------');
      appState.medicationSearches.forEach((s, i) => {
        lines.push((i+1) + '. [' + s.timestamp + '] ' + s.drug);
      });
      lines.push('');
    }
    
    if (anonymizeCheckbox.checked) {
      lines.push('[DATOS ANONIMIZADOS]');
      lines.push('');
    }
    
    lines.push('CONVERSACION');
    lines.push('------------');
    lines.push('');
    
    document.querySelectorAll('.chat-messages .message').forEach(msg => {
      const isUser = msg.classList.contains('user-message');
      const sender = isUser ? 'Usuario' : 'IA';
      const time = msg.querySelector('.message-time')?.textContent || '';
      const content = msg.querySelector('.message-content')?.cloneNode(true);
      if (content) content.querySelectorAll('.message-disclaimer, .drug-card').forEach(el => el.remove());
      const cleanContent = content?.textContent?.trim() || msg.textContent.trim();
      lines.push('[' + time + '] ' + sender + ': ' + cleanContent);
      lines.push('');
    });
    
    lines.push('-------------------------------------');
    lines.push('ADVERTENCIA: No es diagnostico medico. Emergencias: 133');
    lines.push('Salud-Conecta AI - https://jp-romero.github.io/Salud-Conecta-AI/');
    
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
    if (!text) return 'Sin informacion.';
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
  btn.addEventListener('click', () => {
    const action = btn.getAttribute('data-action');
    const symptom = btn.getAttribute('data-symptom');
    
    if (action === 'search-drug') {
      sendMessage('Buscar medicamento');
    } else if (symptom) {
      sendMessage(symptom);
    }
  });
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
    downloadTxt('salud-conecta-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '.txt', getChatHistory());
    showExportFeedback();
  });
  btnExportCopy.addEventListener('click', async () => {
    try { await copyToClipboard(getChatHistory()); showExportFeedback(); }
    catch { alert('Copia manual requerida'); }
  });

  btnCloseMap.addEventListener('click', () => {
    mapContainer.style.display = 'none';
    chatMessages.parentElement.style.display = 'flex';
    if (appState.map) appState.map.remove();
  });
  
  btnAddCenter.addEventListener('click', () => {
    initReportForm();
  });

  btnCloseForm.addEventListener('click', () => {
    reportFormContainer.style.display = 'none';
    mapContainer.style.display = 'flex';
  });
  
  btnCancelReport.addEventListener('click', () => {
    reportFormContainer.style.display = 'none';
    mapContainer.style.display = 'flex';
  });
  
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const reportData = {
      name: document.getElementById('center-name').value,
      type: document.getElementById('center-type').value,
      address: document.getElementById('center-address').value,
      phone: document.getElementById('center-phone').value,
      hours: document.getElementById('center-hours').value,
      notes: document.getElementById('center-notes').value,
      lat: parseFloat(centerLatInput.value),
      lng: parseFloat(centerLngInput.value)
    };
    
    saveReport(reportData);
    
    alert('Reporte guardado localmente. Puedes exportarlo despues desde "Mis Reportes".');
    
    reportFormContainer.style.display = 'none';
    showReportsList();
  });

  btnCloseReports.addEventListener('click', () => {
    reportsListContainer.style.display = 'none';
    mapContainer.style.display = 'flex';
  });
  
  btnExportReportsJSON.addEventListener('click', exportReportsJSON);
  btnExportReportsCSV.addEventListener('click', exportReportsCSV);
  btnClearReports.addEventListener('click', clearAllReports);

  if (hasAccepted === 'true') {
    console.log('Salud-Conecta AI v5.0 iniciada');
  }
});
// === DICCIONARIO DE TRADUCCIÓN MÉDICA (Inglés → Español) ===
const MEDICAL_TERMS_ES = {
  'indications and usage': 'Indicaciones y uso',
  'dosage and administration': 'Dosis y administración',
  'contraindications': 'Contraindicaciones',
  'warnings and precautions': 'Advertencias y precauciones',
  'adverse reactions': 'Reacciones adversas',
  'drug interactions': 'Interacciones medicamentosas',
  'use in specific populations': 'Uso en poblaciones específicas',
  'overdosage': 'Sobredosis',
  'description': 'Descripción',
  'clinical pharmacology': 'Farmacología clínica',
  'nonclinical toxicology': 'Toxicología no clínica',
  'clinical studies': 'Estudios clínicos',
  'references': 'Referencias',
  'how supplied': 'Cómo se suministra',
  'patient counseling information': 'Información para el paciente',
  'pain': 'dolor',
  'fever': 'fiebre',
  'headache': 'dolor de cabeza',
  'inflammation': 'inflamación',
  'infection': 'infección',
  'treatment': 'tratamiento',
  'prevention': 'prevención',
  'symptom': 'síntoma',
  'adult': 'adulto',
  'child': 'niño',
  'tablet': 'tableta',
  'capsule': 'cápsula',
  'oral': 'oral',
  'topical': 'tópico',
  'injection': 'inyección',
  'daily': 'diario',
  'hour': 'hora',
  'week': 'semana',
  'month': 'mes'
};

// Función para traducir texto médico
function translateMedicalText(text) {
  if (!text) return 'Información no disponible.';
  
  let translated = text;
  
  // Traducir términos clave
  Object.keys(MEDICAL_TERMS_ES).forEach(term => {
    const regex = new RegExp(term, 'gi');
    translated = translated.replace(regex, MEDICAL_TERMS_ES[term]);
  });
  
  // Limpiar texto de caracteres especiales problemáticos
  translated = translated.replace(/\*/g, '').replace(/\[/g, '(').replace(/\]/g, ')');
  
  return translated;
}

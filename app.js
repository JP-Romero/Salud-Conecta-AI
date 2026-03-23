/**
═══════════════════════════════════════════════════════════════
SALUD-CONECTA AI — App Principal
═══════════════════════════════════════════════════════════════
📌 VERSIÓN: 7.0.0
📌 CAMBIOS: Login PIN · Perfil de salud · Rediseño marca
═══════════════════════════════════════════════════════════════
*/

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════════════
  //  VALIDACIÓN BASE DE DATOS
  // ═══════════════════════════════════════════════════════════════
  if (typeof obtenerTodosLosCentros !== 'function') {
    console.warn('⚠️ base-datos-salud.js no cargó. Usando modo básico.');
    window.obtenerTodosLosCentros    = () => [];
    window.buscarMedicamento         = () => null;
    window.buscarCentrosPorCategoria = () => [];
    window.buscarSintoma             = () => null;
    window.obtenerTodosLosSintomas   = () => [];
    window.obtenerEmergencias        = () => [];
    window.calcularDistancia         = () => 0;
  }

  // ═══════════════════════════════════════════════════════════════
  //  CONFIGURACIÓN DEL PROXY BACKEND
  // ═══════════════════════════════════════════════════════════════
  const WORKER_URL = 'https://salud-conecta-api.salud-conecta.workers.dev/chat';
  const MAX_HISTORY = 20;

  // ═══════════════════════════════════════════════════════════════
  //  ESTADO GLOBAL
  // ═══════════════════════════════════════════════════════════════
  const appState = {
    medicationSearches:    [],
    userLocation:          null,
    conversationStartTime: new Date(),
    map:                   null,
    userMarker:            null,
    healthMarkers:         [],
    conversationHistory:   [],
    isRecording:           false,
    recognition:           null,
    symptomCache:          {},
    drugCache:             {},
    currentUser:           null  // perfil del usuario autenticado
  };

  // ═══════════════════════════════════════════════════════════════
  //  SISTEMA DE AUTENTICACIÓN — PIN LOCAL
  // ═══════════════════════════════════════════════════════════════

  // Helpers de storage para usuarios
  function hashPin(pin) {
    // Hash simple para no guardar el PIN en texto plano
    let h = 0;
    for (let i = 0; i < pin.length; i++) {
      h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
    }
    return h.toString(36);
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem('sc_users') || '{}');
  }

  function saveUsers(users) {
    localStorage.setItem('sc_users', JSON.stringify(users));
  }

  function getUserProfile(userId) {
    const profiles = JSON.parse(localStorage.getItem('sc_profiles') || '{}');
    return profiles[userId] || {};
  }

  function saveUserProfile(userId, profile) {
    const profiles = JSON.parse(localStorage.getItem('sc_profiles') || '{}');
    profiles[userId] = { ...profiles[userId], ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem('sc_profiles', JSON.stringify(profiles));
  }

  function getSession() {
    try {
      const s = sessionStorage.getItem('sc_session');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }

  function setSession(userId) {
    sessionStorage.setItem('sc_session', JSON.stringify({ userId, loginAt: Date.now() }));
  }

  function clearSession() {
    sessionStorage.removeItem('sc_session');
  }

  // ── Auth UI helpers ──
  const authScreen  = document.getElementById('auth-screen');
  const appContent  = document.getElementById('app-content');

  function showApp(userId) {
    appState.currentUser = userId;
    setSession(userId);
    if (authScreen) authScreen.style.display = 'none';
    if (appContent) appContent.style.display = 'block';
    updateHeaderUser();
    personalizeWelcome();
  }

  function updateHeaderUser() {
    const profile = getUserProfile(appState.currentUser);
    const name = profile.name || 'Usuario';
    const initial = name.charAt(0).toUpperCase();
    const shortName = name.split(' ')[0];
    const el = document.getElementById('user-initial');
    const nameEl = document.getElementById('user-short-name');
    if (el) el.textContent = initial;
    if (nameEl) nameEl.textContent = shortName;
  }

  function personalizeWelcome() {
    const profile = getUserProfile(appState.currentUser);
    const el = document.getElementById('welcome-msg');
    if (!el) return;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? '¡Buenos días' : hour < 19 ? '¡Buenas tardes' : '¡Buenas noches';
    const name = profile.name ? `, ${profile.name.split(' ')[0]}` : '';
    el.textContent = `${greeting}${name}! Soy tu asistente de salud en Granada. ¿Cómo te sentís hoy?`;
  }

  // ── Inicialización: verificar sesión activa ──
  const existingSession = getSession();
  const users = getUsers();

  if (existingSession && users[existingSession.userId]) {
    // Sesión activa — ir directo a la app
    if (authScreen) authScreen.style.display = 'none';
    checkPrivacyConsent();
    showApp(existingSession.userId);
  } else {
    // Mostrar pantalla de auth
    if (authScreen) authScreen.style.display = 'flex';
    if (appContent) appContent.style.display = 'none';
    initAuthUI();
  }

  function checkPrivacyConsent() {
    const modal   = document.getElementById('privacy-modal');
    const content = document.getElementById('app-content');
    if (localStorage.getItem('sc_consent') === 'true') {
      if (modal) modal.style.display = 'none';
      if (content) content.style.display = 'block';
    } else {
      if (modal) modal.style.display = 'flex';
      if (content) content.style.display = 'none';
    }
  }

  // ── Lógica de tabs auth ──
  window.showAuthTab = function(tab) {
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
    document.getElementById('form-login').style.display    = tab === 'login'    ? 'flex' : 'none';
    document.getElementById('form-register').style.display = tab === 'register' ? 'flex' : 'none';
    clearPins();
  };

  function clearPins() {
    ['login-p1','login-p2','login-p3','login-p4',
     'reg-p1','reg-p2','reg-p3','reg-p4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('filled'); }
    });
  }

  // ── Login ──
  window.doLogin = function() {
    const pin = getPinValue('login-p');
    if (pin.length !== 4) {
      showAuthError('login-error', 'Ingresá los 4 dígitos de tu PIN.');
      return;
    }
    const users = getUsers();
    const userId = Object.keys(users).find(id => users[id].pinHash === hashPin(pin));
    if (!userId) {
      showAuthError('login-error', 'PIN incorrecto. Intentá de nuevo.');
      shakePins('login-p');
      return;
    }
    document.getElementById('login-error').style.display = 'none';
    showApp(userId);
    checkPrivacyConsent();
  };

  // ── Registro ──
  window.doRegister = function() {
    const name = document.getElementById('reg-name')?.value.trim();
    const pin  = getPinValue('reg-p');

    if (!name) {
      showAuthError('register-error', 'Escribí tu nombre para continuar.');
      return;
    }
    if (pin.length !== 4) {
      showAuthError('register-error', 'Elegí un PIN de 4 dígitos.');
      return;
    }

    const userId  = 'user_' + Date.now();
    const users   = getUsers();
    users[userId] = { pinHash: hashPin(pin), createdAt: new Date().toISOString() };
    saveUsers(users);
    saveUserProfile(userId, { name });

    document.getElementById('register-error').style.display = 'none';
    showApp(userId);
    checkPrivacyConsent();
  };

  function getPinValue(prefix) {
    return ['1','2','3','4']
      .map(n => document.getElementById(prefix + n)?.value || '')
      .join('');
  }

  function showAuthError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function shakePins(prefix) {
    ['1','2','3','4'].forEach(n => {
      const el = document.getElementById(prefix + n);
      if (el) {
        el.style.borderColor = 'var(--danger)';
        setTimeout(() => { el.style.borderColor = ''; }, 1200);
      }
    });
  }

  // ── Navegación automática entre dígitos PIN ──
  function initAuthUI() {
    ['login-p','reg-p','pf-pin'].forEach(prefix => {
      ['1','2','3','4'].forEach((n, i, arr) => {
        const el = document.getElementById(prefix + n);
        if (!el) return;
        el.addEventListener('input', () => {
          if (el.value.length === 1) {
            el.classList.add('filled');
            const next = document.getElementById(prefix + arr[i + 1]);
            if (next) next.focus();
            else {
              // último dígito — intentar login automático si es el form de login
              if (prefix === 'login-p') {
                const pin = getPinValue('login-p');
                if (pin.length === 4) doLogin();
              }
            }
          } else {
            el.classList.remove('filled');
          }
        });
        el.addEventListener('keydown', e => {
          if (e.key === 'Backspace' && !el.value) {
            const prev = document.getElementById(prefix + arr[i - 1]);
            if (prev) { prev.value = ''; prev.classList.remove('filled'); prev.focus(); }
          }
        });
        // solo permitir números
        el.addEventListener('keypress', e => {
          if (!/[0-9]/.test(e.key)) e.preventDefault();
        });
      });
    });
  }

  // Inicializar navegación PIN si estamos mostrando auth
  if (!existingSession || !users[existingSession?.userId]) {
    initAuthUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  UTILIDADES
  // ═══════════════════════════════════════════════════════════════
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

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function truncateText(text, limit) {
    if (!text) return 'Sin información.';
    const clean = text.replace(/<[^>]*>?/gm, '');
    return clean.length > limit ? clean.substring(0, limit) + '...' : clean;
  }

  function showTyping(show) {
    if (typingIndicator) typingIndicator.style.display = show ? 'flex' : 'none';
    if (show) scrollToBottom();
  }

  function scrollToBottom() {
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showExportFeedback() {
    if (exportFeedback) {
      exportFeedback.style.display = 'block';
      setTimeout(() => { exportFeedback.style.display = 'none'; }, 3000);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  PWA INSTALL
  // ═══════════════════════════════════════════════════════════════
  let deferredPrompt = null;
  const installBanner              = document.getElementById('install-banner');
  const btnInstall                 = document.getElementById('btn-install');
  const btnDismissInstall          = document.getElementById('btn-dismiss-install');
  const installInstructionsModal   = document.getElementById('install-instructions-modal');
  const btnCloseInstallInstructions= document.getElementById('btn-close-install-instructions');
  const installStepsChrome         = document.getElementById('install-steps-chrome');
  const installStepsSafari         = document.getElementById('install-steps-safari');
  const installDismissed           = localStorage.getItem('saludConecta_installDismissed');

  if (installBanner) {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      if (installDismissed !== 'true') installBanner.style.display = 'block';
    });
    window.addEventListener('appinstalled', () => {
      if (installBanner) installBanner.style.display = 'none';
      deferredPrompt = null;
      localStorage.setItem('saludConecta_installed', 'true');
    });
    if (btnInstall) btnInstall.addEventListener('click', async () => {
      if (!deferredPrompt) { showInstallInstructions(); return; }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') installBanner.style.display = 'none';
      deferredPrompt = null;
    });
    if (btnDismissInstall) btnDismissInstall.addEventListener('click', () => {
      if (installBanner) installBanner.style.display = 'none';
      localStorage.setItem('saludConecta_installDismissed', 'true');
    });
  }

  function showInstallInstructions() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (installStepsChrome) installStepsChrome.style.display = isSafari ? 'none' : 'block';
    if (installStepsSafari) installStepsSafari.style.display = isSafari ? 'block' : 'none';
    if (installInstructionsModal) installInstructionsModal.style.display = 'flex';
  }
  if (btnCloseInstallInstructions) btnCloseInstallInstructions.addEventListener('click', () => {
    if (installInstructionsModal) installInstructionsModal.style.display = 'none';
  });
  if (installInstructionsModal) installInstructionsModal.addEventListener('click', e => {
    if (e.target === installInstructionsModal) installInstructionsModal.style.display = 'none';
  });

  // ═══════════════════════════════════════════════════════════════
  //  REFERENCIAS DOM
  // ═══════════════════════════════════════════════════════════════
  const chatMessages        = document.getElementById('chat-messages');
  const userInput           = document.getElementById('user-input');
  const btnSend             = document.getElementById('btn-send');
  const btnVoice            = document.getElementById('btn-voice');
  const typingIndicator     = document.getElementById('typing-indicator');
  const quickBtns           = document.querySelectorAll('.quick-btn');

  const btnEmergency        = document.getElementById('btn-emergency');
  const emergencyModal      = document.getElementById('emergency-modal');
  const btnCloseEmergency   = document.getElementById('btn-close-emergency');
  const btnShowMapEmergency = document.getElementById('btn-show-map-emergency');

  const btnExport           = document.getElementById('btn-export');
  const exportModal         = document.getElementById('export-modal');
  const btnCloseExport      = document.getElementById('btn-close-export');
  const btnExportTxt        = document.getElementById('btn-export-txt');
  const btnExportCopy       = document.getElementById('btn-export-copy');
  const exportFeedback      = document.getElementById('export-feedback');
  const anonymizeCheckbox       = document.getElementById('anonymize-export');
  const includeLocationCheckbox = document.getElementById('include-location');
  const includeMedHistoryCheckbox = document.getElementById('include-med-history');
  const includeSummaryCheckbox  = document.getElementById('include-summary');

  const mapContainer        = document.getElementById('map-container');
  const mapElement          = document.getElementById('map');
  const mapLoading          = document.getElementById('map-loading');
  const mapResults          = document.getElementById('map-results');
  const btnCloseMap         = document.getElementById('btn-close-map');
  const btnAddCenter        = document.getElementById('btn-add-center');

  const reportFormContainer = document.getElementById('report-form-container');
  const reportForm          = document.getElementById('report-form');
  const btnCloseForm        = document.getElementById('btn-close-form');
  const btnCancelReport     = document.getElementById('btn-cancel-report');
  const locationStatus      = document.getElementById('location-status');
  const centerLatInput      = document.getElementById('center-lat');
  const centerLngInput      = document.getElementById('center-lng');

  const reportsListContainer   = document.getElementById('reports-list-container');
  const reportsListContent     = document.getElementById('reports-list-content');
  const btnCloseReports        = document.getElementById('btn-close-reports');
  const btnExportReportsJSON   = document.getElementById('btn-export-reports-json');
  const btnExportReportsCSV    = document.getElementById('btn-export-reports-csv');
  const btnClearReports        = document.getElementById('btn-clear-reports');

  // ═══════════════════════════════════════════════════════════════
  //  CONSTANTES — KEYWORDS Y MAPEOS
  // ═══════════════════════════════════════════════════════════════
  const URGENCY_KEYWORDS = {
    HIGH:   ['dolor de pecho', 'dificultad para respirar', 'sangrado', 'inconsciente', 'infarto', 'desmayo', 'convulsion', 'paralisis', 'no puedo respirar'],
    MEDIUM: ['fiebre alta', 'vomito', 'vomitos', 'dolor intenso', 'mareos', 'mareo fuerte', 'dificultad al tragar'],
    LOW:    ['dolor de cabeza', 'cansancio', 'gripe', 'resfriado', 'tos leve', 'malestar']
  };

  const DRUG_KEYWORDS = ['pastilla', 'medicamento', 'droga', 'jarabe', 'tratamiento', 'para que sirve', 'dosis', 'medicina'];

  const COMMON_DRUGS = [
    // Analgésicos y antiinflamatorios
    'ibuprofeno','paracetamol','aspirina','diclofenaco','dipirona','metamizol',
    'naproxeno','ketorolaco','acetaminofen','alopurinol',
    // Antibióticos
    'amoxicilina','azitromicina','metronidazol','ciprofloxacina','cotrimoxazol',
    'bactrim','doxiciclina','ceftriaxona','clindamicina','ampicilina',
    // Gastrointestinal
    'omeprazol','ranitidina','loperamida','metoclopramida','plasil',
    // Cardiovascular
    'enalapril','losartan','amlodipina','amlodipino','atenolol','furosemida',
    'hidroclorotiazida','simvastatina','clopidogrel','digoxina','warfarina',
    // Respiratorio
    'salbutamol','loratadina','cetirizina','clorfeniramina','ipratropio',
    // Endocrinología
    'metformina','glibenclamida','insulina','levotiroxina','prednisona',
    'dexametasona',
    // Neurología/Psiquiatría
    'diazepam','carbamazepina','fluoxetina','amitriptilina','haloperidol',
    'valproico',
    // Vitaminas y suplementos
    'acido folico','sulfato ferroso','vitamina c','vitamina b12','calcio',
    // Antiparasitarios/Antivirales
    'albendazol','metronidazol','aciclovir','fluconazol','ivermectina',
    'permetrina','cloroquina','nitazoxanida','tinidazol','mebendazol','furazolidona',
    // Respiratorio adicional
    'ambroxol','bromhexina','guaifenesina','dextrometorfano','oximetazolina','xilometazolina',
    // Dermatología
    'clotrimazol','hidrocortisona','miconazol','nistatina','terbinafina','ketoconazol',
    'bacitracina','iodopovidona','acido salicilico','piritionato de zinc','minoxidil',
    // Antihistamínicos adicionales
    'difenhidramina','fexofenadina','cetirizina','dimenhidrinato',
    // Gastrointestinal adicional
    'simeticona','carbon activado','bisacodilo','fenazopiridina','famotidina',
    'subsalicilato de bismuto','pancreatina',
    // Analgésicos adicionales
    'naproxeno','acido mefenamico','ergotamina',
    // Otros
    'lagrimas artificiales','suero fisiologico nasal','multivitaminico',
    // Ginecología
    'misoprostol','oxitocina'
  ];

  const DRUG_NAME_MAPPING = {
    'paracetamol':'acetaminophen','acetaminofen':'acetaminophen',
    'ibuprofeno':'ibuprofen','aspirina':'aspirin',
    'amoxicilina':'amoxicillin','azitromicina':'azithromycin',
    'omeprazol':'omeprazole','ranitidina':'ranitidine',
    'loperamida':'loperamide','metoclopramida':'metoclopramide',
    'loratadina':'loratadine','cetirizina':'cetirizine',
    'clorfeniramina':'chlorpheniramine','salbutamol':'albuterol',
    'metformina':'metformin','glibenclamida':'glibenclamide',
    'losartan':'losartan','amlodipino':'amlodipine','amlodipina':'amlodipine',
    'enalapril':'enalapril','atenolol':'atenolol','furosemida':'furosemide',
    'hidroclorotiazida':'hydrochlorothiazide','simvastatina':'simvastatin',
    'clopidogrel':'clopidogrel','digoxina':'digoxin','warfarina':'warfarin',
    'diclofenaco':'diclofenac','naproxeno':'naproxen',
    'dipirona':'metamizole','metamizol':'metamizole',
    'ketorolaco':'ketorolac','alopurinol':'allopurinol',
    'prednisona':'prednisone','dexametasona':'dexamethasone',
    'levotiroxina':'levothyroxine','ciprofloxacina':'ciprofloxacin',
    'cotrimoxazol':'trimethoprim-sulfamethoxazole','doxiciclina':'doxycycline',
    'ceftriaxona':'ceftriaxone','albendazol':'albendazole',
    'metronidazol':'metronidazole','aciclovir':'acyclovir',
    'fluconazol':'fluconazole','ivermectina':'ivermectin',
    'permetrina':'permethrin','clotrimazol':'clotrimazole',
    'diazepam':'diazepam','carbamazepina':'carbamazepine',
    'fluoxetina':'fluoxetine','amitriptilina':'amitriptyline',
    'haloperidol':'haloperidol','cetirizina':'cetirizine',
    'azitromicina':'azithromycin'
  };

  const MEDICAL_TERMS_ES = {
    'indications and usage':          'Indicaciones y uso',
    'dosage and administration':      'Dosis y administracion',
    'contraindications':              'Contraindicaciones',
    'warnings and precautions':       'Advertencias y precauciones',
    'adverse reactions':              'Reacciones adversas',
    'pain': 'dolor', 'fever': 'fiebre', 'headache': 'dolor de cabeza',
    'inflammation': 'inflamacion', 'infection': 'infeccion',
    'treatment': 'tratamiento', 'adult': 'adulto', 'child': 'nino',
    'tablet': 'tableta', 'oral': 'oral', 'daily': 'diario'
  };

  // ═══════════════════════════════════════════════════════════════
  //  CLAUDE API — VÍA PROXY BACKEND (worker.js)
  //  La API key vive en el servidor. El usuario nunca la ve ni toca.
  // ═══════════════════════════════════════════════════════════════
  async function callClaudeAPI(userMessage) {
    // Añadir mensaje al historial
    appState.conversationHistory.push({ role: 'user', content: userMessage });

    // Mantener ventana de contexto razonable
    if (appState.conversationHistory.length > MAX_HISTORY) {
      appState.conversationHistory.splice(0, 2);
    }

    try {
      const response = await fetch(WORKER_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: appState.conversationHistory })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.response;

      // Guardar respuesta en historial
      appState.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;

    } catch (error) {
      console.error('Worker error:', error);
      // Revertir mensaje del usuario del historial
      appState.conversationHistory.pop();
      return null;
    }
  }

  function detectUrgencyFromResponse(responseText) {
    if (responseText.includes('🔴') || responseText.includes('URGENCIA ALTA')) return 'ALTA';
    if (responseText.includes('🟡') || responseText.includes('URGENCIA MEDIA')) return 'MEDIA';
    return 'BAJA';
  }

  // ═══════════════════════════════════════════════════════════════
  //  VOZ — Web Speech API
  // ═══════════════════════════════════════════════════════════════
  function initVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !btnVoice) {
      if (btnVoice) btnVoice.style.display = 'none';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang             = 'es-NI';
    recognition.continuous       = false;
    recognition.interimResults   = true;
    recognition.maxAlternatives  = 1;
    appState.recognition = recognition;

    recognition.onstart = () => {
      appState.isRecording = true;
      btnVoice.classList.add('recording');
      btnVoice.title = 'Escuchando... (toca para detener)';
      if (userInput) {
        userInput.placeholder = '🎙️ Escuchando...';
        userInput.classList.add('listening');
      }
    };

    recognition.onresult = e => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      if (userInput) userInput.value = transcript;
      if (e.results[e.results.length - 1].isFinal) {
        sendMessage(transcript);
      }
    };

    recognition.onend = () => {
      appState.isRecording = false;
      btnVoice.classList.remove('recording');
      btnVoice.title = 'Hablar (voz)';
      if (userInput) {
        userInput.placeholder = 'Describe tus síntomas...';
        userInput.classList.remove('listening');
      }
    };

    recognition.onerror = e => {
      console.error('Voz error:', e.error);
      appState.isRecording = false;
      btnVoice.classList.remove('recording');
      if (userInput) {
        userInput.placeholder = 'Describe tus síntomas...';
        userInput.classList.remove('listening');
      }
      if (e.error === 'not-allowed') {
        addMessage('Para usar el micrófono, permite el acceso cuando el navegador lo solicite.', 'ai', null, getShortTime());
      }
    };

    btnVoice.addEventListener('click', () => {
      if (appState.isRecording) {
        recognition.stop();
      } else {
        if (userInput) userInput.value = '';
        recognition.start();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  GEOLOCALIZACION Y MAPA
  // ═══════════════════════════════════════════════════════════════
  async function getUserLocation() {
    return new Promise(resolve => {
      if (!navigator.geolocation) {
        resolve({ lat: 11.9344, lng: -85.9560, fallback: true });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        () => resolve({ lat: 11.9344, lng: -85.9560, fallback: true }),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  // ── Íconos de Leaflet por categoría (divIcon evita rutas rotas en GitHub Pages)
  function crearIconoCategoria(categoria, emergencia) {
    const colores = {
      hospital:   { bg: '#d90429', emoji: '🏥' },
      clinica:    { bg: '#2F5D7C', emoji: '🏥' },
      farmacia:   { bg: '#5FAF4E', emoji: '💊' },
      doctors:    { bg: '#3FA7A3', emoji: '👨‍⚕️' },
      laboratory: { bg: '#7CCB5A', emoji: '🔬' },
      health:     { bg: '#2F5D7C', emoji: '🏥' }
    };
    const c = colores[categoria] || colores.health;
    const border = emergencia ? '3px solid #fff' : '2px solid #fff';
    return L.divIcon({
      className: '',
      html: `<div style="background:${c.bg};width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:${border};box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:15px;line-height:1;">${c.emoji}</span></div>`,
      iconSize:    [34, 34],
      iconAnchor:  [17, 34],
      popupAnchor: [0, -36]
    });
  }

  // CORRECCIÓN BUG: Reutilizar mapa en lugar de destruirlo y recrearlo
  function initMap(lat, lng) {
    if (typeof L === 'undefined') { console.error('Leaflet no cargado'); return; }

    if (appState.map) {
      appState.map.setView([lat, lng], 14);
      if (appState.userMarker) appState.userMarker.setLatLng([lat, lng]);
      appState.map.invalidateSize();
      return;
    }

    appState.map = L.map('map').setView([lat, lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(appState.map);

    appState.userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="background:#0077b6;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(0,119,182,0.3),0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
      })
    }).addTo(appState.map).bindPopup('<strong>📍 Tu ubicación</strong>').openPopup();

    setTimeout(() => appState.map.invalidateSize(), 100);
  }

  async function searchHealthFacilities(lat, lng, radius = 2000) {
    const centrosBD = obtenerTodosLosCentros();
    if (centrosBD.length > 0) {
      // CORRECCIÓN BUG: Propiedad 'distance' consistente (era 'distancia' en el sort)
      return centrosBD.map(centro => ({
        ...centro,
        distance: calcularDistancia(lat, lng, centro.lat, centro.lng)
      }))
      .filter(c => c.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
    }
    // Fallback Overpass API
    const query = `[out:json][timeout:25];(node["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius},${lat},${lng});way["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius},${lat},${lng}););out center;`;
    try {
      const resp = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      if (!resp.ok) throw new Error('Overpass error');
      const data = await resp.json();
      return data.elements;
    } catch {
      return [];
    }
  }

  // CORRECCIÓN BUG: Eliminada función duplicada — se usa calcularDistancia de base-datos-salud.js

  function displayHealthFacilities(facilities, userLat, userLng) {
    if (!mapResults) return;
    mapResults.innerHTML = '';

    if (appState.healthMarkers) {
      appState.healthMarkers.forEach(m => appState.map && appState.map.removeLayer(m));
      appState.healthMarkers = [];
    }

    if (!facilities || facilities.length === 0) {
      mapResults.innerHTML = '<p style="text-align:center;color:var(--gray-text);">No se encontraron centros. Intenta ampliar la búsqueda o reporta uno nuevo.</p>';
      return;
    }

    facilities.forEach(facility => {
      const lat  = facility.lat  || facility.center?.lat;
      const lng  = facility.lon  || facility.center?.lon || facility.lng;
      if (!lat || !lng) return;

      const name     = facility.tags?.name    || facility.nombre    || 'Sin nombre';
      const type     = facility.tags?.amenity || facility.categoria || 'health';
      const address  = facility.tags?.['addr:street'] || facility.direccion || '';
      // CORRECCIÓN BUG: usar 'distance' consistente
      const distance = facility.distance !== undefined
        ? facility.distance
        : calcularDistancia(userLat, userLng, lat, lng);

      // Usar ícono personalizado por categoría
      const iconoMarcador = crearIconoCategoria(type, facility.emergencia || false);
      const marker = L.marker([lat, lng], { icon: iconoMarcador }).addTo(appState.map);

      // Etiqueta del tipo en español
      const tipoLabel = {
        hospital: 'Hospital', clinica: 'Clínica', farmacia: 'Farmacia',
        doctors: 'Consultorio', laboratory: 'Laboratorio', health: 'Salud'
      }[type] || type;

      const horario = facility.horario || '';
      const telefono = facility.telefono || '';
      const seguros = facility.seguros ? facility.seguros.slice(0,2).join(', ') : '';

      marker.bindPopup(`
        <strong>${name}</strong><br>
        <span style="color:#666;font-size:0.85em;">${tipoLabel} · ${distance}m</span><br>
        ${address ? `📍 ${address}<br>` : ''}
        ${horario  ? `🕐 ${horario}<br>` : ''}
        ${telefono ? `📞 ${telefono}<br>` : ''}
        ${seguros  ? `🏥 ${seguros}<br>` : ''}
        <br><a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
          target="_blank"
          style="background:#2F5D7C;color:white;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:0.82rem;display:inline-block;margin-top:4px;">
          Cómo llegar ↗
        </a>`);
      appState.healthMarkers.push(marker);

      // Ícono emoji por tipo para la lista
      const iconoEmoji = {
        hospital: '🏥', clinica: '🏥', farmacia: '💊',
        doctors: '👨‍⚕️', laboratory: '🔬', health: '📍'
      }[type] || '📍';

      const resultItem = document.createElement('div');
      resultItem.className = 'map-result-item';
      resultItem.style.cursor = 'pointer';
      resultItem.innerHTML = `
        <div class="map-result-icon">${iconoEmoji}</div>
        <div class="map-result-info">
          <div class="map-result-name">${name}</div>
          <div class="map-result-type">${tipoLabel} · ${distance}m${address ? ' · ' + address : ''}</div>
          ${horario ? `<div class="map-result-horario">🕐 ${horario}</div>` : ''}
        </div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&origin=${userLat},${userLng}"
           class="btn-directions" target="_blank" rel="noopener">Ir ↗</a>`;

      // Al tocar el ítem en la lista, abrir el popup del marcador en el mapa
      resultItem.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-directions')) return;
        marker.openPopup();
        appState.map.setView([lat, lng], 16);
      });

      mapResults.appendChild(resultItem);
    });

    if (appState.map && appState.healthMarkers.length > 0) {
      const group = new L.featureGroup([...appState.healthMarkers, appState.userMarker]);
      appState.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  async function showNearbyHealthCenters() {
    if (mapContainer) mapContainer.style.display = 'block';
    if (reportFormContainer) reportFormContainer.style.display = 'none';
    if (reportsListContainer) reportsListContainer.style.display = 'none';
    if (chatMessages?.parentElement) chatMessages.parentElement.style.display = 'none';
    if (mapLoading) mapLoading.style.display = 'block';
    if (mapResults) mapResults.innerHTML = '';

    try {
      const location = await getUserLocation();
      appState.userLocation = location;
      initMap(location.lat, location.lng);
      const facilities = await searchHealthFacilities(location.lat, location.lng);
      displayHealthFacilities(facilities, location.lat, location.lng);
      if (location.fallback) {
        addMessage('Usando ubicación aproximada de Granada. Permite el acceso a ubicación para resultados precisos.', 'ai', null, getShortTime());
      }
    } catch (err) {
      console.error('Error mapa:', err);
      if (mapResults) mapResults.innerHTML = '<p style="color:var(--danger);text-align:center;">No se pudo cargar el mapa.</p>';
    } finally {
      if (mapLoading) mapLoading.style.display = 'none';
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  CROWDSOURCING — REPORTES
  // ═══════════════════════════════════════════════════════════════
  async function initReportForm() {
    if (reportFormContainer) reportFormContainer.style.display = 'block';
    if (mapContainer) mapContainer.style.display = 'none';
    if (reportsListContainer) reportsListContainer.style.display = 'none';
    if (chatMessages?.parentElement) chatMessages.parentElement.style.display = 'none';

    if (locationStatus) {
      locationStatus.innerHTML = '<span class="loading">Obteniendo ubicación...</span>';
      locationStatus.className = 'location-status';
    }
    try {
      const location = await getUserLocation();
      if (centerLatInput) centerLatInput.value = location.lat;
      if (centerLngInput) centerLngInput.value = location.lng;
      if (locationStatus) {
        locationStatus.innerHTML = `Ubicación capturada: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
        locationStatus.className = 'location-status success';
      }
    } catch {
      if (locationStatus) {
        locationStatus.innerHTML = 'No se pudo obtener ubicación. Ingresa manualmente.';
        locationStatus.className = 'location-status error';
      }
    }
    if (reportForm) reportForm.reset();
  }

  function saveReport(data) {
    const reports = JSON.parse(localStorage.getItem('saludConecta_reports') || '[]');
    const report = { id: Date.now(), timestamp: getLocalTimestamp(), ...data };
    reports.push(report);
    localStorage.setItem('saludConecta_reports', JSON.stringify(reports));
    return report;
  }

  function getReports() {
    return JSON.parse(localStorage.getItem('saludConecta_reports') || '[]');
  }

  window.deleteReport = function(id) {
    const reports = getReports().filter(r => r.id !== id);
    localStorage.setItem('saludConecta_reports', JSON.stringify(reports));
    showReportsList();
  };

  function clearAllReports() {
    if (confirm('¿Eliminar todos los reportes? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('saludConecta_reports');
      showReportsList();
    }
  }

  function showReportsList() {
    if (reportsListContainer) reportsListContainer.style.display = 'block';
    if (mapContainer) mapContainer.style.display = 'none';
    if (reportFormContainer) reportFormContainer.style.display = 'none';
    if (chatMessages?.parentElement) chatMessages.parentElement.style.display = 'none';

    const reports = getReports();
    if (!reportsListContent) return;

    if (reports.length === 0) {
      reportsListContent.innerHTML = '<p style="text-align:center;color:var(--gray-text);padding:2rem;">No hay reportes guardados. ¡Sé el primero en reportar un centro!</p>';
      return;
    }

    const typeLabels = { hospital: 'Hospital', clinic: 'Clínica', pharmacy: 'Farmacia', doctors: 'Consultorio', laboratory: 'Laboratorio', other: 'Otro' };
    reportsListContent.innerHTML = `<p style="margin-bottom:1rem;color:var(--gray-text);">Tienes <strong>${reports.length}</strong> reporte(s) guardado(s) localmente.</p><div id="reports-list"></div>`;

    const listContainer = document.getElementById('reports-list');
    if (!listContainer) return;

    reports.sort((a, b) => b.id - a.id).forEach(r => {
      const item = document.createElement('div');
      item.className = 'report-item';
      item.innerHTML = `
        <div class="report-item-header">
          <span class="report-item-name">${r.name}</span>
          <span class="report-item-type">${typeLabels[r.type] || r.type}</span>
        </div>
        ${r.address ? `<div class="report-item-details">Dirección: ${r.address}</div>` : ''}
        ${r.phone   ? `<div class="report-item-details">Teléfono: ${r.phone}</div>` : ''}
        ${r.hours   ? `<div class="report-item-details">Horario: ${r.hours}</div>` : ''}
        ${r.notes   ? `<div class="report-item-details">Notas: ${r.notes}</div>` : ''}
        <div class="report-item-location">Reportado: ${r.timestamp} · Coords: ${r.lat?.toFixed(4)}, ${r.lng?.toFixed(4)}</div>
        <div class="report-item-actions">
          <button class="btn-delete-report" onclick="window.deleteReport(${r.id})">Eliminar</button>
        </div>`;
      listContainer.appendChild(item);
    });
  }

  function exportReportsJSON() {
    const reports = getReports();
    if (!reports.length) { alert('No hay reportes para exportar'); return; }
    const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `salud-conecta-reportes-${new Date().toISOString().slice(0,10)}.json`);
    alert(`Exportados ${reports.length} reportes. Puedes compartir este archivo con OpenStreetMap o autoridades de salud.`);
  }

  function exportReportsCSV() {
    const reports = getReports();
    if (!reports.length) { alert('No hay reportes para exportar'); return; }
    const headers = ['ID','Fecha','Nombre','Tipo','Direccion','Telefono','Horario','Notas','Latitud','Longitud'];
    const rows = reports.map(r => [r.id, r.timestamp, r.name, r.type, r.address||'', r.phone||'', r.hours||'', r.notes||'', r.lat, r.lng]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `salud-conecta-reportes-${new Date().toISOString().slice(0,10)}.csv`);
    alert(`Exportados ${reports.length} reportes en CSV.`);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ═══════════════════════════════════════════════════════════════
  //  MEDICAMENTOS
  // ═══════════════════════════════════════════════════════════════
  function getEnglishDrugName(name) {
    return DRUG_NAME_MAPPING[name.toLowerCase().trim()] || name.toLowerCase();
  }

  function translateMedicalText(text) {
    if (!text) return 'Información no disponible.';
    let t = text;
    Object.entries(MEDICAL_TERMS_ES).forEach(([en, es]) => {
      t = t.replace(new RegExp(en, 'gi'), es);
    });
    return t.replace(/\*/g, '').replace(/\[/g, '(').replace(/\]/g, ')');
  }

  window.expandDrugContent = function(contentId, btn) {
    const el = document.getElementById(contentId);
    if (el) {
      el.style.webkitLineClamp = 'unset';
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
      btn.style.display = 'none';
    }
  };

  async function fetchDrugInfo(drugName) {
    // Cache para evitar búsquedas repetidas
    if (appState.drugCache[drugName]) {
      showTyping(false);
      addDrugCardLocal(appState.drugCache[drugName], getShortTime());
      return;
    }

    showTyping(true);
    const medBD = buscarMedicamento(drugName);
    if (medBD) {
      showTyping(false);
      const drugData = {
        name: medBD.nombre_es + (medBD.nombres_comerciales.length > 0 ? ` (${medBD.nombres_comerciales.slice(0,3).join(', ')})` : ''),
        usage:          medBD.uso_principal,
        warnings:       `${medBD.contraindicaciones}. Efectos secundarios: ${medBD.efectos_secundarios}`,
        source:         'Base de datos local — Nicaragua ✓',
        dosis:          medBD.dosis_adulto,
        requiere_receta: medBD.requiere_receta,
        precio:         medBD.precio_aproximado
      };
      appState.drugCache[drugName] = drugData;
      addDrugCardLocal(drugData, getShortTime());
      setTimeout(() => {
        const farmacias = buscarCentrosPorCategoria('farmacia');
        if (farmacias?.length > 0) {
          addMessage(`💊 Puedes conseguirlo en estas farmacias de Granada:\n\n${farmacias.slice(0,5).map(f => `• ${f.nombre} (${f.horario})`).join('\n')}`, 'ai', null, getShortTime());
        }
      }, 500);
      return;
    }

    // Fallback openFDA
    const englishName = getEnglishDrugName(drugName);
    try {
      let resp = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${englishName}&limit=1`);
      if (!resp.ok) resp = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${englishName}&limit=1`);
      if (!resp.ok) throw new Error('No encontrado');
      const data = await resp.json();
      const result = data.results[0];
      const drugData = {
        name:    result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || drugName,
        usage:   translateMedicalText(result.indications_and_usage?.[0] || 'Información no disponible.'),
        warnings:translateMedicalText(result.warnings_and_cautions?.[0] || result.adverse_reactions?.[0] || 'Consulte a su médico.'),
        source:  'Fuente: openFDA (EE.UU.) — Verificar con farmacéutico en Nicaragua'
      };
      showTyping(false);
      addDrugCard(drugData, getShortTime());
    } catch {
      showTyping(false);
      addMessage(`No encontré información sobre "${drugName}". En Granada, consulta en farmacias como Del Pueblo, San Nicolás o Cruz Verde.`, 'ai', null, getShortTime());
    }
  }

  function addDrugCardLocal(data, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    const contentId = 'drug-content-' + Date.now();
    messageDiv.innerHTML = `
      <div class="message-avatar">Rx</div>
      <div class="message-content">
        <p>Información sobre <strong>${data.name}</strong>:</p>
        <div class="drug-warning-banner">
          <strong>✅ Información verificada — Nicaragua</strong>
          <ul>
            <li>Datos de la base de datos local de Granada</li>
            <li>Precios aproximados en <strong>Córdobas</strong></li>
            <li>Consulta siempre con un <strong>farmacéutico local</strong></li>
          </ul>
        </div>
        <div class="drug-card">
          <div class="drug-card-header"><span class="drug-icon">Rx</span><h4 class="drug-title">${data.name}</h4></div>
          <div class="drug-section"><div class="drug-section-title">Uso principal</div>
            <div class="drug-section-content" id="${contentId}">${truncateText(data.usage, 150)}</div>
            <button class="btn-expand-drug" onclick="expandDrugContent('${contentId}', this)">Leer más</button></div>
          ${data.dosis ? `<div class="drug-section"><div class="drug-section-title">Dosis adulto</div><div class="drug-section-content">${data.dosis}</div></div>` : ''}
          <div class="drug-section"><div class="drug-section-title">Advertencias</div>
            <div class="drug-section-content">${truncateText(data.warnings, 150)}</div></div>
          ${data.requiere_receta ? `<div class="drug-section"><div class="drug-section-title">Requiere receta</div><div class="drug-section-content" style="color:var(--danger);">Sí — Consulta médica obligatoria</div></div>` : ''}
          ${data.precio ? `<div class="drug-section"><div class="drug-section-title">Precio aproximado</div><div class="drug-section-content" style="color:var(--success);">${data.precio}</div></div>` : ''}
          <div class="drug-footer">${data.source}</div>
        </div>
        <p class="message-disclaimer">No te automediques. Consulta con tu farmacéutico o médico.</p>
        <span class="message-time">${timestamp}</span>
      </div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  function addDrugCard(data, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    const contentId = 'drug-content-' + Date.now();
    messageDiv.innerHTML = `
      <div class="message-avatar">Rx</div>
      <div class="message-content">
        <p>Información sobre <strong>${data.name}</strong>:</p>
        <div class="drug-warning-banner">
          <strong>⚠️ Información de EE.UU. (FDA)</strong>
          <ul>
            <li>Las dosis y nombres comerciales pueden diferir en Nicaragua</li>
            <li>Consulta siempre con un <strong>farmacéutico local</strong></li>
          </ul>
        </div>
        <div class="drug-card">
          <div class="drug-card-header"><span class="drug-icon">Rx</span><h4 class="drug-title">${data.name}</h4></div>
          <div class="drug-section"><div class="drug-section-title">Uso indicado</div>
            <div class="drug-section-content" id="${contentId}">${truncateText(data.usage, 150)}</div>
            <button class="btn-expand-drug" onclick="expandDrugContent('${contentId}', this)">Leer más</button></div>
          <div class="drug-section"><div class="drug-section-title">Advertencias</div>
            <div class="drug-section-content">${truncateText(data.warnings, 150)}</div></div>
          <div class="drug-footer">${data.source}</div>
        </div>
        <p class="message-disclaimer">No te automediques. Consulta con tu médico o farmacéutico.</p>
        <span class="message-time">${timestamp}</span>
      </div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // ═══════════════════════════════════════════════════════════════
  //  SÍNTOMAS
  // ═══════════════════════════════════════════════════════════════
  function addSintomaCard(sintoma, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    const urgenciaColor = sintoma.urgencia_default === 'ALTA' ? '#d90429' : sintoma.urgencia_default === 'MEDIA' ? '#f77f00' : '#0077b6';
    messageDiv.innerHTML = `
      <div class="message-avatar">🩺</div>
      <div class="message-content">
        <p>Información sobre <strong>${sintoma.nombre}</strong>:</p>
        <div style="background:#e9f5ff;border-left:4px solid ${urgenciaColor};padding:12px;margin:12px 0;border-radius:8px;font-size:0.85rem;color:#0369a1;">
          <strong>Nivel de atención: ${sintoma.urgencia_default === 'ALTA' ? '🔴 Urgente' : sintoma.urgencia_default === 'MEDIA' ? '🟡 Moderado' : '🟢 Leve'}</strong>
          <p style="margin:6px 0 0;font-size:0.8rem;">${sintoma.descripcion}</p>
        </div>
        <div class="drug-card">
          <div class="drug-card-header"><span class="drug-icon">🏠</span><h4 class="drug-title">Cuidados en casa</h4></div>
          <div class="drug-section"><ul style="margin:0;padding-left:20px;">${sintoma.cuidados_casa.map(c => `<li>${c}</li>`).join('')}</ul></div>
          <div class="drug-card-header" style="margin-top:12px;"><span class="drug-icon">🩺</span><h4 class="drug-title">¿Cuándo consultar médico?</h4></div>
          <div class="drug-section"><ul style="margin:0;padding-left:20px;">${sintoma.cuando_consultar.map(c => `<li>${c}</li>`).join('')}</ul></div>
          <div class="drug-card-header" style="margin-top:12px;"><span class="drug-icon">📋</span><h4 class="drug-title">Causas comunes</h4></div>
          <div class="drug-section"><div class="drug-section-content">${sintoma.causas_comunes.join(', ')}</div></div>
          <div class="drug-footer">Fuente: Base de datos local — Nicaragua ✓</div>
        </div>
        <p class="message-disclaimer">Esta información es orientativa. No sustituye la consulta médica. Emergencias: 128</p>
        <span class="message-time">${timestamp}</span>
      </div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // ═══════════════════════════════════════════════════════════════
  //  CHAT Y TRIAGE
  // ═══════════════════════════════════════════════════════════════
  function detectUrgency(text) {
    const lower = text.toLowerCase();
    if (URGENCY_KEYWORDS.HIGH.some(k => lower.includes(k)))   return 'HIGH';
    if (URGENCY_KEYWORDS.MEDIUM.some(k => lower.includes(k))) return 'MEDIUM';
    return 'LOW';
  }

  function generateMockResponse(urgency) {
    const RESPONSES = {
      HIGH: {
        text:    '🔴 URGENCIA ALTA — Los síntomas que describes pueden indicar una condición grave.',
        action:  'Llama al 128 ahora o dirígete inmediatamente al Hospital Virgen de la Asistencia (Tel: 2552-2600, 24h) o al Hospital Alemán Nicaragüense (Tel: 2552-3000).',
        urgency: 'ALTA'
      },
      MEDIUM: {
        text:    '🟡 URGENCIA MEDIA — Deberías consultar con un profesional pronto.',
        action:  'Programa una cita en los próximos 1-2 días. Puedes ir al Hospital Virgen de la Asistencia o a la Clínica Familiar del MINSA. ¿Quieres ver centros cercanos en el mapa?',
        urgency: 'MEDIA'
      },
      LOW: {
        text:    '🟢 URGENCIA BAJA — Los síntomas que describes son frecuentes y generalmente manejables en casa.',
        action:  'Descansa, mantente hidratado y vigila si los síntomas empeoran. Si persisten más de 3 días o se intensifican, visita un centro de salud del MINSA (atención gratuita) o una farmacia con consultorio.\n\n⚕️ Esto es orientación informativa. Consulta con un profesional de salud.',
        urgency: 'BAJA'
      }
    };
    return RESPONSES[urgency];
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    const timestamp = getShortTime();
    addMessage(text, 'user', null, timestamp);
    if (userInput) userInput.value = '';
    if (btnSend) btnSend.disabled = true;
    showTyping(true);

    const lowerText = text.toLowerCase();

    // 1. SÍNTOMAS ESPECÍFICOS DE LA BD LOCAL (con cache)
    const cacheKey = lowerText.trim();
    let sintomaEncontrado = appState.symptomCache[cacheKey];
    if (sintomaEncontrado === undefined) {
      sintomaEncontrado = buscarSintoma(lowerText) || null;
      appState.symptomCache[cacheKey] = sintomaEncontrado;
    }
    if (sintomaEncontrado) {
      appState.medicationSearches.push({ drug: sintomaEncontrado.nombre, timestamp: getLocalTimestamp(), query: text });
      setTimeout(() => {
        showTyping(false);
        addSintomaCard(sintomaEncontrado, getShortTime());
        enableInput();
      }, 800);
      return;
    }

    // 2. SOLICITUD DE MEDICAMENTO
    if (lowerText === 'buscar medicamento' || lowerText === 'medicamento') {
      setTimeout(() => {
        showTyping(false);
        addMessage('Claro, ¿qué medicamento buscas? Escribe su nombre (ej: Paracetamol, Ibuprofeno, Omeprazol) y te doy información detallada.', 'ai', null, getShortTime());
        enableInput('Escribe el nombre del medicamento...');
      }, 400);
      return;
    }

    // 3. MEDICAMENTO DIRECTO
    const foundDrugDirect = COMMON_DRUGS.find(d =>
      lowerText === d || lowerText.startsWith(d + ' ') || lowerText.endsWith(' ' + d) ||
      lowerText.includes(' ' + d + ' ')
    );
    const isDrugQuery   = DRUG_KEYWORDS.some(k => lowerText.includes(k));
    const foundDrugKw   = COMMON_DRUGS.find(d => lowerText.includes(d));

    if (foundDrugDirect || (isDrugQuery && foundDrugKw)) {
      const drugName = foundDrugDirect || foundDrugKw;
      appState.medicationSearches.push({ drug: drugName, timestamp: getLocalTimestamp(), query: text });
      setTimeout(() => {
        fetchDrugInfo(drugName);
        enableInput();
      }, 800);
      return;
    }

    // 4. MAPA / CENTROS
    if (['mapa','centro','hospital','farmacia','clinica','cerca'].some(k => lowerText.includes(k))) {
      setTimeout(() => { showTyping(false); showNearbyHealthCenters(); enableInput(); }, 600);
      return;
    }

    // 5. REPORTAR
    if (lowerText.includes('reportar') || lowerText.includes('agregar centro')) {
      setTimeout(() => { showTyping(false); initReportForm(); enableInput(); }, 600);
      return;
    }

    // 6. VER REPORTES
    if (lowerText.includes('mis reportes') || lowerText.includes('ver reportes')) {
      setTimeout(() => { showTyping(false); showReportsList(); enableInput(); }, 600);
      return;
    }

    // 7. TRIAGE — CLAUDE API vía worker backend
    // Si el worker falla (sin internet, no desplegado), usa respuestas básicas automáticamente
    showTyping(true);
    try {
      const response = await callClaudeAPI(text);
      showTyping(false);
      if (response) {
        const urgency = detectUrgencyFromResponse(response);
        addMessage(response, 'ai', urgency, getShortTime());
      } else {
        // Fallback automático cuando el worker no está disponible
        const urgency = detectUrgency(text);
        const mock = generateMockResponse(urgency);
        addMessage(mock.text + '\n\n' + mock.action, 'ai', mock.urgency, getShortTime());
      }
    } catch {
      showTyping(false);
      const urgency = detectUrgency(text);
      const mock = generateMockResponse(urgency);
      addMessage(mock.text + '\n\n' + mock.action, 'ai', mock.urgency, getShortTime());
    }
    enableInput();
  }

  function enableInput(placeholder = 'Describe tus síntomas...') {
    if (btnSend) btnSend.disabled = false;
    if (userInput) { userInput.placeholder = placeholder; userInput.focus(); }
  }

  function addMessage(text, sender, urgency = null, timestamp) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    const avatar = sender === 'ai' ? 'AI' : 'TÚ';

    let urgencyBadge = '';
    if (sender === 'ai' && urgency) {
      const colors  = { ALTA: '#d90429', MEDIA: '#f77f00', BAJA: '#0077b6' };
      const labels  = { ALTA: '🔴 Urgente', MEDIA: '🟡 Moderado', BAJA: '🟢 Leve' };
      urgencyBadge = `<div style="background:${colors[urgency]};color:white;padding:4px 10px;border-radius:4px;font-size:0.75rem;margin-bottom:8px;display:inline-block;">${labels[urgency]}</div>`;
    }

    div.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        ${urgencyBadge}
        <p>${text.replace(/\n/g, '<br>')}</p>
        ${sender === 'ai' ? '<p class="message-disclaimer">Esto es orientación informativa. Consulta a un profesional.</p>' : ''}
        <span class="message-time">${timestamp}</span>
      </div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  // ═══════════════════════════════════════════════════════════════
  //  EXPORTAR CONVERSACIÓN
  // ═══════════════════════════════════════════════════════════════
  function generateClinicalSummary() {
    const messages   = Array.from(document.querySelectorAll('.chat-messages .message'));
    const userMsgs   = messages.filter(m => m.classList.contains('user-message'));
    const symptoms   = [];
    userMsgs.forEach(msg => {
      const txt = msg.textContent.toLowerCase();
      Object.values(URGENCY_KEYWORDS).flat().forEach(kw => {
        if (txt.includes(kw) && !symptoms.includes(kw)) symptoms.push(kw);
      });
    });
    let maxUrgency = 'BAJA';
    if (symptoms.some(s => URGENCY_KEYWORDS.HIGH.includes(s)))   maxUrgency = 'ALTA';
    else if (symptoms.some(s => URGENCY_KEYWORDS.MEDIUM.includes(s))) maxUrgency = 'MEDIA';
    return {
      symptoms:     symptoms.join(', ') || 'No especificados',
      urgency:      maxUrgency,
      drugSearches: appState.medicationSearches.map(m => m.drug).join(', ') || 'Ninguno',
      duration:     Math.round((new Date() - appState.conversationStartTime) / 60000) + ' minutos'
    };
  }

  function getChatHistory() {
    const lines = [];
    const now = getLocalTimestamp();
    const summary = generateClinicalSummary();
    lines.push('SALUD-CONECTA AI — REPORTE DE CONSULTA');
    lines.push('=======================================');
    lines.push(`Fecha: ${now}`);
    lines.push(`Ubicación: ${includeLocationCheckbox?.checked ? 'Granada, Nicaragua' : '[Ocultada]'}`);
    lines.push(`Versión: 6.0.0`);
    lines.push('');

    if (includeSummaryCheckbox?.checked) {
      lines.push('RESUMEN CLÍNICO');
      lines.push('---------------');
      lines.push(`• Síntomas: ${summary.symptoms}`);
      lines.push(`• Urgencia: ${summary.urgency}`);
      lines.push(`• Medicamentos consultados: ${summary.drugSearches}`);
      lines.push(`• Duración: ${summary.duration}`);
      lines.push('');
    }
    if (includeMedHistoryCheckbox?.checked && appState.medicationSearches.length > 0) {
      lines.push('HISTORIAL DE MEDICAMENTOS');
      lines.push('-------------------------');
      appState.medicationSearches.forEach((s, i) => lines.push(`${i+1}. [${s.timestamp}] ${s.drug}`));
      lines.push('');
    }
    if (anonymizeCheckbox?.checked) { lines.push('[DATOS ANONIMIZADOS]'); lines.push(''); }

    lines.push('CONVERSACIÓN');
    lines.push('------------');
    document.querySelectorAll('.chat-messages .message').forEach(msg => {
      const isUser  = msg.classList.contains('user-message');
      const sender  = isUser ? 'Usuario' : 'IA';
      const time    = msg.querySelector('.message-time')?.textContent || '';
      const content = msg.querySelector('.message-content')?.cloneNode(true);
      content?.querySelectorAll('.message-disclaimer, .drug-card').forEach(el => el.remove());
      lines.push(`[${time}] ${sender}: ${(content?.textContent || '').trim()}`);
      lines.push('');
    });

    lines.push('-------------------------------------------');
    lines.push('⚠️ No es diagnóstico médico. Emergencias: 128');
    lines.push('Salud-Conecta AI v6.0.0');
    return lines.join('\n');
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard) return navigator.clipboard.writeText(text);
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
  }

  // ═══════════════════════════════════════════════════════════════
  //  EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════

  // Chat
  if (btnSend)  btnSend.addEventListener('click', () => sendMessage(userInput.value));
  if (userInput) userInput.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(userInput.value); });

  // Quick buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action  = btn.getAttribute('data-action');
      const symptom = btn.getAttribute('data-symptom');
      if (action === 'search-drug') sendMessage('Buscar medicamento');
      else if (symptom) sendMessage(symptom);
    });
  });

  // Emergencia
  if (btnEmergency)      btnEmergency.addEventListener('click', () => { if (emergencyModal) emergencyModal.style.display = 'flex'; });
  if (btnCloseEmergency) btnCloseEmergency.addEventListener('click', () => { if (emergencyModal) emergencyModal.style.display = 'none'; });
  if (btnShowMapEmergency) btnShowMapEmergency.addEventListener('click', () => { if (emergencyModal) emergencyModal.style.display = 'none'; showNearbyHealthCenters(); });
  if (emergencyModal)    emergencyModal.addEventListener('click', e => { if (e.target === emergencyModal) emergencyModal.style.display = 'none'; });

  // Exportar conversación
  if (btnExport)      btnExport.addEventListener('click', () => { if (exportModal) { exportModal.style.display = 'flex'; if (exportFeedback) exportFeedback.style.display = 'none'; } });
  if (btnCloseExport) btnCloseExport.addEventListener('click', () => { if (exportModal) exportModal.style.display = 'none'; });
  if (exportModal)    exportModal.addEventListener('click', e => { if (e.target === exportModal) exportModal.style.display = 'none'; });
  if (btnExportTxt)   btnExportTxt.addEventListener('click', () => {
    const blob = new Blob([getChatHistory()], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `salud-conecta-${new Date().toISOString().slice(0,10).replace(/-/g,'')}.txt`);
    showExportFeedback();
  });
  if (btnExportCopy)  btnExportCopy.addEventListener('click', async () => {
    try { await copyToClipboard(getChatHistory()); showExportFeedback(); }
    catch { alert('Copia manual requerida.'); }
  });

  // Mapa — NO destruir al cerrar, solo ocultar
  if (btnCloseMap) btnCloseMap.addEventListener('click', () => {
    if (mapContainer) mapContainer.style.display = 'none';
    if (chatMessages?.parentElement) chatMessages.parentElement.style.display = 'flex';
    // Invalidar tamaño para cuando se vuelva a mostrar
    if (appState.map) setTimeout(() => appState.map.invalidateSize(), 100);
  });
  if (btnAddCenter) btnAddCenter.addEventListener('click', initReportForm);

  // Formulario reporte
  if (btnCloseForm)    btnCloseForm.addEventListener('click', () => { if (reportFormContainer) reportFormContainer.style.display = 'none'; if (mapContainer) mapContainer.style.display = 'flex'; });
  if (btnCancelReport) btnCancelReport.addEventListener('click', () => { if (reportFormContainer) reportFormContainer.style.display = 'none'; if (mapContainer) mapContainer.style.display = 'flex'; });
  if (reportForm) reportForm.addEventListener('submit', e => {
    e.preventDefault();
    saveReport({
      name:    document.getElementById('center-name').value,
      type:    document.getElementById('center-type').value,
      address: document.getElementById('center-address').value,
      phone:   document.getElementById('center-phone').value,
      hours:   document.getElementById('center-hours').value,
      notes:   document.getElementById('center-notes').value,
      lat:     parseFloat(centerLatInput.value),
      lng:     parseFloat(centerLngInput.value)
    });
    alert('Reporte guardado. Puedes exportarlo desde "Mis Reportes".');
    if (reportFormContainer) reportFormContainer.style.display = 'none';
    showReportsList();
  });

  // Lista reportes
  if (btnCloseReports)      btnCloseReports.addEventListener('click', () => { if (reportsListContainer) reportsListContainer.style.display = 'none'; if (mapContainer) mapContainer.style.display = 'flex'; });
  if (btnExportReportsJSON) btnExportReportsJSON.addEventListener('click', exportReportsJSON);
  if (btnExportReportsCSV)  btnExportReportsCSV.addEventListener('click', exportReportsCSV);
  if (btnClearReports)      btnClearReports.addEventListener('click', clearAllReports);

  // ═══════════════════════════════════════════════════════════════
  //  PERFIL DE USUARIO
  // ═══════════════════════════════════════════════════════════════
  const profileContainer  = document.getElementById('profile-container');
  const btnProfile        = document.getElementById('btn-profile');
  const btnCloseProfile   = document.getElementById('btn-close-profile');
  const btnCancelProfile  = document.getElementById('btn-cancel-profile');
  const btnSaveProfile    = document.getElementById('btn-save-profile');
  const btnLogout         = document.getElementById('btn-logout');

  function openProfile() {
    if (!appState.currentUser) return;
    const p = getUserProfile(appState.currentUser);

    // Llenar campos con datos guardados
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('pf-name',     p.name);
    set('pf-birthdate',p.birthdate);
    set('pf-sex',      p.sex);
    set('pf-address',  p.address);
    set('pf-phone',    p.phone);
    set('pf-blood',    p.blood);
    set('pf-weight',   p.weight);
    set('pf-height',   p.height);
    set('pf-pregnant', p.pregnant || 'no');
    set('pf-allergies',p.allergies);
    set('pf-meds',     p.meds);
    set('pf-other',    p.otherConditions);
    set('pf-ec-name',  p.ecName);
    set('pf-ec-phone', p.ecPhone);

    // Toggles de enfermedades
    const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    setChk('pf-diabetes',    p.diabetes);
    setChk('pf-hypertension',p.hypertension);
    setChk('pf-asthma',      p.asthma);
    setChk('pf-heart',       p.heart);
    setChk('pf-kidney',      p.kidney);
    setChk('pf-liver',       p.liver);

    // PIN vacío
    ['pf-pin1','pf-pin2','pf-pin3','pf-pin4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('filled'); }
    });

    // Header del perfil
    const nameEl = document.getElementById('profile-header-name');
    const subEl  = document.getElementById('profile-header-sub');
    if (nameEl) nameEl.textContent = p.name || 'Mi perfil';
    if (subEl)  subEl.textContent  = p.birthdate ? `Nacido/a: ${p.birthdate}` : 'Información de salud personal';

    // Inicializar nav PIN del perfil
    initAuthUI();

    // Mostrar perfil, ocultar chat
    if (profileContainer) profileContainer.style.display = 'block';
    if (chatMessages?.parentElement) chatMessages.parentElement.style.display = 'none';
  }

  function saveProfile() {
    if (!appState.currentUser) return;

    const get    = id => document.getElementById(id)?.value?.trim() || '';
    const getChk = id => document.getElementById(id)?.checked || false;

    const profile = {
      name:            get('pf-name'),
      birthdate:       get('pf-birthdate'),
      sex:             get('pf-sex'),
      address:         get('pf-address'),
      phone:           get('pf-phone'),
      blood:           get('pf-blood'),
      weight:          get('pf-weight'),
      height:          get('pf-height'),
      pregnant:        get('pf-pregnant'),
      allergies:       get('pf-allergies'),
      meds:            get('pf-meds'),
      otherConditions: get('pf-other'),
      ecName:          get('pf-ec-name'),
      ecPhone:         get('pf-ec-phone'),
      diabetes:        getChk('pf-diabetes'),
      hypertension:    getChk('pf-hypertension'),
      asthma:          getChk('pf-asthma'),
      heart:           getChk('pf-heart'),
      kidney:          getChk('pf-kidney'),
      liver:           getChk('pf-liver')
    };

    // Cambiar PIN si llenó los 4 dígitos
    const newPin = ['pf-pin1','pf-pin2','pf-pin3','pf-pin4']
      .map(id => document.getElementById(id)?.value || '').join('');
    if (newPin.length === 4) {
      const users = getUsers();
      if (users[appState.currentUser]) {
        users[appState.currentUser].pinHash = hashPin(newPin);
        saveUsers(users);
      }
    }

    saveUserProfile(appState.currentUser, profile);
    updateHeaderUser();

    // Cerrar perfil
    if (profileContainer) profileContainer.style.display = 'none';
    if (chatMessages?.parentElement) chatMessages.parentElement.style.display = 'flex';

    addMessage('✅ Tu perfil fue guardado. Esta información me ayuda a darte orientación más precisa.', 'ai', null, getShortTime());
  }

  function closeProfile() {
    if (profileContainer) profileContainer.style.display = 'none';
    if (chatMessages?.parentElement) chatMessages.parentElement.style.display = 'flex';
  }

  if (btnProfile)       btnProfile.addEventListener('click', openProfile);
  if (btnCloseProfile)  btnCloseProfile.addEventListener('click', closeProfile);
  if (btnCancelProfile) btnCancelProfile.addEventListener('click', closeProfile);
  if (btnSaveProfile)   btnSaveProfile.addEventListener('click', saveProfile);

  if (btnLogout) btnLogout.addEventListener('click', () => {
    if (confirm('¿Cerrar sesión? Tendrás que ingresar tu PIN la próxima vez.')) {
      clearSession();
      appState.currentUser = null;
      appState.conversationHistory = [];
      if (appContent) appContent.style.display = 'none';
      if (authScreen) authScreen.style.display = 'flex';
      clearPins();
      showAuthTab('login');
    }
  });

  // Incluir perfil en exportación si está marcado
  const includeProfileCheckbox = document.getElementById('include-profile');

  // ═══════════════════════════════════════════════════════════════
  //  MODAL DE PRIVACIDAD (post-login)
  // ═══════════════════════════════════════════════════════════════
  const privacyModal  = document.getElementById('privacy-modal');
  const acceptTerms   = document.getElementById('accept-terms');
  const btnEnter      = document.getElementById('btn-enter');

  if (acceptTerms) acceptTerms.addEventListener('change', e => {
    if (btnEnter) btnEnter.disabled = !e.target.checked;
  });

  if (btnEnter) btnEnter.addEventListener('click', () => {
    localStorage.setItem('sc_consent', 'true');
    if (privacyModal) privacyModal.style.display = 'none';
    if (appContent)   appContent.style.display   = 'block';
  });

  // ═══════════════════════════════════════════════════════════════
  //  INICIALIZACIÓN
  // ═══════════════════════════════════════════════════════════════
  initVoiceInput();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW error:', err));
  }

  console.log('🏥 Salud-Conecta AI v7.0.0 iniciada · Worker:', WORKER_URL);
});

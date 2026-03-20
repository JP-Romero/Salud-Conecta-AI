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
    conversationStartTime: new Date()
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

  // Detectar si ya se instaló o se descartó
  const installDismissed = localStorage.getItem('saludConecta_installDismissed');

  // Escuchar evento beforeinstallprompt (Chrome/Edge/Android)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar banner solo si no lo ha descartado antes
    if (installDismissed !== 'true') {
      installBanner.style.display = 'block';
      btnInstallHeader.style.display = 'block';
    }
    
    console.log('✅ Evento beforeinstallprompt disparado');
  });

  // Detectar cuando la app se instala
  window.addEventListener('appinstalled', () => {
    installBanner.style.display = 'none';
    btnInstallHeader.style.display = 'none';
    deferredPrompt = null;
    localStorage.setItem('saludConecta_installed', 'true');
    console.log('✅ App instalada exitosamente');
  });

  // Botón de instalar (banner)
  btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) {
      showInstallInstructions();
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Respuesta del usuario: ${outcome}`);
    
    if (outcome === 'accepted') {
      installBanner.style.display = 'none';
      btnInstallHeader.style.display = 'none';
    }
    deferredPrompt = null;
  });

  // Botón de instalar (header)
  btnInstallHeader.addEventListener('click', async () => {
    if (!deferredPrompt) {
      showInstallInstructions();
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      btnInstallHeader.style.display = 'none';
    }
    deferredPrompt = null;
  });

  // Descartar banner de instalación
  btnDismissInstall.addEventListener('click', () => {
    installBanner.style.display = 'none';
    localStorage.setItem('saludConecta_installDismissed', 'true');
  });

  // Mostrar instrucciones de instalación
  function showInstallInstructions() {
    // Detectar navegador
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
      installStepsChrome.style.display = 'none';
      installStepsSafari.style.display = 'block';
    } else {
      installStepsChrome.style.display = 'block';
      installStepsSafari.style.display = 'none';
    }
    
    installInstructionsModal.style.display = 'flex';
  }

  btnCloseInstallInstructions.addEventListener('click', () => {
    installInstructionsModal.style.display = 'none';
  });

  installInstructionsModal.addEventListener('click', (e) => {
    if (e.target === installInstructionsModal) {
      installInstructionsModal.style.display = 'none';
    }
  });

  // === 4. CHAT & TRIAGE LOGIC ===
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const btnSend = document.getElementById('btn-send');
  const typingIndicator = document.getElementById('typing-indicator');
  const quickBtns = document.querySelectorAll('.quick-btn');
  
  // Emergency & Export Modals
  const btnEmergency = document.getElementById('btn-emergency');
  const emergencyModal = document.getElementById('emergency-modal');
  const btnCloseEmergency = document.getElementById('btn-close-emergency');
  const btnShowHospitals = document.getElementById('btn-show-hospitals');
  
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

  // Keywords
  const URGENCY_KEYWORDS = {
    HIGH: ['dolor de pecho', 'dificultad para respirar', 'sangrado', 'inconsciente', 'infarto'],
    MEDIUM: ['fiebre alta', 'vómitos', 'dolor intenso', 'mareos'],
    LOW: ['dolor de cabeza', 'cansancio', 'gripe', 'resfriado']
  };

  const DRUG_KEYWORDS = ['pastilla', 'medicamento', 'droga', 'jarabe', 'tratamiento', 'para qué sirve', 'dosis'];
  const COMMON_DRUGS = ['ibuprofeno', 'paracetamol', 'aspirina', 'amoxicilina', 'omeprazol', 'loratadina'];

  // Hospitales en Granada
  const GRANADA_HOSPITALS = [
    { name: "Hospital Virgen de la Asistencia", info: "Público • Centro de Granada • Emergencias 24h" },
    { name: "Hospital Alemán Nicaragüense", info: "Privado • Barrio San Antonio • Tel: 2552-3000" },
    { name: "Centro Médico Sandoval", info: "Privado • Cerca del Parque • Consulta general" },
    { name: "Clínica Familiar", info: "Privado • Atención general • Horario: 8am-6pm" }
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

  async function requestApproximateLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('Granada, Nicaragua');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve('Granada, Nicaragua');
        },
        (error) => {
          console.log('Ubicación no disponible:', error);
          resolve('Granada, Nicaragua');
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    });
  }

  // === SEND MESSAGE FUNCTION ===
  function sendMessage(text) {
    if (!text.trim()) return;

    const timestamp = getShortTime();
    addMessage(text, 'user', null, timestamp);
    userInput.value = '';
    btnSend.disabled = true;
    showTyping(true);

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

    if (text.toLowerCase().includes('hospital') || text.toLowerCase().includes('clinica') || text.toLowerCase().includes('centro')) {
      setTimeout(() => {
        showHospitals();
        btnSend.disabled = false;
        userInput.focus();
      }, 1000);
      return;
    }

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
        action: "Te recomiendo buscar atención médica inmediata en el Hospital Virgen de la Asistencia o llamar al 133.",
        urgency: 'ALTA'
      },
      MEDIUM: {
        text: "🩺 **Recomendación:** Tus síntomas sugieren que deberías consultar con un profesional pronto.",
        action: "Programa una cita en una clínica de Granada en las próximas 24 horas.",
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
      addMessage(`No encontré información específica sobre "${drugName}" en la base internacional. 🌍\n\nEn Granada, puedes consultar en una farmacia local (ej. Farmacia Del Pueblo, San Nicolás) para información precisa.`, 'ai', null, getShortTime());
    }
  }

  function showHospitals() {
    showTyping(false);
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    let hospitalListHTML = GRANADA_HOSPITALS.map(h => `
      <li class="hospital-item">
        <div class="hospital-name">${h.name}</div>
        <div class="hospital-info">${h.info}</div>
      </li>
    `).join('');

    messageDiv.innerHTML = `
      <div class="message-avatar">🏥</div>
      <div class="message-content">
        <p>Estos son algunos centros de salud en <strong>Granada</strong>:</p>
        <ul class="hospital-list">${hospitalListHTML}</ul>
        <p class="message-disclaimer">⚠️ Verifica horarios y disponibilidad antes de ir.</p>
        <span class="message-time">${getShortTime()}</span>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
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
        if (text.includes(keyword) && !symptoms.includes(keyword)) {
          symptoms.push(keyword);
        }
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
    lines.push(`📅 Fecha de exportación: ${now}`);
    lines.push(`🕐 Inicio de conversación: ${appState.conversationStartTime.toLocaleString('es-NI', { timeZone: 'America/Managua' })}`);
    
    if (includeLocationCheckbox.checked) {
      lines.push(`📍 Ubicación: Granada, Nicaragua`);
    }
    lines.push(`🔖 Versión de la app: 3.0.0`);
    lines.push('');
    
    if (includeSummaryCheckbox.checked) {
      lines.push('┌────────────────────────────────────────────────────┐');
      lines.push('│ 📋 RESUMEN CLÍNICO PARA PROFESIONAL DE SALUD      │');
      lines.push('└────────────────────────────────────────────────────┘');
      lines.push(`• Síntomas reportados: ${summary.symptoms}`);
      lines.push(`• Nivel de urgencia detectado: ${summary.urgency}`);
      lines.push(`• Medicamentos consultados: ${summary.drugSearches || 'Ninguno'}`);
      lines.push(`• Duración de la consulta: ${summary.duration}`);
      lines.push('');
    }
    
    if (includeMedHistoryCheckbox.checked && appState.medicationSearches.length > 0) {
      lines.push('┌────────────────────────────────────────────────────┐');
      lines.push('│ 💊 HISTORIAL DE BÚSQUEDAS DE MEDICAMENTOS         │');
      lines.push('└────────────────────────────────────────────────────┘');
      appState.medicationSearches.forEach((search, index) => {
        lines.push(`${index + 1}. [${search.timestamp}] ${search.drug}`);
        lines.push(`   Consulta: "${search.query}"`);
      });
      lines.push('');
    }
    
    if (anonymizeCheckbox.checked) {
      lines.push('[DATOS ANONIMIZADOS - Información personal ocultada]');
      lines.push('');
    }
    
    lines.push('┌────────────────────────────────────────────────────┐');
    lines.push('│ 💬 CONVERSACIÓN COMPLETA                          │');
    lines.push('└────────────────────────────────────────────────────┘');
    lines.push('');
    
    document.querySelectorAll('.chat-messages .message').forEach(msg => {
      const isUser = msg.classList.contains('user-message');
      const sender = isUser ? '👤 Usuario' : '🤖 Asistente IA';
      const time = msg.querySelector('.message-time')?.textContent || '';
      const content = msg.querySelector('.message-content')?.cloneNode(true);
      
      if (content) {
        content.querySelectorAll('.message-disclaimer, .urgency-badge, .drug-card, .btn-expand-drug').forEach(el => el.remove());
      }
      
      const cleanContent = content?.textContent?.trim() || msg.textContent.trim();
      lines.push(`[${time}] ${sender}:`);
      lines.push(`  ${cleanContent}`);
      lines.push('');
    });
    
    lines.push('─────────────────────────────────────────────────────');
    lines.push('⚠️ ADVERTENCIA LEGAL:');
    lines.push('• Este documento NO constituye un diagnóstico médico.');
    lines.push('• La información de medicamentos es referencial (fuente: openFDA).');
    lines.push('• Verificar disponibilidad y dosis con profesional de salud local.');
    lines.push('• En emergencia, llamar al 133 (Nicaragua) o acudir al hospital más cercano.');
    lines.push('');
    lines.push('Salud-Conecta AI • https://jp-romero.github.io/Salud-Conecta-AI/');
    lines.push('Desarrollado con ❤️ para la comunidad de Granada, Nicaragua');
    
    return lines.join('\n');
  }

  function downloadTxt(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return Promise.resolve();
    }
  }

  function showExportFeedback() {
    exportFeedback.style.display = 'block';
    setTimeout(() => {
      exportFeedback.style.display = 'none';
    }, 3000);
  }

  function truncateText(text, limit) {
    if (!text) return 'Sin información disponible.';
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    return cleanText.length > limit ? cleanText.substring(0, limit) + '...' : cleanText;
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
  btnShowHospitals.addEventListener('click', () => {
    emergencyModal.style.display = 'none';
    sendMessage('Hospitales');
  });
  emergencyModal.addEventListener('click', (e) => {
    if (e.target === emergencyModal) emergencyModal.style.display = 'none';
  });

  btnExport.addEventListener('click', () => {
    exportModal.style.display = 'flex';
    exportFeedback.style.display = 'none';
  });
  btnCloseExport.addEventListener('click', () => exportModal.style.display = 'none';
  exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) exportModal.style.display = 'none';
  });

  btnExportTxt.addEventListener('click', () => {
    const content = getChatHistory();
    const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
    downloadTxt(`salud-conecta-${timestamp}.txt`, content);
    showExportFeedback();
  });

  btnExportCopy.addEventListener('click', async () => {
    const content = getChatHistory();
    try {
      await copyToClipboard(content);
      showExportFeedback();
    } catch (err) {
      alert('No se pudo copiar. Por favor, selecciona el texto manualmente.');
    }
  });

  // === INICIALIZACIÓN ===
  if (hasAccepted === 'true') {
    requestApproximateLocation().then(location => {
      appState.userLocation = location;
      console.log('Ubicación establecida:', location);
    });
  }
});

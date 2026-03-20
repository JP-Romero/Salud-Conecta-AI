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

  // === 2. CHAT & TRIAGE LOGIC ===
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const btnSend = document.getElementById('btn-send');
  const typingIndicator = document.getElementById('typing-indicator');
  const quickBtns = document.querySelectorAll('.quick-btn');
  
  // Emergency Modals
  const btnEmergency = document.getElementById('btn-emergency');
  const emergencyModal = document.getElementById('emergency-modal');
  const btnCloseEmergency = document.getElementById('btn-close-emergency');
  const btnShowHospitals = document.getElementById('btn-show-hospitals');

  // Keywords
  const URGENCY_KEYWORDS = {
    HIGH: ['dolor de pecho', 'dificultad para respirar', 'sangrado', 'inconsciente', 'infarto'],
    MEDIUM: ['fiebre alta', 'vómitos', 'dolor intenso', 'mareos'],
    LOW: ['dolor de cabeza', 'cansancio', 'gripe', 'resfriado']
  };

  const DRUG_KEYWORDS = ['pastilla', 'medicamento', 'droga', 'jarabe', 'tratamiento', 'para qué sirve', 'dosis'];
  const COMMON_DRUGS = ['ibuprofeno', 'paracetamol', 'aspirina', 'amoxicilina', 'omeprazol', 'loratadina'];

  // Hospitales en Granada (Datos estáticos para MVP)
  const GRANADA_HOSPITALS = [
    { name: "Hospital Virgen de la Asistencia", info: "Público • Centro de Granada" },
    { name: "Hospital Alemán Nicaragüense", info: "Privado • Barrio San Antonio" },
    { name: "Centro Médico Sandoval", info: "Privado • Cerca del Parque" },
    { name: "Clínica Familiar", info: "Privado • Atención general" }
  ];

  // Send Message Function
  function sendMessage(text) {
    if (!text.trim()) return;

    addMessage(text, 'user');
    userInput.value = '';
    btnSend.disabled = true;
    showTyping(true);

    // 1. Detect Drug Query
    const isDrugQuery = DRUG_KEYWORDS.some(keyword => text.toLowerCase().includes(keyword));
    const foundDrug = COMMON_DRUGS.find(drug => text.toLowerCase().includes(drug));

    if (isDrugQuery && foundDrug) {
      setTimeout(() => {
        fetchDrugInfo(foundDrug);
        btnSend.disabled = false;
        userInput.focus();
      }, 1000);
      return;
    }

    // 2. Detect Hospital Query
    if (text.toLowerCase().includes('hospital') || text.toLowerCase().includes('clinica') || text.toLowerCase().includes('centro')) {
      setTimeout(() => {
        showHospitals();
        btnSend.disabled = false;
        userInput.focus();
      }, 1000);
      return;
    }

    // 3. Normal Triage Mockup
    const delay = Math.random() * 1500 + 1500;
    setTimeout(() => {
      showTyping(false);
      const urgency = detectUrgency(text);
      const response = generateResponse(urgency);
      addMessage(response.text + '\n\n' + response.action, 'ai', response.urgency);
      scrollToBottom();
      btnSend.disabled = false;
      userInput.focus();
    }, delay);
  }

  // Detect Urgency
  function detectUrgency(text) {
    const lowerText = text.toLowerCase();
    if (URGENCY_KEYWORDS.HIGH.some(k => lowerText.includes(k))) return 'HIGH';
    if (URGENCY_KEYWORDS.MEDIUM.some(k => lowerText.includes(k))) return 'MEDIUM';
    return 'LOW';
  }

  // Generate Response
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

  // Fetch Drug Info (openFDA)
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
      addDrugCard(drugData);
    } catch (error) {
      showTyping(false);
      addMessage(`No encontré información específica sobre "${drugName}" en la base internacional. 🌍\n\nEn Granada, puedes consultar en una farmacia local (ej. Farmacia Del Pueblo, San Nicolás) para información precisa.`, 'ai');
    }
  }

  // Show Local Hospitals
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
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Add Message to Chat
  function addMessage(text, sender, urgency = null) {
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
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Add Drug Card
  function addDrugCard(data) {
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
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Utils
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

  // Event Listeners
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
});
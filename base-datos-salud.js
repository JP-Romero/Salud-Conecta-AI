/**
═══════════════════════════════════════════════════════════════
BASE DE DATOS DE SALUD — Salud-Conecta AI (Granada, Nicaragua)
═══════════════════════════════════════════════════════════════
📌 ÚLTIMA ACTUALIZACIÓN: 2025-01-15
📌 VERSIÓN: 3.0.0
═══════════════════════════════════════════════════════════════
*/

const VERSION_BASE_DATOS = "3.0.0";
const ULTIMA_ACTUALIZACION = "2025-01-15";

// ═══════════════════════════════════════════════════════════════
//  🏥 HOSPITALES - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const HOSPITALES = [
{
  id: 1,
  categoria: "hospital",
  nombre: "Hospital Virgen de la Asistencia",
  direccion: "Centro de Granada, Frente al Parque Central",
  telefono: "2552-2600",
  emergencia: true,
  lat: 11.9350,
  lng: -85.9570,
  horario: "24 horas",
  servicios: ["urgencias", "consulta", "hospitalizacion", "laboratorio", "rayos_x", "cirugia", "pediatria", "ginecologia", "maternidad"],
  disponible: true,
  verificado: true,
  barrio: "Centro",
  notas: "Hospital público principal de Granada. Urgencias 24h gratuitas.",
  seguros: ["INSS", "MINSA", "Todos los seguros públicos"],
  capilla: {
    nombre: "Capilla Nuestra Señora de la Asunción",
    ubicacion: "Segundo piso, ala este del hospital",
    misas: [
      { dia: "Domingo", hora: "7:00 AM" },
      { dia: "Miércoles", hora: "3:00 PM" },
      { dia: "Viernes", hora: "3:00 PM" }
    ],
    capellania: "Disponible 24h para pacientes y familiares",
    telefono_capilla: "2552-2650"
  }
},
{
  id: 2,
  categoria: "hospital",
  nombre: "Hospital Alemán Nicaragüense",
  direccion: "Barrio San Antonio, Granada",
  telefono: "2552-3000",
  emergencia: true,
  lat: 11.9320,
  lng: -85.9540,
  horario: "24 horas",
  servicios: ["urgencias", "consulta", "cirugia", "laboratorio", "farmacia", "rayos_x", "ultrasonido", "tomografia"],
  disponible: true,
  verificado: true,
  barrio: "San Antonio",
  notas: "Hospital privado con seguros médicos. Urgencias 24h.",
  seguros: ["INSS", "MAPFRE", "Seguros UNO", "ANC", "Banpro Seguros", "Particular"],
  capilla: {
    nombre: "Capilla San Juan de Dios",
    ubicacion: "Primer piso, cerca de recepción",
    misas: [
      { dia: "Domingo", hora: "8:00 AM" },
      { dia: "Jueves", hora: "4:00 PM" }
    ],
    capellania: "Disponible Lun-Vie 8am-5pm",
    telefono_capilla: "2552-3050"
  }
},
{
  id: 3,
  categoria: "hospital",
  nombre: "Hospital Carlos Roberto Huembes",
  direccion: "Carretera a Masaya, Granada",
  telefono: "2552-5100",
  emergencia: true,
  lat: 11.9280,
  lng: -85.9480,
  horario: "24 horas",
  servicios: ["urgencias", "consulta", "hospitalizacion", "laboratorio", "maternidad", "pediatria"],
  disponible: true,
  verificado: true,
  barrio: "Carretera a Masaya",
  notas: "Hospital regional con especialidades.",
  seguros: ["INSS", "MINSA", "Todos los seguros públicos"],
  capilla: {
    nombre: "Capilla Divino Niño Jesús",
    ubicacion: "Área de hospitalización, primer piso",
    misas: [
      { dia: "Domingo", hora: "9:00 AM" },
      { dia: "Martes", hora: "2:00 PM" },
      { dia: "Sábado", hora: "3:00 PM" }
    ],
    capellania: "Disponible 24h para emergencias",
    telefono_capilla: "2552-5150"
  }
}
];

// ═══════════════════════════════════════════════════════════════
//  🏥 CLÍNICAS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const CLINICAS = [
{
  id: 4,
  categoria: "clinica",
  nombre: "Centro Médico Sandoval",
  direccion: "Calle La Calzada, Granada",
  telefono: "2552-4500",
  emergencia: false,
  lat: 11.9360,
  lng: -85.9550,
  horario: "Lun-Vie 8am-6pm, Sab 8am-12pm",
  servicios: ["consulta", "laboratorio", "ultrasonido", "rayos_x"],
  disponible: true,
  verificado: true,
  barrio: "La Calzada",
  notas: "Clínica privada con especialistas.",
  seguros: ["MAPFRE", "Seguros UNO", "ANC", "Particular"]
},
{
  id: 5,
  categoria: "clinica",
  nombre: "Clínica Familiar",
  direccion: "Barrio El Calvario, Granada",
  telefono: "2552-1200",
  emergencia: false,
  lat: 11.9340,
  lng: -85.9580,
  horario: "Lun-Vie 7am-7pm",
  servicios: ["consulta", "vacunacion", "curaciones", "control_nino_sano"],
  disponible: true,
  verificado: true,
  barrio: "El Calvario",
  notas: "Atención familiar y vacunación.",
  seguros: ["INSS", "MINSA", "Particular"]
},
{
  id: 6,
  categoria: "clinica",
  nombre: "Clínica de la Mujer",
  direccion: "Barrio Guadalupe, Granada",
  telefono: "2552-7800",
  emergencia: false,
  lat: 11.9370,
  lng: -85.9540,
  horario: "Lun-Vie 8am-6pm, Sab 8am-12pm",
  servicios: ["ginecologia", "ultrasonido", "planificacion_familiar", "control_prenatal"],
  disponible: true,
  verificado: true,
  barrio: "Guadalupe",
  notas: "Especializada en salud femenina.",
  seguros: ["INSS", "MAPFRE", "Seguros UNO", "Particular"]
},
{
  id: 7,
  categoria: "clinica",
  nombre: "Clínica Pediátrica Dr. Martínez",
  direccion: "Barrio Simeón Rivas, Granada",
  telefono: "2552-9600",
  emergencia: false,
  lat: 11.9385,
  lng: -85.9595,
  horario: "Lun-Vie 8am-5pm, Sab 8am-12pm",
  servicios: ["pediatria", "vacunacion", "control_nino_sano", "emergencias_pediatricas"],
  disponible: true,
  verificado: true,
  barrio: "Simeón Rivas",
  notas: "Especializada en niños. Vacunación completa.",
  seguros: ["INSS", "MAPFRE", "Seguros UNO", "Particular"]
}
];

// ═══════════════════════════════════════════════════════════════
//  💊 FARMACIAS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const FARMACIAS = [
{
  id: 8,
  categoria: "farmacia",
  nombre: "Farmacia Del Pueblo",
  direccion: "Parque Central, Granada",
  telefono: "2552-5000",
  emergencia: true,
  lat: 11.9340,
  lng: -85.9565,
  horario: "24 horas",
  servicios: ["medicamentos", "consultorio_farmaceutico", "toma_presion", "medicion_glucosa"],
  disponible: true,
  verificado: true,
  barrio: "Centro",
  notas: "Farmacia 24 horas. Precios económicos."
},
{
  id: 9,
  categoria: "farmacia",
  nombre: "Farmacia San Nicolás",
  direccion: "Calle La Calzada, Granada",
  telefono: "2552-6000",
  emergencia: false,
  lat: 11.9355,
  lng: -85.9545,
  horario: "7am-10pm",
  servicios: ["medicamentos", "productos_naturales", "cosmeticos", "vitaminas"],
  disponible: true,
  verificado: true,
  barrio: "La Calzada",
  notas: "Amplia variedad de productos naturales."
},
{
  id: 10,
  categoria: "farmacia",
  nombre: "Farmacia Cruz Verde",
  direccion: "Centro Comercial, Granada",
  telefono: "2552-7000",
  emergencia: false,
  lat: 11.9330,
  lng: -85.9555,
  horario: "8am-9pm",
  servicios: ["medicamentos", "cosmeticos", "vitaminas", "cuidado_bebe", "leche_formula"],
  disponible: true,
  verificado: true,
  barrio: "Centro",
  notas: "Especializada en productos para bebés."
},
{
  id: 11,
  categoria: "farmacia",
  nombre: "Farmacia Guadalajara",
  direccion: "Barrio San Antonio, Granada",
  telefono: "2552-8000",
  emergencia: false,
  lat: 11.9325,
  lng: -85.9535,
  horario: "7am-9pm",
  servicios: ["medicamentos", "consultorio_farmaceutico", "toma_presion"],
  disponible: true,
  verificado: true,
  barrio: "San Antonio",
  notas: "Servicio de consulta farmacéutica gratis."
}
];

// ═══════════════════════════════════════════════════════════════
//  💊 MEDICAMENTOS - NICARAGUA
// ═══════════════════════════════════════════════════════════════
const MEDICAMENTOS = [
{
  id: 1,
  nombre_es: "Paracetamol",
  nombre_en: "Acetaminophen",
  nombres_comerciales: ["Tempra", "Panadol", "Tylenol", "Acetaminofén MK"],
  categoria: "Analgésico/Antipirético",
  uso_principal: "Dolor leve a moderado, fiebre, dolor de cabeza",
  dosis_adulto: "500-1000mg cada 6-8 horas (máximo 4g por día)",
  dosis_nino: "10-15mg/kg cada 6 horas (consultar médico)",
  contraindicaciones: "Enfermedad hepática grave, alergia al paracetamol",
  efectos_secundarios: "Raro: daño hepático con sobredosis",
  disponible_nicaragua: true,
  requiere_receta: false,
  precio_aproximado: "15-30 C$ (tabletas)",
  embarazo: "Categoría B - Seguro bajo supervisión médica"
},
{
  id: 2,
  nombre_es: "Ibuprofeno",
  nombre_en: "Ibuprofen",
  nombres_comerciales: ["Advil", "Motrin", "Nurofen", "Ibuprofeno MK"],
  categoria: "Antiinflamatorio No Esteroideo",
  uso_principal: "Dolor, inflamación, fiebre, dolor muscular",
  dosis_adulto: "400-600mg cada 6-8 horas (máximo 2.4g por día)",
  dosis_nino: "5-10mg/kg cada 6-8 horas (consultar médico)",
  contraindicaciones: "Úlceras gástricas, enfermedad renal, embarazo 3er trimestre",
  efectos_secundarios: "Malestar estomacal, mareos",
  disponible_nicaragua: true,
  requiere_receta: false,
  precio_aproximado: "20-40 C$ (tabletas)",
  embarazo: "Categoría C - Evitar en 3er trimestre"
},
{
  id: 3,
  nombre_es: "Amoxicilina",
  nombre_en: "Amoxicillin",
  nombres_comerciales: ["Amoxal", "Trimox", "Novamox", "Amoxicilina MK"],
  categoria: "Antibiótico",
  uso_principal: "Infecciones bacterianas (garganta, oído, urinarias)",
  dosis_adulto: "500mg cada 8 horas o 875mg cada 12 horas",
  dosis_nino: "20-40mg/kg/día dividido en 3 dosis (consultar médico)",
  contraindicaciones: "Alergia a penicilinas, mononucleosis",
  efectos_secundarios: "Diarrea, náuseas, erupción cutánea",
  disponible_nicaragua: true,
  requiere_receta: true,
  precio_aproximado: "50-100 C$ (caja)",
  embarazo: "Categoría B - Generalmente seguro"
},
{
  id: 4,
  nombre_es: "Omeprazol",
  nombre_en: "Omeprazole",
  nombres_comerciales: ["Losec", "Prilosec", "Omepral", "Omeprazol MK"],
  categoria: "Inhibidor de Bomba de Protones",
  uso_principal: "Acidez, reflujo gastroesofágico, úlceras gástricas",
  dosis_adulto: "20-40mg una vez al día en ayunas",
  dosis_nino: "Consultar médico",
  contraindicaciones: "Alergia al omeprazol, interacción con algunos medicamentos",
  efectos_secundarios: "Dolor de cabeza, diarrea, náuseas",
  disponible_nicaragua: true,
  requiere_receta: false,
  precio_aproximado: "30-60 C$ (caja)",
  embarazo: "Categoría C - Consultar médico"
},
{
  id: 5,
  nombre_es: "Ácido Fólico",
  nombre_en: "Folic Acid",
  nombres_comerciales: ["Folamil", "Acido Fólico MK", "Folato"],
  categoria: "Suplemento Prenatal",
  uso_principal: "Prevención de defectos del tubo neural en el feto, anemia en embarazadas",
  dosis_adulto: "400-800mcg una vez al día (antes y durante el embarazo)",
  dosis_nino: "No aplica",
  contraindicaciones: "Alergia al ácido fólico",
  efectos_secundarios: "Raro: náuseas leves, malestar estomacal",
  disponible_nicaragua: true,
  requiere_receta: false,
  precio_aproximado: "20-50 C$ (caja)",
  embarazo: "Categoría A - SEGURO y RECOMENDADO en embarazo",
  trimestres: "Especialmente importante en primer trimestre"
}
];

// ═══════════════════════════════════════════════════════════════
//  🤒 SÍNTOMAS COMUNES - INFORMACIÓN ESPECÍFICA
// ═══════════════════════════════════════════════════════════════
const SINTOMAS = [
{
  id: 1,
  nombre: "Dolor de cabeza",
  categoria: "Dolor",
  descripcion: "El dolor de cabeza es una de las molestias más comunes. Puede ser tensional, migraña o por otras causas.",
  causas_comunes: ["Estrés", "Deshidratación", "Falta de sueño", "Tensión muscular", "Cambios hormonales"],
  cuidados_casa: [
    "Descansa en un lugar oscuro y silencioso",
    "Aplica compresas frías en la frente",
    "Mantente hidratado (agua, suero oral)",
    "Masajea suavemente sienes y cuello",
    "Evita pantallas y luces brillantes"
  ],
  cuando_consultar: [
    "Dolor súbito y severo (el peor de tu vida)",
    "Dolor después de un golpe en la cabeza",
    "Con fiebre alta, rigidez de cuello o confusión",
    "Si dura más de 3 días seguidos",
    "Si interfiere con actividades diarias"
  ],
  urgencia_default: "BAJA",
  requiere_atencion: false
},
{
  id: 2,
  nombre: "Fiebre",
  categoria: "Temperatura",
  descripcion: "La fiebre es una respuesta natural del cuerpo a infecciones. Se considera fiebre a partir de 38°C (100.4°F).",
  causas_comunes: ["Infecciones virales", "Infecciones bacterianas", "Gripe", "COVID-19", "Infecciones urinarias"],
  cuidados_casa: [
    "Mantente hidratado (agua, suero, caldos)",
    "Descansa adecuadamente",
    "Usa ropa ligera",
    "Aplica compresas tibias (no frías)",
    "Puedes tomar paracetamol si es necesario"
  ],
  cuando_consultar: [
    "Fiebre mayor a 39.5°C (103°F)",
    "Fiebre que dura más de 3 días",
    "Con dificultad para respirar",
    "Con erupciones en la piel",
    "En bebés menores de 3 meses (cualquier fiebre)"
  ],
  urgencia_default: "MEDIA",
  requiere_atencion: false
},
{
  id: 3,
  nombre: "Náuseas",
  categoria: "Digestivo",
  descripcion: "Las náuseas son la sensación de querer vomitar. Pueden tener múltiples causas.",
  causas_comunes: ["Gastroenteritis", "Mareo por movimiento", "Embarazo", "Ansiedad", "Alimentos en mal estado"],
  cuidados_casa: [
    "Toma líquidos en pequeños sorbos",
    "Evita alimentos grasos o picantes",
    "Come galletas saladas o pan tostado",
    "Descansa sentado o recostado",
    "Prueba té de jengibre o menta"
  ],
  cuando_consultar: [
    "Vómitos que duran más de 24 horas",
    "No puedes retener líquidos",
    "Vómito con sangre",
    "Dolor abdominal severo",
    "Signos de deshidratación"
  ],
  urgencia_default: "BAJA",
  requiere_atencion: false
},
{
  id: 4,
  nombre: "Cansancio",
  categoria: "General",
  descripcion: "El cansancio o fatiga puede ser normal después de esfuerzo, pero si persiste requiere atención.",
  causas_comunes: ["Falta de sueño", "Estrés", "Anemia", "Mala alimentación", "Depresión"],
  cuidados_casa: [
    "Duerme 7-8 horas diarias",
    "Mantén una alimentación balanceada",
    "Haz ejercicio moderado",
    "Reduce el estrés",
    "Mantente hidratado"
  ],
  cuando_consultar: [
    "Cansancio que no mejora con descanso",
    "Dura más de 2 semanas",
    "Con pérdida de peso inexplicable",
    "Con dificultad para respirar",
    "Si interfiere con tu vida diaria"
  ],
  urgencia_default: "BAJA",
  requiere_atencion: false
},
{
  id: 5,
  nombre: "Dolor de garganta",
  categoria: "Respiratorio",
  descripcion: "El dolor de garganta es común en infecciones respiratorias. Puede ser viral o bacteriano.",
  causas_comunes: ["Resfriado común", "Gripe", "Faringitis estreptocócica", "Alergias", "Aire seco"],
  cuidados_casa: [
    "Haz gárgaras con agua tibia y sal",
    "Toma líquidos tibios (té con miel)",
    "Usa humidificador",
    "Descansa la voz",
    "Chupa pastillas para la garganta"
  ],
  cuando_consultar: [
    "Dolor severo que dura más de 5 días",
    "Dificultad para tragar o respirar",
    "Fiebre alta (más de 38.5°C)",
    "Manchas blancas en la garganta",
    "Ganglios inflamados en el cuello"
  ],
  urgencia_default: "BAJA",
  requiere_atencion: false
},
{
  id: 6,
  nombre: "Tos",
  categoria: "Respiratorio",
  descripcion: "La tos es un reflejo para limpiar las vías respiratorias. Puede ser seca o con flema.",
  causas_comunes: ["Resfriado", "Gripe", "Alergias", "Asma", "Reflujo"],
  cuidados_casa: [
    "Mantente hidratado",
    "Usa miel (adultos y niños mayores de 1 año)",
    "Evita irritantes (humo, polvo)",
    "Usa humidificador",
    "Eleva la cabeza al dormir"
  ],
  cuando_consultar: [
    "Tos que dura más de 3 semanas",
    "Con sangre",
    "Con dificultad para respirar",
    "Con fiebre alta",
    "Silbidos al respirar"
  ],
  urgencia_default: "BAJA",
  requiere_atencion: false
},
{
  id: 7,
  nombre: "Dolor abdominal",
  categoria: "Digestivo",
  descripcion: "El dolor abdominal puede tener muchas causas, desde leves hasta graves.",
  causas_comunes: ["Gases", "Indigestión", "Gastroenteritis", "Estreñimiento", "Menstruación"],
  cuidados_casa: [
    "Aplica calor suave en el abdomen",
    "Toma líquidos claros",
    "Evita alimentos grasos",
    "Descansa",
    "Come alimentos suaves (arroz, plátano)"
  ],
  cuando_consultar: [
    "Dolor severo y súbito",
    "Dolor en lado inferior derecho",
    "Con vómitos o sangre en heces",
    "Abdomen duro o inflamado",
    "No puedes evacuar ni expulsar gases"
  ],
  urgencia_default: "MEDIA",
  requiere_atencion: false
},
{
  id: 8,
  nombre: "Diarrea",
  categoria: "Digestivo",
  descripcion: "La diarrea son evacuaciones líquidas frecuentes. El principal riesgo es la deshidratación.",
  causas_comunes: ["Infecciones virales", "Alimentos en mal estado", "Intolerancias", "Medicamentos", "Estrés"],
  cuidados_casa: [
    "Toma suero oral o líquidos con electrolitos",
    "Come alimentos suaves (arroz, plátano, pan tostado)",
    "Evita lácteos, cafeína y grasas",
    "Lávate las manos frecuentemente",
    "Descansa"
  ],
  cuando_consultar: [
    "Diarrea que dura más de 2 días",
    "Signos de deshidratación",
    "Sangre en las heces",
    "Fiebre alta",
    "Dolor abdominal severo"
  ],
  urgencia_default: "BAJA",
  requiere_atencion: false
}
];

// ═══════════════════════════════════════════════════════════════
//  🚑 EMERGENCIAS - NICARAGUA
// ═══════════════════════════════════════════════════════════════
const EMERGENCIAS = [
{
  nombre: "Emergencias Nacionales",
  numero: "133",
  descripcion: "Ambulancias, bomberos, policía (gratuito desde cualquier teléfono)",
  disponible: true
},
{
  nombre: "Bomberos",
  numero: "115",
  descripcion: "Cuerpo de Bomberos de Nicaragua",
  disponible: true
},
{
  nombre: "Policía Nacional",
  numero: "118",
  descripcion: "Emergencias policiales",
  disponible: true
},
{
  nombre: "Cruz Roja Nicaragüense - Granada",
  numero: "2552-5555",
  descripcion: "Ambulancias y primeros auxilios",
  disponible: true
},
{
  nombre: "Hospital Virgen de la Asistencia (Urgencias)",
  numero: "2552-2600",
  descripcion: "Hospital público central de Granada - 24 horas",
  disponible: true
},
{
  nombre: "Hospital Alemán (Urgencias)",
  numero: "2552-3000",
  descripcion: "Hospital privado con urgencias 24 horas",
  disponible: true
},
{
  nombre: "Hospital Carlos Roberto Huembes (Urgencias)",
  numero: "2552-5100",
  descripcion: "Hospital con urgencias 24 horas",
  disponible: true
}
];

// ═══════════════════════════════════════════════════════════════
//  📍 BARRIOS DE GRANADA
// ═══════════════════════════════════════════════════════════════
const BARRIOS_GRANADA = [
  "Centro", "Parque Central", "Barrio San Antonio", "Barrio El Calvario",
  "Barrio Simeón Rivas", "Barrio La Antigua", "Barrio Guadalupe",
  "Calle La Calzada", "Mercado Municipal", "Carretera a Masaya",
  "Calle Atravesada", "Pista de Jardines", "Barrio San José",
  "Reparto San Francisco", "Reparto Las Colinas", "Gandera", "Pueblo Nuevo"
];

// ═══════════════════════════════════════════════════════════════
//  FUNCIONES DE UTILIDAD PARA LA BASE DE DATOS
// ═══════════════════════════════════════════════════════════════

function obtenerTodosLosCentros() {
  return [
    ...HOSPITALES,
    ...CLINICAS,
    ...FARMACIAS
  ].filter(c => c.disponible === true);
}

function buscarCentrosPorCategoria(categoria) {
  return obtenerTodosLosCentros().filter(c => c.categoria === categoria);
}

function buscarCentrosPorBarrio(barrio) {
  return obtenerTodosLosCentros().filter(c => 
    c.barrio && c.barrio.toLowerCase().includes(barrio.toLowerCase())
  );
}

function buscarCentrosCercanos(lat, lng, radioMetros = 2000) {
  const centros = obtenerTodosLosCentros();
  return centros.map(centro => {
    const distancia = calcularDistancia(lat, lng, centro.lat, centro.lng);
    return { ...centro, distancia };
  })
  .filter(c => c.distancia <= radioMetros)
  .sort((a, b) => a.distancia - b.distancia);
}

function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

function buscarMedicamento(nombre) {
  const lower = nombre.toLowerCase();
  return MEDICAMENTOS.find(m => 
    m.nombre_es.toLowerCase().includes(lower) ||
    m.nombre_en.toLowerCase().includes(lower) ||
    m.nombres_comerciales.some(n => n.toLowerCase().includes(lower))
  );
}

function obtenerTodosLosMedicamentos() {
  return MEDICAMENTOS;
}

function buscarSintoma(nombre) {
  const lower = nombre.toLowerCase();
  return SINTOMAS.find(s => 
    s.nombre.toLowerCase().includes(lower) ||
    s.categoria.toLowerCase().includes(lower)
  );
}

function obtenerTodosLosSintomas() {
  return SINTOMAS;
}

function obtenerMedicamentosEmbarazadas() {
  return MEDICAMENTOS.filter(m => 
    m.categoria.includes('Prenatal') || 
    m.categoria.includes('Embarazo') ||
    (m.embarazo && m.embarazo.includes('Categoría A')) ||
    (m.embarazo && m.embarazo.includes('Categoría B'))
  );
}

function obtenerEmergencias() {
  return EMERGENCIAS.filter(e => e.disponible === true);
}

function obtenerEstadisticasBD() {
  return {
    version: VERSION_BASE_DATOS,
    ultima_actualizacion: ULTIMA_ACTUALIZACION,
    total_centros: obtenerTodosLosCentros().length,
    total_medicamentos: MEDICAMENTOS.length,
    total_sintomas: SINTOMAS.length,
    hospitales: HOSPITALES.length,
    clinicas: CLINICAS.length,
    farmacias: FARMACIAS.length,
    emergencias: EMERGENCIAS.length,
    barrios_cubiertos: BARRIOS_GRANADA.length
  };
}

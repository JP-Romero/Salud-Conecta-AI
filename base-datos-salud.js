/**
═══════════════════════════════════════════════════════════════
BASE DE DATOS DE SALUD — Salud-Conecta AI (Granada, Nicaragua)
═══════════════════════════════════════════════════════════════
📌 VERSIÓN: 6.0.0
📌 ÚLTIMA ACTUALIZACIÓN: 2025-01-15
📌 CAMBIOS v6:
   - calcularDistancia es CANÓNICA aquí (eliminada de app.js)
   - buscarSintoma mejorada con fuzzy matching + sinónimos
   - 4 síntomas nuevos: gripe, alergias, dolor de espalda, mareo
   - 2 medicamentos nuevos: Loratadina, Metronidazol
   - buscarMedicamento incluye búsqueda por nombres comerciales
═══════════════════════════════════════════════════════════════
*/

const VERSION_BASE_DATOS  = '6.0.0';
const ULTIMA_ACTUALIZACION = '2025-01-15';

// ═══════════════════════════════════════════════════════════════
//  🏥 HOSPITALES
// ═══════════════════════════════════════════════════════════════
const HOSPITALES = [
  {
    id: 1,
    categoria: 'hospital',
    nombre: 'Hospital Amistad Japón - Nicaragua',
    direccion: 'km. 45 Carretera Masaya Granada, Carretera Masaya Granada, Granada, Nicaragua',
    telefono: '2552-7050',
    emergencia: true,
    lat: 11.937574127750384, lng: -85.97684253263621, 
    horario: '24 horas',
    servicios: ['urgencias','consulta','hospitalizacion','laboratorio','rayos_x','cirugia','pediatria','ginecologia','maternidad'],
    disponible: true, verificado: true,
    barrio: 'Centro',
    notas: 'Hospital público principal de Granada. Urgencias 24h gratuitas.',
    seguros: ['INSS','MINSA','Todos los seguros públicos'],
    capilla: {
      nombre: 'Capilla Nuestra Señora de la Asunción',
      ubicacion: 'Segundo piso, ala este',
      misas: [{ dia: 'Domingo', hora: '7:00 AM' },{ dia: 'Miércoles', hora: '3:00 PM' },{ dia: 'Viernes', hora: '3:00 PM' }],
      capellania: 'Disponible 24h para pacientes y familiares',
      telefono_capilla: '2552-7050'
    }
  },
  {
    id: 2,
    categoria: 'hospital',
    nombre: 'Hospital Alemán Nicaragüense',
    direccion: 'Barrio San Antonio, Granada',
    telefono: '2552-3000',
    emergencia: true,
    lat: 11.9320, lng: -85.9540,
    horario: '24 horas',
    servicios: ['urgencias','consulta','cirugia','laboratorio','farmacia','rayos_x','ultrasonido','tomografia'],
    disponible: true, verificado: true,
    barrio: 'San Antonio',
    notas: 'Hospital privado con seguros médicos. Urgencias 24h.',
    seguros: ['INSS','MAPFRE','Seguros UNO','ANC','Banpro Seguros','Particular'],
    capilla: {
      nombre: 'Capilla San Juan de Dios',
      ubicacion: 'Primer piso, cerca de recepción',
      misas: [{ dia: 'Domingo', hora: '8:00 AM' },{ dia: 'Jueves', hora: '4:00 PM' }],
      capellania: 'Disponible Lun-Vie 8am-5pm',
      telefono_capilla: '2552-3050'
    }
  },
  {
    id: 3,
    categoria: 'hospital',
    nombre: 'Hospital Carlos Roberto Huembes',
    direccion: 'Carretera a Masaya, Granada',
    telefono: '2552-5100',
    emergencia: true,
    lat: 11.9280, lng: -85.9480,
    horario: '24 horas',
    servicios: ['urgencias','consulta','hospitalizacion','laboratorio','maternidad','pediatria'],
    disponible: true, verificado: true,
    barrio: 'Carretera a Masaya',
    notas: 'Hospital regional con especialidades.',
    seguros: ['INSS','MINSA','Todos los seguros públicos'],
    capilla: {
      nombre: 'Capilla Divino Niño Jesús',
      ubicacion: 'Área de hospitalización, primer piso',
      misas: [{ dia: 'Domingo', hora: '9:00 AM' },{ dia: 'Martes', hora: '2:00 PM' },{ dia: 'Sábado', hora: '3:00 PM' }],
      capellania: 'Disponible 24h para emergencias',
      telefono_capilla: '2552-5150'
    }
  }
];

// ═══════════════════════════════════════════════════════════════
//  🏥 CLÍNICAS
// ═══════════════════════════════════════════════════════════════
const CLINICAS = [
  {
    id: 4, categoria: 'clinica',
    nombre: 'Centro Médico Sandoval',
    direccion: 'Calle La Calzada, Granada',
    telefono: '2552-4500', emergencia: false,
    lat: 11.9360, lng: -85.9550,
    horario: 'Lun-Vie 8am-6pm, Sab 8am-12pm',
    servicios: ['consulta','laboratorio','ultrasonido','rayos_x'],
    disponible: true, verificado: true,
    barrio: 'La Calzada',
    notas: 'Clínica privada con especialistas.',
    seguros: ['MAPFRE','Seguros UNO','ANC','Particular']
  },
  {
    id: 5, categoria: 'clinica',
    nombre: 'Clínica Familiar',
    direccion: 'Barrio El Calvario, Granada',
    telefono: '2552-1200', emergencia: false,
    lat: 11.9340, lng: -85.9580,
    horario: 'Lun-Vie 7am-7pm',
    servicios: ['consulta','vacunacion','curaciones','control_nino_sano'],
    disponible: true, verificado: true,
    barrio: 'El Calvario',
    notas: 'Atención familiar y vacunación. MINSA.',
    seguros: ['INSS','MINSA','Particular']
  },
  {
    id: 6, categoria: 'clinica',
    nombre: 'Clínica de la Mujer',
    direccion: 'Barrio Guadalupe, Granada',
    telefono: '2552-7800', emergencia: false,
    lat: 11.9370, lng: -85.9540,
    horario: 'Lun-Vie 8am-6pm, Sab 8am-12pm',
    servicios: ['ginecologia','ultrasonido','planificacion_familiar','control_prenatal'],
    disponible: true, verificado: true,
    barrio: 'Guadalupe',
    notas: 'Especializada en salud femenina.',
    seguros: ['INSS','MAPFRE','Seguros UNO','Particular']
  },
  {
    id: 7, categoria: 'clinica',
    nombre: 'Clínica Pediátrica Dr. Martínez',
    direccion: 'Barrio Simeón Rivas, Granada',
    telefono: '2552-9600', emergencia: false,
    lat: 11.9385, lng: -85.9595,
    horario: 'Lun-Vie 8am-5pm, Sab 8am-12pm',
    servicios: ['pediatria','vacunacion','control_nino_sano','emergencias_pediatricas'],
    disponible: true, verificado: true,
    barrio: 'Simeón Rivas',
    notas: 'Especializada en niños. Vacunación completa.',
    seguros: ['INSS','MAPFRE','Seguros UNO','Particular']
  }
];

// ═══════════════════════════════════════════════════════════════
//  💊 FARMACIAS
// ═══════════════════════════════════════════════════════════════
const FARMACIAS = [
  {
    id: 8, categoria: 'farmacia',
    nombre: 'Farmacia Del Pueblo',
    direccion: 'Parque Central, Granada',
    telefono: '2552-5000', emergencia: true,
    lat: 11.9340, lng: -85.9565,
    horario: '24 horas',
    servicios: ['medicamentos','consultorio_farmaceutico','toma_presion','medicion_glucosa'],
    disponible: true, verificado: true,
    barrio: 'Centro',
    notas: 'Farmacia 24 horas. Precios económicos.'
  },
  {
    id: 9, categoria: 'farmacia',
    nombre: 'Farmacia San Nicolás',
    direccion: 'Calle La Calzada, Granada',
    telefono: '2552-6000', emergencia: false,
    lat: 11.9355, lng: -85.9545,
    horario: '7am-10pm',
    servicios: ['medicamentos','productos_naturales','cosmeticos','vitaminas'],
    disponible: true, verificado: true,
    barrio: 'La Calzada',
    notas: 'Amplia variedad de productos naturales.'
  },
  {
    id: 10, categoria: 'farmacia',
    nombre: 'Farmacia Cruz Verde',
    direccion: 'Centro Comercial, Granada',
    telefono: '2552-7000', emergencia: false,
    lat: 11.9330, lng: -85.9555,
    horario: '8am-9pm',
    servicios: ['medicamentos','cosmeticos','vitaminas','cuidado_bebe','leche_formula'],
    disponible: true, verificado: true,
    barrio: 'Centro',
    notas: 'Especializada en productos para bebés.'
  },
  {
    id: 11, categoria: 'farmacia',
    nombre: 'Farmacia Guadalajara',
    direccion: 'Barrio San Antonio, Granada',
    telefono: '2552-8000', emergencia: false,
    lat: 11.9325, lng: -85.9535,
    horario: '7am-9pm',
    servicios: ['medicamentos','consultorio_farmaceutico','toma_presion'],
    disponible: true, verificado: true,
    barrio: 'San Antonio',
    notas: 'Servicio de consulta farmacéutica gratis.'
  }
];

// ═══════════════════════════════════════════════════════════════
//  💊 MEDICAMENTOS
// ═══════════════════════════════════════════════════════════════
const MEDICAMENTOS = [
  {
    id: 1,
    nombre_es: 'Paracetamol',
    nombre_en: 'Acetaminophen',
    nombres_comerciales: ['Tempra','Panadol','Tylenol','Acetaminofén MK'],
    sinonimos: ['acetaminofen','acetaminofén','tylenol','panadol','tempra'],
    categoria: 'Analgésico/Antipirético',
    uso_principal: 'Dolor leve a moderado, fiebre, dolor de cabeza, dolor muscular',
    dosis_adulto: '500-1000 mg cada 6-8 horas (máximo 4 g por día)',
    dosis_nino: '10-15 mg/kg cada 6 horas (consultar médico)',
    contraindicaciones: 'Enfermedad hepática grave, alergia al paracetamol, consumo de alcohol',
    efectos_secundarios: 'Raro: daño hepático con sobredosis. No exceder dosis máxima.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-30 C$ (tabletas)',
    embarazo: 'Categoría B — Seguro bajo supervisión médica'
  },
  {
    id: 2,
    nombre_es: 'Ibuprofeno',
    nombre_en: 'Ibuprofen',
    nombres_comerciales: ['Advil','Motrin','Nurofen','Ibuprofeno MK'],
    sinonimos: ['advil','motrin','ibuprofeno'],
    categoria: 'Antiinflamatorio No Esteroideo (AINE)',
    uso_principal: 'Dolor, inflamación, fiebre, dolor muscular, artritis',
    dosis_adulto: '400-600 mg cada 6-8 horas (máximo 2.4 g por día). Tomar con comida.',
    dosis_nino: '5-10 mg/kg cada 6-8 horas (consultar médico)',
    contraindicaciones: 'Úlceras gástricas, enfermedad renal, embarazo en 3er trimestre, alergia a AINEs',
    efectos_secundarios: 'Malestar estomacal, mareos. Tomar con alimentos.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-40 C$ (tabletas)',
    embarazo: 'Categoría C — Evitar en 3er trimestre'
  },
  {
    id: 3,
    nombre_es: 'Amoxicilina',
    nombre_en: 'Amoxicillin',
    nombres_comerciales: ['Amoxal','Trimox','Novamox','Amoxicilina MK'],
    sinonimos: ['amoxal','amoxicillin'],
    categoria: 'Antibiótico (Betalactámico)',
    uso_principal: 'Infecciones bacterianas: garganta, oído, sinusitis, urinarias, bronquitis',
    dosis_adulto: '500 mg cada 8 horas, o 875 mg cada 12 horas (7-10 días)',
    dosis_nino: '20-40 mg/kg/día dividido en 3 dosis (consultar médico)',
    contraindicaciones: 'Alergia a penicilinas o cefalosporinas, mononucleosis infecciosa',
    efectos_secundarios: 'Diarrea, náuseas, erupción cutánea. Completar el tratamiento.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '50-100 C$ (caja)',
    embarazo: 'Categoría B — Generalmente seguro con prescripción'
  },
  {
    id: 4,
    nombre_es: 'Omeprazol',
    nombre_en: 'Omeprazole',
    nombres_comerciales: ['Losec','Prilosec','Omepral','Omeprazol MK'],
    sinonimos: ['losec','prilosec','omepral'],
    categoria: 'Inhibidor de Bomba de Protones (IBP)',
    uso_principal: 'Acidez, reflujo gastroesofágico (ERGE), úlceras gástricas, gastritis',
    dosis_adulto: '20-40 mg una vez al día, 30 min antes del desayuno',
    dosis_nino: 'Consultar médico (uso pediátrico con supervisión)',
    contraindicaciones: 'Alergia al omeprazol o benzimidazoles. Interacción con clopidogrel.',
    efectos_secundarios: 'Dolor de cabeza, diarrea, náuseas. Uso prolongado puede reducir vitamina B12.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '30-60 C$ (caja)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 5,
    nombre_es: 'Ácido Fólico',
    nombre_en: 'Folic Acid',
    nombres_comerciales: ['Folamil','Acido Fólico MK','Folato'],
    sinonimos: ['acido folico','folato','folic acid','folamil','vitamina b9'],
    categoria: 'Vitamina B9 / Suplemento Prenatal',
    uso_principal: 'Prevención de defectos del tubo neural en el feto. Anemia megaloblástica. Suplemento prenatal.',
    dosis_adulto: '400-800 mcg una vez al día (iniciar 1 mes antes del embarazo)',
    dosis_nino: 'Consultar médico pediátrico',
    contraindicaciones: 'Alergia al ácido fólico. Puede enmascarar deficiencia de vitamina B12.',
    efectos_secundarios: 'Muy raros: náuseas leves, malestar estomacal',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-50 C$ (caja)',
    embarazo: 'Categoría A — SEGURO y RECOMENDADO en embarazo',
    trimestres: 'Especialmente importante en primer trimestre'
  },
  {
    id: 6,
    nombre_es: 'Loratadina',
    nombre_en: 'Loratadine',
    nombres_comerciales: ['Claritin','Loratadina MK','Clarityne','Histiacil'],
    sinonimos: ['claritin','clarityne','histiacil','antihistaminico'],
    categoria: 'Antihistamínico (no sedante)',
    uso_principal: 'Alergias, rinitis alérgica, urticaria, picazón ocular, estornudos frecuentes',
    dosis_adulto: '10 mg una vez al día (no causa sueño)',
    dosis_nino: '5 mg una vez al día (niños 2-12 años, consultar médico)',
    contraindicaciones: 'Alergia a la loratadina. Precaución en insuficiencia hepática grave.',
    efectos_secundarios: 'Dolor de cabeza, boca seca. Generalmente bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '25-50 C$ (tabletas)',
    embarazo: 'Categoría B — Generalmente seguro, consultar médico'
  },
  {
    id: 7,
    nombre_es: 'Metronidazol',
    nombre_en: 'Metronidazole',
    nombres_comerciales: ['Flagyl','Metronidazol MK','Rozex'],
    sinonimos: ['flagyl','metronidazole','rozex'],
    categoria: 'Antibiótico/Antiparasitario',
    uso_principal: 'Infecciones por bacterias anaerobias, amebas (diarrea con sangre), Giardia, vaginosis bacteriana',
    dosis_adulto: '500 mg cada 8 horas por 7-10 días (según infección)',
    dosis_nino: '7.5 mg/kg cada 8 horas (consultar médico)',
    contraindicaciones: 'Alergia al metronidazol. No consumir alcohol durante el tratamiento (reacción grave).',
    efectos_secundarios: 'Náuseas, sabor metálico en la boca, mareos. Orina puede oscurecerse.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '40-80 C$ (caja)',
    embarazo: 'Categoría B — Evitar en primer trimestre, consultar médico'
  }
];

// ═══════════════════════════════════════════════════════════════
//  🤒 SÍNTOMAS — SINÓNIMOS INCLUIDOS
// ═══════════════════════════════════════════════════════════════
const SINTOMAS = [
  {
    id: 1,
    nombre: 'Dolor de cabeza',
    categoria: 'Dolor',
    sinonimos: ['cefalea','migrana','jaqueca','dolor cabeza','cabeza me duele','me duele la cabeza','dolor en la cabeza'],
    descripcion: 'El dolor de cabeza es una de las molestias más comunes. Puede ser tensional, migraña o por otras causas.',
    causas_comunes: ['Estrés','Deshidratación','Falta de sueño','Tensión muscular','Cambios hormonales','Presión arterial alta'],
    cuidados_casa: [
      'Descansa en un lugar oscuro y silencioso',
      'Aplica compresas frías en la frente',
      'Mantente hidratado (agua, suero oral)',
      'Masajea suavemente sienes y cuello',
      'Evita pantallas y luces brillantes'
    ],
    cuando_consultar: [
      'Dolor súbito y muy severo ("el peor de tu vida")',
      'Después de un golpe en la cabeza',
      'Con fiebre alta, rigidez de cuello o confusión',
      'Si dura más de 3 días seguidos',
      'Si te despierta en la noche'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 2,
    nombre: 'Fiebre',
    categoria: 'Temperatura',
    sinonimos: ['temperatura','calentura','fiebre alta','febrilis','me siento caliente','tengo fiebre','febril'],
    descripcion: 'La fiebre es una respuesta natural del cuerpo a infecciones. Se considera fiebre a partir de 38 °C (100.4 °F).',
    causas_comunes: ['Infecciones virales','Infecciones bacterianas','Gripe','COVID-19','Infecciones urinarias'],
    cuidados_casa: [
      'Mantente hidratado (agua, suero, caldos)',
      'Descansa adecuadamente',
      'Usa ropa ligera',
      'Aplica compresas tibias en frente y axilas',
      'Puedes tomar paracetamol (ver dosis)'
    ],
    cuando_consultar: [
      'Fiebre mayor a 39.5 °C (103 °F)',
      'Fiebre que dura más de 3 días',
      'Con dificultad para respirar o erupción en la piel',
      'En bebés menores de 3 meses (cualquier temperatura)'
    ],
    urgencia_default: 'MEDIA',
    requiere_atencion: false
  },
  {
    id: 3,
    nombre: 'Náuseas',
    categoria: 'Digestivo',
    sinonimos: ['nausea','asco','ganas de vomitar','me dan ganas de vomitar','mareo estomacal','malestar estomago'],
    descripcion: 'Las náuseas son la sensación de querer vomitar. Pueden tener múltiples causas.',
    causas_comunes: ['Gastroenteritis','Mareo por movimiento','Embarazo','Ansiedad','Alimentos en mal estado'],
    cuidados_casa: [
      'Toma líquidos en pequeños sorbos frecuentes',
      'Evita alimentos grasos o picantes',
      'Come galletas saladas o pan tostado',
      'Descansa sentado o recostado',
      'Prueba té de jengibre o menta'
    ],
    cuando_consultar: [
      'Vómitos que duran más de 24 horas',
      'No puedes retener líquidos',
      'Vómito con sangre o de color café',
      'Dolor abdominal severo acompañante',
      'Signos de deshidratación (boca seca, poca orina)'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 4,
    nombre: 'Cansancio',
    categoria: 'General',
    sinonimos: ['fatiga','debilidad','agotamiento','me siento cansado','sin energia','extenuado','sin fuerzas'],
    descripcion: 'El cansancio o fatiga puede ser normal después de esfuerzo, pero si persiste requiere atención.',
    causas_comunes: ['Falta de sueño','Estrés','Anemia','Mala alimentación','Depresión','Infecciones'],
    cuidados_casa: [
      'Duerme 7-8 horas diarias con horario regular',
      'Mantén una alimentación balanceada',
      'Haz ejercicio moderado (caminar 30 min)',
      'Reduce el estrés con técnicas de relajación',
      'Mantente bien hidratado'
    ],
    cuando_consultar: [
      'Cansancio que no mejora con descanso',
      'Dura más de 2 semanas sin causa aparente',
      'Con pérdida de peso inexplicable',
      'Con dificultad para respirar o palpitaciones',
      'Si impide realizar actividades cotidianas'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 5,
    nombre: 'Dolor de garganta',
    categoria: 'Respiratorio',
    sinonimos: ['garganta','dolor garganta','me duele la garganta','faringitis','amigdalitis','garganta irritada','rasquera en la garganta'],
    descripcion: 'El dolor de garganta es común en infecciones respiratorias. Puede ser viral o bacteriano.',
    causas_comunes: ['Resfriado común','Gripe','Faringitis estreptocócica','Alergias','Aire seco'],
    cuidados_casa: [
      'Haz gárgaras con agua tibia y media cucharadita de sal',
      'Toma líquidos tibios (té con miel y limón)',
      'Usa humidificador si el ambiente es muy seco',
      'Descansa la voz',
      'Pastillas para la garganta o miel pura'
    ],
    cuando_consultar: [
      'Dolor severo que dura más de 5 días',
      'Dificultad para tragar o respirar',
      'Fiebre alta (más de 38.5 °C)',
      'Manchas blancas o pus en la garganta',
      'Ganglios inflamados en el cuello'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 6,
    nombre: 'Tos',
    categoria: 'Respiratorio',
    sinonimos: ['tosiendo','tos seca','tos con flema','tos persistente','no puedo dejar de toser','tos fuerte'],
    descripcion: 'La tos es un reflejo para limpiar las vías respiratorias. Puede ser seca o con flema.',
    causas_comunes: ['Resfriado','Gripe','Alergias','Asma','Reflujo','COVID-19'],
    cuidados_casa: [
      'Mantente bien hidratado',
      'Miel pura (adultos y niños mayores de 1 año)',
      'Evita irritantes: humo, polvo, perfumes',
      'Usa humidificador o inhala vapor de agua tibia',
      'Eleva la cabeza al dormir'
    ],
    cuando_consultar: [
      'Tos que dura más de 3 semanas',
      'Con sangre o esputo verde/amarillo abundante',
      'Con dificultad para respirar o silbidos',
      'Con fiebre alta prolongada',
      'En niños menores de 3 meses'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 7,
    nombre: 'Dolor abdominal',
    categoria: 'Digestivo',
    sinonimos: ['dolor de barriga','dolor de estomago','dolor estomacal','dolor abdomen','colicos','me duele el estomago','me duele la barriga'],
    descripcion: 'El dolor abdominal puede tener muchas causas, desde leves hasta graves.',
    causas_comunes: ['Gases','Indigestión','Gastroenteritis','Estreñimiento','Menstruación'],
    cuidados_casa: [
      'Aplica calor suave en el abdomen (no si hay fiebre)',
      'Toma líquidos claros y descansa',
      'Evita alimentos grasos o irritantes',
      'Come alimentos suaves: arroz, plátano cocido, caldo'
    ],
    cuando_consultar: [
      'Dolor severo y súbito que no cede',
      'Dolor en la parte inferior derecha (posible apendicitis)',
      'Con vómitos prolongados o sangre en heces',
      'Abdomen duro o muy inflamado',
      'No puedes evacuar ni expulsar gases por más de 24h'
    ],
    urgencia_default: 'MEDIA',
    requiere_atencion: false
  },
  {
    id: 8,
    nombre: 'Diarrea',
    categoria: 'Digestivo',
    sinonimos: ['evacuaciones liquidas','heces liquidas','soltura','vientre suelto','deposiciones frecuentes','colitis'],
    descripcion: 'La diarrea son evacuaciones líquidas frecuentes. El principal riesgo es la deshidratación.',
    causas_comunes: ['Infecciones virales','Alimentos en mal estado','Intolerancias','Medicamentos','Estrés','Parásitos'],
    cuidados_casa: [
      'Toma suero oral o agua con sal y azúcar frecuentemente',
      'Come alimentos suaves: arroz, plátano, pan tostado',
      'Evita lácteos, cafeína, jugos y grasas',
      'Lávate las manos frecuentemente con jabón',
      'Descansa'
    ],
    cuando_consultar: [
      'Diarrea que dura más de 2 días en adultos',
      'Signos de deshidratación: boca seca, poca orina, mareo',
      'Sangre o moco en las heces',
      'Fiebre mayor a 38.5 °C',
      'En niños menores de 2 años con más de 6 evacuaciones al día'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  // ── NUEVOS en v6 ──────────────────────────────────
  {
    id: 9,
    nombre: 'Gripe',
    categoria: 'Respiratorio',
    sinonimos: ['influenza','resfriado','catarro','congestion nasal','rinitis','moqueo','nariz tapada','nariz mocosa','congestionado'],
    descripcion: 'La gripe es una infección viral del sistema respiratorio. Suele resolverse en 5-7 días con reposo.',
    causas_comunes: ['Virus influenza A o B','Adenovirus','Rhinovirus (resfriado común)','COVID-19'],
    cuidados_casa: [
      'Reposo en cama los primeros días',
      'Líquidos abundantes: agua, caldos, jugos naturales',
      'Paracetamol para fiebre y dolores (ver dosis)',
      'Lavados nasales con agua salina',
      'Ambiente húmedo y ventilado'
    ],
    cuando_consultar: [
      'Fiebre mayor a 39 °C que no baja con paracetamol',
      'Dificultad para respirar o dolor en el pecho',
      'Síntomas que duran más de 7-10 días o empeoran',
      'En adultos mayores de 65 años, embarazadas o con enfermedades crónicas',
      'En niños muy pequeños con dificultad para respirar'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 10,
    nombre: 'Alergia',
    categoria: 'Inmunológico',
    sinonimos: ['alergias','reaccion alergica','urticaria','picazon','ronchas','sarpullido','estornudos','ojos llorosos','ojos rojos'],
    descripcion: 'Las alergias son reacciones del sistema inmune a sustancias normalmente inofensivas (alérgenos).',
    causas_comunes: ['Polen','Polvo y ácaros','Pelo de animales','Alimentos (mariscos, maní)','Medicamentos','Picaduras de insectos'],
    cuidados_casa: [
      'Identifica y evita el alérgeno desencadenante',
      'Antihistamínico oral (loratadina) sin receta para síntomas leves',
      'Compresas frías en zonas de picazón',
      'Mantén ventanas cerradas en temporada de polen',
      'Lávate las manos y cambia de ropa al llegar a casa'
    ],
    cuando_consultar: [
      'Dificultad para respirar o hinchazón de garganta',
      'Reacción alérgica severa (anafilaxia): mareo, dificultad para tragar',
      'Urticaria que no mejora con antihistamínico en 24 horas',
      'Reacción a medicamento recetado',
      'Primera vez que te ocurre sin causa conocida'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 11,
    nombre: 'Dolor de espalda',
    categoria: 'Dolor',
    sinonimos: ['dolor espalda','lumbalgia','dolor lumbar','me duele la espalda','espalda baja','dolor de cintura','rigidez espalda'],
    descripcion: 'El dolor de espalda es muy común. La mayoría de los casos son musculares y mejoran con reposo y movimiento moderado.',
    causas_comunes: ['Malas posturas','Esfuerzo excesivo','Sedentarismo','Sobrepeso','Estrés muscular'],
    cuidados_casa: [
      'Aplica calor en la zona dolorosa por 15-20 minutos',
      'Evita reposo absoluto; camina suavemente',
      'Duerme de lado con almohada entre las rodillas',
      'Evita cargar peso hasta que mejore',
      'Ibuprofeno o paracetamol para el dolor (ver dosis)'
    ],
    cuando_consultar: [
      'Dolor que irradia hacia la pierna (ciática)',
      'Debilidad o entumecimiento en piernas',
      'Dificultad para orinar o controlar esfínteres',
      'Dolor que empeora de noche o en reposo',
      'Después de un golpe o caída'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 12,
    nombre: 'Mareo',
    categoria: 'Neurológico',
    sinonimos: ['vertigo','me siento mareado','sensacion de giro','inestabilidad','perdida de equilibrio','cabeza que da vueltas'],
    descripcion: 'El mareo puede ser una sensación de inestabilidad o de que todo gira. Puede tener causas benignas o más serias.',
    causas_comunes: ['Deshidratación','Bajada de presión arterial al pararse','Laberintitis','Anemia','Problemas del oído interno'],
    cuidados_casa: [
      'Siéntate o acuéstate lentamente para evitar caídas',
      'Toma agua o suero oral si sospechas deshidratación',
      'Levántate lentamente de la cama o silla',
      'Evita movimientos bruscos de cabeza',
      'Descansa en un lugar fresco y tranquilo'
    ],
    cuando_consultar: [
      'Mareo súbito muy severo sin causa aparente',
      'Con dolor de cabeza intenso, visión doble o dificultad para hablar',
      'Con pérdida del conocimiento o casi-desmayo',
      'Si dura más de 48 horas',
      'En personas mayores o con hipertensión'
    ],
    urgencia_default: 'MEDIA',
    requiere_atencion: false
  }
];

// ═══════════════════════════════════════════════════════════════
//  🚑 EMERGENCIAS
// ═══════════════════════════════════════════════════════════════
const EMERGENCIAS = [
  { nombre: 'Emergencias Nacionales',              numero: '133',       descripcion: 'Ambulancias, bomberos, policía (gratuito 24h)',               disponible: true },
  { nombre: 'Bomberos',                            numero: '115',       descripcion: 'Cuerpo de Bomberos de Nicaragua',                             disponible: true },
  { nombre: 'Policía Nacional',                    numero: '118',       descripcion: 'Emergencias policiales',                                      disponible: true },
  { nombre: 'Cruz Roja Nicaragüense — Granada',    numero: '2552-5555', descripcion: 'Ambulancias y primeros auxilios en Granada',                  disponible: true },
  { nombre: 'Hospital Virgen de la Asistencia',    numero: '2552-2600', descripcion: 'Hospital público principal de Granada — urgencias 24h',       disponible: true },
  { nombre: 'Hospital Alemán Nicaragüense',        numero: '2552-3000', descripcion: 'Hospital privado — urgencias 24h',                            disponible: true },
  { nombre: 'Hospital Carlos Roberto Huembes',     numero: '2552-5100', descripcion: 'Hospital con urgencias 24h — Carretera a Masaya',             disponible: true }
];

// ═══════════════════════════════════════════════════════════════
//  📍 BARRIOS DE GRANADA
// ═══════════════════════════════════════════════════════════════
const BARRIOS_GRANADA = [
  'Centro','Parque Central','Barrio San Antonio','Barrio El Calvario',
  'Barrio Simeón Rivas','Barrio La Antigua','Barrio Guadalupe',
  'Calle La Calzada','Mercado Municipal','Carretera a Masaya',
  'Calle Atravesada','Pista de Jardines','Barrio San José',
  'Reparto San Francisco','Reparto Las Colinas','Gandera','Pueblo Nuevo'
];

// ═══════════════════════════════════════════════════════════════
//  FUNCIONES DE DISTANCIA (CANÓNICA — no duplicar en app.js)
// ═══════════════════════════════════════════════════════════════
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000; // metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ═══════════════════════════════════════════════════════════════
//  FUNCIONES DE BÚSQUEDA
// ═══════════════════════════════════════════════════════════════

function obtenerTodosLosCentros() {
  return [...HOSPITALES, ...CLINICAS, ...FARMACIAS].filter(c => c.disponible);
}

function buscarCentrosPorCategoria(categoria) {
  return obtenerTodosLosCentros().filter(c => c.categoria === categoria);
}

function buscarCentrosPorBarrio(barrio) {
  return obtenerTodosLosCentros().filter(c =>
    c.barrio?.toLowerCase().includes(barrio.toLowerCase())
  );
}

function buscarCentrosCercanos(lat, lng, radioMetros = 2000) {
  return obtenerTodosLosCentros()
    .map(c => ({ ...c, distance: calcularDistancia(lat, lng, c.lat, c.lng) }))
    .filter(c => c.distance <= radioMetros)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Busca un medicamento por nombre, sinónimos o nombres comerciales.
 * v6: incluye búsqueda en campo `sinonimos` y normaliza tildes.
 */
function buscarMedicamento(nombre) {
  const lower = normalizar(nombre);
  return MEDICAMENTOS.find(m =>
    normalizar(m.nombre_es).includes(lower) ||
    normalizar(m.nombre_en).includes(lower) ||
    m.nombres_comerciales.some(n => normalizar(n).includes(lower)) ||
    (m.sinonimos && m.sinonimos.some(s => normalizar(s).includes(lower) || lower.includes(normalizar(s))))
  ) || null;
}

function obtenerTodosLosMedicamentos() { return MEDICAMENTOS; }

/**
 * buscarSintoma — v6: fuzzy matching + sinónimos.
 * Orden de prioridad:
 *   1. Coincidencia exacta en nombre
 *   2. Coincidencia en algún sinónimo
 *   3. El texto contiene el nombre del síntoma
 *   4. El nombre del síntoma está contenido en el texto
 */
function buscarSintoma(texto) {
  const lower = normalizar(texto);

  // 1. Coincidencia exacta en nombre
  let found = SINTOMAS.find(s => normalizar(s.nombre) === lower);
  if (found) return found;

  // 2. El texto coincide con algún sinónimo exactamente
  found = SINTOMAS.find(s =>
    s.sinonimos && s.sinonimos.some(sin => normalizar(sin) === lower)
  );
  if (found) return found;

  // 3. El texto contiene algún sinónimo (ej: "tengo dolor de cabeza fuerte")
  found = SINTOMAS.find(s =>
    s.sinonimos && s.sinonimos.some(sin => lower.includes(normalizar(sin)))
  );
  if (found) return found;

  // 4. El texto contiene el nombre del síntoma
  found = SINTOMAS.find(s => lower.includes(normalizar(s.nombre)));
  if (found) return found;

  // 5. El nombre del síntoma contiene el texto (búsqueda parcial)
  found = SINTOMAS.find(s => normalizar(s.nombre).includes(lower) && lower.length > 3);
  return found || null;
}

function obtenerTodosLosSintomas() { return SINTOMAS; }

function obtenerMedicamentosEmbarazadas() {
  return MEDICAMENTOS.filter(m =>
    m.categoria.includes('Prenatal') ||
    m.categoria.includes('Embarazo') ||
    (m.embarazo && (m.embarazo.includes('Categoría A') || m.embarazo.includes('Categoría B')))
  );
}

function obtenerEmergencias() {
  return EMERGENCIAS.filter(e => e.disponible);
}

function obtenerEstadisticasBD() {
  return {
    version:            VERSION_BASE_DATOS,
    ultima_actualizacion: ULTIMA_ACTUALIZACION,
    total_centros:      obtenerTodosLosCentros().length,
    total_medicamentos: MEDICAMENTOS.length,
    total_sintomas:     SINTOMAS.length,
    hospitales:         HOSPITALES.length,
    clinicas:           CLINICAS.length,
    farmacias:          FARMACIAS.length,
    emergencias:        EMERGENCIAS.length,
    barrios_cubiertos:  BARRIOS_GRANADA.length
  };
}

// ─────────────────────────────────────────────
//  UTILIDAD INTERNA: normalizar texto (sin tildes, minúsculas)
// ─────────────────────────────────────────────
function normalizar(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
    .trim();
}

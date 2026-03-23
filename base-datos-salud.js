/**
═══════════════════════════════════════════════════════════════
BASE DE DATOS DE SALUD — Salud-Conecta AI (Granada, Nicaragua)
═══════════════════════════════════════════════════════════════
📌 VERSIÓN: 6.0.0
📌 ÚLTIMA ÚLTIMA ACTUALIZACIÓN: 2026-03-22
📌 CAMBIOS v6:
   - calcularDistancia es CANÓNICA aquí (eliminada de app.js)
   - buscarSintoma mejorada con fuzzy matching + sinónimos
   - 4 síntomas nuevos: gripe, alergias, dolor de espalda, mareo
   - 2 medicamentos nuevos: Loratadina, Metronidazol
   - buscarMedicamento incluye búsqueda por nombres comerciales
═══════════════════════════════════════════════════════════════
*/

const VERSION_BASE_DATOS  = '7.0.0';
const ULTIMA_ACTUALIZACION = '2026-03-22';

// ═══════════════════════════════════════════════════════════════
//  🏥 HOSPITALES
// ═══════════════════════════════════════════════════════════════
const HOSPITALES = [
  {
    id: 1,
    categoria: 'hospital',
    nombre: 'Hospital Amistad Japón Nicaragua',
    direccion: 'Km 44.5 Carretera Granada-Masaya, Barrio El Capullo',
    telefono: '2552-7050',
    emergencia: true,
    lat: 11.93749, lng: -85.97651,
    horario: '24 horas',
    servicios: ['urgencias','consulta','hospitalizacion','laboratorio','rayos_x','cirugia','pediatria','ginecologia','maternidad','oncologia','medicina_natural'],
    disponible: true, verificado: true,
    barrio: 'Barrio El Capullo',
    notas: 'Hospital Departamental público principal de Granada (MINSA/SILAIS). Urgencias 24h gratuitas. Referencia departamental.',
    seguros: ['INSS','MINSA','Atención gratuita']
  },
  {
    id: 2,
    categoria: 'hospital',
    nombre: 'Hospital SERMESA Granada',
    direccion: 'Granada, Nicaragua',
    telefono: '2552-4444',
    emergencia: true,
    lat: 11.9301, lng: -85.9563,
    horario: '24 horas',
    servicios: ['urgencias','consulta','cirugia','laboratorio','farmacia','rayos_x','ultrasonido'],
    disponible: true, verificado: true,
    barrio: 'Centro',
    notas: 'Hospital privado — SERMESA. INSS y pago particular.',
    seguros: ['INSS','Particular']
  },
  {
    id: 3,
    categoria: 'hospital',
    nombre: 'Centro de Salud Jorge Sinforoso Bravo',
    direccion: 'Costado norte del Parque Sandino, Barrio Estación',
    telefono: '2552-0600',
    emergencia: false,
    lat: 11.9302, lng: -85.9581,
    horario: 'Lun-Vie 7am-8pm, Sab-Dom 7am-12pm',
    servicios: ['urgencias','consulta','vacunacion','maternidad','pediatria','laboratorio','medicina_natural','curaciones'],
    disponible: true, verificado: true,
    barrio: 'Barrio Estación',
    notas: 'Centro de Salud principal MINSA Granada. Frente al Parque Sandino. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  }
];

// ═══════════════════════════════════════════════════════════════
//  🏥 CLÍNICAS / CENTROS DE SALUD
// ═══════════════════════════════════════════════════════════════
const CLINICAS = [
  {
    id: 4, categoria: 'clinica',
    nombre: 'Centro de Salud Naciones Unidas',
    direccion: 'Barrio Naciones Unidas, Granada',
    telefono: '2552-0700', emergencia: false,
    lat: 11.9252, lng: -85.9501,
    horario: 'Lun-Vie 7am-5pm',
    servicios: ['consulta','vacunacion','curaciones','control_nino_sano','planificacion_familiar'],
    disponible: true, verificado: true,
    barrio: 'Naciones Unidas',
    notas: 'Centro de Salud MINSA. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  },
  {
    id: 5, categoria: 'clinica',
    nombre: 'Centro de Salud Villa Sandino',
    direccion: 'Barrio Villa Sandino, Granada',
    telefono: '2552-0800', emergencia: false,
    lat: 11.9421, lng: -85.9612,
    horario: 'Lun-Vie 7am-5pm',
    servicios: ['consulta','vacunacion','curaciones','control_nino_sano'],
    disponible: true, verificado: true,
    barrio: 'Villa Sandino',
    notas: 'Centro de Salud MINSA. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  },
  {
    id: 6, categoria: 'clinica',
    nombre: 'Centro de Salud Los Tanques',
    direccion: 'Barrio Los Tanques, Granada',
    telefono: '2552-0900', emergencia: false,
    lat: 11.9198, lng: -85.9488,
    horario: 'Lun-Vie 7am-5pm',
    servicios: ['consulta','vacunacion','curaciones','planificacion_familiar'],
    disponible: true, verificado: true,
    barrio: 'Los Tanques',
    notas: 'Centro de Salud MINSA. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  },
  {
    id: 7, categoria: 'clinica',
    nombre: 'Centro de Salud Palmira',
    direccion: 'Barrio Palmira, Granada',
    telefono: '2552-1000', emergencia: false,
    lat: 11.9455, lng: -85.9445,
    horario: 'Lun-Vie 7am-5pm',
    servicios: ['consulta','vacunacion','curaciones','medicina_natural'],
    disponible: true, verificado: true,
    barrio: 'Palmira',
    notas: 'Centro de Salud MINSA. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  },
  {
    id: 8, categoria: 'clinica',
    nombre: 'CMP MINSA — Amistad Japón Nicaragua',
    direccion: 'Km 44.5 Carretera Granada-Masaya, junto al Hospital',
    telefono: '2552-7060', emergencia: false,
    lat: 11.9378, lng: -85.9768,
    horario: 'Lun-Vie 7am-4pm',
    servicios: ['consulta','especialidades','laboratorio','ultrasonido','fisioterapia'],
    disponible: true, verificado: true,
    barrio: 'Barrio El Capullo',
    notas: 'Clínica Médica Previsional MINSA. Atención INSS.',
    seguros: ['INSS']
  }
];

// ═══════════════════════════════════════════════════════════════
//  💊 FARMACIAS
// ═══════════════════════════════════════════════════════════════
const FARMACIAS = [
  {
    id: 12, categoria: 'farmacia',
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
    id: 12, categoria: 'farmacia',
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
    id: 12, categoria: 'farmacia',
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
    id: 12, categoria: 'farmacia',
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

  // ════════════════════════════════════════════════════════
  //  GRUPO 2 — GASTROENTEROLOGÍA (MINSA LBME 2022)
  // ════════════════════════════════════════════════════════
  ,{
    id: 8,
    nombre_es: 'Ranitidina',
    nombre_en: 'Ranitidine',
    nombres_comerciales: ['Zantac','Ulcodin','Ranitidina MK'],
    sinonimos: ['zantac','ulcodin','para la acidez','antiulcera','anti acido'],
    categoria: 'Antiulceroso (H2)',
    uso_principal: 'Ulcera gastrica y duodenal, reflujo, acidez estomacal',
    dosis_adulto: '150 mg dos veces al dia o 300 mg en la noche',
    dosis_nino: '2-4 mg/kg/dia dividido en 2 dosis',
    contraindicaciones: 'Alergia a ranitidina. Precaucion en insuficiencia renal.',
    efectos_secundarios: 'Dolor de cabeza, mareos, constipacion. Generalmente bien tolerado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-40 C$ (tabletas)',
    embarazo: 'Categoria B — Generalmente seguro, consultar medico'
  },{
    id: 9,
    nombre_es: 'Loperamida',
    nombre_en: 'Loperamide',
    nombres_comerciales: ['Imodium','Lopex','Loperamida MK'],
    sinonimos: ['imodium','antidiarreico','para la diarrea','para el estomago'],
    categoria: 'Antidiarreico',
    uso_principal: 'Diarrea aguda no complicada en adultos y mayores de 2 años',
    dosis_adulto: '4 mg al inicio, luego 2 mg tras cada deposicion liquida (max 16 mg/dia)',
    dosis_nino: 'Mayores de 2 años: 1-2 mg segun peso. NO en menores de 2 años.',
    contraindicaciones: 'Diarrea con sangre o fiebre alta, menores de 2 años, colitis.',
    efectos_secundarios: 'Estreñimiento, nauseas, dolor abdominal leve.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-25 C$ (capsulas)',
    embarazo: 'Categoria C — Evitar en primer trimestre'
  },{
    id: 10,
    nombre_es: 'Metoclopramida',
    nombre_en: 'Metoclopramide',
    nombres_comerciales: ['Plasil','Primperan','Metoclopramida MK'],
    sinonimos: ['plasil','primperan','para el vomito','antinausea','antiemetico'],
    categoria: 'Antivomitivo / Procinetico',
    uso_principal: 'Nauseas y vomitos, reflujo gastroesofagico',
    dosis_adulto: '10 mg tres veces al dia, 30 minutos antes de comidas. Max 5 dias.',
    dosis_nino: '0.1 mg/kg tres veces al dia (consultar medico)',
    contraindicaciones: 'Epilepsia, hemorragia gastrointestinal, obstruccion intestinal.',
    efectos_secundarios: 'Somnolencia, inquietud, movimientos involuntarios con uso prolongado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-20 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 11,
    nombre_es: 'Sales de Rehidratacion Oral',
    nombre_en: 'Oral Rehydration Salts',
    nombres_comerciales: ['Suero oral','Hidraplus','Rehidrat','Litrosol'],
    sinonimos: ['suero','suero oral','rehidratacion','sales orales','litrosol','hidraplus','para deshidratacion','suero casero'],
    categoria: 'Electrolitico / Rehidratacion',
    uso_principal: 'Deshidratacion por diarrea, vomitos o fiebre alta',
    dosis_adulto: '1 sobre disuelto en 1 litro de agua hervida, tomar a sorbos frecuentes',
    dosis_nino: '50-100 mL por kg en 4 horas (casos moderados)',
    contraindicaciones: 'Vomitos incoercibles (requiere suero IV). Obstruccion intestinal.',
    efectos_secundarios: 'Nauseas leves si se toma muy rapido. Muy bien tolerado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '5-15 C$ (sobre)',
    embarazo: 'Categoria A — Seguro y recomendado'
  },{
    id: 12,
    nombre_es: 'Sulfato de Zinc',
    nombre_en: 'Zinc Sulfate',
    nombres_comerciales: ['Zinc MK','Zincovit','Zintablets'],
    sinonimos: ['zinc','para la diarrea del nino','suplemento zinc'],
    categoria: 'Suplemento / Antidiarreico pediatrico',
    uso_principal: 'Diarrea infantil (junto al suero oral), deficiencia de zinc',
    dosis_adulto: '20 mg al dia por 10-14 dias',
    dosis_nino: 'Menores de 6 meses: 10 mg/dia. Mayores: 20 mg/dia por 10-14 dias.',
    contraindicaciones: 'Alergia al zinc. No exceder dosis recomendada.',
    efectos_secundarios: 'Nauseas o vomitos si se toma en ayunas. Tomar con comida.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas)',
    embarazo: 'Categoria A — Suplemento seguro'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 3 — RESPIRATORIO
  // ════════════════════════════════════════════════════════
  {
    id: 13,
    nombre_es: 'Salbutamol',
    nombre_en: 'Salbutamol / Albuterol',
    nombres_comerciales: ['Ventolin','Salbumax','Broncovent','Albuterol'],
    sinonimos: ['ventolin','inhalador','para el asma','broncodilatador','dificultad para respirar','silbido'],
    categoria: 'Broncodilatador (Beta-2)',
    uso_principal: 'Asma, broncoespasmo, EPOC. Alivio rapido de dificultad para respirar.',
    dosis_adulto: 'Inhalador: 1-2 puffs cada 4-6 h. Jarabe: 2-4 mg tres veces al dia.',
    dosis_nino: 'Inhalador: 1-2 puffs segun necesidad. Jarabe: 0.1-0.15 mg/kg 3 veces al dia.',
    contraindicaciones: 'Alergia al salbutamol. Precaucion en cardiopatias y diabetes.',
    efectos_secundarios: 'Temblor de manos, palpitaciones, dolor de cabeza. Transitorios.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '60-120 C$ (inhalador), 30-50 C$ (jarabe)',
    embarazo: 'Categoria C — Usar solo si es necesario'
  },{
    id: 14,
    nombre_es: 'Clorfeniramina',
    nombre_en: 'Chlorpheniramine',
    nombres_comerciales: ['Alercort','Allergan','CTM','Clorfeniramina MK'],
    sinonimos: ['ctm','antihistaminico sedante','alergia','picazon','estornudos'],
    categoria: 'Antihistaminico (1ra generacion, causa sueno)',
    uso_principal: 'Alergias, rinitis alergica, urticaria, picazon. Causa somnolencia.',
    dosis_adulto: '4 mg cada 6 horas (causa sueno — no conducir)',
    dosis_nino: '0.35 mg/kg/dia dividido en 3-4 dosis',
    contraindicaciones: 'Glaucoma, retencion urinaria, asma agudo. No conducir.',
    efectos_secundarios: 'Somnolencia (intensa), boca seca, vision borrosa.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '5-15 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 15,
    nombre_es: 'Bromuro de Ipratropio',
    nombre_en: 'Ipratropium Bromide',
    nombres_comerciales: ['Atrovent','Ipravent','Ipratropio MK'],
    sinonimos: ['atrovent','para epoc','broncodilatador anticolin','para enfisema'],
    categoria: 'Broncodilatador anticolinergico',
    uso_principal: 'EPOC (enfisema, bronquitis cronica), asma como terapia adicional',
    dosis_adulto: 'Inhalador: 2-3 puffs tres o cuatro veces al dia',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Alergia a atropina o ipratropio.',
    efectos_secundarios: 'Boca seca, retencion urinaria leve, vision borrosa.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '80-150 C$ (inhalador)',
    embarazo: 'Categoria B — Consultar medico'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 4 — CARDIOVASCULAR
  // ════════════════════════════════════════════════════════
  {
    id: 16,
    nombre_es: 'Enalapril',
    nombre_en: 'Enalapril',
    nombres_comerciales: ['Renitec','Vasotec','Lotrial','Enalapril MK'],
    sinonimos: ['renitec','para la presion','ieca','antihipertensivo','presion alta'],
    categoria: 'Antihipertensivo (IECA)',
    uso_principal: 'Hipertension arterial, insuficiencia cardiaca, proteccion renal en diabetes',
    dosis_adulto: '5-40 mg una o dos veces al dia (iniciar con 5 mg)',
    dosis_nino: 'Bajo supervision medica estricta',
    contraindicaciones: 'Embarazo (contraindicado absolutamente), angioedema previo, alergia.',
    efectos_secundarios: 'Tos seca persistente (muy comun), mareos, hiperpotasemia.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoria D — CONTRAINDICADO en embarazo'
  },{
    id: 17,
    nombre_es: 'Losartan',
    nombre_en: 'Losartan',
    nombres_comerciales: ['Cozaar','Losartan MK','Losacar'],
    sinonimos: ['cozaar','losacar','para la presion','ara2','antihipertensivo','sin tos'],
    categoria: 'Antihipertensivo (ARA II)',
    uso_principal: 'Hipertension arterial, nefropatia diabetica, insuficiencia cardiaca',
    dosis_adulto: '50-100 mg una vez al dia',
    dosis_nino: 'Mayores de 6 años bajo supervision medica',
    contraindicaciones: 'Embarazo (contraindicado), alergia. No combinar con enalapril ni potasio sin control.',
    efectos_secundarios: 'Mareos, hiperpotasemia. NO causa tos (ventaja sobre enalapril).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '25-60 C$ (tabletas)',
    embarazo: 'Categoria D — CONTRAINDICADO en embarazo'
  },{
    id: 18,
    nombre_es: 'Amlodipina',
    nombre_en: 'Amlodipine',
    nombres_comerciales: ['Norvasc','Amlocard','Amlodipina MK'],
    sinonimos: ['norvasc','para la presion','calcioantagonista','para angina'],
    categoria: 'Antihipertensivo (Bloqueador calcio)',
    uso_principal: 'Hipertension arterial, angina de pecho',
    dosis_adulto: '5-10 mg una vez al dia',
    dosis_nino: 'Consultar medico pediatrico',
    contraindicaciones: 'Alergia a dihidropiridinas. Precaucion en insuficiencia cardiaca grave.',
    efectos_secundarios: 'Edema en tobillos, enrojecimiento facial, palpitaciones, dolor de cabeza.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '15-40 C$ (tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 19,
    nombre_es: 'Hidroclorotiazida',
    nombre_en: 'Hydrochlorothiazide',
    nombres_comerciales: ['HCT','Dichlotride','Hidroclorotiazida MK'],
    sinonimos: ['hct','diuretico','para los pies hinchados','para la presion','tiazida'],
    categoria: 'Diuretico tiazidico / Antihipertensivo',
    uso_principal: 'Hipertension arterial, edemas, insuficiencia cardiaca',
    dosis_adulto: '12.5-25 mg una vez al dia (manana)',
    dosis_nino: 'Consultar medico',
    contraindicaciones: 'Insuficiencia renal grave, alergia a sulfas. Precaucion en diabetes y gota.',
    efectos_secundarios: 'Baja el potasio (calambres), sube el azucar y el acido urico.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '5-15 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 20,
    nombre_es: 'Furosemida',
    nombre_en: 'Furosemide',
    nombres_comerciales: ['Lasix','Diurin','Furosemida MK'],
    sinonimos: ['lasix','diuretico fuerte','para pies hinchados','edema','para el corazon'],
    categoria: 'Diuretico de asa',
    uso_principal: 'Edema (pies/tobillos hinchados), insuficiencia cardiaca, hipertension grave',
    dosis_adulto: '20-80 mg una o dos veces al dia',
    dosis_nino: '0.5-1 mg/kg (consultar medico)',
    contraindicaciones: 'Insuficiencia renal grave, deshidratacion severa, alergia a sulfas.',
    efectos_secundarios: 'Perdida de potasio (calambres), deshidratacion, mareos al pararse.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '5-20 C$ (tabletas)',
    embarazo: 'Categoria C — Usar solo si es necesario'
  },{
    id: 21,
    nombre_es: 'Atenolol',
    nombre_en: 'Atenolol',
    nombres_comerciales: ['Tenormin','Betacard','Atenolol MK'],
    sinonimos: ['tenormin','betabloqueador','para el corazon','para la presion','para las palpitaciones'],
    categoria: 'Antihipertensivo / Betabloqueador',
    uso_principal: 'Hipertension arterial, angina, arritmias, prevencion de infarto',
    dosis_adulto: '25-100 mg una vez al dia',
    dosis_nino: 'Consultar medico',
    contraindicaciones: 'Asma o EPOC grave, bloqueo cardiaco. No suspender bruscamente.',
    efectos_secundarios: 'Cansancio, manos frias, bradicardia, puede agravar asma.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoria D — Consultar medico'
  },{
    id: 22,
    nombre_es: 'Simvastatina',
    nombre_en: 'Simvastatin',
    nombres_comerciales: ['Zocor','Sivastin','Simvastatina MK'],
    sinonimos: ['zocor','estatina','para el colesterol','colesterol alto','trigliceridos'],
    categoria: 'Hipolipemiante (Estatina)',
    uso_principal: 'Colesterol elevado, prevencion de enfermedades cardiovasculares',
    dosis_adulto: '10-40 mg una vez al dia (noche)',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Enfermedad hepatica activa, embarazo, lactancia. Interacciones con antibioticos.',
    efectos_secundarios: 'Dolor muscular (importante: consultar medico si es severo).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoria X — CONTRAINDICADO en embarazo'
  },{
    id: 23,
    nombre_es: 'Aspirina',
    nombre_en: 'Aspirin',
    nombres_comerciales: ['Aspirina Bayer','Ecotrin','AAS','ASA'],
    sinonimos: ['acido acetilsalicilico','asa','aas','para el dolor','para el infarto','antipiretico'],
    categoria: 'AINE / Antiagregante / Antipiretico',
    uso_principal: 'Dolor leve, fiebre, prevencion de trombosis e infartos (dosis baja 75-100 mg)',
    dosis_adulto: 'Dolor/fiebre: 500-1000 mg cada 6-8 h. Cardiovascular: 75-100 mg/dia.',
    dosis_nino: 'NO usar en menores de 16 años con fiebre viral (riesgo sindrome de Reye).',
    contraindicaciones: 'Ulcera gastrica, alergia a AINEs, hemofilia. Menores de 16 con fiebre.',
    efectos_secundarios: 'Irritacion gastrica, sangrado. Tomar con comida.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '5-15 C$ (tabletas)',
    embarazo: 'Categoria D en tercer trimestre — Evitar'
  },{
    id: 24,
    nombre_es: 'Clopidogrel',
    nombre_en: 'Clopidogrel',
    nombres_comerciales: ['Plavix','Clopidogrel MK','Iscover'],
    sinonimos: ['plavix','antiagregante','para el corazon','para el infarto','para la trombosis'],
    categoria: 'Antiagregante plaquetario',
    uso_principal: 'Prevencion de infarto y ACV en pacientes de alto riesgo cardiovascular',
    dosis_adulto: '75 mg una vez al dia',
    dosis_nino: 'No aplica en uso pediatrico rutinario',
    contraindicaciones: 'Sangrado activo, ulcera peptica activa, alergia.',
    efectos_secundarios: 'Sangrado (hematomas, encías), raramente sangrado grave.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '40-100 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 25,
    nombre_es: 'Digoxina',
    nombre_en: 'Digoxin',
    nombres_comerciales: ['Lanoxin','Digoxina MK'],
    sinonimos: ['lanoxin','para el corazon','para fibrilacion auricular','glucosido cardiaco'],
    categoria: 'Glucosido cardiaco / Antiarritmico',
    uso_principal: 'Insuficiencia cardiaca, fibrilacion auricular',
    dosis_adulto: '0.125-0.25 mg una vez al dia (dosis exacta segun medico)',
    dosis_nino: 'Solo bajo supervision cardiologica pediatrica',
    contraindicaciones: 'Intoxicacion digitálica, bloqueo cardiaco, hipopotasemia. Margen terapeutico estrecho.',
    efectos_secundarios: 'Nauseas, vision amarillenta, arritmias (signos de intoxicacion — suspender y consultar).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '15-40 C$ (tabletas)',
    embarazo: 'Categoria C — Bajo supervision medica'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 5 — HEMATOLOGIA
  // ════════════════════════════════════════════════════════
  {
    id: 26,
    nombre_es: 'Sulfato Ferroso',
    nombre_en: 'Ferrous Sulfate',
    nombres_comerciales: ['Fer-In-Sol','Ferodan','Hierro MK','Sulfato ferroso'],
    sinonimos: ['hierro','para la anemia','ferodan','sulfato de hierro','anemia ferropenica'],
    categoria: 'Antianemico / Suplemento de hierro',
    uso_principal: 'Anemia ferropenica, embarazo, lactancia, perdida de sangre',
    dosis_adulto: '300 mg (60 mg hierro elemental) 1-3 veces al dia, con jugo de naranja',
    dosis_nino: '3-6 mg/kg/dia de hierro elemental',
    contraindicaciones: 'Hemocromatosis, anemia no ferropenica. No tomar con leche o te.',
    efectos_secundarios: 'Heces negras (normal), estreñimiento, nauseas. Tomar con jugo de naranja.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas o jarabe)',
    embarazo: 'Categoria A — Recomendado en embarazo'
  },{
    id: 27,
    nombre_es: 'Warfarina',
    nombre_en: 'Warfarin',
    nombres_comerciales: ['Coumadin','Warfarina MK'],
    sinonimos: ['coumadin','anticoagulante','para la trombosis','para los coagulos'],
    categoria: 'Anticoagulante oral',
    uso_principal: 'Trombosis venosa profunda, fibrilacion auricular, valvulas cardiacas artificiales',
    dosis_adulto: '2-10 mg al dia (ajustar segun INR — examen de sangre)',
    dosis_nino: 'Solo bajo supervision hematologica',
    contraindicaciones: 'Sangrado activo, embarazo, hipertension no controlada. MUCHAS interacciones.',
    efectos_secundarios: 'Sangrado (principal riesgo). Evitar cambios bruscos de dieta con vitamina K.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoria X — CONTRAINDICADO'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 6 — NEUROLOGIA / PSIQUIATRIA
  // ════════════════════════════════════════════════════════
  {
    id: 28,
    nombre_es: 'Diazepam',
    nombre_en: 'Diazepam',
    nombres_comerciales: ['Valium','Ansiolin','Diazepam MK'],
    sinonimos: ['valium','para los nervios','ansiedad','calmante','tranquilizante','convulsiones'],
    categoria: 'Benzodiazepina / Ansiolitico',
    uso_principal: 'Ansiedad grave, convulsiones, espasmos musculares, abstinencia alcoholica',
    dosis_adulto: '2-10 mg 2-4 veces al dia (segun indicacion medica)',
    dosis_nino: 'Solo bajo supervision medica estricta',
    contraindicaciones: 'Insuficiencia respiratoria grave, apnea del sueno. Dependencia con uso prolongado.',
    efectos_secundarios: 'Somnolencia, mareos, dependencia fisica. No conducir.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '5-20 C$ (tabletas)',
    embarazo: 'Categoria D — Evitar, especialmente primer trimestre'
  },{
    id: 29,
    nombre_es: 'Carbamazepina',
    nombre_en: 'Carbamazepine',
    nombres_comerciales: ['Tegretol','Carbatrol','Carbamazepina MK'],
    sinonimos: ['tegretol','para la epilepsia','antiepiletico','convulsiones','neuralgia'],
    categoria: 'Anticonvulsivante / Antiepiletico',
    uso_principal: 'Epilepsia, neuralgia del trigemino, trastorno bipolar',
    dosis_adulto: '200-400 mg dos veces al dia',
    dosis_nino: '10-20 mg/kg/dia dividido en 2-3 dosis',
    contraindicaciones: 'Bloqueo AV, alergia. Muchas interacciones medicamentosas.',
    efectos_secundarios: 'Mareos, vision doble, nauseas, sarpullido (suspender si aparece).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoria D — Riesgo de malformaciones fetales'
  },{
    id: 30,
    nombre_es: 'Acido Valproico',
    nombre_en: 'Valproic Acid',
    nombres_comerciales: ['Depakote','Valcote','Acido valproico MK','Epival'],
    sinonimos: ['depakote','valcote','para la epilepsia','antiepiletico','para el bipolar'],
    categoria: 'Anticonvulsivante / Estabilizador del animo',
    uso_principal: 'Epilepsia, trastorno bipolar, prevencion de migrana',
    dosis_adulto: '250-500 mg dos o tres veces al dia',
    dosis_nino: '15-30 mg/kg/dia dividido en 2-3 dosis',
    contraindicaciones: 'Enfermedad hepatica, embarazo (alto riesgo), alergia.',
    efectos_secundarios: 'Aumento de peso, caida de cabello, temblor, daño hepatico.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '40-100 C$ (tabletas)',
    embarazo: 'Categoria D — Riesgo alto de defectos del tubo neural'
  },{
    id: 31,
    nombre_es: 'Fluoxetina',
    nombre_en: 'Fluoxetine',
    nombres_comerciales: ['Prozac','Fluoxac','Fontex','Fluoxetina MK'],
    sinonimos: ['prozac','antidepresivo','para la depresion','isrs','para la ansiedad'],
    categoria: 'Antidepresivo ISRS',
    uso_principal: 'Depresion, trastorno obsesivo-compulsivo, trastorno de panico, bulimia',
    dosis_adulto: '20-60 mg una vez al dia (manana)',
    dosis_nino: 'Solo bajo supervision psiquiatrica',
    contraindicaciones: 'No combinar con inhibidores de MAO. Precaucion en epilepsia.',
    efectos_secundarios: 'Nauseas (primeras semanas), insomnio, disfuncion sexual. Efecto tarda 2-4 semanas.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '30-80 C$ (capsulas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 32,
    nombre_es: 'Amitriptilina',
    nombre_en: 'Amitriptyline',
    nombres_comerciales: ['Triptizol','Amitriptilina MK','Laroxyl'],
    sinonimos: ['triptizol','antidepresivo','para el dolor cronico','neuropatia','para dormir'],
    categoria: 'Antidepresivo triciclico',
    uso_principal: 'Depresion, dolor neuropatico cronico, fibromialgia, migrana (prevencion)',
    dosis_adulto: '25-150 mg al dia (iniciar con 25 mg en la noche)',
    dosis_nino: 'Solo bajo supervision medica',
    contraindicaciones: 'Infarto reciente, glaucoma, retencion urinaria, arritmias. No con IMAO.',
    efectos_secundarios: 'Somnolencia, boca seca, estreñimiento, aumento de peso.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 33,
    nombre_es: 'Haloperidol',
    nombre_en: 'Haloperidol',
    nombres_comerciales: ['Haldol','Serenase','Haloperidol MK'],
    sinonimos: ['haldol','antipsicótico','para la psicosis','para la agitacion'],
    categoria: 'Antipsicótico tipico',
    uso_principal: 'Esquizofrenia, psicosis aguda, agitacion severa, delirio',
    dosis_adulto: '0.5-5 mg dos o tres veces al dia',
    dosis_nino: 'Solo bajo supervision psiquiatrica',
    contraindicaciones: 'Parkinson, coma, depresion grave del SNC.',
    efectos_secundarios: 'Rigidez muscular, temblor, somnolencia, movimientos involuntarios.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 7 — ENDOCRINOLOGIA
  // ════════════════════════════════════════════════════════
  {
    id: 34,
    nombre_es: 'Glibenclamida',
    nombre_en: 'Glibenclamide',
    nombres_comerciales: ['Daonil','Euglucon','Glibenclamida MK'],
    sinonimos: ['daonil','euglucon','para la diabetes','hipoglucemiante','antidiabetico'],
    categoria: 'Hipoglucemiante oral (Sulfonilurea)',
    uso_principal: 'Diabetes tipo 2 cuando dieta y metformina no son suficientes',
    dosis_adulto: '2.5-15 mg al dia con el desayuno (iniciar con dosis baja)',
    dosis_nino: 'No usar en diabetes tipo 1 ni en ninos',
    contraindicaciones: 'Diabetes tipo 1, insuficiencia renal o hepatica grave, embarazo.',
    efectos_secundarios: 'Hipoglucemia si no come. Aumento de peso.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '10-25 C$ (tabletas)',
    embarazo: 'Categoria C — Contraindicado, usar insulina en embarazo'
  },{
    id: 35,
    nombre_es: 'Insulina NPH',
    nombre_en: 'NPH Insulin / Isophane Insulin',
    nombres_comerciales: ['Insulina Lilly NPH','Insulatard','Humulin N'],
    sinonimos: ['insulina','insulina nph','para la diabetes','insulina lenta','inyeccion para diabetes'],
    categoria: 'Insulina de accion intermedia',
    uso_principal: 'Diabetes tipo 1, diabetes tipo 2 mal controlada, diabetes en embarazo',
    dosis_adulto: 'Individualizada segun glucemia (prescripcion medica obligatoria)',
    dosis_nino: 'Solo bajo supervision medica pediatrica',
    contraindicaciones: 'Hipoglucemia activa. Tecnica de inyeccion y dosis individualizadas.',
    efectos_secundarios: 'Hipoglucemia (azucar baja — mareos, sudor, temblor), lipodistrofia.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '120-250 C$ (frasco/vial)',
    embarazo: 'Categoria B — Primera eleccion en embarazo diabetico'
  },{
    id: 36,
    nombre_es: 'Levotiroxina',
    nombre_en: 'Levothyroxine',
    nombres_comerciales: ['Eutirox','Synthroid','Levotiroxina MK'],
    sinonimos: ['eutirox','synthroid','tiroides','hipotiroidismo','hormona tiroidea','t4'],
    categoria: 'Hormona tiroidea',
    uso_principal: 'Hipotiroidismo, bocio, tras extirpacion de tiroides',
    dosis_adulto: '25-200 mcg una vez al dia (en ayunas, 30 min antes del desayuno)',
    dosis_nino: 'Segun peso y edad (consultar medico)',
    contraindicaciones: 'Tirotoxicosis no tratada. Iniciar con dosis baja en ancianos y cardiopatia.',
    efectos_secundarios: 'Con dosis excesiva: palpitaciones, nerviosismo, perdida de peso, insomnio.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoria A — Necesaria y segura en embarazo'
  },{
    id: 37,
    nombre_es: 'Dexametasona',
    nombre_en: 'Dexamethasone',
    nombres_comerciales: ['Decadron','Oradexon','Dexametasona MK'],
    sinonimos: ['decadron','corticoide','cortisona','para la inflamacion','para la alergia grave'],
    categoria: 'Corticosteroide potente',
    uso_principal: 'Inflamacion severa, reacciones alergicas graves, edema cerebral, crup',
    dosis_adulto: '0.5-24 mg/dia segun indicacion medica',
    dosis_nino: 'Solo bajo supervision medica',
    contraindicaciones: 'Infecciones fungicas sistemicas. Precaucion en diabetes, HTA, ulcera.',
    efectos_secundarios: 'Con uso prolongado: aumento de peso, diabetes, osteoporosis, inmunosupresion.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '10-40 C$ (tabletas o inyectable)',
    embarazo: 'Categoria C — Usar solo si beneficio supera el riesgo'
  },{
    id: 38,
    nombre_es: 'Prednisona',
    nombre_en: 'Prednisone',
    nombres_comerciales: ['Deltasone','Meticorten','Prednisona MK'],
    sinonimos: ['meticorten','cortisona oral','prednisona','para alergia severa','para artritis'],
    categoria: 'Corticosteroide oral',
    uso_principal: 'Enfermedades autoinmunes, alergias graves, asma severo, inflamacion cronica',
    dosis_adulto: '5-60 mg/dia segun condicion (tomar con comida)',
    dosis_nino: '0.5-2 mg/kg/dia (consultar medico)',
    contraindicaciones: 'Infecciones no tratadas, ulcera peptica activa. No suspender bruscamente.',
    efectos_secundarios: 'Aumento de peso, hipertension, diabetes, osteoporosis con uso cronico.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '5-20 C$ (tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 8 — ANALGESIA ADICIONAL
  // ════════════════════════════════════════════════════════
  {
    id: 39,
    nombre_es: 'Diclofenaco',
    nombre_en: 'Diclofenac',
    nombres_comerciales: ['Voltaren','Cataflam','Artren','Diclofenaco MK'],
    sinonimos: ['voltaren','cataflam','artren','para el dolor','antiinflamatorio','para la artritis','dolor muscular'],
    categoria: 'AINE / Antiinflamatorio',
    uso_principal: 'Dolor musculoesqueletico, artritis, colicos menstruales, traumatismos',
    dosis_adulto: '50 mg dos o tres veces al dia con comida. Max 150 mg/dia.',
    dosis_nino: '1-3 mg/kg/dia (consultar medico)',
    contraindicaciones: 'Ulcera gastrica, insuficiencia renal o cardiaca, embarazo avanzado. SIEMPRE con comida.',
    efectos_secundarios: 'Malestar estomacal, ulcera si no come, retencion de liquidos.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-30 C$ (tabletas o ampollas)',
    embarazo: 'Categoria D en 3er trimestre — CONTRAINDICADO'
  },{
    id: 40,
    nombre_es: 'Dipirona / Metamizol',
    nombre_en: 'Metamizole / Dipyrone',
    nombres_comerciales: ['Novalgin','Novalgina','Conmel','Dipirona MK'],
    sinonimos: ['novalgin','novalgina','conmel','metamizol','para el dolor fuerte','para la fiebre alta'],
    categoria: 'Analgesico / Antipiretico',
    uso_principal: 'Dolor intenso, fiebre alta, colico renal o biliar',
    dosis_adulto: '500-1000 mg cada 6-8 horas (oral o inyectable)',
    dosis_nino: '10-15 mg/kg cada 6-8 horas',
    contraindicaciones: 'Alergia, porfiria, depresion de medula osea.',
    efectos_secundarios: 'Reacciones alergicas, caida de presion con inyeccion rapida. Rara agranulocitosis.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '5-15 C$ (tabletas), 20-40 C$ (ampollas)',
    embarazo: 'Categoria C — Evitar en primer y tercer trimestre'
  },{
    id: 41,
    nombre_es: 'Ketorolaco',
    nombre_en: 'Ketorolac',
    nombres_comerciales: ['Toradol','Dolac','Ketorolaco MK'],
    sinonimos: ['toradol','dolac','para el dolor fuerte','inyeccion para el dolor','antiinflamatorio inyectable'],
    categoria: 'AINE potente (oral e inyectable)',
    uso_principal: 'Dolor moderado a severo de corta duracion (max 5 dias), dolor posoperatorio',
    dosis_adulto: '10-30 mg cada 4-6 horas. MAX 5 dias de tratamiento.',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Ulcera, insuficiencia renal, embarazo, uso prolongado. MAX 5 dias.',
    efectos_secundarios: 'Malestar gastrico, riesgo de sangrado gastrointestinal.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-50 C$ (tabletas), 40-80 C$ (ampollas)',
    embarazo: 'Categoria C/D — Contraindicado en tercer trimestre'
  },{
    id: 42,
    nombre_es: 'Alopurinol',
    nombre_en: 'Allopurinol',
    nombres_comerciales: ['Zyloric','Zyloprim','Alopurinol MK'],
    sinonimos: ['zyloric','para la gota','acido urico alto','hiperuricemia','gota'],
    categoria: 'Antigotoso',
    uso_principal: 'Gota cronica, hiperuricemia, prevencion de ataques de gota',
    dosis_adulto: '100-300 mg una vez al dia (con mucha agua)',
    dosis_nino: 'Solo bajo supervision medica',
    contraindicaciones: 'Ataque agudo de gota activo (no iniciar durante crisis). Alergia.',
    efectos_secundarios: 'Sarpullido (suspender si aparece), nauseas, crisis de gota al inicio.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '15-40 C$ (tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 9 — ANTIINFECCIOSOS ADICIONALES
  // ════════════════════════════════════════════════════════
  {
    id: 43,
    nombre_es: 'Cotrimoxazol',
    nombre_en: 'Trimethoprim-Sulfamethoxazole',
    nombres_comerciales: ['Bactrim','Septrin','Trimel','Cotrimoxazol MK'],
    sinonimos: ['bactrim','septrin','trimel','trimetoprim','para la orina','infeccion urinaria','sulfa'],
    categoria: 'Antibiotico Sulfonamida',
    uso_principal: 'Infecciones urinarias, diarrea bacteriana, toxoplasmosis',
    dosis_adulto: '1 tableta forte (800/160 mg) dos veces al dia por 7-10 dias',
    dosis_nino: '8/40 mg/kg/dia dividido en 2 dosis',
    contraindicaciones: 'Alergia a sulfas, insuficiencia renal grave, embarazo 3er trimestre, menores de 2 meses.',
    efectos_secundarios: 'Sarpullido, nauseas. Tomar mucho liquido.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoria C — Evitar en tercer trimestre'
  },{
    id: 44,
    nombre_es: 'Doxiciclina',
    nombre_en: 'Doxycycline',
    nombres_comerciales: ['Vibramycin','Vivox','Doxiciclina MK'],
    sinonimos: ['vibramycin','tetraciclina','para acne','para infeccion','para malaria'],
    categoria: 'Antibiotico Tetraciclina',
    uso_principal: 'Infecciones respiratorias, acne moderado-grave, ITS, malaria',
    dosis_adulto: '100 mg dos veces al dia el primer dia, luego 100 mg/dia',
    dosis_nino: 'Contraindicado en menores de 8 años',
    contraindicaciones: 'Menores de 8 años, embarazo, lactancia. Evitar sol excesivo.',
    efectos_secundarios: 'Nauseas, fotosensibilidad (protegerse del sol), reduce efecto de anticonceptivos.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '30-70 C$ (capsulas)',
    embarazo: 'Categoria D — CONTRAINDICADO'
  },{
    id: 45,
    nombre_es: 'Ciprofloxacina',
    nombre_en: 'Ciprofloxacin',
    nombres_comerciales: ['Cipro','Cifran','Ciprofloxacina MK'],
    sinonimos: ['cipro','cifran','quinolona','para infeccion urinaria','para la diarrea bacteriana'],
    categoria: 'Antibiotico Fluoroquinolona',
    uso_principal: 'Infecciones urinarias complicadas, diarrea bacteriana, infecciones respiratorias',
    dosis_adulto: '250-750 mg dos veces al dia por 3-14 dias segun infeccion',
    dosis_nino: 'Uso limitado (bajo supervision medica)',
    contraindicaciones: 'Alergia a quinolonas, embarazo, menores de 18 años rutinario. Evitar con antiacidos.',
    efectos_secundarios: 'Nauseas, diarrea, sensibilidad al sol, tendinitis (raro). No tomar con leche.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '30-80 C$ (tabletas)',
    embarazo: 'Categoria C — Evitar si es posible'
  },{
    id: 46,
    nombre_es: 'Ceftriaxona',
    nombre_en: 'Ceftriaxone',
    nombres_comerciales: ['Rocephin','Ceftriaxona MK','Triaxon'],
    sinonimos: ['rocephin','triaxon','cefalosporina','antibiotico inyectable','para infeccion grave'],
    categoria: 'Antibiotico Cefalosporina (3ra generacion)',
    uso_principal: 'Infecciones graves: neumonia, meningitis, sepsis, ITS (gonorrea)',
    dosis_adulto: '1-2 g al dia (IM o IV)',
    dosis_nino: '50-100 mg/kg/dia (consultar medico)',
    contraindicaciones: 'Alergia a cefalosporinas o penicilinas (precaucion). Neonatos con hiperbilirrubinemia.',
    efectos_secundarios: 'Dolor en sitio de inyeccion, diarrea, reacciones alergicas.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '80-180 C$ (frasco ampolla)',
    embarazo: 'Categoria B — Generalmente seguro'
  },{
    id: 47,
    nombre_es: 'Albendazol',
    nombre_en: 'Albendazole',
    nombres_comerciales: ['Zentel','Eskazole','Albendazol MK'],
    sinonimos: ['zentel','antiparasitario','para los parasitos','gusanos','lombrices','parasitosis','oxiuros'],
    categoria: 'Antihelmíntico / Antiparasitario',
    uso_principal: 'Parasitosis intestinal (lombrices, oxiuros, tenias)',
    dosis_adulto: '400 mg dosis unica',
    dosis_nino: 'Mayores de 2 años: 400 mg. Menores de 2: 200 mg.',
    contraindicaciones: 'Alergia, embarazo primer trimestre, enfermedad hepatica grave.',
    efectos_secundarios: 'Dolor abdominal leve, nauseas.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-30 C$ (tableta masticable)',
    embarazo: 'Categoria C — Evitar en primer trimestre'
  },{
    id: 48,
    nombre_es: 'Aciclovir',
    nombre_en: 'Acyclovir',
    nombres_comerciales: ['Zovirax','Acivir','Aciclovir MK'],
    sinonimos: ['zovirax','para el herpes','fuego labial','culebrina','varicela','antiviral'],
    categoria: 'Antiviral',
    uso_principal: 'Herpes labial, herpes genital, varicela, culebrina (herpes zoster)',
    dosis_adulto: 'Herpes labial: 200 mg 5 veces/dia por 5 dias. Varicela: 800 mg 5 veces/dia.',
    dosis_nino: '20 mg/kg 4 veces al dia para varicela',
    contraindicaciones: 'Alergia al aciclovir. Beber abundante agua.',
    efectos_secundarios: 'Nauseas, dolor de cabeza. Beber mucha agua.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '40-100 C$ (tabletas), 30-60 C$ (crema)',
    embarazo: 'Categoria B — Generalmente seguro'
  },{
    id: 49,
    nombre_es: 'Fluconazol',
    nombre_en: 'Fluconazole',
    nombres_comerciales: ['Diflucan','Fluconazol MK','Fluconal'],
    sinonimos: ['diflucan','para los hongos','candidiasis','hongo vaginal','micosis'],
    categoria: 'Antimicótico sistemico',
    uso_principal: 'Candidiasis vaginal, candidiasis oral, micosis sistemicas',
    dosis_adulto: 'Candidiasis vaginal: 150 mg dosis unica. Oral: 100-200 mg/dia.',
    dosis_nino: '3-6 mg/kg/dia (consultar medico)',
    contraindicaciones: 'Alergia, embarazo (primer trimestre). Muchas interacciones medicamentosas.',
    efectos_secundarios: 'Nauseas, dolor abdominal, dolor de cabeza.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '40-100 C$ (capsula 150 mg)',
    embarazo: 'Categoria D — Evitar en primer trimestre'
  },{
    id: 50,
    nombre_es: 'Cloroquina',
    nombre_en: 'Chloroquine',
    nombres_comerciales: ['Aralen','Cloroquina MK'],
    sinonimos: ['aralen','para el paludismo','malaria','antimalárico'],
    categoria: 'Antimalárico',
    uso_principal: 'Prevencion y tratamiento de malaria por Plasmodium vivax',
    dosis_adulto: 'Tratamiento: 600 mg inicio, 300 mg a las 6h, 300 mg/dia por 2 dias mas.',
    dosis_nino: '10 mg/kg inicio, 5 mg/kg a las 6h (consultar medico)',
    contraindicaciones: 'Alergia, retinopatia, epilepsia. Resistencia en algunas areas geograficas.',
    efectos_secundarios: 'Nauseas, vision borrosa con uso prolongado, prurito (picazon).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoria C — Uso permitido para malaria en embarazo'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 10 — VITAMINAS Y SUPLEMENTOS
  // ════════════════════════════════════════════════════════
  {
    id: 51,
    nombre_es: 'Vitamina C',
    nombre_en: 'Ascorbic Acid',
    nombres_comerciales: ['Redoxon','Ce-Vita','Celin','Vitamina C MK'],
    sinonimos: ['vitamina c','acido ascorbico','redoxon','ce vita','para las defensas','efervescente'],
    categoria: 'Vitamina / Suplemento',
    uso_principal: 'Prevencion y tratamiento del escorbuto, refuerzo del sistema inmune, antioxidante',
    dosis_adulto: '500-1000 mg una vez al dia',
    dosis_nino: '250 mg una vez al dia',
    contraindicaciones: 'Calculos renales de oxalato con dosis altas. En general muy segura.',
    efectos_secundarios: 'Diarrea con dosis muy altas (mas de 2 g al dia).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-30 C$ (tabletas o efervescentes)',
    embarazo: 'Categoria A — Segura y recomendada'
  },{
    id: 52,
    nombre_es: 'Vitamina B12',
    nombre_en: 'Cyanocobalamin',
    nombres_comerciales: ['Bedoyecta','Neurobion','Cianocobalamina MK','B12'],
    sinonimos: ['b12','cianocobalamina','bedoyecta','neurobion','para la anemia','para los nervios','vitamina nervios'],
    categoria: 'Vitamina B12 / Antianemico',
    uso_principal: 'Anemia megaloblastica, neuropatia periferica, deficiencia en vegetarianos y ancianos',
    dosis_adulto: '1000 mcg al dia (oral) o 1000 mcg IM semanal (inyectable)',
    dosis_nino: 'Segun deficiencia (consultar medico)',
    contraindicaciones: 'Alergia a cobalaminas. En general muy segura.',
    efectos_secundarios: 'Rarísimos efectos adversos.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (tabletas), 30-60 C$ (inyectable)',
    embarazo: 'Categoria A — Segura y recomendada'
  },{
    id: 53,
    nombre_es: 'Calcio Carbonato',
    nombre_en: 'Calcium Carbonate',
    nombres_comerciales: ['Caltrate','Os-Cal','Calcibon','Calcium Sandoz'],
    sinonimos: ['calcio','para los huesos','osteoporosis','calcibon','caltrate','antiacido'],
    categoria: 'Suplemento de calcio / Antiacido',
    uso_principal: 'Suplemento de calcio, osteoporosis, antiacido para acidez estomacal',
    dosis_adulto: 'Antiacido: 500-1500 mg segun necesidad. Suplemento: 500-1000 mg dos veces al dia.',
    dosis_nino: 'Segun edad (consultar medico)',
    contraindicaciones: 'Hipercalcemia, calculos renales de calcio. No tomar con antibioticos (tetraciclinas, quinolonas).',
    efectos_secundarios: 'Estreñimiento, gases, flatulencia.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoria A — Recomendado en embarazo'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 11 — DERMATOLOGIA TOPICA
  // ════════════════════════════════════════════════════════
  {
    id: 54,
    nombre_es: 'Clotrimazol',
    nombre_en: 'Clotrimazole',
    nombres_comerciales: ['Canesten','Lotrimin','Gyne-Lotrimin','Clotrimazol MK'],
    sinonimos: ['canesten','lotrimin','antimicótico','hongos en la piel','pie de atleta','candidiasis vaginal','hongo'],
    categoria: 'Antimicótico topico',
    uso_principal: 'Candidiasis vaginal, pie de atleta, tina, hongos en la piel',
    dosis_adulto: 'Crema: 2-3 veces al dia por 2-4 semanas. Ovulo vaginal: 1 ovulo 500 mg dosis unica.',
    dosis_nino: 'Crema: 2-3 veces al dia segun indicacion',
    contraindicaciones: 'Alergia al clotrimazol.',
    efectos_secundarios: 'Ardor o irritacion leve en el sitio de aplicacion.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (crema), 40-80 C$ (ovulos)',
    embarazo: 'Categoria B — Crema segura'
  },{
    id: 55,
    nombre_es: 'Hidrocortisona crema',
    nombre_en: 'Hydrocortisone cream',
    nombres_comerciales: ['Cortaid','Hytone','Hidrocortisona MK 1%'],
    sinonimos: ['cortaid','crema cortisona','para la picazon','eczema','dermatitis','alergia en la piel'],
    categoria: 'Corticosteroide topico leve',
    uso_principal: 'Eczema, dermatitis, picazon, erupciones cutaneas inflamatorias leves',
    dosis_adulto: 'Fina capa 2-3 veces al dia. No usar mas de 2 semanas sin indicacion medica.',
    dosis_nino: 'Usar con precaucion. Dosis minima efectiva.',
    contraindicaciones: 'Infecciones cutaneas por virus, hongos o bacterias sin antibiotico. Evitar en cara y pliegues en ninos.',
    efectos_secundarios: 'Con uso prolongado: adelgazamiento de la piel, estrias.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (tubo)',
    embarazo: 'Categoria C — Usar solo si es necesario, minima cantidad'
  },{
    id: 56,
    nombre_es: 'Permetrina',
    nombre_en: 'Permethrin',
    nombres_comerciales: ['Elimite','Nix','Scabimite','Permetrina MK'],
    sinonimos: ['nix','para la sarna','para los piojos','scabiosis','pediculosis','parasitos piel'],
    categoria: 'Antiparasitario topico',
    uso_principal: 'Sarna (escabiosis), piojos de la cabeza (pediculosis)',
    dosis_adulto: 'Sarna: cuello a pies, dejar 8-12 h, lavar. Piojos: cabello 10 min, lavar.',
    dosis_nino: 'Igual que adulto. Menores de 2 meses: consultar medico.',
    contraindicaciones: 'Alergia a la permetrina. Evitar contacto con ojos.',
    efectos_secundarios: 'Picazon o ardor leve temporal.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '30-70 C$ (crema o champu)',
    embarazo: 'Categoria B — Generalmente seguro'
  },{
    id: 57,
    nombre_es: 'Ivermectina',
    nombre_en: 'Ivermectin',
    nombres_comerciales: ['Stromectol','Ivexterm','Ivermectina MK'],
    sinonimos: ['stromectol','ivexterm','para la sarna','para los parasitos','antiparasitario oral'],
    categoria: 'Antiparasitario sistemico',
    uso_principal: 'Sarna (escabiosis), oncocercosis, estrongiloidiasis, piojos',
    dosis_adulto: 'Sarna: 200 mcg/kg dosis unica (repetir a los 7-14 dias)',
    dosis_nino: 'Mayores de 15 kg: 200 mcg/kg. No usar en menores de 15 kg.',
    contraindicaciones: 'Menores de 15 kg, embarazo, meningitis. Alergia.',
    efectos_secundarios: 'Mareos, nauseas, reaccion de Mazzotti (en oncocercosis).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '30-80 C$ (tabletas)',
    embarazo: 'Categoria C — Evitar'
  },

  // ════════════════════════════════════════════════════════
  //  GRUPO 12 — GINECOLOGIA / ANTICONCEPCION
  // ════════════════════════════════════════════════════════
  {
    id: 58,
    nombre_es: 'Anticonceptivo oral combinado',
    nombre_en: 'Combined Oral Contraceptive',
    nombres_comerciales: ['Microgynon','Nordette','Levofem','Yasmin','Belara'],
    sinonimos: ['pastillas anticonceptivas','pastillas para no embarazarse','microgynon','nordette','levofem','yasmin','planificacion familiar'],
    categoria: 'Anticonceptivo hormonal oral',
    uso_principal: 'Anticoncepcion, regulacion del ciclo menstrual, sindrome de ovario poliquistico',
    dosis_adulto: '1 tableta al dia, comenzar el primer dia de la menstruacion',
    dosis_nino: 'Solo para adolescentes con menstruacion, bajo supervision medica',
    contraindicaciones: 'Fumadoras mayores de 35 años, trombosis, migrana con aura, hepatitis, embarazo.',
    efectos_secundarios: 'Nauseas (primeras semanas), manchado intermenstrual, cambios de humor.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '30-80 C$ (ciclo mensual)',
    embarazo: 'Categoria X — No usar en embarazo'
  },{
    id: 59,
    nombre_es: 'Anticonceptivo de emergencia',
    nombre_en: 'Emergency Contraception',
    nombres_comerciales: ['Postinor','Plan B','Levonorgestrel MK','NorLevo'],
    sinonimos: ['pastilla del dia siguiente','postinor','plan b','anticoncepcion de emergencia','levonorgestrel'],
    categoria: 'Anticoncepcion de emergencia',
    uso_principal: 'Prevencion de embarazo despues de relacion sexual sin proteccion (max 72 horas)',
    dosis_adulto: '1.5 mg (una tableta) lo antes posible, dentro de las 72 horas',
    dosis_nino: 'Solo para adolescentes con menstruacion',
    contraindicaciones: 'No es abortivo. No usar como metodo regular. Embarazo confirmado.',
    efectos_secundarios: 'Nauseas, vomitos, sangrado irregular, dolor de cabeza.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '80-150 C$ (tableta)',
    embarazo: 'No aplica (no es abortivo)'
  },{
    id: 60,
    nombre_es: 'Oxitocina',
    nombre_en: 'Oxytocin',
    nombres_comerciales: ['Pitocin','Syntocinon','Oxitocina MK'],
    sinonimos: ['pitocin','syntocinon','para el parto','inductor del parto','para el sangrado postparto'],
    categoria: 'Uterotonco / Hormona',
    uso_principal: 'Induccion del trabajo de parto, prevencion de hemorragia postparto',
    dosis_adulto: 'Administracion hospitalaria exclusiva (IV o IM segun protocolo)',
    dosis_nino: 'No aplica',
    contraindicaciones: 'Uso exclusivamente hospitalario bajo supervision medica. Desproporcion cefalopelvica.',
    efectos_secundarios: 'Contracciones intensas, hipotension, intoxicacion hidrica con dosis altas.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '30-80 C$ (ampolla)',
    embarazo: 'Uso hospitalario exclusivo'
  },{
    id: 61,
    nombre_es: 'Difenhidramina',
    nombre_en: 'Diphenhydramine',
    nombres_comerciales: ['Benadryl','Difenhidramina MK','Nytol','Unisom'],
    sinonimos: ['benadryl','para la alergia','para dormir','antihistaminico','picazon','urticaria','nytol'],
    categoria: 'Antihistaminico (1ra generacion / sedante)',
    uso_principal: 'Alergias, urticaria, picazon, ayuda para dormir, nauseas por movimiento',
    dosis_adulto: '25-50 mg cada 6-8 horas. Causa mucho sueno — no conducir.',
    dosis_nino: 'Mayores de 2 anos: 1 mg/kg cada 6 horas (consultar medico).',
    contraindicaciones: 'Glaucoma, retencion urinaria, asma. Menores de 2 anos. No conducir.',
    efectos_secundarios: 'Somnolencia intensa, boca seca, vision borrosa, confusion en ancianos.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas o capsula)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 62,
    nombre_es: 'Fexofenadina',
    nombre_en: 'Fexofenadine',
    nombres_comerciales: ['Allegra','Fexofenadina MK','Telfast'],
    sinonimos: ['allegra','telfast','para la alergia','antihistaminico sin sueno','alergia nasal','sin somnolencia'],
    categoria: 'Antihistaminico (2da generacion, NO causa sueno)',
    uso_principal: 'Rinitis alergica, urticaria cronica. NO causa somnolencia.',
    dosis_adulto: '120-180 mg una vez al dia',
    dosis_nino: 'Mayores de 6 anos: 30 mg dos veces al dia (consultar medico)',
    contraindicaciones: 'Alergia a fexofenadina. No tomar con jugo de naranja o toronja.',
    efectos_secundarios: 'Dolor de cabeza, nauseas. Generalmente muy bien tolerado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '30-70 C$ (tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 63,
    nombre_es: 'Cetirizina',
    nombre_en: 'Cetirizine',
    nombres_comerciales: ['Zyrtec','Cetirizina MK','Reactine','Alerlisin'],
    sinonimos: ['zyrtec','reactine','alerlisin','para la alergia','antihistaminico','rinitis','urticaria'],
    categoria: 'Antihistaminico (2da generacion, leve somnolencia)',
    uso_principal: 'Rinitis alergica, urticaria, ojos llorosos, estornudos. Puede causar algo de sueno.',
    dosis_adulto: '10 mg una vez al dia (preferible en la noche)',
    dosis_nino: '5 mg una vez al dia (mayores de 2 anos)',
    contraindicaciones: 'Alergia a cetirizina o hidroxizina. Precaucion en insuficiencia renal.',
    efectos_secundarios: 'Somnolencia leve, boca seca. Mejor tolerado que clorfeniramina.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-35 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 64,
    nombre_es: 'Ambroxol',
    nombre_en: 'Ambroxol',
    nombres_comerciales: ['Mucosolvan','Ambroxol MK','Mucoflux','Bisolvon'],
    sinonimos: ['mucosolvan','mucoflux','bisolvon','para la tos con flema','expectorante','mucolítico','flema'],
    categoria: 'Mucolitico / Expectorante',
    uso_principal: 'Tos productiva con flema, bronquitis, EPOC, infecciones respiratorias con moco',
    dosis_adulto: '30 mg tres veces al dia (tableta) o 15 mL jarabe tres veces al dia',
    dosis_nino: 'Jarabe: hasta 2 anos 2.5 mL dos veces al dia; 2-5 anos 2.5 mL tres veces; 5-12 anos 5 mL tres veces',
    contraindicaciones: 'Alergia al ambroxol. No usar en menores de 2 anos sin indicacion medica.',
    efectos_secundarios: 'Nauseas, diarrea leve, boca seca. Generalmente bien tolerado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (tabletas o jarabe)',
    embarazo: 'Categoria B — Evitar en primer trimestre'
  },{
    id: 65,
    nombre_es: 'Bromhexina',
    nombre_en: 'Bromhexine',
    nombres_comerciales: ['Bisolvon','Bromhexina MK','Broncleer'],
    sinonimos: ['bisolvon','broncleer','mucolitico','para la flema','tos con flema','expectorante'],
    categoria: 'Mucolitico',
    uso_principal: 'Tos con secreciones espesas, bronquitis, sinusitis con congestion',
    dosis_adulto: '8 mg tres veces al dia',
    dosis_nino: 'Jarabe: 4 mg tres veces al dia (2-12 anos)',
    contraindicaciones: 'Alergia a bromhexina. Precaucion en ulcera peptica.',
    efectos_secundarios: 'Nauseas, malestar gastrointestinal leve.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-35 C$ (tabletas o jarabe)',
    embarazo: 'Categoria C — Evitar en primer trimestre'
  },{
    id: 66,
    nombre_es: 'Guaifenesina',
    nombre_en: 'Guaifenesin',
    nombres_comerciales: ['Robitussin','Guaifenesina MK','Humibid'],
    sinonimos: ['robitussin','expectorante','para la tos seca','para aflojar la flema','guayacolato'],
    categoria: 'Expectorante',
    uso_principal: 'Aflojar y expulsar el moco en tos seca o con poca flema, resfriado, bronquitis',
    dosis_adulto: '200-400 mg cada 4-6 horas. Tomar con mucha agua.',
    dosis_nino: 'Jarabe: segun peso (consultar indicacion del producto)',
    contraindicaciones: 'Alergia. Tos persistente (mas de 1 semana) requiere evaluacion medica.',
    efectos_secundarios: 'Nauseas, vomitos si se toma en ayunas. Beber mucha agua.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-40 C$ (tabletas o jarabe)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 67,
    nombre_es: 'Dextrometorfano',
    nombre_en: 'Dextromethorphan',
    nombres_comerciales: ['Robitussin DM','Dextrometorfano MK','Vick 44','DM'],
    sinonimos: ['vick 44','dm','para la tos seca','antitusivo','supresor de tos','tos sin flema'],
    categoria: 'Antitusivo (supresor de tos)',
    uso_principal: 'Tos seca irritativa que no produce flema, tos nocturna molesta',
    dosis_adulto: '15-30 mg cada 6-8 horas. NO usar si hay flema.',
    dosis_nino: 'Mayores de 6 anos: 7.5-15 mg cada 6-8 horas. NO en menores de 2 anos.',
    contraindicaciones: 'Tos con flema, asma, no combinar con antidepresivos IMAO. Menores de 2 anos.',
    efectos_secundarios: 'Nauseas, mareo, somnolencia leve.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-45 C$ (tabletas o jarabe)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 68,
    nombre_es: 'Oximetazolina',
    nombre_en: 'Oxymetazoline',
    nombres_comerciales: ['Afrin','Nasivin','Oximetazolina MK','Vicks Sinex'],
    sinonimos: ['afrin','nasivin','para la nariz tapada','descongestionante nasal','spray nasal'],
    categoria: 'Descongestionante nasal topico',
    uso_principal: 'Congestion nasal por resfriado, rinitis alergica, sinusitis. Alivio rapido.',
    dosis_adulto: '2-3 gotas o 1-2 atomizaciones en cada fosa nasal, 2 veces al dia. MAX 5 dias.',
    dosis_nino: 'Mayores de 6 anos con formulacion pediatrica. NO en menores de 6 anos.',
    contraindicaciones: 'No usar mas de 5 dias (efecto rebote). Hipertension, glaucoma. Menores de 6 anos.',
    efectos_secundarios: 'Ardor nasal, congestion de rebote si se usa mas de 5 dias.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '30-60 C$ (atomizador)',
    embarazo: 'Categoria C — Evitar si es posible'
  },{
    id: 69,
    nombre_es: 'Xilometazolina',
    nombre_en: 'Xylometazoline',
    nombres_comerciales: ['Otrivine','Xilometazolina MK','Olynth'],
    sinonimos: ['otrivine','olynth','para la nariz tapada','spray nasal','congestion nasal'],
    categoria: 'Descongestionante nasal topico',
    uso_principal: 'Congestion nasal aguda por resfriado o alergia. Alivio rapido de la obstruccion nasal.',
    dosis_adulto: '1-2 atomizaciones por fosa nasal 2-3 veces al dia. MAX 7 dias. Solo mayores de 12 anos.',
    dosis_nino: 'Formulacion pediatrica 0.05% para 2-12 anos. NO en menores de 2 anos.',
    contraindicaciones: 'No mas de 7 dias. Hipertension, glaucoma. Menores de 2 anos.',
    efectos_secundarios: 'Ardor, picazon nasal, congestion de rebote con uso prolongado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '25-55 C$ (atomizador)',
    embarazo: 'Categoria C — Evitar'
  },{
    id: 70,
    nombre_es: 'Fenazopiridina',
    nombre_en: 'Phenazopyridine',
    nombres_comerciales: ['Pyridium','Fenazopiridina MK','Uristat'],
    sinonimos: ['pyridium','uristat','para el ardor al orinar','dolor al orinar','infeccion urinaria ardor'],
    categoria: 'Analgesico urinario',
    uso_principal: 'Alivio del ardor, dolor y urgencia urinaria (NO trata la infeccion — solo alivia el sintoma)',
    dosis_adulto: '200 mg tres veces al dia despues de comidas. MAX 2 dias.',
    dosis_nino: 'Consultar medico',
    contraindicaciones: 'Insuficiencia renal, hepatica. ADVERTENCIA: tine la orina de naranja/rojo (es normal).',
    efectos_secundarios: 'Orina anaranjada/roja (NORMAL, no alarmarse), nauseas. Puede manchar ropa.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 71,
    nombre_es: 'Acido Mefenamico',
    nombre_en: 'Mefenamic Acid',
    nombres_comerciales: ['Ponstel','Ponstan','Acido mefenamico MK'],
    sinonimos: ['ponstan','ponstel','para los colicos menstruales','dolor menstrual','dismenorrea'],
    categoria: 'AINE (analgesico y antiinflamatorio)',
    uso_principal: 'Colicos menstruales (dismenorrea), dolor leve a moderado, fiebre',
    dosis_adulto: '500 mg tres veces al dia con comida. MAX 7 dias.',
    dosis_nino: 'Mayores de 12 anos: misma dosis que adulto',
    contraindicaciones: 'Ulcera peptica, insuficiencia renal o hepatica, embarazo. SIEMPRE con comida.',
    efectos_secundarios: 'Malestar gastrointestinal, diarrea, nauseas. Tomar con comida.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-35 C$ (capsulas)',
    embarazo: 'Categoria C — Contraindicado en 3er trimestre'
  },{
    id: 72,
    nombre_es: 'Naproxeno',
    nombre_en: 'Naproxen',
    nombres_comerciales: ['Aleve','Naprosyn','Naproxeno MK','Flanax'],
    sinonimos: ['aleve','naprosyn','flanax','para el dolor','antiinflamatorio','dolor muscular','artritis'],
    categoria: 'AINE (analgesico antiinflamatorio de larga duracion)',
    uso_principal: 'Dolor muscular, artritis, colicos menstruales, dolor dental, fiebre',
    dosis_adulto: '250-500 mg dos veces al dia con comida. Duracion larga (12 horas).',
    dosis_nino: 'Mayores de 12 anos: 250 mg dos veces al dia',
    contraindicaciones: 'Ulcera, insuficiencia renal o cardiaca, embarazo avanzado. SIEMPRE con comida.',
    efectos_secundarios: 'Malestar gastrico, retencion de liquidos. Tomar con comida.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoria C — Contraindicado en 3er trimestre'
  },{
    id: 73,
    nombre_es: 'Ergotamina',
    nombre_en: 'Ergotamine',
    nombres_comerciales: ['Cafergot','Ergotamina MK','Ergoton'],
    sinonimos: ['cafergot','ergotamina','para la migrana','jaqueca fuerte','migrena'],
    categoria: 'Antimigranosoo / Vasoconstrictor',
    uso_principal: 'Tratamiento del ataque agudo de migrana o jaqueca intensa',
    dosis_adulto: '1-2 mg al inicio del ataque. MAX 6 mg por ataque y 10 mg por semana.',
    dosis_nino: 'No recomendado en menores de 12 anos',
    contraindicaciones: 'Hipertension, enfermedad coronaria, vasculopatia periferica, embarazo, sepsis.',
    efectos_secundarios: 'Nauseas, vomitos, hormigueo en extremidades. No usar frecuentemente.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoria X — CONTRAINDICADO'
  },{
    id: 74,
    nombre_es: 'Famotidina',
    nombre_en: 'Famotidine',
    nombres_comerciales: ['Pepcid','Famotidina MK','Pepcidine'],
    sinonimos: ['pepcid','pepcidine','para la acidez','antiulceroso','gastritis','reflujo'],
    categoria: 'Antiulceroso (antagonista H2)',
    uso_principal: 'Acidez, gastritis, reflujo gastroesofagico, ulcera gastrica',
    dosis_adulto: '20 mg dos veces al dia o 40 mg en la noche',
    dosis_nino: '0.5 mg/kg dos veces al dia (consultar medico)',
    contraindicaciones: 'Alergia a famotidina o antihistaminicos H2.',
    efectos_secundarios: 'Dolor de cabeza, mareos, diarrea o estreñimiento. Generalmente bien tolerado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 75,
    nombre_es: 'Simeticona',
    nombre_en: 'Simethicone',
    nombres_comerciales: ['Gas-X','Luftal','Simeticona MK','Mylanta Gas','Baros'],
    sinonimos: ['gas-x','luftal','baros','para los gases','flatulencia','hinchazon de estomago','colicos gases'],
    categoria: 'Antiflatulento / Antiespumante',
    uso_principal: 'Gases, flatulencia, hinchazon abdominal, colicos por gases en bebes',
    dosis_adulto: '40-125 mg despues de comidas y al acostarse',
    dosis_nino: 'Bebes y ninos: 20-40 mg despues de cada comida y al acostarse',
    contraindicaciones: 'Alergia a simeticona. Generalmente muy segura.',
    efectos_secundarios: 'Ninguno significativo. Es quimicamente inerte.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-40 C$ (tabletas masticables o gotas)',
    embarazo: 'Categoria C — Generalmente segura, consultar medico'
  },{
    id: 76,
    nombre_es: 'Carbon Activado',
    nombre_en: 'Activated Charcoal',
    nombres_comerciales: ['Carbon activado MK','Norit','Carbophos'],
    sinonimos: ['carbon activado','para los gases','intoxicacion','diarrea con gases','norit'],
    categoria: 'Antiflatulento / Adsorbente gastrointestinal',
    uso_principal: 'Gases intestinales, flatulencia, coadyuvante en intoxicaciones (solo bajo supervision medica)',
    dosis_adulto: '520 mg tres veces al dia entre comidas',
    dosis_nino: 'Solo bajo supervision medica para intoxicaciones',
    contraindicaciones: 'Obstruccion intestinal. Para intoxicaciones: solo bajo supervision medica.',
    efectos_secundarios: 'Heces negras (normal), estreñimiento.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas o capsulas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 77,
    nombre_es: 'Nitazoxanida',
    nombre_en: 'Nitazoxanide',
    nombres_comerciales: ['Alinia','Nitazoxanida MK','Paramix'],
    sinonimos: ['alinia','paramix','para parasitos','giardia','cryptosporidium','diarrea parasitaria'],
    categoria: 'Antiparasitario / Antiprotozoario',
    uso_principal: 'Giardiasis, criptosporidiosis, diarrea por parasitos, algunas infecciones virales digestivas',
    dosis_adulto: '500 mg dos veces al dia por 3 dias con comida',
    dosis_nino: '1-3 anos: 100 mg dos veces al dia. 4-11 anos: 200 mg dos veces al dia.',
    contraindicaciones: 'Alergia a nitazoxanida.',
    efectos_secundarios: 'Dolor abdominal leve, nauseas, orina amarilla (normal).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '60-120 C$ (tabletas o suspension)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 78,
    nombre_es: 'Tinidazol',
    nombre_en: 'Tinidazole',
    nombres_comerciales: ['Fasigyn','Tinidazol MK','Triconex'],
    sinonimos: ['fasigyn','triconex','para parasitos','giardia','amebas','tricomonas'],
    categoria: 'Antiparasitario / Antibiotico',
    uso_principal: 'Giardiasis, amebiasis, tricomoniasis, vaginosis bacteriana',
    dosis_adulto: 'Giardia: 2 g dosis unica. Amebiasis: 2 g al dia por 3 dias.',
    dosis_nino: '50-60 mg/kg/dia (consultar medico)',
    contraindicaciones: 'Alergia, embarazo primer trimestre. NO alcohol durante tratamiento.',
    efectos_secundarios: 'Sabor metalico, nauseas, mareo. Evitar alcohol.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoria C — Evitar en primer trimestre'
  },{
    id: 79,
    nombre_es: 'Mebendazol',
    nombre_en: 'Mebendazole',
    nombres_comerciales: ['Vermox','Mebendazol MK','Nemasol'],
    sinonimos: ['vermox','nemasol','para los parasitos','lombrices','oxiuros','gusanos intestinales'],
    categoria: 'Antihelmíntico (antiparasitario)',
    uso_principal: 'Lombrices, oxiuros, ascaris, uncinaria, tricocefalo',
    dosis_adulto: '100 mg dos veces al dia por 3 dias o 500 mg dosis unica',
    dosis_nino: 'Igual que adulto para mayores de 2 anos',
    contraindicaciones: 'Alergia, menores de 1 ano, embarazo (primer trimestre).',
    efectos_secundarios: 'Dolor abdominal leve, diarrea transitoria.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas masticables)',
    embarazo: 'Categoria C — Evitar en primer trimestre'
  },{
    id: 80,
    nombre_es: 'Furazolidona',
    nombre_en: 'Furazolidone',
    nombres_comerciales: ['Furoxona','Furazolidona MK'],
    sinonimos: ['furoxona','para la diarrea bacteriana','colitis','enterocolitis','giardia'],
    categoria: 'Antibiotico / Antiparasitario intestinal',
    uso_principal: 'Diarrea bacteriana, giardiasis, colera, enterocolitis',
    dosis_adulto: '100 mg cuatro veces al dia por 5-7 dias con comida',
    dosis_nino: '1.25 mg/kg cuatro veces al dia',
    contraindicaciones: 'Alergia. NO consumir alcohol. Menores de 1 mes.',
    efectos_secundarios: 'Nauseas, vomitos, orina oscura (normal). Evitar alcohol.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (tabletas o suspension)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 81,
    nombre_es: 'Subsalicilato de Bismuto',
    nombre_en: 'Bismuth Subsalicylate',
    nombres_comerciales: ['Pepto-Bismol','Bismuto MK'],
    sinonimos: ['pepto bismol','bismuto','para el estomago','nauseas','diarrea','malestar estomacal'],
    categoria: 'Antidiarreico / Antiemetico / Antiacido',
    uso_principal: 'Diarrea leve, nauseas, indigestion, malestar estomacal, diarrea del viajero',
    dosis_adulto: '525 mg cada 30-60 min segun necesidad. MAX 8 dosis al dia.',
    dosis_nino: 'Mayores de 12 anos: dosis adulto. NO en menores de 12 anos (riesgo sindrome de Reye).',
    contraindicaciones: 'Menores de 12 anos, alergia a salicilatos, anticoagulantes, ulcera activa.',
    efectos_secundarios: 'Heces y lengua negra (NORMAL), estreñimiento, tinnitus con dosis altas.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '30-70 C$ (tabletas o suspension)',
    embarazo: 'Categoria C — Evitar en tercer trimestre'
  },{
    id: 82,
    nombre_es: 'Bisacodilo',
    nombre_en: 'Bisacodyl',
    nombres_comerciales: ['Dulcolax','Bisacodilo MK','Laxoberon'],
    sinonimos: ['dulcolax','laxoberon','laxante','para el estrenimiento','constipacion'],
    categoria: 'Laxante estimulante',
    uso_principal: 'Estreñimiento ocacional, preparacion para examenes medicos',
    dosis_adulto: '5-10 mg oral en la noche (efecto en 6-12 h) o 10 mg supositorios (efecto en 15-60 min)',
    dosis_nino: 'Mayores de 6 anos: 5 mg oral. Mayores de 10 anos: dosis adulto.',
    contraindicaciones: 'Dolor abdominal agudo desconocido, nauseas, vomitos, ileus. No uso cronico.',
    efectos_secundarios: 'Calambres abdominales, diarrea, nauseas. No usar mas de 7 dias seguidos.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-40 C$ (tabletas o supositorios)',
    embarazo: 'Categoria C — Usar con precaucion'
  },{
    id: 83,
    nombre_es: 'Dimenhidrinato',
    nombre_en: 'Dimenhydrinate',
    nombres_comerciales: ['Dramamine','Dimenhidrinato MK','Vertirosan'],
    sinonimos: ['dramamine','vertirosan','para el mareo','mareo en carro','mareo en bus','vomitos de viaje','nauseas viaje'],
    categoria: 'Antivomitivo / Antimareo',
    uso_principal: 'Mareo por movimiento (carro, barco, avion), nauseas y vomitos, vertigo',
    dosis_adulto: '50-100 mg cada 4-6 horas. Tomar 30 min antes de viajar.',
    dosis_nino: 'Mayores de 2 anos: 1-1.5 mg/kg cada 6-8 horas.',
    contraindicaciones: 'Glaucoma, asma, retencion urinaria. No conducir (causa sueno).',
    efectos_secundarios: 'Somnolencia, boca seca, vision borrosa. Causa sueno.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 84,
    nombre_es: 'Pancreatina',
    nombre_en: 'Pancreatin / Pancrelipase',
    nombres_comerciales: ['Pankreatan','Creon','Pancreatina MK','Nutrizym'],
    sinonimos: ['pankreatan','creon','enzimas digestivas','para la digestion','mala digestion','dispepsia'],
    categoria: 'Enzima digestiva',
    uso_principal: 'Insuficiencia pancreatica exocrina, mala digestion de grasas, heces grasosas',
    dosis_adulto: '1-3 capsulas con cada comida principal',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Alergia a proteinas de porcino. Pancreatitis aguda.',
    efectos_secundarios: 'Molestia abdominal, nauseas, diarrea con dosis altas.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '50-120 C$ (capsulas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 85,
    nombre_es: 'Miconazol',
    nombre_en: 'Miconazole',
    nombres_comerciales: ['Monistat','Miconazol MK','Daktarin','Gyno-Daktarin'],
    sinonimos: ['monistat','daktarin','gyno-daktarin','para hongos vaginales','candidiasis','hongo en la piel'],
    categoria: 'Antimicótico topico y vaginal',
    uso_principal: 'Candidiasis vaginal, hongos en la piel (tina, pie de atleta), candidiasis oral',
    dosis_adulto: 'Vaginal: 200 mg ovulo por 3 dias o 100 mg por 7 dias. Topica: crema 2% dos veces al dia.',
    dosis_nino: 'Topica bajo supervision medica',
    contraindicaciones: 'Alergia al miconazol.',
    efectos_secundarios: 'Ardor o irritacion leve local.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '30-70 C$ (ovulos o crema)',
    embarazo: 'Categoria C — Consultar medico, uso topico generalmente aceptado'
  },{
    id: 86,
    nombre_es: 'Nistatina',
    nombre_en: 'Nystatin',
    nombres_comerciales: ['Mycostatin','Nistatina MK','Nilstat'],
    sinonimos: ['mycostatin','nilstat','para hongos bucales','candidiasis oral','algodoncillo','muguet'],
    categoria: 'Antimicótico (topico oral y vaginal)',
    uso_principal: 'Candidiasis oral (algodoncillo), candidiasis vaginal, candidiasis cutanea',
    dosis_adulto: 'Oral: 500,000 UI enjuague y trague 4 veces al dia. Vaginal: 100,000 UI ovulo por 14 dias.',
    dosis_nino: 'Oral: 100,000 UI cuatro veces al dia en la boca (neonatos y lactantes)',
    contraindicaciones: 'Alergia a nistatina.',
    efectos_secundarios: 'Sabor desagradable, nauseas con dosis altas.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (suspension o ovulos)',
    embarazo: 'Categoria B — Segura en uso topico'
  },{
    id: 87,
    nombre_es: 'Terbinafina',
    nombre_en: 'Terbinafine',
    nombres_comerciales: ['Lamisil','Terbinafina MK','Fungimed'],
    sinonimos: ['lamisil','fungimed','para hongos en unas','onicomicosis','tina','pie de atleta','hongos'],
    categoria: 'Antimicótico (topico y oral)',
    uso_principal: 'Hongos en unas (onicomicosis), pie de atleta, tina (tinea pedis, cruris, corporis)',
    dosis_adulto: 'Oral: 250 mg una vez al dia por 6 semanas (unas manos) o 12 semanas (unas pies). Topica: 1% dos veces al dia por 1-2 semanas.',
    dosis_nino: 'Oral solo bajo supervision medica',
    contraindicaciones: 'Enfermedad hepatica grave. Alergia a terbinafina.',
    efectos_secundarios: 'Nauseas, dolor abdominal, rash (oral). Ardor local (topico).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '40-100 C$ (crema), 150-300 C$ (tabletas)',
    embarazo: 'Categoria B — Crema generalmente segura; oral consultar medico'
  },{
    id: 88,
    nombre_es: 'Ketoconazol',
    nombre_en: 'Ketoconazole',
    nombres_comerciales: ['Nizoral','Ketoconazol MK','Ketoderm'],
    sinonimos: ['nizoral','ketoderm','para la caspa','hongo cuero cabelludo','seborreico','hongos'],
    categoria: 'Antimicótico topico',
    uso_principal: 'Caspa, dermatitis seborreica, tina del cuero cabelludo, hongos en la piel',
    dosis_adulto: 'Champu 2%: aplicar 2 veces por semana por 4 semanas. Crema 2%: una vez al dia por 2-4 semanas.',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Alergia al ketoconazol. Evitar contacto con ojos.',
    efectos_secundarios: 'Irritacion local, resequedad del cuero cabelludo.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '40-90 C$ (champu o crema)',
    embarazo: 'Categoria C — Uso topico con precaucion'
  },{
    id: 89,
    nombre_es: 'Iodopovidona',
    nombre_en: 'Povidone-Iodine',
    nombres_comerciales: ['Betadine','Isodine','Iodopovidona MK','Yodalin'],
    sinonimos: ['betadine','isodine','yodalin','yodo','antiseptico','para heridas','para desinfectar'],
    categoria: 'Antiseptico topico',
    uso_principal: 'Desinfeccion de heridas, quemaduras, cortes, preparacion quirurgica de la piel',
    dosis_adulto: 'Aplicar directamente en la herida o zona a desinfectar. Dejar secar.',
    dosis_nino: 'Usar con precaucion en neonatos.',
    contraindicaciones: 'Alergia al yodo, hipotiroidismo. No usar en heridas profundas sin indicacion medica.',
    efectos_secundarios: 'Irritacion o quemadura en piel sensible. Tine la piel de cafe/marron (temporal).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (solucion o crema)',
    embarazo: 'Categoria D — Evitar en embarazo y lactancia'
  },{
    id: 90,
    nombre_es: 'Acido Salicilico',
    nombre_en: 'Salicylic Acid',
    nombres_comerciales: ['Verutex','Acido salicilico MK','Keralyt','Saliderm'],
    sinonimos: ['acido salicilico','para las verrugas','para los callos','verrugas','callosidades','queratolitico'],
    categoria: 'Queratolítico topico',
    uso_principal: 'Verrugas, callos, durezas, psoriasis, seborrea, acne (concentraciones bajas)',
    dosis_adulto: 'Verrugas/callos: aplicar solucion 17-40% directamente en la lesion una vez al dia.',
    dosis_nino: 'Consultar medico. Evitar en ninos pequenos en areas extensas.',
    contraindicaciones: 'Heridas abiertas, infecciones. No aplicar en piel sana alrededor de la lesion.',
    efectos_secundarios: 'Irritacion local, descamacion de la piel tratada.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '15-40 C$ (solucion o crema)',
    embarazo: 'Categoria C — Uso topico limitado con precaucion'
  },{
    id: 91,
    nombre_es: 'Minoxidil',
    nombre_en: 'Minoxidil',
    nombres_comerciales: ['Rogaine','Regaine','Minoxidil MK','Loniten topico'],
    sinonimos: ['rogaine','regaine','para la calvicie','para el cabello','alopecia','caida del cabello'],
    categoria: 'Estimulante capilar topico',
    uso_principal: 'Alopecia androgenetica (calvicie comun en hombres y mujeres)',
    dosis_adulto: '1 mL (2% o 5%) aplicar en cuero cabelludo dos veces al dia. Resultado en 3-6 meses.',
    dosis_nino: 'No recomendado en menores de 18 anos',
    contraindicaciones: 'Alergia. No usar si hay infeccion o irritacion en el cuero cabelludo.',
    efectos_secundarios: 'Irritacion local, prurito, crecimiento de vello en cara (mujeres con 5%).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '100-250 C$ (frasco)',
    embarazo: 'Categoria C — Contraindicado durante embarazo'
  },{
    id: 92,
    nombre_es: 'Lagrimas Artificiales',
    nombre_en: 'Artificial Tears',
    nombres_comerciales: ['Systane','Refresh Tears','Lagrimas Artificiales MK','Visine Tears'],
    sinonimos: ['systane','refresh tears','para los ojos secos','sequedad ocular','ardor de ojos','ojos rojos secos'],
    categoria: 'Lubricante ocular',
    uso_principal: 'Ojos secos, irritacion ocular por viento, polvo, humo o uso de pantallas',
    dosis_adulto: '1-2 gotas en cada ojo segun necesidad',
    dosis_nino: 'Seguro en todas las edades bajo supervision',
    contraindicaciones: 'Alergia a los componentes. No usar lentes de contacto blandos al aplicar (excepto formulas especiales).',
    efectos_secundarios: 'Vision borrosa transitoria inmediatamente despues de aplicar (normal).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '40-120 C$ (frasco gotero)',
    embarazo: 'Categoria A — Seguras durante embarazo'
  },{
    id: 93,
    nombre_es: 'Bacitracina',
    nombre_en: 'Bacitracin',
    nombres_comerciales: ['Bacitracina MK','Bacitracin Plus','Neosporin'],
    sinonimos: ['bacitracina','neosporin','pomada antibiotica','para heridas','para cortadas','antibiotico topico'],
    categoria: 'Antibiotico topico',
    uso_principal: 'Prevencion de infecciones en heridas menores, cortes, quemaduras superficiales',
    dosis_adulto: 'Aplicar fina capa en la herida 1-3 veces al dia y cubrir con vendaje',
    dosis_nino: 'Igual que adulto. Seguro en ninos.',
    contraindicaciones: 'Alergia a bacitracina o neomicina. Heridas profundas o mordeduras de animales requieren evaluacion medica.',
    efectos_secundarios: 'Erupcion alergica (raro), irritacion local.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '20-50 C$ (tubo de pomada)',
    embarazo: 'Categoria C — Uso topico generalmente aceptado'
  },{
    id: 94,
    nombre_es: 'Piritionato de Zinc',
    nombre_en: 'Zinc Pyrithione',
    nombres_comerciales: ['Head & Shoulders','Pyrition','Zinpiro','Selsun Blue'],
    sinonimos: ['head and shoulders','para la caspa','champu anticaspa','seborrea','caspa','cuero cabelludo'],
    categoria: 'Antiseborreico / Antimicótico capilar',
    uso_principal: 'Caspa, dermatitis seborreica del cuero cabelludo',
    dosis_adulto: 'Aplicar champu en cabello humedo, masajear, dejar 2-5 min, enjuagar. 2-3 veces por semana.',
    dosis_nino: 'Mayores de 2 anos bajo supervision',
    contraindicaciones: 'Alergia. Evitar contacto con ojos.',
    efectos_secundarios: 'Irritacion leve del cuero cabelludo.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '60-120 C$ (champu)',
    embarazo: 'Generalmente seguro para uso topico'
  },{
    id: 95,
    nombre_es: 'Suero Fisiologico Nasal',
    nombre_en: 'Nasal Saline Solution',
    nombres_comerciales: ['Sterimar','Fisiomer','Salinase','Suero nasal MK','Nasal Mist'],
    sinonimos: ['sterimar','fisiomer','salinase','lavado nasal','para la nariz','solución salina nasal','nariz tapada'],
    categoria: 'Descongestionante nasal (solucion salina)',
    uso_principal: 'Congestion nasal, limpieza nasal, rinitis, resfriado, alergias nasales, ninos con moco',
    dosis_adulto: '1-2 atomizaciones por fosa nasal segun necesidad. Sin limite de uso.',
    dosis_nino: 'Seguro desde recien nacidos. Aplicar antes de amamantar o comer.',
    contraindicaciones: 'Ninguna. Es simplemente agua con sal al 0.9%.',
    efectos_secundarios: 'Ninguno. Totalmente seguro.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '40-100 C$ (atomizador)',
    embarazo: 'Categoria A — Totalmente seguro'
  },{
    id: 96,
    nombre_es: 'Multivitaminico',
    nombre_en: 'Multivitamin',
    nombres_comerciales: ['Centrum','Supradyn','Pharmaton','Multibionta','Complejo B'],
    sinonimos: ['centrum','supradyn','pharmaton','complejo b','vitaminas','multivitaminas','suplemento vitaminas','vitaminas complejo'],
    categoria: 'Suplemento vitamínico / Multimineral',
    uso_principal: 'Suplementacion vitaminica general, prevencion de deficiencias, apoyo al sistema inmune',
    dosis_adulto: '1 tableta al dia con comida',
    dosis_nino: 'Formulas infantiles: 1 tableta masticable al dia (segun edad)',
    contraindicaciones: 'Evitar dosis multiples. Hipervitaminosis con sobredosis de vitaminas A y D.',
    efectos_secundarios: 'Nauseas si se toma en ayunas. Orina amarilla brillante (vitamina B2, normal).',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '50-200 C$ (frasco)',
    embarazo: 'Categoria A — Recomendado (formulas prenatales especificas)'
  }
  ,{
    id: 97,
    nombre_es: 'Desloratadina',
    nombre_en: 'Desloratadine',
    nombres_comerciales: ['Clarinex','Aerius','Desloratadina MK','Larien'],
    sinonimos: ['clarinex','aerius','larien','para la alergia','antihistaminico sin sueno','alergia nasal','estornudos'],
    categoria: 'Antihistaminico (3ra generacion, NO causa sueno)',
    uso_principal: 'Rinitis alergica, urticaria cronica, alergias en general. NO causa somnolencia.',
    dosis_adulto: '5 mg una vez al dia',
    dosis_nino: 'Jarabe: 1-5 anos 1.25 mg/dia; 6-11 anos 2.5 mg/dia',
    contraindicaciones: 'Alergia a desloratadina o loratadina.',
    efectos_secundarios: 'Dolor de cabeza leve. Muy bien tolerado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '67.50-88 C$ (jarabe o tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 98,
    nombre_es: 'Carvedilol',
    nombre_en: 'Carvedilol',
    nombres_comerciales: ['Coreg','Dilatrend','Carvedilol MK'],
    sinonimos: ['coreg','dilatrend','para el corazon','betabloqueador no selectivo','insuficiencia cardiaca'],
    categoria: 'Betabloqueador / Alfa-bloqueador',
    uso_principal: 'Insuficiencia cardiaca, hipertension arterial, cardioproteccion post-infarto',
    dosis_adulto: 'HTA: 12.5-25 mg dos veces al dia. IC: iniciar 3.125 mg dos veces al dia.',
    dosis_nino: 'Solo bajo supervision cardiologica pediatrica',
    contraindicaciones: 'Asma grave, bloqueo cardiaco, bradicardia severa. No suspender bruscamente.',
    efectos_secundarios: 'Mareos, fatiga, manos frias, bradicardia.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '70-116.50 C$ (30 tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 99,
    nombre_es: 'Betametasona crema',
    nombre_en: 'Betamethasone cream',
    nombres_comerciales: ['Diprolene','Betnovate','Betametasona MK 0.1%'],
    sinonimos: ['betnovate','diprolene','crema para picazon fuerte','corticoide topico potente','dermatitis severa','psoriasis'],
    categoria: 'Corticosteroide topico potente',
    uso_principal: 'Dermatitis atopica, psoriasis, eczema severo, inflamacion cutanea moderada a grave',
    dosis_adulto: 'Fina capa 1-2 veces al dia. MAX 2-4 semanas. NO en cara ni pliegues.',
    dosis_nino: 'Extrema precaucion. Dosis minima, tiempo breve.',
    contraindicaciones: 'Infecciones cutaneas no tratadas, acne. NO en cara, axilas, ingle sin indicacion.',
    efectos_secundarios: 'Con uso prolongado: atrofia de piel, estrias, despigmentacion.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '41.50 C$ (tubo 20 g)',
    embarazo: 'Categoria C — Uso minimo y breve'
  },{
    id: 100,
    nombre_es: 'Mupirocina',
    nombre_en: 'Mupirocin',
    nombres_comerciales: ['Bactroban','Mupiral','Mupirocina MK'],
    sinonimos: ['bactroban','mupiral','antibiotico topico','para impetigo','infeccion de piel','herida infectada'],
    categoria: 'Antibiotico topico (anti-Staphylococcus)',
    uso_principal: 'Impetigo, infecciones cutaneas por Staphylococcus aureus, heridas infectadas superficiales',
    dosis_adulto: 'Aplicar 3 veces al dia por 5-10 dias',
    dosis_nino: 'Igual que adulto (mayores de 2 meses)',
    contraindicaciones: 'Alergia a mupirocina.',
    efectos_secundarios: 'Ardor o picazon leve local.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '103.50-120 C$ (unguento 15-20 g)',
    embarazo: 'Categoria B — Segura en uso topico'
  },{
    id: 101,
    nombre_es: 'Prednisolona',
    nombre_en: 'Prednisolone',
    nombres_comerciales: ['Prelone','Pediapred','Prednisolona MK'],
    sinonimos: ['prelone','pediapred','corticoide jarabe','cortisona jarabe para nino','para asma nino','inflamacion pediatrica'],
    categoria: 'Corticosteroide oral (jarabe y tabletas)',
    uso_principal: 'Crisis asmatica en ninos, alergias graves, crup laringeo, inflamacion severa pediatrica',
    dosis_adulto: '5-60 mg/dia segun condicion',
    dosis_nino: '1-2 mg/kg/dia (MAX 40 mg). Jarabe ideal para ninos.',
    contraindicaciones: 'Infecciones no tratadas, ulcera peptica activa. No suspender bruscamente.',
    efectos_secundarios: 'Con uso prolongado: aumento de peso, hiperglucemia, inmunosupresion.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '144.50-263.50 C$ (jarabe)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 102,
    nombre_es: 'Amoxicilina + Acido Clavulanico',
    nombre_en: 'Amoxicillin + Clavulanic Acid',
    nombres_comerciales: ['Augmentin','Clavulin','Amoxiclav','Cil Amox'],
    sinonimos: ['augmentin','clavulin','amoxiclav','antibiotico fuerte','para infeccion resistente','amoxicilina reforzada'],
    categoria: 'Antibiotico amplio espectro (Penicilina + inhibidor)',
    uso_principal: 'Infecciones resistentes a amoxicilina: otitis, sinusitis, neumonia, ITU, mordeduras',
    dosis_adulto: '875/125 mg cada 12 horas por 7-10 dias',
    dosis_nino: 'Suspension: 25-45 mg/kg/dia dividido cada 12 horas',
    contraindicaciones: 'Alergia a penicilinas, hepatitis previa por amoxiclav.',
    efectos_secundarios: 'Diarrea (comun), nauseas, erupcion cutanea. Tomar con comida.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '92.50-220 C$ (suspension o tabletas)',
    embarazo: 'Categoria B — Generalmente seguro'
  },{
    id: 103,
    nombre_es: 'Claritromicina',
    nombre_en: 'Clarithromycin',
    nombres_comerciales: ['Biaxin','Klaricid','Clanic','Claritromicina MK'],
    sinonimos: ['biaxin','klaricid','clanic','macrolido','para infeccion respiratoria','para h pylori','helicobacter pylori'],
    categoria: 'Antibiotico Macrolido (2da generacion)',
    uso_principal: 'Infecciones respiratorias, H. pylori (combinado), sinusitis, faringitis',
    dosis_adulto: '250-500 mg cada 12 horas por 7-14 dias',
    dosis_nino: '7.5 mg/kg cada 12 horas',
    contraindicaciones: 'Alergia a macrolidos. Muchas interacciones (estatinas, warfarina, digoxina).',
    efectos_secundarios: 'Sabor metalico, nauseas, diarrea, dolor abdominal.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '290-360 C$ (30 tabletas)',
    embarazo: 'Categoria C — Evitar en primer trimestre'
  },{
    id: 104,
    nombre_es: 'Cefixima',
    nombre_en: 'Cefixime',
    nombres_comerciales: ['Suprax','Baxfim','Cefixima MK'],
    sinonimos: ['suprax','baxfim','cefalosporina oral','para gonorrea','infeccion urinaria complicada'],
    categoria: 'Antibiotico Cefalosporina (3ra generacion oral)',
    uso_principal: 'Infecciones urinarias, gonorrea, otitis, faringitis, bronquitis',
    dosis_adulto: '400 mg una vez al dia o 200 mg cada 12 horas por 7-10 dias',
    dosis_nino: '8 mg/kg/dia una vez al dia (suspension)',
    contraindicaciones: 'Alergia a cefalosporinas o penicilinas (precaucion).',
    efectos_secundarios: 'Diarrea, nauseas, dolor abdominal.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '106-166 C$ (suspension o capsulas)',
    embarazo: 'Categoria B — Generalmente seguro'
  },{
    id: 105,
    nombre_es: 'Meloxicam',
    nombre_en: 'Meloxicam',
    nombres_comerciales: ['Mobic','Movalis','Meloxicam MK','Melex'],
    sinonimos: ['mobic','movalis','para la artritis','dolor cronico','aine selectivo','antiinflamatorio articulaciones'],
    categoria: 'AINE selectivo COX-2 (mejor tolerancia gastrica)',
    uso_principal: 'Artritis reumatoide, artrosis, dolor musculoesqueletico cronico. Menor riesgo gastrico.',
    dosis_adulto: '7.5-15 mg una vez al dia con comida',
    dosis_nino: 'Consultar medico',
    contraindicaciones: 'Insuficiencia renal o hepatica grave, embarazo, ulcera activa.',
    efectos_secundarios: 'Malestar gastrico (menor que ibuprofeno), retencion de liquidos.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '78 C$ (100 tabletas)',
    embarazo: 'Categoria C — Contraindicado en 3er trimestre'
  },{
    id: 106,
    nombre_es: 'Dexketoprofeno',
    nombre_en: 'Dexketoprofen',
    nombres_comerciales: ['Keral','Dolkyl','Doltium','Enantyum'],
    sinonimos: ['keral','dolkyl','doltium','enantyum','para dolor agudo fuerte','colico renal','dolor dental fuerte'],
    categoria: 'AINE potente de accion rapida',
    uso_principal: 'Dolor agudo moderado a severo: dental, muscular, colico renal, postoperatorio',
    dosis_adulto: '25 mg cada 8 horas. MAX 75 mg/dia. Tomar con comida.',
    dosis_nino: 'No recomendado en menores de 18 anos',
    contraindicaciones: 'Ulcera peptica, insuficiencia renal, embarazo.',
    efectos_secundarios: 'Nauseas, malestar gastrico.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '24-75 C$ (sobre o ampolla)',
    embarazo: 'Categoria C — Contraindicado en 3er trimestre'
  },{
    id: 107,
    nombre_es: 'Levofloxacina',
    nombre_en: 'Levofloxacin',
    nombres_comerciales: ['Levaquin','Xinanx','Levofloxacina MK'],
    sinonimos: ['levaquin','xinanx','quinolona potente','para neumonia','para infeccion grave'],
    categoria: 'Antibiotico Fluoroquinolona (3ra generacion)',
    uso_principal: 'Neumonia, infecciones urinarias complicadas, sinusitis, bronquitis cronica agudizada',
    dosis_adulto: '500-750 mg una vez al dia por 5-14 dias',
    dosis_nino: 'No recomendado en menores de 18 anos (excepto casos especiales)',
    contraindicaciones: 'Alergia a quinolonas, embarazo, epilepsia. Evitar sol excesivo.',
    efectos_secundarios: 'Nauseas, diarrea, fotosensibilidad, tendinitis (raro pero importante).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '97-157 C$ (30 tabletas)',
    embarazo: 'Categoria C — Evitar'
  },{
    id: 108,
    nombre_es: 'Nitrofurantoina',
    nombre_en: 'Nitrofurantoin',
    nombres_comerciales: ['Macrobid','Uvamin','Nitrofurantoina MK'],
    sinonimos: ['macrobid','uvamin','para infeccion urinaria','para cistitis','antibiotico orina','itu recurrente'],
    categoria: 'Antibiotico urinario especifico',
    uso_principal: 'Infecciones del tracto urinario inferior (cistitis), profilaxis de ITU recurrente. SOLO actua en orina.',
    dosis_adulto: '100 mg cada 12 horas por 5-7 dias. Profilaxis: 50-100 mg/noche.',
    dosis_nino: '5-7 mg/kg/dia dividido (mayores de 3 meses)',
    contraindicaciones: 'Insuficiencia renal, embarazo termino, menores de 3 meses.',
    efectos_secundarios: 'Orina amarilla/marron (normal), nauseas. Tomar con comida.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '213-225.50 C$ (100 tabletas)',
    embarazo: 'Categoria B — Evitar en termino y parto'
  },{
    id: 109,
    nombre_es: 'Captopril',
    nombre_en: 'Captopril',
    nombres_comerciales: ['Capoten','Captopril MK','Tensiomin'],
    sinonimos: ['capoten','tensiomin','para la presion alta','ieca','crisis hipertensiva','tableta bajo la lengua presion'],
    categoria: 'Antihipertensivo IECA (accion corta)',
    uso_principal: 'Hipertension arterial, insuficiencia cardiaca, crisis hipertensiva (sublingual)',
    dosis_adulto: '25-50 mg dos o tres veces al dia. Crisis: 25 mg sublingual.',
    dosis_nino: '0.1-0.5 mg/kg cada 8-12 horas (bajo supervision)',
    contraindicaciones: 'Embarazo (contraindicado), angioedema previo, estenosis renal bilateral.',
    efectos_secundarios: 'Tos seca persistente, mareos, hiperpotasemia.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '49.50-77 C$ (50 tabletas)',
    embarazo: 'Categoria D — CONTRAINDICADO'
  },{
    id: 110,
    nombre_es: 'Propranolol',
    nombre_en: 'Propranolol',
    nombres_comerciales: ['Inderal','Sumial','Propranolol MK'],
    sinonimos: ['inderal','sumial','para la migrana','para el temblor','betabloqueador','palpitaciones','para la ansiedad fisica'],
    categoria: 'Betabloqueador no selectivo',
    uso_principal: 'Hipertension, prevencion de migrana, temblor esencial, ansiedad somatica, hipertiroidismo',
    dosis_adulto: 'HTA: 40-80 mg dos veces al dia. Migrana: 40-80 mg dos veces al dia.',
    dosis_nino: '1-4 mg/kg/dia dividido (bajo supervision)',
    contraindicaciones: 'Asma o EPOC grave, bloqueo cardiaco. No suspender bruscamente.',
    efectos_secundarios: 'Fatiga, extremidades frias, bradicardia, puede agravar asma.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '59 C$ (100 tabletas)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 111,
    nombre_es: 'Gabapentina',
    nombre_en: 'Gabapentin',
    nombres_comerciales: ['Neurontin','Gabarin','Gabex Plus','Gabapentina MK'],
    sinonimos: ['neurontin','gabarin','para dolor de nervios','neuropatia','dolor neuropatico','fibromialgia','nervio ciatico'],
    categoria: 'Anticonvulsivante / Analgesico neuropatico',
    uso_principal: 'Dolor neuropatico (neuropatia diabetica, ciatica, neuralgia posherpetica), epilepsia, fibromialgia',
    dosis_adulto: '300-1200 mg tres veces al dia (iniciar con 300 mg/noche, titular lentamente)',
    dosis_nino: '10-15 mg/kg/dia dividido tres veces (epilepsia, bajo supervision)',
    contraindicaciones: 'Alergia. Ajustar dosis en insuficiencia renal.',
    efectos_secundarios: 'Somnolencia, mareos, aumento de peso. Iniciar con dosis baja.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '85-291.50 C$ (segun dosis)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 112,
    nombre_es: 'Nifedipina',
    nombre_en: 'Nifedipine',
    nombres_comerciales: ['Adalat','Procardia','Nifedipina MK'],
    sinonimos: ['adalat','procardia','para la presion','para angina','bloqueador calcio','para parto prematuro'],
    categoria: 'Bloqueador de calcio (Dihidropiridina)',
    uso_principal: 'Hipertension arterial, angina de pecho, parto prematuro (tocolitico)',
    dosis_adulto: 'Liberacion inmediata: 10-30 mg tres veces al dia. Sostenida: 30-90 mg/dia.',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Choque cardiogenico, estenosis aortica grave.',
    efectos_secundarios: 'Enrojecimiento facial, edema en tobillos, palpitaciones, dolor de cabeza.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '125-130 C$ (100 tabletas)',
    embarazo: 'Categoria C — Se usa como tocolitico bajo supervision'
  },{
    id: 113,
    nombre_es: 'Pantoprazol',
    nombre_en: 'Pantoprazole',
    nombres_comerciales: ['Protonix','Pantocal','Pantoprazol MK'],
    sinonimos: ['protonix','pantocal','para la gastritis','para el reflujo','ibp','alternativa omeprazol'],
    categoria: 'Inhibidor de Bomba de Protones (IBP)',
    uso_principal: 'Gastritis, reflujo gastroesofagico, ulcera. Alternativa al omeprazol con menos interacciones.',
    dosis_adulto: '40 mg una vez al dia, 30 min antes del desayuno',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Alergia a IBP.',
    efectos_secundarios: 'Dolor de cabeza, diarrea, nauseas. Bien tolerado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '119-177 C$ (14-100 tabletas)',
    embarazo: 'Categoria B — Generalmente seguro'
  },{
    id: 114,
    nombre_es: 'Atorvastatina',
    nombre_en: 'Atorvastatin',
    nombres_comerciales: ['Lipitor','Torvast','Atorvastatina MK'],
    sinonimos: ['lipitor','torvast','para el colesterol','estatina potente','colesterol alto','ldl alto'],
    categoria: 'Hipolipemiante (Estatina potente)',
    uso_principal: 'Colesterol LDL elevado, trigliceridos altos, prevencion cardiovascular',
    dosis_adulto: '10-80 mg una vez al dia (noche). Mas potente que simvastatina.',
    dosis_nino: 'Bajo supervision medica',
    contraindicaciones: 'Enfermedad hepatica activa, embarazo, lactancia.',
    efectos_secundarios: 'Dolor muscular (mialgia — consultar si es severo), enzimas hepaticas elevadas.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '154 C$ (30 tabletas)',
    embarazo: 'Categoria X — CONTRAINDICADO'
  },{
    id: 115,
    nombre_es: 'Montelukast',
    nombre_en: 'Montelukast',
    nombres_comerciales: ['Singulair','Snowkast','Ucon','Montelukast MK'],
    sinonimos: ['singulair','snowkast','ucon','para el asma','antileucotriene','para alergia cronica','asma nino'],
    categoria: 'Antileucotrieneno (asma y alergias)',
    uso_principal: 'Asma leve-moderada (prevencion), rinitis alergica cronica, prevencion broncospasmo por ejercicio',
    dosis_adulto: '10 mg una vez al dia (noche)',
    dosis_nino: '2-5 anos: 4 mg. 6-14 anos: 5 mg. Tabletas masticables.',
    contraindicaciones: 'Alergia. ADVERTENCIA FDA: puede causar cambios de animo (informar al medico).',
    efectos_secundarios: 'Dolor de cabeza. Raros: cambios conductuales (suspender y consultar).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '66-170.50 C$ (10-30 unidades)',
    embarazo: 'Categoria B — Consultar medico'
  },{
    id: 116,
    nombre_es: 'Eritromicina',
    nombre_en: 'Erythromycin',
    nombres_comerciales: ['Ery-Tab','Ilosone','Eritromicina MK'],
    sinonimos: ['ilosone','macrolido basico','para acne','alternativa penicilina','para alergia a penicilina'],
    categoria: 'Antibiotico Macrolido (1ra generacion)',
    uso_principal: 'Infecciones en alergicos a penicilina, acne moderado, infecciones de piel y respiratorias',
    dosis_adulto: '250-500 mg cada 6-12 horas por 7-10 dias',
    dosis_nino: '30-50 mg/kg/dia dividido cada 6-8 horas',
    contraindicaciones: 'Alergia a macrolidos. Muchas interacciones medicamentosas.',
    efectos_secundarios: 'Nauseas, vomitos, diarrea (comunes). Tomar con comida si hay malestar.',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '50 C$ (polvo para reconstituir 60 mL)',
    embarazo: 'Categoria B — Generalmente seguro'
  },{
    id: 117,
    nombre_es: 'Secnidazol',
    nombre_en: 'Secnidazole',
    nombres_comerciales: ['Flagentyl','Secnil','Secnidazol MK'],
    sinonimos: ['flagentyl','secnil','para parasitos dosis unica','giardia rapido','vaginosis','amebiasis'],
    categoria: 'Antiparasitario (5-nitroimidazol, dosis unica)',
    uso_principal: 'Giardiasis, amebiasis, vaginosis bacteriana, tricomoniasis. Ventaja: dosis unica.',
    dosis_adulto: '2 g dosis unica. Vaginosis: 1 g dosis unica.',
    dosis_nino: '30 mg/kg dosis unica (consultar medico)',
    contraindicaciones: 'Alergia, embarazo primer trimestre. NO alcohol.',
    efectos_secundarios: 'Nauseas, sabor metalico, mareos. Evitar alcohol.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '13.50-36 C$ (tabletas o suspension)',
    embarazo: 'Categoria B — Evitar en primer trimestre'
  },{
    id: 118,
    nombre_es: 'Calamina locion',
    nombre_en: 'Calamine Lotion',
    nombres_comerciales: ['Calamina MK','Caladermina'],
    sinonimos: ['calamina','para picazon','para varicela','para quemadura de sol','urticaria topica','ronchas','sarpullido'],
    categoria: 'Astringente / Antipruritico topico',
    uso_principal: 'Picazon por varicela, urticaria, quemaduras leves de sol, sarpullidos',
    dosis_adulto: 'Aplicar sobre zona afectada limpia y seca. Dejar secar. Repetir segun necesidad.',
    dosis_nino: 'Seguro desde lactantes. Muy usado en varicela pediatrica.',
    contraindicaciones: 'Alergia a los componentes. No aplicar en heridas abiertas.',
    efectos_secundarios: 'Ninguno significativo.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '38-49 C$ (locion 120 mL)',
    embarazo: 'Categoria A — Totalmente segura en uso topico'
  },{
    id: 119,
    nombre_es: 'Vitamina A',
    nombre_en: 'Vitamin A / Retinol',
    nombres_comerciales: ['Arovit','Vitamina A MK'],
    sinonimos: ['vitamina a','retinol','arovit','para la vista','deficiencia vitamina a','ceguera nocturna'],
    categoria: 'Vitamina liposoluble',
    uso_principal: 'Deficiencia de vitamina A, ceguera nocturna, salud ocular, inmunidad',
    dosis_adulto: '5000-50000 UI segun deficiencia. No exceder 10000 UI/dia en uso prolongado.',
    dosis_nino: 'Programa de suplementacion MINSA segun edad',
    contraindicaciones: 'Hipervitaminosis A (toxica en exceso). Embarazo: NO exceder 10000 UI/dia.',
    efectos_secundarios: 'Con sobredosis: dolor de cabeza, vomitos, dano hepatico.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '136 C$ (50 capsulas)',
    embarazo: 'Categoria A (dosis baja) — NO exceder 10000 UI/dia en embarazo'
  },{
    id: 120,
    nombre_es: 'Vitamina E',
    nombre_en: 'Vitamin E / Tocopherol',
    nombres_comerciales: ['Ephynal','Vitamina E MK','Evion'],
    sinonimos: ['vitamina e','tocoferol','ephynal','evion','antioxidante','para la piel','capsula vitamina'],
    categoria: 'Vitamina liposoluble / Antioxidante',
    uso_principal: 'Deficiencia de vitamina E, antioxidante, salud cardiovascular',
    dosis_adulto: '200-400 UI una vez al dia',
    dosis_nino: 'Segun deficiencia (consultar medico)',
    contraindicaciones: 'Anticoagulantes (aumenta efecto). Evitar dosis >1000 UI/dia.',
    efectos_secundarios: 'Con dosis altas: nauseas, diarrea, riesgo de sangrado.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '215 C$ (60 capsulas)',
    embarazo: 'Categoria A — Segura en dosis normales'
  },{
    id: 121,
    nombre_es: 'Omega 3',
    nombre_en: 'Omega-3 Fatty Acids',
    nombres_comerciales: ['Cardio-Vital','Omega 3 MK','Aceite de salmon','EPA DHA'],
    sinonimos: ['omega 3','acidos grasos','aceite de salmon','para el colesterol','para el corazon','trigliceridos altos'],
    categoria: 'Acido graso esencial / Suplemento cardiovascular',
    uso_principal: 'Trigliceridos elevados, prevencion cardiovascular, salud cerebral',
    dosis_adulto: '1000-3000 mg al dia con las comidas',
    dosis_nino: 'Formulas pediatricas bajo indicacion medica',
    contraindicaciones: 'Alergia al pescado. Anticoagulantes (consultar con dosis altas).',
    efectos_secundarios: 'Eructos con sabor a pescado, nauseas. Tomar con comida.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '147 C$ (60 capsulas)',
    embarazo: 'Categoria C — Generalmente seguro en dosis normales'
  },{
    id: 122,
    nombre_es: 'Benzoato de Bencilo',
    nombre_en: 'Benzyl Benzoate',
    nombres_comerciales: ['Ascabiol','Scabinil','Benzoato de bencilo MK'],
    sinonimos: ['ascabiol','scabinil','para la sarna','escabiosis','acaricida','alternativa permetrina'],
    categoria: 'Antiparasitario topico (acaricida)',
    uso_principal: 'Sarna (escabiosis) — alternativa cuando permetrina no esta disponible',
    dosis_adulto: 'Locion 25%: de cuello a pies, dejar 24 horas, lavar. Repetir a los 7 dias.',
    dosis_nino: 'Diluir al 12.5% en ninos. NO en menores de 2 anos.',
    contraindicaciones: 'Alergia, heridas abiertas extensas. Evitar ojos y mucosas.',
    efectos_secundarios: 'Ardor local (normal y transitorio), irritacion de piel.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '24 C$ (locion 120 mL)',
    embarazo: 'Categoria C — Usar con precaucion'
  },{
    id: 123,
    nombre_es: 'Ketotifeno',
    nombre_en: 'Ketotifen',
    nombres_comerciales: ['Zaditor','Ketomax','Ketofen','Ketotifeno MK'],
    sinonimos: ['zaditor','ketomax','ketofen','para ojos alergicos','conjuntivitis alergica','ojos rojos por alergia'],
    categoria: 'Antialergico ocular y sistemico',
    uso_principal: 'Conjuntivitis alergica (gotas), prevencion de asma alergica (oral)',
    dosis_adulto: 'Gotas: 1 gota en cada ojo dos veces al dia. Oral: 1 mg dos veces al dia.',
    dosis_nino: 'Mayores de 3 anos: igual que adulto',
    contraindicaciones: 'Alergia al ketotifeno.',
    efectos_secundarios: 'Oral: somnolencia, aumento de peso. Gotas: ardor leve transitorio.',
    disponible_nicaragua: true, requiere_receta: false,
    precio_aproximado: '51 C$ (tabletas 50), 168 C$ (solucion oftalmica)',
    embarazo: 'Categoria C — Consultar medico'
  },{
    id: 124,
    nombre_es: 'Finasteride',
    nombre_en: 'Finasteride',
    nombres_comerciales: ['Proscar','Propecia','Finasteride MK'],
    sinonimos: ['proscar','propecia','para la prostata','para la calvicie','alopecia masculina','hiperplasia prostatica'],
    categoria: 'Inhibidor 5-alfa reductasa',
    uso_principal: 'Hiperplasia prostatica benigna (5 mg), alopecia androgenetica masculina (1 mg)',
    dosis_adulto: 'Prostata: 5 mg/dia. Calvicie: 1 mg/dia. Efecto en 3-6 meses.',
    dosis_nino: 'NO usar en menores de 18 anos ni en mujeres.',
    contraindicaciones: 'Mujeres (especialmente embarazadas — malformaciones fetales). Menores de 18 anos.',
    efectos_secundarios: 'Disfuncion sexual (~2%), ginecomastia (raro).',
    disponible_nicaragua: true, requiere_receta: true,
    precio_aproximado: '577 C$ (100 tabletas)',
    embarazo: 'Categoria X — PROHIBIDO en mujeres embarazadas (ni tocar el comprimido)'
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
  { nombre: 'Emergencias Nacionales (Bomberos)',   numero: '128',       descripcion: 'Línea de emergencias gratuita 24h — Nicaragua',              disponible: true },
  { nombre: 'Policía Nacional',                    numero: '118',       descripcion: 'Emergencias policiales',                                      disponible: true },
  { nombre: 'Cruz Roja Nicaragüense — Granada',    numero: '2552-5555', descripcion: 'Ambulancias y primeros auxilios en Granada',                  disponible: true },
  { nombre: 'Hospital Amistad Japón Nicaragua',    numero: '2552-7050', descripcion: 'Hospital Departamental — urgencias 24h gratuitas',            disponible: true },
  { nombre: 'Hospital SERMESA Granada',            numero: '2552-4444', descripcion: 'Hospital privado — urgencias INSS y particular',              disponible: true },
  { nombre: 'SILAIS Granada',                      numero: '2552-0450', descripcion: 'Sistema Local de Atención Integral en Salud Granada',         disponible: true }
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

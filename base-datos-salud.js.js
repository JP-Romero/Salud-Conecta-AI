/**
═══════════════════════════════════════════════════════════════
BASE DE DATOS DE SALUD — Salud-Conecta AI (Granada, Nicaragua)
═══════════════════════════════════════════════════════════════
📌 CÓMO AGREGAR UN CENTRO DE SALUD NUEVO:
1. Copia uno de los bloques { } de abajo
2. Pégalo antes del corchete ] final de su categoría
3. Asegúrate de separarlo con una coma del anterior
4. Cambia los datos (id, nombre, telefono, etc.)

📌 CAMPOS DISPONIBLES PARA CENTROS:
id          → Número único (no repitas ninguno)
categoria   → "hospital" | "clinica" | "farmacia" | "laboratorio" | "centro_salud"
nombre      → Nombre del centro
direccion   → Dirección completa (barrio, calle, referencia)
telefono    → Número de teléfono (ej: "2552-0000")
emergencia  → true = tiene urgencias 24h | false = solo consulta
lat         → Latitud para el mapa (ej: 11.9350)
lng         → Longitud para el mapa (ej: -85.9570)
horario     → Horario de atención (ej: "24 horas" | "Lun-Vie 8am-6pm")
servicios   → Array de servicios ["consulta", "farmacia", "laboratorio", etc.]
disponible  → true = visible en la app | false = oculto
verificado  → true = datos confirmados | false = pendiente verificación

📌 CÓMO AGREGAR UN MEDICAMENTO:
Usa la sección de MEDICAMENTOS abajo. Incluye nombre en español
y su equivalente en inglés (para openFDA si quieres consultar).

📌 EMERGENCIAS:
Mantén actualizados los números de emergencia nacionales.

📌 ÚLTIMA ACTUALIZACIÓN:
Edita la fecha cuando agregues o modifiques datos.
═══════════════════════════════════════════════════════════════
*/

const VERSION_BASE_DATOS = "1.0.0";
const ULTIMA_ACTUALIZACION = "2025-01-15";

// ═══════════════════════════════════════════════════════════════
//  🏥 HOSPITALES - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const HOSPITALES = [

{
  id:          1,
  categoria:    "hospital",
  nombre:       "Hospital Virgen de la Asistencia",
  direccion:    "Centro de Granada, Frente al Parque Central",
  telefono:     "2552-2600",
  emergencia:   true,
  lat:          11.9350,
  lng:          -85.9570,
  horario:      "24 horas",
  servicios:    ["urgencias", "consulta", "hospitalizacion", "laboratorio", "rayos_x", "cirugia", "pediatria", "ginecologia"],
  disponible:   true,
  verificado:   true
},
{
  id:          2,
  categoria:    "hospital",
  nombre:       "Hospital Alemán Nicaragüense",
  direccion:    "Barrio San Antonio, Granada",
  telefono:     "2552-3000",
  emergencia:   true,
  lat:          11.9320,
  lng:          -85.9540,
  horario:      "24 horas",
  servicios:    ["urgencias", "consulta", "cirugia", "laboratorio", "farmacia", "rayos_x", "ultrasonido"],
  disponible:   true,
  verificado:   true
},
{
  id:          3,
  categoria:    "hospital",
  nombre:       "Hospital Carlos Roberto Huembes",
  direccion:    "Carretera a Masaya, Granada",
  telefono:     "2552-5100",
  emergencia:   true,
  lat:          11.9280,
  lng:          -85.9480,
  horario:      "24 horas",
  servicios:    ["urgencias", "consulta", "hospitalizacion", "laboratorio", "maternidad"],
  disponible:   true,
  verificado:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  🏥 CLÍNICAS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const CLINICAS = [

{
  id:          4,
  categoria:    "clinica",
  nombre:       "Centro Médico Sandoval",
  direccion:    "Calle La Calzada, Granada",
  telefono:     "2552-4500",
  emergencia:   false,
  lat:          11.9360,
  lng:          -85.9550,
  horario:      "Lun-Vie 8am-6pm, Sab 8am-12pm",
  servicios:    ["consulta", "laboratorio", "ultrasonido", "rayos_x"],
  disponible:   true,
  verificado:   true
},
{
  id:          5,
  categoria:    "clinica",
  nombre:       "Clínica Familiar",
  direccion:    "Barrio El Calvario, Granada",
  telefono:     "2552-1200",
  emergencia:   false,
  lat:          11.9340,
  lng:          -85.9580,
  horario:      "Lun-Vie 7am-7pm",
  servicios:    ["consulta", "vacunacion", "curaciones", "control_nino_sano"],
  disponible:   true,
  verificado:   true
},
{
  id:          6,
  categoria:    "clinica",
  nombre:       "Clínica Médico Dental",
  direccion:    "Parque Central, Granada",
  telefono:     "2552-6700",
  emergencia:   false,
  lat:          11.9345,
  lng:          -85.9565,
  horario:      "Lun-Vie 8am-5pm",
  servicios:    ["odontologia", "ortodoncia", "limpieza_dental"],
  disponible:   true,
  verificado:   true
},
{
  id:          7,
  categoria:    "clinica",
  nombre:       "Clínica de la Mujer",
  direccion:    "Barrio Guadalupe, Granada",
  telefono:     "2552-7800",
  emergencia:   false,
  lat:          11.9370,
  lng:          -85.9540,
  horario:      "Lun-Vie 8am-6pm, Sab 8am-12pm",
  servicios:    ["ginecologia", "ultrasonido", "planificacion_familiar", "control_prenatal"],
  disponible:   true,
  verificado:   true
},
{
  id:          8,
  categoria:    "clinica",
  nombre:       "Centro Médico Las Américas",
  direccion:    "Calle Atravesada, Granada",
  telefono:     "2552-8900",
  emergencia:   false,
  lat:          11.9335,
  lng:          -85.9555,
  horario:      "Lun-Vie 7am-7pm",
  servicios:    ["consulta", "laboratorio", "farmacia", "urgencias_menores"],
  disponible:   true,
  verificado:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  💊 FARMACIAS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const FARMACIAS = [

{
  id:          9,
  categoria:    "farmacia",
  nombre:       "Farmacia Del Pueblo",
  direccion:    "Parque Central, Granada",
  telefono:     "2552-5000",
  emergencia:   true,
  lat:          11.9340,
  lng:          -85.9565,
  horario:      "24 horas",
  servicios:    ["medicamentos", "consultorio_farmaceutico", "toma_presion"],
  disponible:   true,
  verificado:   true
},
{
  id:          10,
  categoria:    "farmacia",
  nombre:       "Farmacia San Nicolás",
  direccion:    "Calle La Calzada, Granada",
  telefono:     "2552-6000",
  emergencia:   false,
  lat:          11.9355,
  lng:          -85.9545,
  horario:      "7am-10pm",
  servicios:    ["medicamentos", "productos_naturales", "cosmeticos"],
  disponible:   true,
  verificado:   true
},
{
  id:          11,
  categoria:    "farmacia",
  nombre:       "Farmacia Cruz Verde",
  direccion:    "Centro Comercial, Granada",
  telefono:     "2552-7000",
  emergencia:   false,
  lat:          11.9330,
  lng:          -85.9555,
  horario:      "8am-9pm",
  servicios:    ["medicamentos", "cosmeticos", "vitaminas", "cuidado_bebe"],
  disponible:   true,
  verificado:   true
},
{
  id:          12,
  categoria:    "farmacia",
  nombre:       "Farmacia Guadalajara",
  direccion:    "Barrio San Antonio, Granada",
  telefono:     "2552-8000",
  emergencia:   false,
  lat:          11.9325,
  lng:          -85.9535,
  horario:      "7am-9pm",
  servicios:    ["medicamentos", "consultorio_farmaceutico", "toma_presion"],
  disponible:   true,
  verificado:   true
},
{
  id:          13,
  categoria:    "farmacia",
  nombre:       "Farmacia Elegua",
  direccion:    "Carretera a Masaya, Granada",
  telefono:     "2552-9100",
  emergencia:   false,
  lat:          11.9290,
  lng:          -85.9490,
  horario:      "8am-8pm",
  servicios:    ["medicamentos", "productos_naturales"],
  disponible:   true,
  verificado:   true
},
{
  id:          14,
  categoria:    "farmacia",
  nombre:       "Farmacia Nicaragua",
  direccion:    "Mercado Municipal, Granada",
  telefono:     "2552-9200",
  emergencia:   false,
  lat:          11.9365,
  lng:          -85.9575,
  horario:      "7am-7pm",
  servicios:    ["medicamentos", "precios_economicos"],
  disponible:   true,
  verificado:   true
},
{
  id:          15,
  categoria:    "farmacia",
  nombre:       "Farmacia La Unión",
  direccion:    "Barrio Simeón Rivas, Granada",
  telefono:     "2552-9300",
  emergencia:   false,
  lat:          11.9380,
  lng:          -85.9590,
  horario:      "8am-8pm",
  servicios:    ["medicamentos", "consultorio_farmaceutico"],
  disponible:   true,
  verificado:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  🔬 LABORATORIOS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const LABORATORIOS = [

{
  id:          16,
  categoria:    "laboratorio",
  nombre:       "Laboratorio Clínico Central",
  direccion:    "Calle Atravesada, Granada",
  telefono:     "2552-9000",
  emergencia:   false,
  lat:          11.9345,
  lng:          -85.9560,
  horario:      "Lun-Vie 7am-5pm, Sab 7am-12pm",
  servicios:    ["analisis_sangre", "orina", "rayos_x", "ultrasonido", "electrocardiograma"],
  disponible:   true,
  verificado:   true
},
{
  id:          17,
  categoria:    "laboratorio",
  nombre:       "Laboratorio Médico",
  direccion:    "Parque Central, Granada",
  telefono:     "2552-9400",
  emergencia:   false,
  lat:          11.9348,
  lng:          -85.9568,
  horario:      "Lun-Vie 6am-4pm",
  servicios:    ["analisis_sangre", "orina", "heces", "cultivos"],
  disponible:   true,
  verificado:   true
},
{
  id:          18,
  categoria:    "laboratorio",
  nombre:       "Centro de Diagnóstico",
  direccion:    "Barrio San Antonio, Granada",
  telefono:     "2552-9500",
  emergencia:   false,
  lat:          11.9315,
  lng:          -85.9525,
  horario:      "Lun-Vie 7am-6pm, Sab 7am-1pm",
  servicios:    ["rayos_x", "ultrasonido", "tomografia", "resonancia"],
  disponible:   true,
  verificado:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  🏥 CENTROS DE SALUD PÚBLICOS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const CENTROS_SALUD_PUBLICOS = [

{
  id:          19,
  categoria:    "centro_salud",
  nombre:       "Centro de Salud Simeón Rivas",
  direccion:    "Barrio Simeón Rivas, Granada",
  telefono:     "2552-1000",
  emergencia:   false,
  lat:          11.9380,
  lng:          -85.9590,
  horario:      "Lun-Vie 8am-4pm",
  servicios:    ["consulta_general", "vacunacion", "control_nino_sano", "planificacion_familiar", "control_prenatal"],
  disponible:   true,
  verificado:   true
},
{
  id:          20,
  categoria:    "centro_salud",
  nombre:       "Centro de Salud El Calvario",
  direccion:    "Barrio El Calvario, Granada",
  telefono:     "2552-1100",
  emergencia:   false,
  lat:          11.9355,
  lng:          -85.9595,
  horario:      "Lun-Vie 8am-4pm",
  servicios:    ["consulta_general", "vacunacion", "curaciones", "control_cronico"],
  disponible:   true,
  verificado:   true
},
{
  id:          21,
  categoria:    "centro_salud",
  nombre:       "Centro de Salud Guadalupe",
  direccion:    "Barrio Guadalupe, Granada",
  telefono:     "2552-1150",
  emergencia:   false,
  lat:          11.9375,
  lng:          -85.9535,
  horario:      "Lun-Vie 8am-4pm",
  servicios:    ["consulta_general", "vacunacion", "salud_materno_infantil"],
  disponible:   true,
  verificado:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  💊 MEDICAMENTOS COMUNES - NICARAGUA
// ═══════════════════════════════════════════════════════════════
const MEDICAMENTOS = [

{
  id:                    1,
  nombre_es:             "Paracetamol",
  nombre_en:             "Acetaminophen",
  nombres_comerciales:   ["Tempra", "Panadol", "Tylenol", "Acetaminofén MK"],
  categoria:             "Analgésico/Antipirético",
  uso_principal:         "Dolor leve a moderado, fiebre, dolor de cabeza",
  dosis_adulto:          "500-1000mg cada 6-8 horas (máximo 4g por día)",
  dosis_nino:            "10-15mg/kg cada 6 horas (consultar médico)",
  contraindicaciones:    "Enfermedad hepática grave, alergia al paracetamol",
  efectos_secundarios:   "Raro: daño hepático con sobredosis",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "15-30 C$ (tabletas)"
},
{
  id:                    2,
  nombre_es:             "Ibuprofeno",
  nombre_en:             "Ibuprofen",
  nombres_comerciales:   ["Advil", "Motrin", "Nurofen", "Ibuprofeno MK"],
  categoria:             "Antiinflamatorio No Esteroideo",
  uso_principal:         "Dolor, inflamación, fiebre, dolor muscular",
  dosis_adulto:          "400-600mg cada 6-8 horas (máximo 2.4g por día)",
  dosis_nino:            "5-10mg/kg cada 6-8 horas (consultar médico)",
  contraindicaciones:    "Úlceras gástricas, enfermedad renal, embarazo 3er trimestre",
  efectos_secundarios:   "Malestar estomacal, mareos",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "20-40 C$ (tabletas)"
},
{
  id:                    3,
  nombre_es:             "Amoxicilina",
  nombre_en:             "Amoxicillin",
  nombres_comerciales:   ["Amoxal", "Trimox", "Novamox", "Amoxicilina MK"],
  categoria:             "Antibiótico",
  uso_principal:         "Infecciones bacterianas (garganta, oído, urinarias)",
  dosis_adulto:          "500mg cada 8 horas o 875mg cada 12 horas",
  dosis_nino:            "20-40mg/kg/día dividido en 3 dosis (consultar médico)",
  contraindicaciones:    "Alergia a penicilinas, mononucleosis",
  efectos_secundarios:   "Diarrea, náuseas, erupción cutánea",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "50-100 C$ (caja)"
},
{
  id:                    4,
  nombre_es:             "Omeprazol",
  nombre_en:             "Omeprazole",
  nombres_comerciales:   ["Losec", "Prilosec", "Omepral", "Omeprazol MK"],
  categoria:             "Inhibidor de Bomba de Protones",
  uso_principal:         "Acidez, reflujo gastroesofágico, úlceras gástricas",
  dosis_adulto:          "20-40mg una vez al día en ayunas",
  dosis_nino:            "Consultar médico",
  contraindicaciones:    "Alergia al omeprazol, interacción con algunos medicamentos",
  efectos_secundarios:   "Dolor de cabeza, diarrea, náuseas",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "30-60 C$ (caja)"
},
{
  id:                    5,
  nombre_es:             "Loratadina",
  nombre_en:             "Loratadine",
  nombres_comerciales:   ["Claritin", "Loratamed", "Loratadina MK"],
  categoria:             "Antihistamínico",
  uso_principal:         "Alergias, rinitis alérgica, urticaria, picazón",
  dosis_adulto:          "10mg una vez al día",
  dosis_nino:            "5mg una vez al día (2-12 años)",
  contraindicaciones:    "Alergia a la loratadina, enfermedad hepática grave",
  efectos_secundarios:   "Somnolencia leve, boca seca",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "25-50 C$ (caja)"
},
{
  id:                    6,
  nombre_es:             "Metformina",
  nombre_en:             "Metformin",
  nombres_comerciales:   ["Glucophage", "Diabex", "Metformina MK"],
  categoria:             "Antidiabético Oral",
  uso_principal:         "Diabetes tipo 2, control de azúcar en sangre",
  dosis_adulto:          "500-850mg 2-3 veces al día con comidas",
  dosis_nino:            "Consultar médico (mayores de 10 años)",
  contraindicaciones:    "Insuficiencia renal, acidosis metabólica",
  efectos_secundarios:   "Náuseas, diarrea, malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "40-80 C$ (caja)"
},
{
  id:                    7,
  nombre_es:             "Losartán",
  nombre_en:             "Losartan",
  nombres_comerciales:   ["Cozaar", "Losartán MK", "Losartán Potásico"],
  categoria:             "Antihipertensivo",
  uso_principal:         "Presión arterial alta, protección renal en diabéticos",
  dosis_adulto:          "50-100mg una vez al día",
  dosis_nino:            "Consultar médico",
  contraindicaciones:    "Embarazo, alergia al losartán",
  efectos_secundarios:   "Mareos, fatiga, hipotensión",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "50-100 C$ (caja)"
},
{
  id:                    8,
  nombre_es:             "Diclofenaco",
  nombre_en:             "Diclofenac",
  nombres_comerciales:   ["Voltaren", "Cataflam", "Diclofenaco MK"],
  categoria:             "Antiinflamatorio No Esteroideo",
  uso_principal:         "Dolor muscular, artritis, inflamación, cólicos",
  dosis_adulto:          "50mg 2-3 veces al día",
  dosis_nino:            "Consultar médico",
  contraindicaciones:    "Úlceras, enfermedad cardiovascular, embarazo",
  efectos_secundarios:   "Malestar estomacal, mareos, dolor abdominal",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "25-50 C$ (caja)"
},
{
  id:                    9,
  nombre_es:             "Azitromicina",
  nombre_en:             "Azithromycin",
  nombres_comerciales:   ["Azitro", "Zithromax", "Azitromicina MK"],
  categoria:             "Antibiótico",
  uso_principal:         "Infecciones respiratorias, de piel, transmisión sexual",
  dosis_adulto:          "500mg día 1, luego 250mg días 2-5",
  dosis_nino:            "Consultar médico",
  contraindicaciones:    "Alergia a macrólidos, enfermedad hepática",
  efectos_secundarios:   "Náuseas, diarrea, dolor abdominal",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "80-150 C$ (caja)"
},
{
  id:                    10,
  nombre_es:             "Cetirizina",
  nombre_en:             "Cetirizine",
  nombres_comerciales:   ["Zyrtec", "Cetirizina MK", "Alegrin"],
  categoria:             "Antihistamínico",
  uso_principal:         "Alergias, rinitis, urticaria, picazón",
  dosis_adulto:          "10mg una vez al día",
  dosis_nino:            "5mg una vez al día (6-12 años)",
  contraindicaciones:    "Alergia a la cetirizina, enfermedad renal grave",
  efectos_secundarios:   "Somnolencia, boca seca, fatiga",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "30-60 C$ (caja)"
},
{
  id:                    11,
  nombre_es:             "Naproxeno",
  nombre_en:             "Naproxen",
  nombres_comerciales:   ["Naproxyn", "Flanax", "Naproxeno MK"],
  categoria:             "Antiinflamatorio No Esteroideo",
  uso_principal:         "Dolor menstrual, dolor muscular, artritis, migraña",
  dosis_adulto:          "250-500mg cada 12 horas",
  dosis_nino:            "Consultar médico (mayores de 12 años)",
  contraindicaciones:    "Úlceras, enfermedad renal, embarazo",
  efectos_secundarios:   "Malestar estomacal, acidez, mareos",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "30-60 C$ (caja)"
},
{
  id:                    12,
  nombre_es:             "Prednisona",
  nombre_en:             "Prednisone",
  nombres_comerciales:   ["Deltasone", "Prednisona MK"],
  categoria:             "Corticoesteroide",
  uso_principal:         "Inflamación severa, alergias graves, asma",
  dosis_adulto:          "5-60mg por día (según condición)",
  dosis_nino:            "Consultar médico",
  contraindicaciones:    "Infecciones activas, diabetes no controlada",
  efectos_secundarios:   "Aumento de apetito, insomnio, retención de líquidos",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "40-80 C$ (caja)"
},
{
  id:                    13,
  nombre_es:             "Amlodipino",
  nombre_en:             "Amlodipine",
  nombres_comerciales:   ["Norvasc", "Amlodipino MK"],
  categoria:             "Antihipertensivo",
  uso_principal:         "Presión arterial alta, dolor de pecho (angina)",
  dosis_adulto:          "5-10mg una vez al día",
  dosis_nino:            "Consultar médico",
  contraindicaciones:    "Presión arterial muy baja, enfermedad hepática",
  efectos_secundarios:   "Hinchazón de tobillos, mareos, fatiga",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "50-100 C$ (caja)"
},
{
  id:                    14,
  nombre_es:             "Aspirina",
  nombre_en:             "Aspirin",
  nombres_comerciales:   ["Aspirina Bayer", "Aspirina MK"],
  categoria:             "Analgésico/Antiinflamatorio",
  uso_principal:         "Dolor leve, fiebre, prevención de coágulos",
  dosis_adulto:          "325-650mg cada 4-6 horas (dolor) | 81mg diario (corazón)",
  dosis_nino:            "No recomendado en niños (riesgo de Síndrome de Reye)",
  contraindicaciones:    "Úlceras, trastornos de coagulación, niños con virus",
  efectos_secundarios:   "Malestar estomacal, sangrado fácil",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "20-40 C$ (caja)"
},
{
  id:                    15,
  nombre_es:             "Dipirona",
  nombre_en:             "Metamizole",
  nombres_comerciales:   ["Novalgina", "Dipirona MK", "Nolotil"],
  categoria:             "Analgésico/Antipirético",
  uso_principal:         "Dolor moderado a severo, fiebre alta",
  dosis_adulto:          "500-1000mg cada 6-8 horas",
  dosis_nino:            "Consultar médico",
  contraindicaciones:    "Alergia a dipirona, trastornos sanguíneos",
  efectos_secundarios:   "Raro: agranulocitosis, mareos",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "25-50 C$ (caja)"
}

];

// ═══════════════════════════════════════════════════════════════
//  🚑 EMERGENCIAS - NICARAGUA
// ═══════════════════════════════════════════════════════════════
const EMERGENCIAS = [

{
  nombre:       "Emergencias Nacionales",
  numero:       "133",
  descripcion:  "Ambulancias, bomberos, policía (gratuito desde cualquier teléfono)",
  disponible:   true
},
{
  nombre:       "Bomberos",
  numero:       "115",
  descripcion:  "Cuerpo de Bomberos de Nicaragua",
  disponible:   true
},
{
  nombre:       "Policía Nacional",
  numero:       "118",
  descripcion:  "Emergencias policiales",
  disponible:   true
},
{
  nombre:       "Cruz Roja Nicaragüense - Granada",
  numero:       "2552-5555",
  descripcion:  "Ambulancias y primeros auxilios",
  disponible:   true
},
{
  nombre:       "Hospital Virgen de la Asistencia (Urgencias)",
  numero:       "2552-2600",
  descripcion:  "Hospital público central de Granada - 24 horas",
  disponible:   true
},
{
  nombre:       "Hospital Alemán (Urgencias)",
  numero:       "2552-3000",
  descripcion:  "Hospital privado con urgencias 24 horas",
  disponible:   true
},
{
  nombre:       "Hospital Carlos Roberto Huembes (Urgencias)",
  numero:       "2552-5100",
  descripcion:  "Hospital con urgencias 24 horas",
  disponible:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  📍 BARRIOS DE GRANADA (para búsqueda)
// ═══════════════════════════════════════════════════════════════
const BARRIOS_GRANADA = [
  "Centro",
  "Parque Central",
  "Barrio San Antonio",
  "Barrio El Calvario",
  "Barrio Simeón Rivas",
  "Barrio La Antigua",
  "Barrio Guadalupe",
  "Calle La Calzada",
  "Mercado Municipal",
  "Lago de Nicaragua",
  "Carretera a Masaya",
  "Calle Atravesada"
];

// ═══════════════════════════════════════════════════════════════
//  FUNCIONES DE UTILIDAD PARA LA BASE DE DATOS
// ═══════════════════════════════════════════════════════════════

// Obtener todos los centros de salud combinados
function obtenerTodosLosCentros() {
  return [
    ...HOSPITALES,
    ...CLINICAS,
    ...FARMACIAS,
    ...LABORATORIOS,
    ...CENTROS_SALUD_PUBLICOS
  ].filter(c => c.disponible === true);
}

// Buscar centros por categoría
function buscarCentrosPorCategoria(categoria) {
  return obtenerTodosLosCentros().filter(c => c.categoria === categoria);
}

// Buscar centros cercanos por coordenadas (simple)
function buscarCentrosCercanos(lat, lng, radioMetros = 2000) {
  const centros = obtenerTodosLosCentros();
  return centros.map(centro => {
    const distancia = calcularDistancia(lat, lng, centro.lat, centro.lng);
    return { ...centro, distancia };
  })
  .filter(c => c.distancia <= radioMetros)
  .sort((a, b) => a.distancia - b.distancia);
}

// Calcular distancia entre dos puntos (fórmula de Haversine)
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// Buscar medicamento por nombre
function buscarMedicamento(nombre) {
  const lower = nombre.toLowerCase();
  return MEDICAMENTOS.find(m => 
    m.nombre_es.toLowerCase().includes(lower) ||
    m.nombre_en.toLowerCase().includes(lower) ||
    m.nombres_comerciales.some(n => n.toLowerCase().includes(lower))
  );
}

// Obtener todos los medicamentos
function obtenerTodosLosMedicamentos() {
  return MEDICAMENTOS;
}

// Buscar emergencias
function obtenerEmergencias() {
  return EMERGENCIAS.filter(e => e.disponible === true);
}

// ═══════════════════════════════════════════════════════════════
//  ✏️  AGREGA TUS DATOS AQUÍ
//  Copia los bloques de arriba y personalízalos
// ═══════════════════════════════════════════════════════════════

/**
📌 CONSEJOS PARA MANTENER LA BASE DE DATOS:

1. VERIFICA LOS DATOS:
   - Llama a los centros antes de agregarlos
   - Confirma horarios y números de teléfono
   - Actualiza cuando haya cambios

2. COORDENADAS GPS:
   - Usa Google Maps para obtener lat/lng
   - Click derecho en el mapa → copiar coordenadas

3. PRIVACIDAD:
   - No incluyas datos personales de pacientes
   - Solo información pública de centros

4. ACTUALIZACIÓN:
   - Revisa la base de datos cada 3 meses
   - Pide a usuarios que reporten cambios

5. AGREGAR NUEVOS CENTROS:
   - Copia un bloque existente
   - Cambia el ID (debe ser único)
   - Actualiza todos los campos

═══════════════════════════════════════════════════════════════
*/

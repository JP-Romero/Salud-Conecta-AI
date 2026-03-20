/**
═══════════════════════════════════════════════════════════════
BASE DE DATOS DE SALUD — Salud-Conecta AI (Granada, Nicaragua)
═══════════════════════════════════════════════════════════════
📌 CÓMO AGREGAR UN NUEVO CENTRO DE SALUD:
1. Copia uno de los bloques { } de abajo
2. Pégalo antes del corchete ] final
3. Asegúrate de separarlo con una coma del anterior
4. Cambia los datos (id, nombre, telefono, etc.)

📌 CAMPOS DISPONIBLES:
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
═══════════════════════════════════════════════════════════════
*/

// ═══════════════════════════════════════════════════════════════
//  🏥 CENTROS DE SALUD - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const CENTROS_SALUD = [

// ─────────────────────────────
//  HOSPITALES
// ─────────────────────────────
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
  servicios:    ["urgencias", "consulta", "hospitalizacion", "laboratorio", "rayos_x"],
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
  servicios:    ["urgencias", "consulta", "cirugia", "laboratorio", "farmacia"],
  disponible:   true,
  verificado:   true
},

// ─────────────────────────────
//  CLÍNICAS
// ─────────────────────────────
{
  id:          3,
  categoria:    "clinica",
  nombre:       "Centro Médico Sandoval",
  direccion:    "Calle La Calzada, Granada",
  telefono:     "2552-4500",
  emergencia:   false,
  lat:          11.9360,
  lng:          -85.9550,
  horario:      "Lun-Vie 8am-6pm, Sab 8am-12pm",
  servicios:    ["consulta", "laboratorio", "ultrasonido"],
  disponible:   true,
  verificado:   true
},
{
  id:          4,
  categoria:    "clinica",
  nombre:       "Clínica Familiar",
  direccion:    "Barrio El Calvario, Granada",
  telefono:     "2552-1200",
  emergencia:   false,
  lat:          11.9340,
  lng:          -85.9580,
  horario:      "Lun-Vie 7am-7pm",
  servicios:    ["consulta", "vacunacion", "curaciones"],
  disponible:   true,
  verificado:   true
},

// ─────────────────────────────
//  FARMACIAS
// ─────────────────────────────
{
  id:          5,
  categoria:    "farmacia",
  nombre:       "Farmacia Del Pueblo",
  direccion:    "Parque Central, Granada",
  telefono:     "2552-5000",
  emergencia:   true,
  lat:          11.9340,
  lng:          -85.9565,
  horario:      "24 horas",
  servicios:    ["medicamentos", "consultorio_farmaceutico"],
  disponible:   true,
  verificado:   true
},
{
  id:          6,
  categoria:    "farmacia",
  nombre:       "Farmacia San Nicolás",
  direccion:    "Calle La Calzada, Granada",
  telefono:     "2552-6000",
  emergencia:   false,
  lat:          11.9355,
  lng:          -85.9545,
  horario:      "7am-10pm",
  servicios:    ["medicamentos", "productos_naturales"],
  disponible:   true,
  verificado:   true
},
{
  id:          7,
  categoria:    "farmacia",
  nombre:       "Farmacia Cruz Verde",
  direccion:    "Centro Comercial, Granada",
  telefono:     "2552-7000",
  emergencia:   false,
  lat:          11.9330,
  lng:          -85.9555,
  horario:      "8am-9pm",
  servicios:    ["medicamentos", "cosmeticos", "vitaminas"],
  disponible:   true,
  verificado:   true
},
{
  id:          8,
  categoria:    "farmacia",
  nombre:       "Farmacia Guadalajara",
  direccion:    "Barrio San Antonio, Granada",
  telefono:     "2552-8000",
  emergencia:   false,
  lat:          11.9325,
  lng:          -85.9535,
  horario:      "7am-9pm",
  servicios:    ["medicamentos", "consultorio_farmaceutico"],
  disponible:   true,
  verificado:   true
},

// ─────────────────────────────
//  LABORATORIOS
// ─────────────────────────────
{
  id:          9,
  categoria:    "laboratorio",
  nombre:       "Laboratorio Clínico Central",
  direccion:    "Calle Atravesada, Granada",
  telefono:     "2552-9000",
  emergencia:   false,
  lat:          11.9345,
  lng:          -85.9560,
  horario:      "Lun-Vie 7am-5pm, Sab 7am-12pm",
  servicios:    ["analisis_sangre", "orina", "rayos_x", "ultrasonido"],
  disponible:   true,
  verificado:   true
},

// ─────────────────────────────
//  CENTROS DE SALUD PÚBLICOS
// ─────────────────────────────
{
  id:          10,
  categoria:    "centro_salud",
  nombre:       "Centro de Salud Simeón Rivas",
  direccion:    "Barrio Simeón Rivas, Granada",
  telefono:     "2552-1000",
  emergencia:   false,
  lat:          11.9380,
  lng:          -85.9590,
  horario:      "Lun-Vie 8am-4pm",
  servicios:    ["consulta_general", "vacunacion", "control_nino_sano", "planificacion_familiar"],
  disponible:   true,
  verificado:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  💊 MEDICAMENTOS COMUNES - NICARAGUA
// ═══════════════════════════════════════════════════════════════
const MEDICAMENTOS = [

{
  id:              1,
  nombre_es:       "Paracetamol",
  nombre_en:       "Acetaminophen",
  nombres_comerciales: ["Tempra", "Panadol", "Tylenol"],
  categoria:       "Analgésico/Antipirético",
  uso_principal:   "Dolor leve a moderado, fiebre",
  dosis_adulto:    "500-1000mg cada 6-8 horas (máx 4g/día)",
  dosis_nino:      "10-15mg/kg cada 6 horas (consultar médico)",
  contraindicaciones: "Enfermedad hepática grave, alergia al paracetamol",
  disponible_nicaragua: true,
  requiere_receta: false
},
{
  id:              2,
  nombre_es:       "Ibuprofeno",
  nombre_en:       "Ibuprofen",
  nombres_comerciales: ["Advil", "Motrin", "Nurofen"],
  categoria:       "Antiinflamatorio No Esteroideo",
  uso_principal:   "Dolor, inflamación, fiebre",
  dosis_adulto:    "400-600mg cada 6-8 horas (máx 2.4g/día)",
  dosis_nino:      "5-10mg/kg cada 6-8 horas (consultar médico)",
  contraindicaciones: "Úlceras gástricas, enfermedad renal, embarazo 3er trimestre",
  disponible_nicaragua: true,
  requiere_receta: false
},
{
  id:              3,
  nombre_es:       "Amoxicilina",
  nombre_en:       "Amoxicillin",
  nombres_comerciales: ["Amoxal", "Trimox", "Novamox"],
  categoria:       "Antibiótico",
  uso_principal:   "Infecciones bacterianas",
  dosis_adulto:    "500mg cada 8 horas o 875mg cada 12 horas",
  dosis_nino:      "20-40mg/kg/día dividido en 3 dosis (consultar médico)",
  contraindicaciones: "Alergia a penicilinas, mononucleosis",
  disponible_nicaragua: true,
  requiere_receta: true
},
{
  id:              4,
  nombre_es:       "Omeprazol",
  nombre_en:       "Omeprazole",
  nombres_comerciales: ["Losec", "Prilosec", "Omepral"],
  categoria:       "Inhibidor de Bomba de Protones",
  uso_principal:   "Acidez, reflujo, úlceras gástricas",
  dosis_adulto:    "20-40mg una vez al día en ayunas",
  dosis_nino:      "Consultar médico",
  contraindicaciones: "Alergia al omeprazol, interacción con algunos medicamentos",
  disponible_nicaragua: true,
  requiere_receta: false
},
{
  id:              5,
  nombre_es:       "Loratadina",
  nombre_en:       "Loratadine",
  nombres_comerciales: ["Claritin", "Loratamed"],
  categoria:       "Antihistamínico",
  uso_principal:   "Alergias, rinitis, urticaria",
  dosis_adulto:    "10mg una vez al día",
  dosis_nino:      "5mg una vez al día (2-12 años)",
  contraindicaciones: "Alergia a la loratadina, enfermedad hepática grave",
  disponible_nicaragua: true,
  requiere_receta: false
},
{
  id:              6,
  nombre_es:       "Metformina",
  nombre_en:       "Metformin",
  nombres_comerciales: ["Glucophage", "Diabex"],
  categoria:       "Antidiabético Oral",
  uso_principal:   "Diabetes tipo 2",
  dosis_adulto:    "500-850mg 2-3 veces al día con comidas",
  dosis_nino:      "Consultar médico (mayores de 10 años)",
  contraindicaciones: "Insuficiencia renal, acidosis metabólica",
  disponible_nicaragua: true,
  requiere_receta: true
},
{
  id:              7,
  nombre_es:       "Losartán",
  nombre_en:       "Losartan",
  nombres_comerciales: ["Cozaar", "Losartán MK"],
  categoria:       "Antihipertensivo",
  uso_principal:   "Presión arterial alta",
  dosis_adulto:    "50-100mg una vez al día",
  dosis_nino:      "Consultar médico",
  contraindicaciones: "Embarazo, alergia al losartán",
  disponible_nicaragua: true,
  requiere_receta: true
},
{
  id:              8,
  nombre_es:       "Diclofenaco",
  nombre_en:       "Diclofenac",
  nombres_comerciales: ["Voltaren", "Cataflam"],
  categoria:       "Antiinflamatorio No Esteroideo",
  uso_principal:   "Dolor muscular, artritis, inflamación",
  dosis_adulto:    "50mg 2-3 veces al día",
  dosis_nino:      "Consultar médico",
  contraindicaciones: "Úlceras, enfermedad cardiovascular, embarazo",
  disponible_nicaragua: true,
  requiere_receta: false
}

];

// ═══════════════════════════════════════════════════════════════
//  🚑 EMERGENCIAS - NICARAGUA
// ═══════════════════════════════════════════════════════════════
const EMERGENCIAS = [
  {
    nombre:       "Emergencias Nacionales",
    numero:       "133",
    descripcion:  "Ambulancias, bomberos, policía (gratuito)",
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
    nombre:       "Cruz Roja Nicaragüense",
    numero:       "2552-5555",
    descripcion:  "Ambulancias y primeros auxilios",
    disponible:   true
  },
  {
    nombre:       "Hospital Virgen de la Asistencia (Urgencias)",
    numero:       "2552-2600",
    descripcion:  "Hospital público central de Granada",
    disponible:   true
  },
  {
    nombre:       "Hospital Alemán (Urgencias)",
    numero:       "2552-3000",
    descripcion:  "Hospital privado con urgencias 24h",
    disponible:   true
  }
];

// ═══════════════════════════════════════════════════════════════
//  📍 BARRIOS DE GRANADA (para búsqueda)
// ═══════════════════════════════════════════════════════════════
const BARRIOS_GRANADA = [
  "Centro",
  "Barrio San Antonio",
  "Barrio El Calvario",
  "Barrio Simeón Rivas",
  "Barrio La Antigua",
  "Barrio Guadalupe",
  "Calle La Calzada",
  "Parque Central",
  "Mercado Municipal",
  "Lago de Nicaragua"
];

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

═══════════════════════════════════════════════════════════════
*/
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
barrio      → Barrio específico de Granada
notas       → Notas adicionales sobre el centro
seguros     → Array de seguros médicos aceptados ["INSS", "MAPFRE", "UNO", etc.]
capilla     → Información de capilla/misas (solo hospitales)

📌 CÓMO AGREGAR UN MEDICAMENTO:
Usa la sección de MEDICAMENTOS abajo. Incluye nombre en español
y su equivalente en inglés (para openFDA si quieres consultar).

📌 EMERGENCIAS:
Mantén actualizados los números de emergencia nacionales.

📌 ÚLTIMA ACTUALIZACIÓN:
Edita la fecha cuando agregues o modifiques datos.

📌 FUENTES DE VERIFICACIÓN:
- Llamadas telefónicas a los centros
- Visitas presenciales
- Página web del MINSA (Ministerio de Salud)
- Reportes de usuarios de la app

═══════════════════════════════════════════════════════════════
*/

const VERSION_BASE_DATOS = "3.0.0";
const ULTIMA_ACTUALIZACION = "2025-01-15";
const TOTAL_CENTROS = 35;
const TOTAL_MEDICAMENTOS = 30;

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
  servicios:    ["urgencias", "consulta", "hospitalizacion", "laboratorio", "rayos_x", "cirugia", "pediatria", "ginecologia", "maternidad"],
  disponible:   true,
  verificado:   true,
  barrio:       "Centro",
  notas:        "Hospital público principal de Granada. Urgencias 24h gratuitas.",
  seguros:      ["INSS", "MINSA", "Todos los seguros públicos"],
  capilla:      {
    nombre:     "Capilla Nuestra Señora de la Asunción",
    ubicacion:  "Segundo piso, ala este del hospital",
    misas:      [
      { dia: "Domingo", hora: "7:00 AM" },
      { dia: "Miércoles", hora: "3:00 PM" },
      { dia: "Viernes", hora: "3:00 PM" }
    ],
    capellania: "Disponible 24h para pacientes y familiares",
    telefono_capilla: "2552-2650"
  }
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
  servicios:    ["urgencias", "consulta", "cirugia", "laboratorio", "farmacia", "rayos_x", "ultrasonido", "tomografia"],
  disponible:   true,
  verificado:   true,
  barrio:       "San Antonio",
  notas:        "Hospital privado con seguros médicos. Urgencias 24h.",
  seguros:      ["INSS", "MAPFRE", "Seguros UNO", "ANC", "Banpro Seguros", "Particular"],
  capilla:      {
    nombre:     "Capilla San Juan de Dios",
    ubicacion:  "Primer piso, cerca de recepción",
    misas:      [
      { dia: "Domingo", hora: "8:00 AM" },
      { dia: "Jueves", hora: "4:00 PM" }
    ],
    capellania: "Disponible Lun-Vie 8am-5pm",
    telefono_capilla: "2552-3050"
  }
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
  servicios:    ["urgencias", "consulta", "hospitalizacion", "laboratorio", "maternidad", "pediatria"],
  disponible:   true,
  verificado:   true,
  barrio:       "Carretera a Masaya",
  notas:        "Hospital regional con especialidades.",
  seguros:      ["INSS", "MINSA", "Todos los seguros públicos"],
  capilla:      {
    nombre:     "Capilla Divino Niño Jesús",
    ubicacion:  "Área de hospitalización, primer piso",
    misas:      [
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
  verificado:   true,
  barrio:       "La Calzada",
  notas:        "Clínica privada con especialistas.",
  seguros:      ["MAPFRE", "Seguros UNO", "ANC", "Particular"]
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
  verificado:   true,
  barrio:       "El Calvario",
  notas:        "Atención familiar y vacunación.",
  seguros:      ["INSS", "MINSA", "Particular"]
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
  verificado:   true,
  barrio:       "Centro",
  notas:        "Servicios dentales completos.",
  seguros:      ["MAPFRE", "Dental Care", "Particular"]
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
  verificado:   true,
  barrio:       "Guadalupe",
  notas:        "Especializada en salud femenina.",
  seguros:      ["INSS", "MAPFRE", "Seguros UNO", "Particular"]
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
  verificado:   true,
  barrio:       "Centro",
  notas:        "Atención general con farmacia.",
  seguros:      ["Todos los seguros", "Particular"]
},
{
  id:          9,
  categoria:    "clinica",
  nombre:       "Clínica Pediátrica Dr. Martínez",
  direccion:    "Barrio Simeón Rivas, Granada",
  telefono:     "2552-9600",
  emergencia:   false,
  lat:          11.9385,
  lng:          -85.9595,
  horario:      "Lun-Vie 8am-5pm, Sab 8am-12pm",
  servicios:    ["pediatria", "vacunacion", "control_nino_sano", "emergencias_pediatricas"],
  disponible:   true,
  verificado:   true,
  barrio:       "Simeón Rivas",
  notas:        "Especializada en niños. Vacunación completa.",
  seguros:      ["INSS", "MAPFRE", "Seguros UNO", "Particular"]
},
{
  id:          10,
  categoria:    "clinica",
  nombre:       "Clínica de Especialidades Médicas",
  direccion:    "Barrio La Antigua, Granada",
  telefono:     "2552-9700",
  emergencia:   false,
  lat:          11.9355,
  lng:          -85.9600,
  horario:      "Lun-Vie 8am-6pm",
  servicios:    ["cardiologia", "endocrinologia", "neurologia", "consulta_general"],
  disponible:   true,
  verificado:   true,
  barrio:       "La Antigua",
  notas:        "Especialistas en enfermedades crónicas.",
  seguros:      ["INSS", "MAPFRE", "Seguros UNO", "ANC", "Particular"]
},
{
  id:          11,
  categoria:    "clinica",
  nombre:       "Centro Médico Lago de Nicaragua",
  direccion:    "Pista de Jardines, Granada",
  telefono:     "2552-9800",
  emergencia:   false,
  lat:          11.9310,
  lng:          -85.9520,
  horario:      "Lun-Sab 8am-7pm",
  servicios:    ["consulta", "laboratorio", "rayos_x", "farmacia"],
  disponible:   true,
  verificado:   true,
  barrio:       "Jardines",
  notas:        "Atención integral con farmacia.",
  seguros:      ["Todos los seguros", "Particular"]
},
{
  id:          12,
  categoria:    "clinica",
  nombre:       "Clínica Materno-Infantil",
  direccion:    "Barrio Guadalupe, Granada",
  telefono:     "2552-9850",
  emergencia:   false,
  lat:          11.9378,
  lng:          -85.9538,
  horario:      "Lun-Vie 8am-6pm, Sab 8am-1pm",
  servicios:    ["control_prenatal", "parto", "pediatria", "vacunacion", "ultrasonido_obstetrico"],
  disponible:   true,
  verificado:   true,
  barrio:       "Guadalupe",
  notas:        "Especializada en embarazo y niños. Atención humanizada.",
  seguros:      ["INSS", "MINSA", "MAPFRE", "Particular"]
},
{
  id:          13,
  categoria:    "clinica",
  nombre:       "Clínica del Adulto Mayor",
  direccion:    "Barrio San Antonio, Granada",
  telefono:     "2552-9900",
  emergencia:   false,
  lat:          11.9328,
  lng:          -85.9548,
  horario:      "Lun-Vie 8am-5pm",
  servicios:    ["geriatria", "control_cronico", "fisioterapia", "consulta_general"],
  disponible:   true,
  verificado:   true,
  barrio:       "San Antonio",
  notas:        "Especializada en adultos mayores. Descuentos para tercera edad.",
  seguros:      ["INSS", "MINSA", "Particular"]
}

];

// ═══════════════════════════════════════════════════════════════
//  💊 FARMACIAS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const FARMACIAS = [

{
  id:          14,
  categoria:    "farmacia",
  nombre:       "Farmacia Del Pueblo",
  direccion:    "Parque Central, Granada",
  telefono:     "2552-5000",
  emergencia:   true,
  lat:          11.9340,
  lng:          -85.9565,
  horario:      "24 horas",
  servicios:    ["medicamentos", "consultorio_farmaceutico", "toma_presion", "medicion_glucosa"],
  disponible:   true,
  verificado:   true,
  barrio:       "Centro",
  notas:        "Farmacia 24 horas. Precios económicos."
},
{
  id:          15,
  categoria:    "farmacia",
  nombre:       "Farmacia San Nicolás",
  direccion:    "Calle La Calzada, Granada",
  telefono:     "2552-6000",
  emergencia:   false,
  lat:          11.9355,
  lng:          -85.9545,
  horario:      "7am-10pm",
  servicios:    ["medicamentos", "productos_naturales", "cosmeticos", "vitaminas"],
  disponible:   true,
  verificado:   true,
  barrio:       "La Calzada",
  notas:        "Amplia variedad de productos naturales."
},
{
  id:          16,
  categoria:    "farmacia",
  nombre:       "Farmacia Cruz Verde",
  direccion:    "Centro Comercial, Granada",
  telefono:     "2552-7000",
  emergencia:   false,
  lat:          11.9330,
  lng:          -85.9555,
  horario:      "8am-9pm",
  servicios:    ["medicamentos", "cosmeticos", "vitaminas", "cuidado_bebe", "leche_formula"],
  disponible:   true,
  verificado:   true,
  barrio:       "Centro",
  notas:        "Especializada en productos para bebés."
},
{
  id:          17,
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
  verificado:   true,
  barrio:       "San Antonio",
  notas:        "Servicio de consulta farmacéutica gratis."
},
{
  id:          18,
  categoria:    "farmacia",
  nombre:       "Farmacia Elegua",
  direccion:    "Carretera a Masaya, Granada",
  telefono:     "2552-9100",
  emergencia:   false,
  lat:          11.9290,
  lng:          -85.9490,
  horario:      "8am-8pm",
  servicios:    ["medicamentos", "productos_naturales", "homeopatia"],
  disponible:   true,
  verificado:   true,
  barrio:       "Carretera a Masaya",
  notas:        "Productos homeopáticos y naturales."
},
{
  id:          19,
  categoria:    "farmacia",
  nombre:       "Farmacia Nicaragua",
  direccion:    "Mercado Municipal, Granada",
  telefono:     "2552-9200",
  emergencia:   false,
  lat:          11.9365,
  lng:          -85.9575,
  horario:      "7am-7pm",
  servicios:    ["medicamentos", "precios_economicos", "genericos"],
  disponible:   true,
  verificado:   true,
  barrio:       "Mercado Municipal",
  notas:        "Precios más económicos de la ciudad."
},
{
  id:          20,
  categoria:    "farmacia",
  nombre:       "Farmacia La Unión",
  direccion:    "Barrio Simeón Rivas, Granada",
  telefono:     "2552-9300",
  emergencia:   false,
  lat:          11.9380,
  lng:          -85.9590,
  horario:      "8am-8pm",
  servicios:    ["medicamentos", "consultorio_farmaceutico", "entrega_domicilio"],
  disponible:   true,
  verificado:   true,
  barrio:       "Simeón Rivas",
  notas:        "Servicio de entrega a domicilio."
},
{
  id:          21,
  categoria:    "farmacia",
  nombre:       "Farmacia Barrio Guadalupe",
  direccion:    "Barrio Guadalupe, Granada",
  telefono:     "2552-9350",
  emergencia:   false,
  lat:          11.9375,
  lng:          -85.9530,
  horario:      "7am-9pm",
  servicios:    ["medicamentos", "toma_presion", "medicion_glucosa"],
  disponible:   true,
  verificado:   true,
  barrio:       "Guadalupe",
  notas:        "Chequeos gratuitos de presión y glucosa."
},
{
  id:          22,
  categoria:    "farmacia",
  nombre:       "Farmacia Barrio El Calvario",
  direccion:    "Barrio El Calvario, Granada",
  telefono:     "2552-9400",
  emergencia:   false,
  lat:          11.9350,
  lng:          -85.9590,
  horario:      "8am-8pm",
  servicios:    ["medicamentos", "genericos", "consultorio_farmaceutico"],
  disponible:   true,
  verificado:   true,
  barrio:       "El Calvario",
  notas:        "Medicamentos genéricos económicos."
},
{
  id:          23,
  categoria:    "farmacia",
  nombre:       "Farmacia del Hospital Virgen",
  direccion:    "Dentro del Hospital Virgen de la Asistencia, Centro",
  telefono:     "2552-2650",
  emergencia:   true,
  lat:          11.9352,
  lng:          -85.9572,
  horario:      "24 horas",
  servicios:    ["medicamentos_hospitalarios", "medicamentos_especializados", "quimioterapia"],
  disponible:   true,
  verificado:   true,
  barrio:       "Centro",
  notas:        "Farmacia hospitalaria. Medicamentos especializados."
}

];

// ═══════════════════════════════════════════════════════════════
//  🔬 LABORATORIOS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const LABORATORIOS = [

{
  id:          24,
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
  verificado:   true,
  barrio:       "Centro",
  notas:        "Laboratorio completo con imágenes.",
  seguros:      ["Todos los seguros", "Particular"]
},
{
  id:          25,
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
  verificado:   true,
  barrio:       "Centro",
  notas:        "Abre temprano para ayuno.",
  seguros:      ["INSS", "MAPFRE", "Particular"]
},
{
  id:          26,
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
  verificado:   true,
  barrio:       "San Antonio",
  notas:        "Equipos de imágenes avanzadas.",
  seguros:      ["MAPFRE", "Seguros UNO", "ANC", "Particular"]
},
{
  id:          27,
  categoria:    "laboratorio",
  nombre:       "Laboratorio de Análisis Clínicos",
  direccion:    "Calle La Calzada, Granada",
  telefono:     "2552-9550",
  emergencia:   false,
  lat:          11.9358,
  lng:          -85.9548,
  horario:      "Lun-Vie 6:30am-4pm",
  servicios:    ["analisis_sangre", "orina", "pruebas_embarazo", "glucosa", "colesterol"],
  disponible:   true,
  verificado:   true,
  barrio:       "La Calzada",
  notas:        "Resultados rápidos el mismo día.",
  seguros:      ["Todos los seguros", "Particular"]
}

];

// ═══════════════════════════════════════════════════════════════
//  🏥 CENTROS DE SALUD PÚBLICOS - GRANADA, NICARAGUA
// ═══════════════════════════════════════════════════════════════
const CENTROS_SALUD_PUBLICOS = [

{
  id:          28,
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
  verificado:   true,
  barrio:       "Simeón Rivas",
  notas:        "Centro público gratuito. MINSA.",
  seguros:      ["MINSA", "INSS", "Gratuito"]
},
{
  id:          29,
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
  verificado:   true,
  barrio:       "El Calvario",
  notas:        "Atención de enfermedades crónicas.",
  seguros:      ["MINSA", "INSS", "Gratuito"]
},
{
  id:          30,
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
  verificado:   true,
  barrio:       "Guadalupe",
  notas:        "Especializado en madre y niño.",
  seguros:      ["MINSA", "INSS", "Gratuito"]
},
{
  id:          31,
  categoria:    "centro_salud",
  nombre:       "Centro de Salud La Antigua",
  direccion:    "Barrio La Antigua, Granada",
  telefono:     "2552-1180",
  emergencia:   false,
  lat:          11.9360,
  lng:          -85.9605,
  horario:      "Lun-Vie 8am-4pm",
  servicios:    ["consulta_general", "vacunacion", "control_prenatal", "planificacion_familiar"],
  disponible:   true,
  verificado:   true,
  barrio:       "La Antigua",
  notas:        "Centro público gratuito. MINSA.",
  seguros:      ["MINSA", "INSS", "Gratuito"]
},
{
  id:          32,
  categoria:    "centro_salud",
  nombre:       "Puesto de Salud Jardines",
  direccion:    "Pista de Jardines, Granada",
  telefono:     "2552-1190",
  emergencia:   false,
  lat:          11.9305,
  lng:          -85.9515,
  horario:      "Lun-Vie 8am-4pm",
  servicios:    ["consulta_general", "vacunacion", "curaciones"],
  disponible:   true,
  verificado:   true,
  barrio:       "Jardines",
  notas:        "Puesto de salud pequeño. Atención básica.",
  seguros:      ["MINSA", "Gratuito"]
},
{
  id:          33,
  categoria:    "centro_salud",
  nombre:       "Centro de Salud Barrio San Antonio",
  direccion:    "Barrio San Antonio, Granada",
  telefono:     "2552-1200",
  emergencia:   false,
  lat:          11.9330,
  lng:          -85.9545,
  horario:      "Lun-Vie 8am-4pm",
  servicios:    ["consulta_general", "vacunacion", "control_cronico", "adulto_mayor"],
  disponible:   true,
  verificado:   true,
  barrio:       "San Antonio",
  notas:        "Atención para adulto mayor.",
  seguros:      ["MINSA", "INSS", "Gratuito"]
}

];

// ═══════════════════════════════════════════════════════════════
//  💊 MEDICAMENTOS - NICARAGUA (EXPANDIDO v3.0)
// ═══════════════════════════════════════════════════════════════
const MEDICAMENTOS = [

// ─────────────────────────────
//  ANALGÉSICOS Y ANTIPIRÉTICOS
// ─────────────────────────────
{
  id:                    1,
  nombre_es:             "Paracetamol",
  nombre_en:             "Acetaminophen",
  nombres_comerciales:   ["Tempra", "Panadol", "Tylenol", "Acetaminofén MK"],
  categoria:             "Analgésico/Antipirético",
  uso_principal:         "Dolor leve a moderado, fiebre, dolor de cabeza",
  dosis_adulto:          "500-1000mg cada 6-8 horas (máximo 4g por día)",
  dosis_nino:            "10-15mg/kg cada 6 horas (consultar médico)",
  presentaciones:        ["Tabletas 500mg", "Jarabe 120mg/5ml", "Gotas 100mg/ml"],
  contraindicaciones:    "Enfermedad hepática grave, alergia al paracetamol",
  efectos_secundarios:   "Raro: daño hepático con sobredosis",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "15-30 C$ (tabletas)",
  embarazo:              "Categoría B - Seguro bajo supervisión médica"
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
  presentaciones:        ["Tabletas 400mg", "Jarabe 100mg/5ml", "Cápsulas 600mg"],
  contraindicaciones:    "Úlceras gástricas, enfermedad renal, embarazo 3er trimestre",
  efectos_secundarios:   "Malestar estomacal, mareos",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "20-40 C$ (tabletas)",
  embarazo:              "Categoría C - Evitar en 3er trimestre"
},
{
  id:                    3,
  nombre_es:             "Dipirona",
  nombre_en:             "Metamizole",
  nombres_comerciales:   ["Novalgina", "Dipirona MK", "Nolotil"],
  categoria:             "Analgésico/Antipirético",
  uso_principal:         "Dolor moderado a severo, fiebre alta",
  dosis_adulto:          "500-1000mg cada 6-8 horas",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas 500mg", "Jarabe 250mg/5ml", "Ampollas inyectables"],
  contraindicaciones:    "Alergia a dipirona, trastornos sanguíneos",
  efectos_secundarios:   "Raro: agranulocitosis, mareos",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "25-50 C$ (caja)",
  embarazo:              "Categoría B - Consultar médico"
},

// ─────────────────────────────
//  MEDICAMENTOS PARA EMBARAZADAS ⭐ NUEVO
// ─────────────────────────────
{
  id:                    4,
  nombre_es:             "Ácido Fólico",
  nombre_en:             "Folic Acid",
  nombres_comerciales:   ["Folamil", "Acido Fólico MK", "Folato"],
  categoria:             "Suplemento Prenatal",
  uso_principal:         "Prevención de defectos del tubo neural en el feto, anemia en embarazadas",
  dosis_adulto:          "400-800mcg una vez al día (antes y durante el embarazo)",
  dosis_nino:            "No aplica",
  presentaciones:        ["Tabletas 400mcg", "Tabletas 5mg", "Complejo prenatal"],
  contraindicaciones:    "Alergia al ácido fólico",
  efectos_secundarios:   "Raro: náuseas leves, malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "20-50 C$ (caja)",
  embarazo:              "Categoría A - SEGURO y RECOMENDADO en embarazo",
  trimestres:            "Especialmente importante en primer trimestre"
},
{
  id:                    5,
  nombre_es:             "Hierro + Ácido Fólico",
  nombre_en:             "Iron + Folic Acid",
  nombres_comerciales:   ["Fer-In-Sol", "Hierro MK", "Materna"],
  categoria:             "Suplemento Prenatal",
  uso_principal:         "Prevención y tratamiento de anemia en embarazadas",
  dosis_adulto:          "1 tableta al día con alimentos",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas", "Jarabe", "Cápsulas"],
  contraindicaciones:    "Hemocromatosis, anemia no ferropénica",
  efectos_secundarios:   "Estreñimiento, heces oscuras, náuseas",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "30-60 C$ (caja)",
  embarazo:              "Categoría A - SEGURO y RECOMENDADO en embarazo",
  trimestres:            "Segundo y tercer trimestre principalmente"
},
{
  id:                    6,
  nombre_es:             "Calcio + Vitamina D",
  nombre_en:             "Calcium + Vitamin D",
  nombres_comerciales:   ["Caltrate", "Osteocare", "Calcio MK"],
  categoria:             "Suplemento Prenatal",
  uso_principal:         "Desarrollo óseo del feto, prevención de osteoporosis materna",
  dosis_adulto:          "500-1000mg de calcio + 400UI Vitamina D al día",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas", "Tabletas masticables", "Jarabe"],
  contraindicaciones:    "Hipercalcemia, cálculos renales",
  efectos_secundarios:   "Estreñimiento, malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "40-80 C$ (caja)",
  embarazo:              "Categoría A - SEGURO en embarazo",
  trimestres:            "Segundo y tercer trimestre"
},
{
  id:                    7,
  nombre_es:             "Vitamina Prenatal Completa",
  nombre_en:             "Prenatal Vitamin",
  nombres_comerciales:   ["Materna", "Natalben", "Elevit Pronatal"],
  categoria:             "Suplemento Prenatal",
  uso_principal:         "Suplemento completo para embarazo (vitaminas, minerales, ácido fólico)",
  dosis_adulto:          "1 tableta/cápsula al día",
  dosis_nino:            "No aplica",
  presentaciones:        ["Cápsulas", "Tabletas", "Gomitas"],
  contraindicaciones:    "Alergia a componentes",
  efectos_secundarios:   "Náuseas leves, estreñimiento",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "150-300 C$ (caja)",
  embarazo:              "Categoría A - DISEÑADO para embarazo",
  trimestres:            "Todo el embarazo y lactancia"
},
{
  id:                    8,
  nombre_es:             "Doxilamina + Piridoxina",
  nombre_en:             "Doxylamine + Pyridoxine",
  nombres_comerciales:   ["Doxinac", "Bonjesta", "Nausea-Free"],
  categoria:             "Antiemético para Embarazo",
  uso_principal:         "Náuseas y vómitos del embarazo (hipémesis gravídica)",
  dosis_adulto:          "1 tableta al día antes de dormir (consultar médico)",
  dosis_nino:            "No aplica",
  presentaciones:        ["Tabletas", "Cápsulas de liberación prolongada"],
  contraindicaciones:    "Glaucoma, asma severa",
  efectos_secundarios:   "Somnolencia, boca seca",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "80-150 C$ (caja)",
  embarazo:              "Categoría A - APROBADO para náuseas en embarazo",
  trimestres:            "Primer trimestre principalmente"
},
{
  id:                    9,
  nombre_es:             "Metildopa",
  nombre_en:             "Methyldopa",
  nombres_comerciales:   ["Aldomet", "Metildopa MK"],
  categoria:             "Antihipertensivo para Embarazo",
  uso_principal:         "Presión arterial alta en embarazadas (preeclampsia)",
  dosis_adulto:          "250-500mg 2-3 veces al día (bajo supervisión médica)",
  dosis_nino:            "No aplica",
  presentaciones:        ["Tabletas 250mg", "Tabletas 500mg"],
  contraindicaciones:    "Enfermedad hepática activa, depresión",
  efectos_secundarios:   "Somnolencia, mareos, boca seca",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "50-100 C$ (caja)",
  embarazo:              "Categoría B - ANTIHIPERTENSIVO de elección en embarazo",
  trimestres:            "Segundo y tercer trimestre"
},

// ─────────────────────────────
//  ANTIBIÓTICOS
// ─────────────────────────────
{
  id:                    10,
  nombre_es:             "Amoxicilina",
  nombre_en:             "Amoxicillin",
  nombres_comerciales:   ["Amoxal", "Trimox", "Novamox", "Amoxicilina MK"],
  categoria:             "Antibiótico",
  uso_principal:         "Infecciones bacterianas (garganta, oído, urinarias)",
  dosis_adulto:          "500mg cada 8 horas o 875mg cada 12 horas",
  dosis_nino:            "20-40mg/kg/día dividido en 3 dosis (consultar médico)",
  presentaciones:        ["Cápsulas 500mg", "Jarabe 250mg/5ml", "Tabletas 875mg"],
  contraindicaciones:    "Alergia a penicilinas, mononucleosis",
  efectos_secundarios:   "Diarrea, náuseas, erupción cutánea",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "50-100 C$ (caja)",
  embarazo:              "Categoría B - Generalmente seguro"
},
{
  id:                    11,
  nombre_es:             "Azitromicina",
  nombre_en:             "Azithromycin",
  nombres_comerciales:   ["Azitro", "Zithromax", "Azitromicina MK"],
  categoria:             "Antibiótico",
  uso_principal:         "Infecciones respiratorias, de piel, transmisión sexual",
  dosis_adulto:          "500mg día 1, luego 250mg días 2-5",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas 500mg", "Jarabe 200mg/5ml", "Cápsulas 250mg"],
  contraindicaciones:    "Alergia a macrólidos, enfermedad hepática",
  efectos_secundarios:   "Náuseas, diarrea, dolor abdominal",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "80-150 C$ (caja)",
  embarazo:              "Categoría B - Consultar médico"
},
{
  id:                    12,
  nombre_es:             "Ceftriaxona",
  nombre_en:             "Ceftriaxone",
  nombres_comerciales:   ["Rocefin", "Ceftriaxona MK"],
  categoria:             "Antibiótico Inyectable",
  uso_principal:         "Infecciones graves, neumonía, meningitis",
  dosis_adulto:          "1-2g una vez al día IM o IV",
  dosis_nino:            "50-75mg/kg/día (consultar médico)",
  presentaciones:        ["Ampollas inyectables 1g", "Ampollas inyectables 2g"],
  contraindicaciones:    "Alergia a cefalosporinas",
  efectos_secundarios:   "Dolor en sitio de inyección, diarrea",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "100-200 C$ (ampolla)",
  embarazo:              "Categoría B - Solo si es necesario"
},

// ─────────────────────────────
//  MEDICAMENTOS PARA NIÑOS
// ─────────────────────────────
{
  id:                    13,
  nombre_es:             "Jarabe para la Tos (Niños)",
  nombre_en:             "Cough Syrup (Children)",
  nombres_comerciales:   ["Robitussin Pediatrico", "Tosdril", "Bisolvon Niños"],
  categoria:             "Antitusivo/Expectorante",
  uso_principal:         "Tos seca o con flema en niños",
  dosis_adulto:          "No recomendado para adultos",
  dosis_nino:            "2.5-5ml cada 6-8 horas (según edad)",
  presentaciones:        ["Jarabe 100ml", "Jarabe 120ml"],
  contraindicaciones:    "Menores de 2 años sin supervisión médica",
  efectos_secundarios:   "Somnolencia leve, malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "40-80 C$ (frasco)",
  embarazo:              "N/A - Uso pediátrico"
},
{
  id:                    14,
  nombre_es:             "Suero Oral Pediátrico",
  nombre_en:             "Pediatric Oral Rehydration",
  nombres_comerciales:   ["Pedialyte", "Suero Vida", "Electrolit Pediátrico"],
  categoria:             "Rehidratante",
  uso_principal:         "Deshidratación por diarrea o vómito en niños",
  dosis_adulto:          "No específico para adultos",
  dosis_nino:            "50-100ml después de cada evacuación líquida",
  presentaciones:        ["Sobre 25g", "Líquido 500ml", "Líquido 1L"],
  contraindicaciones:    "Ninguna conocida",
  efectos_secundarios:   "Ninguno",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "15-40 C$ (sobre/líquido)",
  embarazo:              "N/A - Uso pediátrico"
},
{
  id:                    15,
  nombre_es:             "Multivitamínico Infantil",
  nombre_en:             "Children's Multivitamin",
  nombres_comerciales:   ["Centrum Kids", "Vicki", "Gummy Vitamins"],
  categoria:             "Suplemento Vitamínico",
  uso_principal:         "Complemento nutricional para niños",
  dosis_adulto:          "No recomendado para adultos",
  dosis_nino:            "1 tableta/gomita al día (según edad)",
  presentaciones:        ["Gomitas", "Tabletas masticables", "Jarabe"],
  contraindicaciones:    "Alergia a componentes",
  efectos_secundarios:   "Raro: malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "80-150 C$ (frasco)",
  embarazo:              "N/A - Uso pediátrico"
},

// ─────────────────────────────
//  MEDICAMENTOS CRÓNICOS
// ─────────────────────────────
{
  id:                    16,
  nombre_es:             "Metformina",
  nombre_en:             "Metformin",
  nombres_comerciales:   ["Glucophage", "Diabex", "Metformina MK"],
  categoria:             "Antidiabético Oral",
  uso_principal:         "Diabetes tipo 2, control de azúcar en sangre",
  dosis_adulto:          "500-850mg 2-3 veces al día con comidas",
  dosis_nino:            "Consultar médico (mayores de 10 años)",
  presentaciones:        ["Tabletas 500mg", "Tabletas 850mg", "Tabletas 1000mg"],
  contraindicaciones:    "Insuficiencia renal, acidosis metabólica",
  efectos_secundarios:   "Náuseas, diarrea, malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "40-80 C$ (caja)",
  embarazo:              "Categoría B - Consultar médico"
},
{
  id:                    17,
  nombre_es:             "Losartán",
  nombre_en:             "Losartan",
  nombres_comerciales:   ["Cozaar", "Losartán MK", "Losartán Potásico"],
  categoria:             "Antihipertensivo",
  uso_principal:         "Presión arterial alta, protección renal en diabéticos",
  dosis_adulto:          "50-100mg una vez al día",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas 50mg", "Tabletas 100mg"],
  contraindicaciones:    "Embarazo, alergia al losartán",
  efectos_secundarios:   "Mareos, fatiga, hipotensión",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "50-100 C$ (caja)",
  embarazo:              "Categoría D - NO usar en embarazo"
},
{
  id:                    18,
  nombre_es:             "Amlodipino",
  nombre_en:             "Amlodipine",
  nombres_comerciales:   ["Norvasc", "Amlodipino MK"],
  categoria:             "Antihipertensivo",
  uso_principal:         "Presión arterial alta, dolor de pecho (angina)",
  dosis_adulto:          "5-10mg una vez al día",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas 5mg", "Tabletas 10mg"],
  contraindicaciones:    "Presión arterial muy baja, enfermedad hepática",
  efectos_secundarios:   "Hinchazón de tobillos, mareos, fatiga",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "50-100 C$ (caja)",
  embarazo:              "Categoría C - Consultar médico"
},
{
  id:                    19,
  nombre_es:             "Atorvastatina",
  nombre_en:             "Atorvastatin",
  nombres_comerciales:   ["Lipitor", "Atorvastatina MK"],
  categoria:             "Estatina (Control de Colesterol)",
  uso_principal:         "Colesterol alto, prevención cardiovascular",
  dosis_adulto:          "10-40mg una vez al día",
  dosis_nino:            "Consultar médico (mayores de 10 años)",
  presentaciones:        ["Tabletas 10mg", "Tabletas 20mg", "Tabletas 40mg"],
  contraindicaciones:    "Enfermedad hepática activa, embarazo",
  efectos_secundarios:   "Dolor muscular, fatiga, malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "60-120 C$ (caja)",
  embarazo:              "Categoría X - NO usar en embarazo"
},
{
  id:                    20,
  nombre_es:             "Insulina NPH",
  nombre_en:             "Insulin NPH",
  nombres_comerciales:   ["Humulina NPH", "Novolin N", "Insulatard"],
  categoria:             "Insulina de Acción Intermedia",
  uso_principal:         "Diabetes tipo 1 y tipo 2",
  dosis_adulto:          "Variable según necesidad (consultar médico)",
  dosis_nino:            "Variable según necesidad (consultar médico)",
  presentaciones:        ["Ampollas 10ml", "Plumas prellenadas"],
  contraindicaciones:    "Hipoglucemia",
  efectos_secundarios:   "Hipoglucemia, aumento de peso, reacción en sitio de inyección",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "200-400 C$ (frasco)",
  embarazo:              "Categoría B - Seguro bajo supervisión"
},

// ─────────────────────────────
//  ANTIHISTAMÍNICOS Y ALERGIAS
// ─────────────────────────────
{
  id:                    21,
  nombre_es:             "Loratadina",
  nombre_en:             "Loratadine",
  nombres_comerciales:   ["Claritin", "Loratamed", "Loratadina MK"],
  categoria:             "Antihistamínico",
  uso_principal:         "Alergias, rinitis alérgica, urticaria, picazón",
  dosis_adulto:          "10mg una vez al día",
  dosis_nino:            "5mg una vez al día (2-12 años)",
  presentaciones:        ["Tabletas 10mg", "Jarabe 5mg/5ml"],
  contraindicaciones:    "Alergia a la loratadina, enfermedad hepática grave",
  efectos_secundarios:   "Somnolencia leve, boca seca",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "25-50 C$ (caja)",
  embarazo:              "Categoría B - Consultar médico"
},
{
  id:                    22,
  nombre_es:             "Cetirizina",
  nombre_en:             "Cetirizine",
  nombres_comerciales:   ["Zyrtec", "Cetirizina MK", "Alegrin"],
  categoria:             "Antihistamínico",
  uso_principal:         "Alergias, rinitis, urticaria, picazón",
  dosis_adulto:          "10mg una vez al día",
  dosis_nino:            "5mg una vez al día (6-12 años)",
  presentaciones:        ["Tabletas 10mg", "Jarabe 5mg/5ml"],
  contraindicaciones:    "Alergia a la cetirizina, enfermedad renal grave",
  efectos_secundarios:   "Somnolencia, boca seca, fatiga",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "30-60 C$ (caja)",
  embarazo:              "Categoría B - Consultar médico"
},

// ─────────────────────────────
//  ANTIINFLAMATORIOS
// ─────────────────────────────
{
  id:                    23,
  nombre_es:             "Diclofenaco",
  nombre_en:             "Diclofenac",
  nombres_comerciales:   ["Voltaren", "Cataflam", "Diclofenaco MK"],
  categoria:             "Antiinflamatorio No Esteroideo",
  uso_principal:         "Dolor muscular, artritis, inflamación, cólicos",
  dosis_adulto:          "50mg 2-3 veces al día",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas 50mg", "Gel tóxico", "Ampollas inyectables"],
  contraindicaciones:    "Úlceras, enfermedad cardiovascular, embarazo",
  efectos_secundarios:   "Malestar estomacal, mareos, dolor abdominal",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "25-50 C$ (caja)",
  embarazo:              "Categoría C - Evitar en 3er trimestre"
},
{
  id:                    24,
  nombre_es:             "Naproxeno",
  nombre_en:             "Naproxen",
  nombres_comerciales:   ["Naproxyn", "Flanax", "Naproxeno MK"],
  categoria:             "Antiinflamatorio No Esteroideo",
  uso_principal:         "Dolor menstrual, dolor muscular, artritis, migraña",
  dosis_adulto:          "250-500mg cada 12 horas",
  dosis_nino:            "Consultar médico (mayores de 12 años)",
  presentaciones:        ["Tabletas 250mg", "Tabletas 500mg"],
  contraindicaciones:    "Úlceras, enfermedad renal, embarazo",
  efectos_secundarios:   "Malestar estomacal, acidez, mareos",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "30-60 C$ (caja)",
  embarazo:              "Categoría C - Evitar en 3er trimestre"
},

// ─────────────────────────────
//  ESTEROIDES
// ─────────────────────────────
{
  id:                    25,
  nombre_es:             "Prednisona",
  nombre_en:             "Prednisone",
  nombres_comerciales:   ["Deltasone", "Prednisona MK"],
  categoria:             "Corticoesteroide",
  uso_principal:         "Inflamación severa, alergias graves, asma",
  dosis_adulto:          "5-60mg por día (según condición)",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas 5mg", "Tabletas 10mg", "Tabletas 20mg"],
  contraindicaciones:    "Infecciones activas, diabetes no controlada",
  efectos_secundarios:   "Aumento de apetito, insomnio, retención de líquidos",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "40-80 C$ (caja)",
  embarazo:              "Categoría C - Solo si es necesario"
},

// ─────────────────────────────
//  OTROS MEDICAMENTOS COMUNES
// ─────────────────────────────
{
  id:                    26,
  nombre_es:             "Omeprazol",
  nombre_en:             "Omeprazole",
  nombres_comerciales:   ["Losec", "Prilosec", "Omepral", "Omeprazol MK"],
  categoria:             "Inhibidor de Bomba de Protones",
  uso_principal:         "Acidez, reflujo gastroesofágico, úlceras gástricas",
  dosis_adulto:          "20-40mg una vez al día en ayunas",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Cápsulas 20mg", "Cápsulas 40mg"],
  contraindicaciones:    "Alergia al omeprazol, interacción con algunos medicamentos",
  efectos_secundarios:   "Dolor de cabeza, diarrea, náuseas",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "30-60 C$ (caja)",
  embarazo:              "Categoría C - Consultar médico"
},
{
  id:                    27,
  nombre_es:             "Aspirina",
  nombre_en:             "Aspirin",
  nombres_comerciales:   ["Aspirina Bayer", "Aspirina MK"],
  categoria:             "Analgésico/Antiinflamatorio",
  uso_principal:         "Dolor leve, fiebre, prevención de coágulos",
  dosis_adulto:          "325-650mg cada 4-6 horas (dolor) | 81mg diario (corazón)",
  dosis_nino:            "No recomendado en niños (riesgo de Síndrome de Reye)",
  presentaciones:        ["Tabletas 81mg", "Tabletas 325mg", "Tabletas 500mg"],
  contraindicaciones:    "Úlceras, trastornos de coagulación, niños con virus",
  efectos_secundarios:   "Malestar estomacal, sangrado fácil",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "20-40 C$ (caja)",
  embarazo:              "Categoría D - Evitar en 3er trimestre"
},
{
  id:                    28,
  nombre_es:             "Loperamida",
  nombre_en:             "Loperamide",
  nombres_comerciales:   ["Imodium", "Loperamida MK"],
  categoria:             "Antidiarreico",
  uso_principal:         "Diarrea aguda",
  dosis_adulto:          "4mg inicial, luego 2mg después de cada evacuación",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Cápsulas 2mg", "Tabletas 2mg"],
  contraindicaciones:    "Diarrea con sangre, fiebre alta",
  efectos_secundarios:   "Estreñimiento, mareos, malestar estomacal",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "25-50 C$ (caja)",
  embarazo:              "Categoría C - Consultar médico"
},
{
  id:                    29,
  nombre_es:             "Dimenhidrinato",
  nombre_en:             "Dimenhydrinate",
  nombres_comerciales:   ["Dramamine", "Biodramina"],
  categoria:             "Antiemético/Antimareo",
  uso_principal:         "Náuseas, vómito, mareo por movimiento",
  dosis_adulto:          "50-100mg cada 4-6 horas",
  dosis_nino:            "Consultar médico",
  presentaciones:        ["Tabletas 50mg", "Jarabe 12.5mg/5ml"],
  contraindicaciones:    "Glaucoma, problemas de próstata",
  efectos_secundarios:   "Somnolencia, boca seca, visión borrosa",
  disponible_nicaragua:  true,
  requiere_receta:       false,
  precio_aproximado:     "20-40 C$ (caja)",
  embarazo:              "Categoría B - Consultar médico"
},
{
  id:                    30,
  nombre_es:             "Salbutamol",
  nombre_en:             "Albuterol",
  nombres_comerciales:   ["Ventolin", "Salbutamol MK"],
  categoria:             "Broncodilatador",
  uso_principal:         "Asma, broncoespasmo, dificultad para respirar",
  dosis_adulto:          "1-2 inhalaciones cada 4-6 horas según necesidad",
  dosis_nino:            "1 inhalación cada 4-6 horas (consultar médico)",
  presentaciones:        ["Inhalador 100mcg", "Nebulizador 2.5mg/2.5ml"],
  contraindicaciones:    "Alergia al salbutamol, arritmias graves",
  efectos_secundarios:   "Temblor, taquicardia, nerviosismo",
  disponible_nicaragua:  true,
  requiere_receta:       true,
  precio_aproximado:     "150-300 C$ (inhalador)",
  embarazo:              "Categoría C - Consultar médico"
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
},
{
  nombre:       "MINSA - Línea de Salud",
  numero:       "133",
  descripcion:  "Consultas de salud y orientación médica",
  disponible:   true
}

];

// ═══════════════════════════════════════════════════════════════
//  📍 BARRIOS DE GRANADA (EXPANDIDO)
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
  "Calle Atravesada",
  "Pista de Jardines",
  "Barrio San José",
  "Barrio Mexico",
  "Barrio Venezuela",
  "Barrio Cuba",
  "Reparto San Francisco",
  "Reparto Las Colinas",
  "Reparto Xalteva",
  "Islas del Lago (Zapatera, Ometepe - referencia)",
  "Gandera",
  "Pueblo Nuevo",
  "Santiago"
];

// ═══════════════════════════════════════════════════════════════
//  🏥 LISTA DE SEGUROS MÉDICOS EN NICARAGUA
// ═══════════════════════════════════════════════════════════════
const SEGUROS_MEDICOS = [
  { nombre: "INSS", nombre_completo: "Instituto Nicaragüense de Seguridad Social", tipo: "Público" },
  { nombre: "MINSA", nombre_completo: "Ministerio de Salud", tipo: "Público" },
  { nombre: "MAPFRE", nombre_completo: "MAPFRE Nicaragua", tipo: "Privado" },
  { nombre: "Seguros UNO", nombre_completo: "Seguros UNO", tipo: "Privado" },
  { nombre: "ANC", nombre_completo: "Alianza Nicaragüense de Compañías de Seguros", tipo: "Privado" },
  { nombre: "Banpro Seguros", nombre_completo: "Banpro Seguros", tipo: "Privado" },
  { nombre: "Dental Care", nombre_completo: "Dental Care Nicaragua", tipo: "Privado - Dental" },
  { nombre: "Particular", nombre_completo: "Pago particular (sin seguro)", tipo: "Particular" },
  { nombre: "Gratuito", nombre_completo: "Servicio gratuito (centros públicos)", tipo: "Público" }
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

// Buscar centros por barrio
function buscarCentrosPorBarrio(barrio) {
  return obtenerTodosLosCentros().filter(c => 
    c.barrio && c.barrio.toLowerCase().includes(barrio.toLowerCase())
  );
}

// Buscar centros por seguro médico
function buscarCentrosPorSeguro(seguro) {
  return obtenerTodosLosCentros().filter(c => 
    c.seguros && c.seguros.some(s => s.toLowerCase().includes(seguro.toLowerCase()))
  );
}

// Buscar centros cercanos por coordenadas
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
  const R = 6371000;
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

// Buscar medicamentos por categoría
function buscarMedicamentosPorCategoria(categoria) {
  return MEDICAMENTOS.filter(m => m.categoria.includes(categoria));
}

// Obtener todos los medicamentos
function obtenerTodosLosMedicamentos() {
  return MEDICAMENTOS;
}

// Obtener medicamentos para niños
function obtenerMedicamentosPediatricos() {
  return MEDICAMENTOS.filter(m => 
    m.dosis_nino && m.dosis_nino.toLowerCase().includes('niño')
  );
}

// Obtener medicamentos para embarazadas ⭐ NUEVO
function obtenerMedicamentosEmbarazadas() {
  return MEDICAMENTOS.filter(m => 
    m.categoria.includes('Prenatal') || 
    m.categoria.includes('Embarazo') ||
    (m.embarazo && m.embarazo.includes('Categoría A')) ||
    (m.embarazo && m.embarazo.includes('Categoría B'))
  );
}

// Obtener medicamentos crónicos
function obtenerMedicamentosCronicos() {
  return MEDICAMENTOS.filter(m => 
    m.categoria.includes('Diabético') || 
    m.categoria.includes('Antihipertensivo') ||
    m.categoria.includes('Estatina') ||
    m.categoria.includes('Insulina')
  );
}

// Obtener medicamentos SEGUROS en embarazo ⭐ NUEVO
function obtenerMedicamentosSegurosEmbarazo() {
  return MEDICAMENTOS.filter(m => 
    m.embarazo && (m.embarazo.includes('Categoría A') || m.embarazo.includes('SEGURO'))
  );
}

// Obtener medicamentos NO SEGUROS en embarazo ⭐ NUEVO
function obtenerMedicamentosNoSegurosEmbarazo() {
  return MEDICAMENTOS.filter(m => 
    m.embarazo && (m.embarazo.includes('NO usar') || m.embarazo.includes('Categoría D') || m.embarazo.includes('Categoría X'))
  );
}

// Buscar emergencias
function obtenerEmergencias() {
  return EMERGENCIAS.filter(e => e.disponible === true);
}

// Obtener seguros médicos
function obtenerSegurosMedicos() {
  return SEGUROS_MEDICOS;
}

// Buscar centros con capilla/misas ⭐ NUEVO
function obtenerCentrosConCapilla() {
  return obtenerTodosLosCentros().filter(c => c.capilla);
}

// Obtener estadísticas de la base de datos
function obtenerEstadisticasBD() {
  return {
    version: VERSION_BASE_DATOS,
    ultima_actualizacion: ULTIMA_ACTUALIZACION,
    total_centros: obtenerTodosLosCentros().length,
    total_medicamentos: MEDICAMENTOS.length,
    hospitales: HOSPITALES.length,
    clinicas: CLINICAS.length,
    farmacias: FARMACIAS.length,
    laboratorios: LABORATORIOS.length,
    centros_publicos: CENTROS_SALUD_PUBLICOS.length,
    centros_con_capilla: obtenerCentrosConCapilla().length,
    medicamentos_pediatricos: obtenerMedicamentosPediatricos().length,
    medicamentos_embarazadas: obtenerMedicamentosEmbarazadas().length,
    medicamentos_cronicos: obtenerMedicamentosCronicos().length,
    medicamentos_seguros_embarazo: obtenerMedicamentosSegurosEmbarazo().length,
    emergencias: EMERGENCIAS.length,
    barrios_cubiertos: BARRIOS_GRANADA.length,
    seguros_disponibles: SEGUROS_MEDICOS.length
  };
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

6. MEDICAMENTOS:
   - Incluye siempre dosis para adultos y niños
   - Agrega contraindicaciones y efectos secundarios
   - Especifica si requiere receta
   - Incluye categoría de embarazo (A, B, C, D, X)

7. SEGUROS MÉDICOS:
   - Verifica con cada centro qué seguros aceptan
   - Actualiza cuando haya cambios de convenio

8. CAPILLAS/MISAS:
   - Confirma horarios de misas con la capellanía
   - Actualiza en Semana Santa y fiestas patronales

═══════════════════════════════════════════════════════════════
*/

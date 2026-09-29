// ============================================================================
// DECK ENGINE — Defensa de monografía: Dinámica Comercial y Migratoria COL-VEN
// Navegación por pasos: cada clic en «Siguiente» revela un elemento (data-s),
// y solo al completar los pasos pasa a la diapositiva siguiente.
// ←/→ navegan · F pantalla completa · N notas del expositor
// ============================================================================
import * as echarts from 'echarts';
import gsap from 'gsap';
import Globe from 'globe.gl';

// ---------- Utilidades ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmtEs = (n, dec = 1) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtInt = (n) => n.toLocaleString('es-ES', { maximumFractionDigits: 0 });

const C = {
  gold: '#d4af37',
  electric: '#4aa8ff',
  ink: '#e8edf4',
  muted: '#9fb0c3',
  grid: 'rgba(159,176,195,0.14)',
  red: 'rgba(176,36,24,0.13)',
  orange: 'rgba(224,122,44,0.12)'
};
const BASE_TEXT = { color: C.muted, fontFamily: 'Inter Variable, Inter, sans-serif' };

// ---------- Notas del expositor ----------
const NOTES = [
  "Buenas tardes. Mi nombre es Wister Márquez y hoy presento mi monografía: Dinámica Comercial y Migratoria Colombia-Venezuela 2013-2025, desarrollada en la Escuela de Economía de la Universidad de los Andes bajo la tutoría de la doctora Dyanna Ruíz. En los próximos minutos mostraré cómo la crisis venezolana transformó simultáneamente dos cosas: el comercio entre ambos países y la vida de casi tres millones de migrantes.",
  "Colombia y Venezuela comparten 2.219 kilómetros de frontera, una de las más activas de América Latina. Lo que ocurrió entre 2013 y 2025 en este corredor no fueron dos fenómenos separados: el colapso del comercio y el éxodo migratorio son dos caras de la misma crisis. Esta presentación demuestra esa tesis con dos fuentes de datos independientes y un mismo hilo conductor.",
  "La relación colombo-venezolana se construyó sobre más de cinco décadas de integración. Desde el Acuerdo de Cartagena de 1969, ambos países conformaron el núcleo más dinámico del Pacto Andino. Ese andamiaje se fracturó en 2006, cuando Venezuela se retiró formalmente de la CAN. Pero el punto de inflexión definitivo llegó en 2013: la inflación saltó a 56 % interanual, en 2014 el barril de petróleo cayó de 98,98 a 47,05 dólares, y entre 2017 y 2021 Venezuela entró oficialmente en hiperinflación. Las consecuencias fueron dobles: el flujo comercial pasó de 2.687 millones de dólares en 2013 a apenas 222,9 millones en 2020, y millones de venezolanos cruzaron la frontera.",
  "La pregunta de investigación articula las tres dimensiones del fenómeno: comercio, migración y marco normativo. El primer objetivo específico se responde con un panel de datos producto-año y un modelo econométrico con corrección de sesgo de selección, que separa la decisión de comerciar del monto comerciado. El segundo se responde con las ocho rondas de la Encuesta Pulso de la Migración del DANE, que permiten caracterizar quiénes son los migrantes, cómo viven y qué tan insertos están en el mercado laboral colombiano.",
  "El marco teórico descansa sobre cuatro pilares. Para el comercio: la teoría del sesgo de selección de Heckman, extendida a datos de panel por Wooldridge en 1995 — la columna vertebral econométrica — y el modelo gravitacional de Tinbergen, una de las regularidades empíricas más robustas de la economía internacional. Para la migración: la visión de migrar como inversión en capital humano, desde Sjaastad hasta el modelo de selección de Borjas; y la literatura de asimilación de Chiswick y asimilación segmentada de Portes y Zhou, que da sentido a los gradientes por cohorte que veremos en los resultados.",
  "El componente comercial se estima sobre dos paneles producto-año: 82 capítulos del Sistema Armonizado para exportaciones y 94 para importaciones, 2013-2024. El problema central es que muchas celdas tienen flujo cero — 29,4 % en exportaciones — y esos ceros no son aleatorios. Por eso se aplica Wooldridge (1995) en dos etapas: un Probit anual modela la probabilidad de flujo positivo y genera el inverso de Mills; esa corrección entra en un modelo de efectos fijos sobre el logaritmo del flujo, con errores agrupados por producto. La especificación es gravitacional: PIB de ambos países, dummies de frontera y perecederos. La validez se contrasta con pruebas F de poolabilidad y Hausman.",
  "El componente migratorio usa las ocho rondas de la EPM del DANE, entre 2021 y 2025, aplicando los factores de expansión de personas y hogares. Tres capas de análisis: estadística descriptiva ponderada por ronda y cohorte; cartografía temática sobre el marco geoestadístico oficial; y cuatro modelos WLS con errores agrupados por hogar para escolaridad, educación técnica, empleo e ingreso. Quiero destacar la validación: todos los agregados coinciden con los boletines oficiales del DANE con diferencias menores a una décima de punto porcentual. Todo el pipeline es reproducible y está en GitHub.",
  "Dos piezas de datos sustentan la investigación. A la izquierda, el panel comercial: nótese la proporción de ceros, 29,4 % en exportaciones, que justifica el modelo de selección. A la derecha, la ficha técnica de la EPM: las primeras cuatro rondas son de panel con referencia de unos 2,21 millones de venezolanos; desde la ronda cinco el diseño cambia a transversal y la referencia desciende a 975 mil en la ronda ocho. Este cambio de diseño es importante: explica por qué las poblaciones expandidas no son comparables como serie de stock, y por qué la lectura correcta es por indicadores relativos.",
  "Primera gran evidencia. En 2013 Venezuela exportaba a Colombia 430,9 millones de dólares y le compraba 2.255,7 millones. Siete años después, en el fondo de la crisis, las exportaciones cayeron a 27,5 millones — menos 93,6 % — y las importaciones a 195,4 millones, menos 91,3 %. El colapso no fue lineal: las bandas rojas marcan los cierres de 2015-2016 y el cierre total de 2019-2021, que coincide con el mínimo histórico. Desde la normalización de 2022 hay recuperación: en 2024 las importaciones superan los mil millones. Pero la lectura correcta es de niveles: las exportaciones de 2024 siguen 68,9 % debajo de 2013. Se recuperó el corredor, no la relación comercial.",
  "El comercio se descompone en dos márgenes: el intensivo — cuánto se vende de cada producto — y el extensivo — cuántos productos se venden. El intensivo colapsó primero: de 6,43 millones por producto en 2013 a 0,59 en 2020, menos 91 %. El extensivo resistió más, incluso repuntó en 2017-2018, pero cedió con el cierre total: de 82,9 % de productos activos en 2018 a 51,2 % en 2022. Esta descomposición es la razón técnica por la que el modelo trata por separado la decisión de comerciar del monto comerciado.",
  "El mapa de calor resume los 82 capítulos en doce años. Se ven dos cosas: el oscurecimiento transversal hacia 2019-2020 — el colapso no fue de unos pocos sectores — y la concentración vertical: casi la mitad de lo exportado corresponde a tres capítulos: químicos orgánicos 20,3 %, fertilizantes 18,0 % y combustibles 9,0 %, el 47,3 % del acumulado. Y el dato de política: la recuperación de 2022-2024 encendió exactamente esas mismas filas. La reapertura no trajo diversificación; reactivó la cesta tradicional con la misma vulnerabilidad estructural.",
  "El corazón econométrico. Con la corrección de Wooldridge, la elasticidad del PIB venezolano es 4,965 y altamente significativa: por cada punto que se contrae la economía venezolana, las exportaciones activas caen casi cinco. Es una elasticidad enorme: el determinante dominante del colapso fue la implosión productiva venezolana, no solo la política fronteriza. La frontera cerrada, corregida la selección, aparece negativa y significativa al 10 %: menos 2,425, una caída de alrededor del 91 % en los productos activos. Y el hallazgo metodológico: el inverso de Mills es positivo y significativo — 17,18 — evidencia directa de sesgo de selección. Sin corrección, la elasticidad estimada sería apenas 0,914: habríamos subestimado cinco veces el efecto de la crisis.",
  "El lado de las importaciones es asimétrico. La elasticidad del PIB venezolano es 2,13 y altamente significativa: Venezuela compra según su capacidad de pago. La diferencia está en la frontera: en el margen intensivo las dummies pierden significancia, mientras que en el Probit del margen extensivo son muy significativas: frontera cerrada menos 0,498, apertura parcial menos 0,467 y perecederos menos 0,595. Interpretación directa: el cierre afectó las importaciones por la puerta de entrada — qué productos logran cruzar — y no por el monto de los que ya cruzaban; los perecederos fueron las primeras víctimas. El IMR negativo y significativo confirma sesgo de selección de signo opuesto.",
  "Cambio de bloque: del comercio a las personas. El stock institucional es claro: 2,86 millones de venezolanos en Colombia según el GEME a enero de 2024. Frente a esa cifra, la EPM muestra poblaciones de referencia decrecientes, de 2,21 millones a 975 mil. Antes de que alguien concluya que los migrantes se fueron: no es así. El cambio obedece al rediseño muestral entre R4 y R5. Las dos fuentes se complementan: el registro institucional dice cuántos son; la encuesta dice quiénes son, dónde están y cómo viven.",
  "Esta línea reconstruye la cronología del éxodo. Las llegadas fueron modestas hasta 2015, despegaron en 2016-2017 y alcanzaron su pico en 2018 — 525 mil personas — exactamente el año de mayor colapso del ingreso real y de plena hiperinflación. Nótese que la ruptura diplomática de 2019 no detuvo el flujo: llegaron 416 mil por pasos irregulares. El único freno real fue la pandemia. Y al superponer las cuatro rondas aparece el sesgo de supervivencia: la cohorte 2018 es recordada por 525 mil residentes en R5 pero solo por 153 mil en R8, una caída del 71 %. Muchos usaron Colombia como escalón hacia terceros países.",
  "Quizá la visualización más elocuente. La primera capa muestra dónde declaran haber entrado: el corredor nororiental concentra casi todo — Norte de Santander 56,3 %, La Guajira 22,4 %, Arauca 12,4 %, que casi duplicó su peso. Más del 90 % entra por tres departamentos fronterizos. Pero al transicionar a la residencia efectiva, el mapa se invierte: Bogotá concentra cerca del 21 % del stock — unas 600 mil personas —, Antioquia 13,9 % y Norte de Santander solo 11,8 %. La conclusión está en Harris-Todaro: los migrantes no se asientan donde cruzan, sino donde esperan encontrar ingresos. La geografía del ingreso no es la geografía del asentamiento.",
  "El espejo del mapa anterior está del lado venezolano. Los cinco orígenes principales en R8: Zulia 19,3 %, Distrito Capital 13,2 %, Aragua 9,4 %, Táchira 8,8 % y Carabobo 6,9 %. Hay dos motores: la proximidad fronteriza — Zulia y Táchira — y el colapso de los centros industriales del centro-norte: Carabobo y Aragua fueron el corazón manufacturero, Caracas el administrativo. Que el Distrito Capital sea hoy el segundo origen confirma que el fenómeno dejó de ser regional para convertirse en un éxodo nacional.",
  "¿Quiénes cruzaron? Tres rasgos. Primero, jóvenes: mediana entre 30 y 33 años, y el grupo de 25 a 34 siempre el más grande. Población en plena edad productiva. Segundo, feminización gradual: del 49,6 % al 51,0 % de mujeres; del patrón pionero masculino a la reunificación familiar. Tercero, y crucial: selección positiva de escolaridad, como predice Borjas — 52,5 % con bachillerato completo y escolaridad media de 9,6 a 9,9 años, por encima del promedio de origen. Colombia recibió capital humano; la pregunta es si lo está aprovechando.",
  "La inserción laboral mejora: trabajando sube de 57,5 % a 64,1 %, la búsqueda se desploma de 11,9 % a 5,1 %, y la dificultad para encontrar trabajo cae de 58,3 % a 31,3 %. A primera vista, una historia de éxito. Pero la teoría de mercados duales de Piore obliga a matizar: los inmigrantes son absorbidos por el segmento secundario — servicios, comercio ambulatorio, construcción, trabajo doméstico — con bajos salarios y sin uso de sus calificaciones. Ocupación alta, pero informal. El mercado sí absorbió al migrante, por la vía de la precariedad, no de la productividad.",
  "El Estatuto Temporal de Protección de 2021 produjo una secuencia causal visible: primero el PPT, del 56,7 % al 65,6 %; detrás la salud, que en toda la serie pasó de 35,8 % a 70,1 %; y por último la bancarización, hasta 42,7 %. El documento habilita derechos y los derechos habilitan la vida formal. El eslabón roto: pensiones, apenas 11 %, la firma de la informalidad. En hogares, la mejora es contundente: dificultad alimentaria de 81,9 % a 36,0 %. Y un cuarto de la población envió remesas: el hogar migrante opera como unidad transnacional de gestión de riesgo, como plantea Stark.",
  "El hallazgo más importante del componente migratorio. Primero la buena noticia: gradiente de asimilación claro — en R8 la cohorte llegada hasta 2017 tiene 86,1 % de afiliación a salud contra 33,7 % de la cohorte 2022 en adelante. El tiempo integra, como predice Chiswick. Pero los modelos marcan límites. M1: las mujeres acumulan 0,44 años más de escolaridad. M3: la escolaridad sí compra empleo, pero ser mujer reduce en 30 puntos la probabilidad de trabajar. Y M4, el resultado central: el retorno salarial a la escolaridad es estadísticamente nulo — p de 0,82 — y ser mujer castiga el 51 % del ingreso. Un año más de educación consigue empleo, pero no sube el sueldo. Brain drain para Venezuela, brain waste en Colombia.",
  "Cinco conclusiones. Primera: la crisis devastó el intercambio — nueve de cada diez dólares — y el determinante dominante fue la contracción del PIB venezolano, con elasticidades de 4,96 y 2,13, muy por encima de los efectos fronterizos. Segunda: el éxodo reproduce la secuencia de shocks y es estructural: 2,86 millones con 88,2 % de intención de quedarse. Tercera: Venezuela exportó capital humano calificado, pero Colombia no le paga por él: retorno nulo y brecha de género de 30 puntos. Cuarta: el marco institucional fue causa y consecuencia. Quinta: comercio y migración son dos caras de la misma crisis; la reconstrucción bilateral debe tratarlas conjuntamente.",
  "Muchas gracias por su atención. Todos los datos, el código de los modelos y las figuras son completamente reproducibles y están en el repositorio que ven en pantalla. Quedo atento a las preguntas del jurado."
];

// ---------- Datos verificados (Excel/monografía) ----------
const YEARS = [2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024];
const EXP_M = [430.9,439.6,291.8,189.2,219.6,136.7,44.8,27.5,69.3,108.2,130.9,134.0];
const IMP_M = [2255.7,1986.9,1060.0,613.6,319.1,354.2,195.9,195.4,331.0,631.9,673.3,1003.5];
const TOTAL_1320 = [2686.6,2426.5,1351.8,802.8,538.7,490.9,240.7,222.9];
const YEARS_1320 = [2013,2014,2015,2016,2017,2018,2019,2020];
const MEXT = [81.7,78.0,75.6,72.0,80.5,82.9,68.3,57.3,52.4,51.2,75.6,72.0];
const MINT = [6.43,6.87,4.71,3.21,3.33,2.01,0.80,0.59,1.61,2.58,2.11,2.27];
const ROUNDS = ['R1','R2','R3','R4','R5','R6','R7','R8'];
const POB_REF = [2208470,2209774,2207990,2207990,1654743,1496028,1243138,974658];
const LLEGADAS = {
  years: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'],
  R5: [7381,3578,16267,37851,234147,525236,415920,163149,146680,70042,109,null,null],
  R6: [3996,8630,32213,70081,202288,383417,385250,155257,120671,87358,25024,null,null],
  R7: [6153,14763,13824,55198,100889,243071,319211,147650,142948,97432,62421,4588,null],
  R8: [1093,2689,9600,34044,49157,153189,223378,165978,134202,94894,62439,36919,2328]
};
const MUJERES = [49.60,49.34,49.13,49.49,49.60,50.28,50.75,51.02];
const TRABAJANDO = [57.45,55.07,53.51,57.90,56.03,58.40,59.58,64.06];
const BUSCANDO = [11.90,14.03,11.88,12.26,11.69,9.72,8.05,5.09];
const R58 = ['R5','R6','R7','R8'];
const SALUD = [63.96,66.12,66.56,70.06];
const PPT = [56.71,63.66,66.98,65.60];
const BANCO = [26.34,27.64,28.77,42.73];
const PENSION = [9.43,10.59,12.61,11.03];
const COHORTE_SALUD = [['≤ 2017',86.1],['2018–2019',83.0],['2020–2021',72.2],['2022 +',33.7]];

// Ingreso R8 por departamento (nombres del GeoJSON DANE)
const INGRESO_R8 = [
  ['NORTE DE SANTANDER',56.29],['LA GUAJIRA',22.35],['ARAUCA',12.35],['BOGOTÁ, D.C.',7.36],
  ['ANTIOQUIA',0.92],['ATLÁNTICO',0.19],['NARIÑO',0.21],['CESAR',0.09],['VICHADA',0.10],['GUAINÍA',0.05]
];
const RESIDENCIA = [
  ['BOGOTÁ, D.C.',21.0],['ANTIOQUIA',13.9],['NORTE DE SANTANDER',11.8],
  ['ATLÁNTICO',7.3],['SANTANDER',6.6],['LA GUAJIRA',5.9]
];
const ORIGEN_VEN = [
  ['Zulia',19.32],['Distrito Capital',13.24],['Aragua',9.41],['Táchira',8.75],['Carabobo',6.90]
];

// Arcos migratorios (coords [lng, lat])
const ARCOS = [
  {coords: [[-71.61,10.63],[-72.50,7.91]]},   // Maracaibo → Cúcuta
  {coords: [[-72.23,7.77],[-72.50,7.91]]},    // San Cristóbal → Cúcuta
  {coords: [[-70.21,11.38],[-72.91,11.54]]},  // Falcón → Riohacha
  {coords: [[-66.90,10.48],[-74.08,4.61]]},   // Caracas → Bogotá
  {coords: [[-68.00,10.18],[-75.56,6.25]]},   // Valencia → Medellín
  {coords: [[-70.74,7.99],[-70.76,7.09]]}     // Rubio → Arauca
];

// Forest plots
const FOREST_EXP = [
  {name:'ln PIB Venezuela', coef:4.965, se:1.795, sig:'***'},
  {name:'ln PIB Colombia', coef:-11.069, se:5.274, sig:'**'},
  {name:'Frontera cerrada', coef:-2.425, se:1.332, sig:'*'},
  {name:'Apertura parcial', coef:-0.667, se:0.621, sig:''},
  {name:'IMR (selección)', coef:17.179, se:7.386, sig:'**'}
];
const FOREST_IMP = [
  {name:'ln PIB Venezuela', coef:2.130, se:0.532, sig:'***'},
  {name:'ln PIB Colombia', coef:2.011, se:1.226, sig:''},
  {name:'Frontera cerrada', coef:5.024, se:3.234, sig:''},
  {name:'Apertura parcial', coef:4.437, se:2.972, sig:''},
  {name:'IMR (selección)', coef:-32.078, se:19.416, sig:'*'}
];
const FOREST_M = [
  {name:'M1 · Mujer (escolaridad)', coef:0.4377, se:0.1229, sig:'***'},
  {name:'M3 · Escolaridad (empleo)', coef:0.0122, se:0.0021, sig:'***'},
  {name:'M3 · Mujer (empleo)', coef:-0.2997, se:0.0203, sig:'***'},
  {name:'M4 · Escolaridad (ingreso)', coef:0.0137, se:0.0589, sig:'n.s.'},
  {name:'M4 · Mujer (ingreso)', coef:-0.7092, se:0.2908, sig:'**'}
];

// ---------- Fábricas de gráficas ----------
const charts = {};
function mkChart(id, option) {
  const el = document.getElementById(id);
  if (!el) return null;
  if (charts[id]) { charts[id].setOption(option); charts[id].resize(); return charts[id]; }
  const ch = echarts.init(el, null, { renderer: 'canvas' });
  ch.setOption(option);
  charts[id] = ch;
  return ch;
}

function axisStyle(extra = {}) {
  return Object.assign({
    axisLine: { lineStyle: { color: 'rgba(159,176,195,0.35)' } },
    axisLabel: { color: C.muted, fontFamily: BASE_TEXT.fontFamily, fontSize: 13 },
    splitLine: { lineStyle: { color: C.grid } }
  }, extra);
}
const TT = {
  backgroundColor: 'rgba(6,13,22,0.94)',
  borderColor: 'rgba(212,175,55,0.4)',
  textStyle: { color: C.ink, fontSize: 14 },
  trigger: 'axis'
};

function optSpark() {
  return {
    grid: { left: 6, right: 6, top: 14, bottom: 24 },
    xAxis: { type: 'category', data: YEARS_1320, axisLabel: { color: C.muted, fontSize: 11 }, axisLine: { lineStyle: { color: C.grid } }, axisTick: { show: false } },
    yAxis: { show: false, min: 0 },
    tooltip: { ...TT, valueFormatter: v => fmtEs(v, 1) + ' M USD' },
    series: [{
      type: 'line', data: TOTAL_1320, smooth: 0.35, symbol: 'circle', symbolSize: 5,
      lineStyle: { color: C.gold, width: 2.5 }, itemStyle: { color: C.gold },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
        { offset: 0, color: 'rgba(212,175,55,0.35)' }, { offset: 1, color: 'rgba(212,175,55,0.02)' }] } },
      animationDuration: 1600
    }]
  };
}

function optFlows() {
  const bands = [
    [{ xAxis: '2015' }, { xAxis: '2016', itemStyle: { color: C.red }, label: { show: true, position: 'insideTop', color: '#e0604f', fontSize: 12, formatter: 'frontera cerrada' } }],
    [{ xAxis: '2017' }, { xAxis: '2018', itemStyle: { color: C.orange }, label: { show: true, position: 'insideTop', color: '#e08a3c', fontSize: 12, formatter: 'parcial' } }],
    [{ xAxis: '2019' }, { xAxis: '2021', itemStyle: { color: C.red }, label: { show: true, position: 'insideTop', color: '#e0604f', fontSize: 12, formatter: 'cerrada' } }],
    [{ xAxis: '2022' }, { xAxis: '2022', itemStyle: { color: C.orange }, label: { show: true, position: 'insideTop', color: '#e08a3c', fontSize: 12, formatter: 'parcial' } }]
  ];
  return {
    grid: { left: 70, right: 26, top: 48, bottom: 40 },
    legend: { top: 6, textStyle: { color: C.ink, fontSize: 14 }, itemWidth: 22 },
    tooltip: { ...TT, valueFormatter: v => fmtEs(v, 1) + ' M USD' },
    xAxis: { type: 'category', data: YEARS, boundaryGap: false, ...axisStyle() },
    yAxis: { type: 'value', name: 'millones USD', nameTextStyle: { color: C.muted }, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: v => fmtInt(v) } },
    series: [
      { name: 'Exportaciones VEN → COL', type: 'line', data: EXP_M, smooth: 0.25, symbol: 'circle', symbolSize: 7,
        lineStyle: { color: C.gold, width: 3.5 }, itemStyle: { color: C.gold },
        animationDuration: 2200, markArea: { silent: true, data: bands } },
      { name: 'Importaciones COL → VEN', type: 'line', data: IMP_M, smooth: 0.25, symbol: 'circle', symbolSize: 7,
        lineStyle: { color: C.electric, width: 3.5 }, itemStyle: { color: C.electric }, animationDuration: 2200 }
    ]
  };
}

function optMargins() {
  return {
    grid: { left: 64, right: 70, top: 48, bottom: 40 },
    legend: { top: 6, textStyle: { color: C.ink, fontSize: 14 } },
    tooltip: { ...TT },
    xAxis: { type: 'category', data: YEARS, ...axisStyle() },
    yAxis: [
      { type: 'value', name: '% productos activos', max: 100, nameTextStyle: { color: C.muted }, ...axisStyle() },
      { type: 'value', name: 'M USD / producto', nameTextStyle: { color: C.muted }, ...axisStyle(), splitLine: { show: false } }
    ],
    series: [
      { name: 'Margen extensivo (%)', type: 'line', data: MEXT, smooth: 0.3, symbol: 'circle', symbolSize: 7,
        lineStyle: { color: C.gold, width: 3.5 }, itemStyle: { color: C.gold }, animationDuration: 1800 },
      { name: 'Margen intensivo (M USD)', type: 'bar', yAxisIndex: 1, data: MINT, barWidth: 16,
        itemStyle: { color: 'rgba(74,168,255,0.55)', borderColor: C.electric, borderWidth: 1 }, animationDuration: 1800 }
    ]
  };
}

function optHeatmap(hm) {
  const maxLog = Math.log10(1 + Math.max(...hm.values.map(v => v[2])));
  return {
    grid: { left: 210, right: 20, top: 10, bottom: 60 },
    tooltip: { ...TT, trigger: 'item', formatter: p => {
      const v = hm.values[p.dataIndex];
      return `<b>${hm.products[v[1]]}</b><br/>${hm.years[v[0]]}: <b>${v[2] > 0 ? 'USD ' + fmtInt(Math.round(v[2])) : '0'}</b>`;
    } },
    xAxis: { type: 'category', data: hm.years, ...axisStyle(), splitArea: { show: false } },
    yAxis: { type: 'category', data: hm.products.map(p => p.length > 34 ? p.slice(0, 33) + '…' : p), inverse: true,
      axisLabel: { color: C.muted, fontSize: 9.5, fontFamily: BASE_TEXT.fontFamily }, axisLine: { show: false }, axisTick: { show: false } },
    visualMap: {
      min: 0, max: maxLog, calculable: false, orient: 'horizontal', left: 'center', bottom: 0,
      text: ['mayor flujo', 'cero'], textStyle: { color: C.muted, fontSize: 12 },
      inRange: { color: ['#101f31', '#1d3a5f', '#2e75b6', '#7fb2e5', '#d4af37'] },
      dimension: 2
    },
    series: [{
      type: 'heatmap',
      data: hm.values.map(v => [v[0], v[1], v[2] > 0 ? Math.log10(1 + v[2]) : 0, v[2]]),
      label: { show: false },
      itemStyle: { borderColor: '#0d1b2a', borderWidth: 0.5 },
      emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(212,175,55,0.6)' } },
      animationDuration: 1400
    }]
  };
}

function optForest(rows) {
  const color = r => !r.sig || r.sig === 'n.s.' ? '#5a6b7d' : (r.coef >= 0 ? C.gold : C.electric);
  return {
    grid: { left: 210, right: 90, top: 26, bottom: 36 },
    tooltip: { ...TT, trigger: 'item', formatter: p => {
      const r = rows[p.dataIndex];
      return `<b>${r.name}</b><br/>Coeficiente: <b>${fmtEs(r.coef, 3)}</b> ${r.sig}<br/>IC 95 %: [${fmtEs(r.coef - 1.96 * r.se, 2)} ; ${fmtEs(r.coef + 1.96 * r.se, 2)}]`;
    } },
    xAxis: { type: 'value', name: 'coeficiente', nameGap: 8, nameTextStyle: { color: C.muted }, min: v => Math.floor(v.min - 1), max: v => Math.ceil(v.max + 1), ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: v => fmtEs(v, 1) } },
    yAxis: { type: 'category', data: rows.map(r => r.name), inverse: true,
      axisLabel: { color: C.ink, fontSize: 13.5, fontFamily: BASE_TEXT.fontFamily }, axisLine: { lineStyle: { color: C.grid } }, axisTick: { show: false } },
    series: [{
      type: 'custom',
      clip: true,
      encode: { x: [1, 2, 3], y: 0 },
      data: rows.map((r, i) => [i, r.coef - 1.96 * r.se, r.coef + 1.96 * r.se, r.coef]),
      renderItem: (params, api) => {
        const y = api.coord([0, api.value(0)])[1];
        const x1 = api.coord([api.value(1), 0])[0];
        const x2 = api.coord([api.value(2), 0])[0];
        const xm = api.coord([api.value(3), 0])[0];
        const r = rows[params.dataIndex];
        const col = color(r);
        return { type: 'group', children: [
          { type: 'line', shape: { x1, y1: y, x2, y2: y }, style: { stroke: col, lineWidth: 2.5 } },
          { type: 'line', shape: { x1, y1: y - 7, x2: x1, y2: y + 7 }, style: { stroke: col, lineWidth: 2.5 } },
          { type: 'line', shape: { x1: x2, y1: y - 7, x2, y2: y + 7 }, style: { stroke: col, lineWidth: 2.5 } },
          { type: 'circle', shape: { cx: xm, cy: y, r: 7 }, style: { fill: col, shadowBlur: 8, shadowColor: col } }
        ] };
      },
      markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(232,237,244,0.4)', type: 'dashed' }, label: { show: false }, data: [{ xAxis: 0 }] },
      animationDuration: 1200
    }]
  };
}

function optPobRef() {
  return {
    grid: { left: 90, right: 20, top: 30, bottom: 36 },
    tooltip: { ...TT, valueFormatter: v => fmtInt(v) },
    xAxis: { type: 'category', data: ROUNDS, ...axisStyle() },
    yAxis: { type: 'value', ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: v => fmtEs(v / 1e6, 1) + ' M' } },
    series: [{
      type: 'bar', data: POB_REF.map((v, i) => ({
        value: v,
        itemStyle: { color: i < 4 ? 'rgba(74,168,255,0.75)' : 'rgba(212,175,55,0.8)' }
      })),
      barWidth: 34,
      label: { show: true, position: 'top', color: C.ink, fontSize: 12.5, formatter: p => fmtEs(p.value / 1e6, 2) + ' M' },
      animationDuration: 1400
    }],
    graphic: [{
      type: 'text', left: 92, top: 34,
      style: { text: 'R1–R4: panel · R5–R8: transversal (nuevo marco muestral)', fill: C.muted, fontSize: 12.5, fontFamily: BASE_TEXT.fontFamily }
    }]
  };
}

function optLlegadas(allSeries) {
  const series = [{
    name: 'R5 (2023)', type: 'line', data: LLEGADAS.R5, smooth: 0.25, symbol: 'circle', symbolSize: 6,
    lineStyle: { color: C.gold, width: 3.5 }, itemStyle: { color: C.gold }, z: 5,
    markPoint: { data: [{ coord: ['2018', 525236], value: 'pico 2018: 525 mil', label: { color: C.gold, fontSize: 13, fontWeight: 700 }, itemStyle: { color: C.gold }, symbolSize: 46 }] },
    markArea: { silent: true, data: [
      [{ xAxis: '2017', label: { color: '#e0604f', fontSize: 11, position: 'insideTop', formatter: 'hiperinflación' } }, { xAxis: '2018', itemStyle: { color: C.red } }],
      [{ xAxis: '2020', label: { color: C.muted, fontSize: 11, position: 'insideTop', formatter: 'pandemia' } }, { xAxis: '2020', itemStyle: { color: 'rgba(159,176,195,0.10)' } }]
    ] },
    animationDuration: 2000
  }];
  if (allSeries) {
    [['R6 (2023)', LLEGADAS.R6, 'rgba(74,168,255,0.85)'], ['R7 (2024)', LLEGADAS.R7, 'rgba(74,168,255,0.5)'], ['R8 (2025)', LLEGADAS.R8, 'rgba(159,176,195,0.55)']]
      .forEach(([n, d, c]) => series.push({ name: n, type: 'line', data: d, smooth: 0.25, symbol: 'none',
        lineStyle: { color: c, width: 2, type: 'dashed' }, itemStyle: { color: c }, animationDuration: 1600 }));
  }
  return {
    grid: { left: 76, right: 24, top: 44, bottom: 36 },
    legend: { top: 4, textStyle: { color: C.ink, fontSize: 13 } },
    tooltip: { ...TT, valueFormatter: v => v == null ? '—' : fmtInt(v) },
    xAxis: { type: 'category', data: LLEGADAS.years, boundaryGap: false, ...axisStyle() },
    yAxis: { type: 'value', name: 'personas', nameTextStyle: { color: C.muted }, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: v => fmtInt(v / 1000) + ' mil' } },
    series
  };
}

// Mapas coropléticos (GeoJSON se precargan en boot)
let geoCol = null, geoVen = null;

function optColombia(layer) { // layer: 'ingreso' | 'residencia'
  const data = (layer === 'ingreso' ? INGRESO_R8 : RESIDENCIA).map(([name, value]) => ({ name, value }));
  const series = [{
    type: 'map', geoIndex: 0, // usa el MISMO sistema de coordenadas que las flechas
    data,
    emphasis: { label: { show: true, color: '#fff', fontSize: 12 } },
    select: { disabled: true },
    animationDurationUpdate: 900
  }];
  if (layer === 'ingreso') {
    series.push({
      type: 'lines', coordinateSystem: 'geo', zlevel: 2,
      effect: { show: true, period: 5, trailLength: 0.4, symbol: 'arrow', symbolSize: 5, color: C.gold },
      lineStyle: { color: C.gold, width: 1.4, opacity: 0.55, curveness: 0.25 },
      data: ARCOS
    });
  }
  return {
    tooltip: { ...TT, trigger: 'item', formatter: p => isNaN(p.value) ? p.name : `${p.name}: <b>${fmtEs(p.value, 1)} %</b>` },
    visualMap: {
      min: 0, max: 56, left: 6, bottom: 6, text: ['56 %', '0 %'], textStyle: { color: C.muted, fontSize: 11 },
      inRange: { color: ['#13253a', '#1d3a5f', '#2e75b6', '#d4af37'] }, calculable: false, itemWidth: 12, itemHeight: 90
    },
    geo: { map: 'colombia', roam: false, layoutCenter: ['50%', '50%'], layoutSize: '96%',
      itemStyle: { areaColor: '#13253a', borderColor: 'rgba(74,168,255,0.35)', borderWidth: 0.8 },
      emphasis: { itemStyle: { areaColor: '#2e5a86' }, label: { color: '#fff' } }, label: { show: false } },
    series
  };
}

function optVenezuela() {
  return {
    tooltip: { ...TT, trigger: 'item', formatter: p => isNaN(p.value) ? p.name : `${p.name}: <b>${fmtEs(p.value, 1)} %</b>` },
    visualMap: {
      min: 0, max: 20, left: 6, bottom: 6, text: ['19,3 %', '0 %'], textStyle: { color: C.muted, fontSize: 11 },
      inRange: { color: ['#13253a', '#1d3a5f', '#2e75b6', '#d4af37'] }, calculable: false, itemWidth: 12, itemHeight: 90
    },
    series: [{
      type: 'map', map: 'venezuela', roam: false, layoutCenter: ['50%', '50%'], layoutSize: '96%',
      data: ORIGEN_VEN.map(([name, value]) => ({ name, value })),
      itemStyle: { areaColor: '#13253a', borderColor: 'rgba(74,168,255,0.35)', borderWidth: 0.8 },
      emphasis: { itemStyle: { areaColor: '#2e5a86' }, label: { show: true, color: '#fff', fontSize: 12 } },
      label: { show: false }, select: { disabled: true },
      animationDuration: 1200
    }]
  };
}

function optEdad() {
  return {
    grid: { left: 60, right: 14, top: 26, bottom: 30 },
    tooltip: { ...TT, valueFormatter: v => fmtEs(v, 1) + ' %' },
    xAxis: { type: 'category', data: ['15–24', '25–34', '35–44', '45–54', '55 +'], ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, fontSize: 12 } },
    yAxis: { type: 'value', max: 40, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: '{value} %' } },
    series: [{ type: 'bar', data: [28.78, 33.29, 19.42, 9.86, 8.64].map((v, i) => ({ value: v, itemStyle: { color: i === 1 ? C.gold : 'rgba(74,168,255,0.6)' } })),
      barWidth: 30, label: { show: true, position: 'top', color: C.ink, fontSize: 12, formatter: p => fmtEs(p.value, 1) } }]
  };
}

function optMujeres() {
  return {
    grid: { left: 52, right: 20, top: 26, bottom: 30 },
    tooltip: { ...TT, valueFormatter: v => fmtEs(v, 1) + ' %' },
    xAxis: { type: 'category', data: ROUNDS, ...axisStyle() },
    yAxis: { type: 'value', min: 48, max: 52, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: '{value} %' } },
    series: [{ type: 'line', data: MUJERES, smooth: 0.3, symbol: 'circle', symbolSize: 7,
      lineStyle: { color: C.electric, width: 3 }, itemStyle: { color: C.electric },
      areaStyle: { color: 'rgba(74,168,255,0.10)' },
      markLine: { silent: true, symbol: 'none', label: { color: C.muted, formatter: '50 %', fontSize: 11 }, lineStyle: { color: 'rgba(232,237,244,0.35)', type: 'dashed' }, data: [{ yAxis: 50 }] } }]
  };
}

function optEducacion() {
  const data = [['Bachillerato', 52.5], ['Primaria', 26.0], ['Técnico/tecnológico', 9.5], ['Universitario', 7.9], ['Ninguno', 2.7], ['Posgrado', 0.3]];
  return {
    grid: { left: 118, right: 40, top: 10, bottom: 26 },
    tooltip: { ...TT, trigger: 'item', valueFormatter: v => fmtEs(v, 1) + ' %' },
    xAxis: { type: 'value', max: 60, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: '{value} %' } },
    yAxis: { type: 'category', data: data.map(d => d[0]), inverse: true,
      axisLabel: { color: C.ink, fontSize: 12, fontFamily: BASE_TEXT.fontFamily }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: data.map((d, i) => ({ value: d[1], itemStyle: { color: i === 0 ? C.gold : 'rgba(74,168,255,0.6)' } })),
      barWidth: 16, label: { show: true, position: 'right', color: C.ink, fontSize: 12, formatter: p => fmtEs(p.value, 1) } }]
  };
}

function optLaboral() {
  return {
    grid: { left: 56, right: 26, top: 46, bottom: 36 },
    legend: { top: 4, textStyle: { color: C.ink, fontSize: 14 } },
    tooltip: { ...TT, valueFormatter: v => fmtEs(v, 1) + ' %' },
    xAxis: { type: 'category', data: ROUNDS, boundaryGap: false, ...axisStyle() },
    yAxis: { type: 'value', max: 75, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: '{value} %' } },
    series: [
      { name: 'Trabajando', type: 'line', data: TRABAJANDO, smooth: 0.3, symbol: 'circle', symbolSize: 7,
        lineStyle: { color: C.gold, width: 3.5 }, itemStyle: { color: C.gold },
        areaStyle: { color: 'rgba(212,175,55,0.08)' },
        markPoint: { data: [{ type: 'max', label: { color: C.gold, formatter: p => fmtEs(p.value, 1) + ' %', fontSize: 13, fontWeight: 700 }, itemStyle: { color: C.gold } }] } },
      { name: 'Buscando trabajo', type: 'line', data: BUSCANDO, smooth: 0.3, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: C.electric, width: 3 }, itemStyle: { color: C.electric } }
    ]
  };
}

function optProteccion() {
  return {
    grid: { left: 52, right: 24, top: 46, bottom: 32 },
    legend: { top: 4, textStyle: { color: C.ink, fontSize: 13 }, itemWidth: 18 },
    tooltip: { ...TT, valueFormatter: v => fmtEs(v, 1) + ' %' },
    xAxis: { type: 'category', data: R58, boundaryGap: false, ...axisStyle() },
    yAxis: { type: 'value', max: 80, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, formatter: '{value} %' } },
    series: [
      { name: 'Salud', type: 'line', data: SALUD, smooth: 0.3, symbol: 'circle', symbolSize: 6, lineStyle: { color: C.gold, width: 3 }, itemStyle: { color: C.gold } },
      { name: 'PPT', type: 'line', data: PPT, smooth: 0.3, symbol: 'circle', symbolSize: 6, lineStyle: { color: C.electric, width: 3 }, itemStyle: { color: C.electric } },
      { name: 'Bancarización', type: 'line', data: BANCO, smooth: 0.3, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#6bcf7f', width: 3 }, itemStyle: { color: '#6bcf7f' } },
      { name: 'Pensiones', type: 'line', data: PENSION, smooth: 0.3, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#e0604f', width: 2.5, type: 'dashed' }, itemStyle: { color: '#e0604f' } }
    ]
  };
}

function optCohortes() {
  return {
    grid: { left: 84, right: 40, top: 8, bottom: 26 },
    tooltip: { ...TT, trigger: 'item', valueFormatter: v => fmtEs(v, 1) + ' %' },
    xAxis: { type: 'value', max: 100, ...axisStyle(), axisLabel: { ...axisStyle().axisLabel, fontSize: 11, formatter: '{value} %' } },
    yAxis: { type: 'category', data: COHORTE_SALUD.map(d => d[0]), inverse: true,
      axisLabel: { color: C.ink, fontSize: 12.5, fontFamily: BASE_TEXT.fontFamily }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: COHORTE_SALUD.map(d => ({ value: d[1], itemStyle: { color: d[1] > 60 ? C.gold : (d[1] > 40 ? '#2e75b6' : '#e0604f') } })),
      barWidth: 20, label: { show: true, position: 'right', color: C.ink, fontSize: 12.5, fontWeight: 600, formatter: p => fmtEs(p.value, 1) + ' %' } }]
  };
}

// ---------- Globos 3D ----------
let worldGeo = null;
const globes = {};

function makeGlobe(id, { altitude = 2.1, lat = 8, lng = -66, highlight = false, dim = 0 } = {}) {
  const el = document.getElementById(id);
  if (!el || !worldGeo) return null;
  const g = Globe()(el)
    .width(1600).height(900)
    .backgroundColor('rgba(0,0,0,0)')
    .showAtmosphere(true).atmosphereColor('#4aa8ff').atmosphereAltitude(0.16)
    .polygonsData(worldGeo.features)
    .polygonAltitude(0.012)
    .polygonCapColor(f => {
      if (f.properties.name === 'Venezuela') return highlight ? 'rgba(212,175,55,0.85)' : 'rgba(212,175,55,0.35)';
      if (f.properties.name === 'Colombia') return highlight ? 'rgba(74,168,255,0.85)' : 'rgba(74,168,255,0.30)';
      return dim ? 'rgba(22,38,58,0.55)' : 'rgba(24,44,66,0.92)';
    })
    .polygonSideColor(() => 'rgba(0,0,0,0)')
    .polygonStrokeColor(() => 'rgba(74,168,255,0.22)')
    .polygonsTransitionDuration(800);
  g.globeMaterial().color.set('#0d1f33');
  g.pointOfView({ lat, lng, altitude }, 0);
  g.controls().autoRotate = true;
  g.controls().autoRotateSpeed = 0.55;
  g.controls().enableZoom = false;
  g.controls().enablePan = false;
  globes[id] = g;
  return g;
}

function globe2Zoom() {
  const g = globes.globe2;
  if (!g) return;
  g.controls().autoRotate = false;
  g.pointOfView({ lat: 8.5, lng: -70.5, altitude: 0.85 }, 2400);
  g.polygonCapColor(f => {
    if (f.properties.name === 'Venezuela') return 'rgba(212,175,55,0.95)';
    if (f.properties.name === 'Colombia') return 'rgba(74,168,255,0.9)';
    return 'rgba(22,38,58,0.5)';
  });
  g.arcsData(ARCO_GLOBE)
    .arcColor(() => ['rgba(212,175,55,0.85)', 'rgba(74,168,255,0.85)'])
    .arcStroke(0.6)
    .arcDashLength(0.45).arcDashGap(0.9).arcDashAnimateTime(2600)
    .arcAltitude(0.18);
}
const ARCO_GLOBE = [
  { startLat: 10.63, startLng: -71.61, endLat: 7.91, endLng: -72.50 },  // Maracaibo → Cúcuta
  { startLat: 10.48, startLng: -66.90, endLat: 4.61, endLng: -74.08 },  // Caracas → Bogotá
  { startLat: 7.77, startLng: -72.23, endLat: 7.91, endLng: -72.50 },   // San Cristóbal → Cúcuta
  { startLat: 10.18, startLng: -68.00, endLat: 6.25, endLng: -75.56 },  // Valencia → Medellín
  { startLat: 11.38, startLng: -70.21, endLat: 11.54, endLng: -72.91 }  // Falcón → Riohacha
];

// ---------- Motor de navegación ----------
const slides = $$('.slide');
const TOTAL = slides.length;
let cur = 0;   // índice de diapositiva (0-based)
let step = 0;  // paso actual (0 = nada revelado)
const maxSteps = i => parseInt(slides[i].dataset.steps, 10);

const stepInd = $('#step-ind');
const notesBox = $('#notes');
const notesN = $('#notes-n');
const notesBody = $('#notes-body');

// barra lateral
const sidebar = $('#sidebar');
slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'dot';
  d.title = `Diapositiva ${i + 1}`;
  d.addEventListener('click', () => goTo(i));
  sidebar.appendChild(d);
});
const dots = $$('.dot', sidebar);

function cascade(el) {
  // filas de tabla entran una a una dentro del paso
  $$('tbody tr', el).forEach((tr, i) => {
    tr.classList.add('st');
    tr.style.transitionDelay = `${i * 110}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => tr.classList.add('on')));
  });
}
function uncascade(el) {
  $$('tbody tr', el).forEach(tr => { tr.classList.remove('on'); tr.classList.remove('st'); tr.style.transitionDelay = ''; });
}

function applyStep(i, s, forward = true) {
  const slide = slides[i];
  $$('.st', slide).forEach(el => {
    const n = parseInt(el.dataset.s, 10);
    if (el.tagName === 'TR') return; // filas se manejan por cascada
    if (n <= s) {
      if (!el.classList.contains('on')) {
        el.classList.add('on');
        if (el.hasAttribute('data-cascade')) cascade(el);
      }
    } else {
      if (el.classList.contains('on')) {
        el.classList.remove('on');
        if (el.hasAttribute('data-cascade')) {
          $$('tbody tr', el).forEach(tr => tr.classList.remove('on'));
          setTimeout(() => uncascade(el), 500);
        }
      }
    }
  });
  runActions(i, s, forward);
}

function updateHud() {
  stepInd.innerHTML = `<b>${cur + 1} / ${TOTAL}</b> · paso ${step} de ${maxSteps(cur)}`;
  dots.forEach((d, i) => {
    d.classList.toggle('now', i === cur);
    d.classList.toggle('done', i < cur);
  });
  notesN.textContent = cur + 1;
  notesBody.textContent = NOTES[cur] || '';
  $('#btn-prev').disabled = cur === 0 && step === 0;
  $('#btn-next').disabled = cur === TOTAL - 1 && step === maxSteps(cur);
}

function enterSlide(i, s, forward = true) {
  slides.forEach((sl, j) => sl.classList.toggle('active', j === i));
  cur = i; step = s;
  onEnter(i, forward);
  applyStep(i, s, forward);
  updateHud();
  // resize de charts visibles
  requestAnimationFrame(() => Object.values(charts).forEach(ch => ch.resize()));
}

function next() {
  if (step < maxSteps(cur)) { step++; applyStep(cur, step); updateHud(); }
  else if (cur < TOTAL - 1) {
    const auto = cur + 1 === 1 ? 1 : 0; // diapositiva 2: el zoom es automático (paso 1)
    enterSlide(cur + 1, auto);
  }
}
function prev() {
  if (step > (cur === 1 ? 1 : 0)) { step--; applyStep(cur, step, false); updateHud(); }
  else if (cur > 0) enterSlide(cur - 1, maxSteps(cur - 1), false);
}
function goTo(i) { enterSlide(i, maxSteps(i), false); }

// ---------- Acciones por paso (gráficas, contadores, globo) ----------
const inited = new Set();

function runActions(i, s, forward) {
  if (i === 9) { // diapositiva 10: contadores
    animateCounter('cnt-exp', s >= 3, -93.6, v => `-${fmtEs(Math.abs(v), 1)} %`, forward);
    animateCounter('cnt-imp', s >= 4, -91.3, v => `-${fmtEs(Math.abs(v), 1)} %`, forward);
  }
  if (i === 14) { // diapositiva 15: contador stock
    animateCounter('cnt-stock', s >= 2, 2.86, v => `${fmtEs(v, 2)} M`, forward);
  }
  if (i === 15) { // diapositiva 16: superponer rondas
    const ch = charts.c16; if (ch) ch.setOption(optLlegadas(s >= 3));
  }
  if (i === 16) { // diapositiva 17: capa ingreso → residencia
    const ch = charts.c17;
    // replaceMerge: al pasar a residencia desaparecen las flechas de ingreso
    if (ch) ch.setOption(optColombia(s >= 3 ? 'residencia' : 'ingreso'), { replaceMerge: ['series'] });
  }
  if (i === 1 && s >= 1) globe2Zoom(); // diapositiva 2: zoom automático
}

const counterState = {};
function animateCounter(id, active, target, format, forward) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!active) {
    counterState[id] = 0;
    el.textContent = id === 'cnt-stock' ? '0' : '-0,0 %';
    return;
  }
  if (counterState[id] === target) { el.textContent = format(target); return; }
  const from = counterState[id] || 0;
  const obj = { v: from };
  gsap.to(obj, {
    v: target, duration: forward ? 1.6 : 0.3, ease: 'power2.out',
    onUpdate: () => { el.textContent = format(obj.v); },
    onComplete: () => { counterState[id] = target; }
  });
}

function onEnter(i, forward) {
  if (inited.has(i)) return;
  inited.add(i);
  switch (i) {
    case 0: makeGlobe('globe1', { altitude: 2.2, lat: 12, lng: -63 }); break;
    case 1: makeGlobe('globe2', { altitude: 2.2, lat: 12, lng: -63 }); break;
    case 2: mkChart('c3', optSpark()); break;
    case 9: mkChart('c10', optFlows()); break;
    case 10: mkChart('c11', optMargins()); break;
    case 11:
      fetch('data/heatmap_exp.json').then(r => r.json()).then(hm => mkChart('c12', optHeatmap(hm)));
      break;
    case 12: mkChart('c13', optForest(FOREST_EXP)); break;
    case 13: mkChart('c14', optForest(FOREST_IMP)); break;
    case 14: mkChart('c15', optPobRef()); break;
    case 15: mkChart('c16', optLlegadas(false)); break;
    case 16: mkChart('c17', optColombia('ingreso')); break;
    case 17: mkChart('c18', optVenezuela()); break;
    case 18:
      mkChart('c19a', optEdad());
      mkChart('c19b', optMujeres());
      mkChart('c19c', optEducacion());
      break;
    case 19: mkChart('c20', optLaboral()); break;
    case 20: mkChart('c21', optProteccion()); break;
    case 21:
      mkChart('c22a', optCohortes());
      mkChart('c22b', optForest(FOREST_M));
      break;
    case 23: makeGlobe('globe3', { altitude: 2.6, lat: 10, lng: -68, dim: 1 }); break;
  }
}

// ---------- Controles ----------
$('#btn-next').addEventListener('click', next);
$('#btn-prev').addEventListener('click', prev);

document.addEventListener('keydown', e => {
  const k = e.key;
  if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') { e.preventDefault(); next(); }
  else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); prev(); }
  else if (k === 'f' || k === 'F') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  else if (k === 'n' || k === 'N') notesBox.classList.toggle('open');
});

// ---------- Escalado 16:9 ----------
function fit() {
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const s = Math.min(vw / 1600, vh / 900);
  $('#stage').style.transform = `scale(${s})`;
  Object.values(charts).forEach(ch => ch.resize());
}
window.addEventListener('resize', fit);
if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => setTimeout(fit, 250));

// ---------- Zonas táctiles (móvil/tablet) ----------
// Borde derecho = Siguiente, borde izquierdo = Anterior.
// El indicador de paso alterna las notas del expositor en pantallas táctiles.
const tapNext = $('#tap-next'), tapPrev = $('#tap-prev');
if (tapNext) tapNext.addEventListener('click', () => next());
if (tapPrev) tapPrev.addEventListener('click', () => prev());
if (window.matchMedia('(pointer: coarse)').matches) {
  stepInd.style.cursor = 'pointer';
  stepInd.title = 'Toca para ver las notas del expositor';
  stepInd.addEventListener('click', () => notesBox.classList.toggle('open'));
}

// ---------- Boot ----------
Promise.all([
  fetch('data/world.geojson').then(r => r.json()),
  fetch('data/colombia.geojson').then(r => r.json()),
  fetch('data/venezuela.geojson').then(r => r.json())
]).then(([world, col, ven]) => {
  worldGeo = world;
  geoCol = col; geoVen = ven;
  // ECharts une los datos por properties.name: normalizar desde los campos fuente
  col.features.forEach(f => { f.properties.name = f.properties.DPTO_CNMBR; });
  ven.features.forEach(f => { f.properties.name = f.properties.shapeName; });
  echarts.registerMap('colombia', col);
  echarts.registerMap('venezuela', ven);
  fit();
  enterSlide(0, 0);
}).catch(err => {
  console.error('Error cargando GeoJSON', err);
  fit();
  enterSlide(0, 0);
});

/**
 * Empieza con IA — plan de estudio realizable de 90 días.
 * Las tareas son guías, no certificaciones ni promesas de productividad.
 */
export interface PlanTask {
  id: string;
  phase: 1 | 2 | 3 | 4;
  days: string;
  title: string;
  action: string;
  deliverable: string;
  pass: string;
}

export const PLAN_STORAGE_KEY = "empieza-con-ia:plan-v1";
export const PLAN_CHANGED = "empieza-con-ia:plan-updated";

export const PLAN_TASKS: readonly PlanTask[] = [
  {id:"p1-objetivo",phase:1,days:"01–05",title:"Define una tarea concreta",action:"Elige un problema repetitivo que ya tengas y escribe qué entrada, resultado y usuario tendría.",deliverable:"Ficha de problema de una página",pass:"La tarea se puede explicar sin mencionar una marca o modelo"},
  {id:"p1-pruebas",phase:1,days:"06–10",title:"Compara tres intentos",action:"Con los mismos datos ficticios, prueba tres instrucciones y documenta qué cambió y dónde fallaron.",deliverable:"Matriz de tres prompts y resultados",pass:"Incluye al menos un error reconocido y una comprobación manual"},
  {id:"p1-privacidad",phase:1,days:"11–14",title:"Identifica datos que no compartirás",action:"Separa datos públicos, privados, confidenciales y autorizados. Excluye secretos y datos reales no necesarios.",deliverable:"Inventario y checklist de privacidad",pass:"Ningún token, contraseña o dato personal real en las pruebas"},
  {id:"p2-terminal",phase:2,days:"15–20",title:"Instala un entorno mínimo",action:"Prepara editor, Git y un terminal; crea una carpeta con README y .gitignore.",deliverable:"Primer repositorio local documentado",pass:"Puedes abrirlo, modificarlo y registrar sus cambios"},
  {id:"p2-script",phase:2,days:"21–26",title:"Escribe un script útil",action:"Crea un programa que lea un archivo de ejemplo y devuelva una salida transformada verificable.",deliverable:"Script y fichero de ejemplo",pass:"Devuelve el resultado esperado con dos entradas distintas"},
  {id:"p2-tests",phase:2,days:"27–30",title:"Añade pruebas y revisión",action:"Escribe dos pruebas: una positiva y otra negativa. Ejecuta el script sin copiar instrucciones desconocidas.",deliverable:"Informe simple de pruebas",pass:"Las dos pruebas ejecutan y no hay credenciales en Git"},
  {id:"p3-api",phase:3,days:"31–39",title:"Diseña una integración controlada",action:"Dibuja el camino solicitud → servidor → API → respuesta, con claves solo en el servidor.",deliverable:"Diagrama y contrato de entrada/salida",pass:"Las credenciales nunca se exponen en frontend"},
  {id:"p3-presupuesto",phase:3,days:"40–49",title:"Establece límites de costes",action:"Fija presupuesto máximo, límite de peticiones, errores recuperables y apagado manual.",deliverable:"Tabla de escenarios de consumo",pass:"Sabes qué acción impide gastar por encima del presupuesto"},
  {id:"p3-evaluacion",phase:3,days:"50–60",title:"Crea un conjunto de evaluación",action:"Prepara diez ejemplos ficticios, incluye casos contradictorios y señala respuestas incompletas.",deliverable:"10 casos y rúbrica de calidad",pass:"Puede compararse un cambio de versión con los mismos criterios"},
  {id:"p4-prototipo",phase:4,days:"61–70",title:"Entrega un prototipo navegable",action:"Añade página de inicio, propósito claro, formulario de ejemplo, estados de carga y mensaje de error.",deliverable:"Prototipo funcional en entorno local",pass:"Una persona entiende qué hace sin que se lo expliques"},
  {id:"p4-seguridad",phase:4,days:"71–81",title:"Revisa accesibilidad y seguridad",action:"Comprueba teclado, móvil, límites del backend, datos introducidos y pruebas negativas.",deliverable:"Checklist de riesgos y errores",pass:"No hay acciones externas sin autenticación ni secretos en cliente"},
  {id:"p4-entrega",phase:4,days:"82–90",title:"Prepara una entrega revisable",action:"Documenta instalación, funcionamiento real, pruebas, límites, licencia y condiciones de retirada.",deliverable:"README completo y acta de decisión",pass:"Otra persona puede repetir la prueba y verificar la promesa del producto"},
] as const;

const allowed = new Set(PLAN_TASKS.map(task => task.id));

export function parsePlan(raw: string | null): string[] {
  if (!raw || raw.length > 20_000) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return [...new Set(data.filter((id): id is string => typeof id === "string" && allowed.has(id)))];
  } catch { return []; }
}

export function toggleTask(done: readonly string[], id: string): string[] {
  if (!allowed.has(id)) return [...done];
  return done.includes(id) ? done.filter(x => x !== id) : [...done, id];
}

export function completionPercent(done: readonly string[]): number {
  return Math.round(100 * PLAN_TASKS.filter(task => done.includes(task.id)).length / PLAN_TASKS.length);
}

export function planAsMarkdown(done: readonly string[]): string {
  return [
    "# Empieza con IA — mi ruta de 90 días",
    "",
    "Material de estudio educativo. Los plazos son orientativos; ninguna tarea equivale a una certificación.",
    "",
    ...([1,2,3,4] as const).flatMap(phase => [
      `## Fase ${phase}`,
      "",
      ...PLAN_TASKS.filter(task => task.phase === phase).flatMap(task => [
        `- [${done.includes(task.id) ? "x" : " "}] ${task.days}: **${task.title}**`,
        `  - Acción: ${task.action}`,
        `  - Entrega: ${task.deliverable}`,
        `  - Comprobación: ${task.pass}`,
      ]),
      "",
    ]),
    `**Avance guardado:** ${completionPercent(done)}%`,
    "",
  ].join("\n");
}

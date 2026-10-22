import { useSyncExternalStore } from "react";
import { Check, Download, RotateCcw, Upload } from "lucide-react";
import {
  PLAN_CHANGED,
  PLAN_STORAGE_KEY,
  PLAN_TASKS,
  completionPercent,
  parsePlan,
  planAsMarkdown,
  planBackup,
  parsePlanBackup,
  toggleTask,
} from "@/lib/study-plan";

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(PLAN_CHANGED, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(PLAN_CHANGED, notify);
  };
}

function snapshot() {
  try { return window.localStorage.getItem(PLAN_STORAGE_KEY) ?? "[]"; }
  catch { return "[]"; }
}

export function StudyPlanTracker() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const done = parsePlan(raw);
  const percentage = completionPercent(done);

  const save = (next: string[]) => {
    try {
      window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(PLAN_CHANGED));
    } catch {
      window.alert("No se pudo guardar el progreso. Puedes exportar la lista como Markdown.");
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([planAsMarkdown(done)], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mi-ruta-ia-90-dias.md";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadBackup = () => {
    const url = URL.createObjectURL(new Blob([planBackup(done)], {type:"application/json;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mi-ruta-ia-90-dias.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (file.size > 20_000) {
      window.alert("La copia supera 20 KB."); return;
    }
    try {
      const imported = parsePlanBackup(await file.text());
      if (window.confirm("¿Sustituir el progreso actual por " + imported.length + " tareas de esta copia?")) save(imported);
    } catch {
      window.alert("La copia no es válida: no se ha modificado tu progreso.");
    }
  };

  const reset = () => {
    if (!window.confirm("¿Borrar las tareas completadas de esta guía? Para recuperarlas necesitarás una copia JSON.")) return;
    save([]);
  };

  return (
    <section aria-labelledby="tracker-title" className="mx-auto mt-12 max-w-6xl rounded-[28px] border border-[#24465a]/20 bg-[#fefcf6] px-5 py-8 shadow-[0_18px_65px_-48px_#10334c] sm:px-9 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#916144]">PLAN OPERATIVO / LOCAL-FIRST</p>
          <h3 id="tracker-title" className="mt-3 text-2xl font-bold tracking-tight text-[#142d3a] sm:text-3xl">Doce entregables que puedes comprobar.</h3>
          <p className="mt-3 text-sm leading-7 text-[#52616a]">Cada etapa tiene acción, resultado esperado y criterio de éxito. Marca tus avances, consérvalos en este navegador y llévate una copia del itinerario.</p>
        </div>
        <div className="min-w-36 rounded-2xl border border-[#24465a]/15 bg-[#edf1ec] px-5 py-4 text-center">
          <strong className="block text-3xl font-bold tabular-nums text-[#133447]">{percentage}%</strong>
          <span className="mt-1 block text-xs text-[#58636a]">Ruta completada</span>
        </div>
      </div>
      <div className="mt-7 h-2.5 overflow-hidden rounded-full bg-[#d9e0db]" role="progressbar" aria-label="Avance del plan de 90 días" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[#276654] transition-[width] duration-300" style={{ width: `${percentage}%` }}/>
      </div>
      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {PLAN_TASKS.map((task) => {
          const checked = done.includes(task.id);
          return (
            <article key={task.id} className={`rounded-2xl border p-5 transition-colors ${checked ? "border-[#296e58]/35 bg-[#eff7ed]" : "border-[#24465a]/12 bg-white"}`}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#976147]">FASE 0{task.phase} / DÍAS {task.days}</p><h4 className="mt-2 text-lg font-bold tracking-tight text-[#142d3a]">{task.title}</h4></div>
                <button type="button" aria-label={`${checked ? "Marcar pendiente" : "Marcar completada"}: ${task.title}`} aria-pressed={checked} onClick={() => save(toggleTask(done, task.id))}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#276654] ${checked ? "border-[#276654] bg-[#276654] text-white" : "border-[#718c85] bg-white text-[#276654] hover:bg-[#edf7f0]"}`}>
                  {checked ? <Check size={20} aria-hidden="true"/> : <span className="h-3 w-3 rounded-sm border border-current" aria-hidden="true"/>}
                </button>
              </div>
              <p className="text-sm leading-7 text-[#445660]">{task.action}</p>
              <div className="mt-4 space-y-1.5 border-t border-[#24465a]/12 pt-4 text-xs leading-6 text-[#455f65]">
                <p><strong className="text-[#173e4c]">Entrega:</strong> {task.deliverable}</p>
                <p><strong className="text-[#173e4c]">Listo cuando:</strong> {task.pass}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#24465a]/15 pt-6">
        <p className="max-w-xl text-xs leading-6 text-[#58656c]">No se necesita registro. Solo se guarda el estado de las casillas en este dispositivo; no se envía a un servidor. Los días son orientativos y el aprendizaje no se certifica automáticamente.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg bg-[#1d5160] px-4 py-3 text-xs font-bold text-white hover:bg-[#143e4c]"><Download size={16} aria-hidden="true"/> Descargar mi ruta</button>
          <button type="button" onClick={downloadBackup} className="inline-flex items-center gap-2 rounded-lg border border-[#255361]/25 bg-white px-4 py-3 text-xs font-bold text-[#1d5160] hover:bg-[#f2f5f2]"><Download size={16} aria-hidden="true"/> Copia JSON</button>
          <label htmlFor="plan-backup-file" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#255361]/25 bg-white px-4 py-3 text-xs font-bold text-[#1d5160] hover:bg-[#f2f5f2]"><Upload size={16} aria-hidden="true"/> Importar progreso</label>
          <input id="plan-backup-file" aria-label="Seleccionar copia JSON del progreso" className="sr-only" type="file" accept=".json,application/json" onChange={importBackup}/>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-[#255361]/25 bg-white px-4 py-3 text-xs font-bold text-[#1d5160] hover:bg-[#f2f5f2]"><RotateCcw size={16} aria-hidden="true"/> Reiniciar</button>
        </div>
      </div>
    </section>
  );
}

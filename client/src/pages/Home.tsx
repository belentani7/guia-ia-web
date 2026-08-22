/**
 * Diseño Cuaderno de Ruta: una guía editorial asimétrica con señalización cartográfica.
 * La interfaz convierte decisiones complejas en una secuencia visible, cálida y accionable.
 */
import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Braces,
  Check,
  CircleDollarSign,
  Cloud,
  Code2,
  Compass,
  Database,
  ExternalLink,
  FileKey2,
  GitBranch,
  HardDrive,
  Laptop,
  Layers3,
  Menu,
  Route as RouteIcon,
  ServerCog,
  Sparkles,
  TerminalSquare,
  X,
} from "lucide-react";
import { useState } from "react";

type RouteKey = "explorar" | "programar" | "crear";

const routeProfiles: Record<
  RouteKey,
  {
    label: string;
    kicker: string;
    title: string;
    description: string;
    next: string;
    tool: string;
    budget: string;
    icon: typeof Sparkles;
  }
> = {
  explorar: {
    label: "Explorar",
    kicker: "Punto de partida 01",
    title: "Una tarea real antes que una suscripción.",
    description:
      "Usa un asistente en la nube para comparar respuestas, redactar, estudiar o resumir. Conserva los prompts que realmente mejoran tu trabajo.",
    next: "Prueba tres tareas reales durante una semana y anota qué cambió.",
    tool: "Asistente web o móvil gratuito",
    budget: "0 € para empezar",
    icon: Sparkles,
  },
  programar: {
    label: "Programar",
    kicker: "Punto de partida 02",
    title: "Git, terminal y una mejora cada vez.",
    description:
      "Aprende a leer diferencias, escribir un script y versionar tus cambios. La IA te acompaña; tú revisas, pruebas y decides.",
    next: "Crea un script pequeño que lea un archivo y produzca una salida útil.",
    tool: "Editor, Git y terminal",
    budget: "0–15 € al mes",
    icon: Code2,
  },
  crear: {
    label: "Crear una app",
    kicker: "Punto de partida 03",
    title: "Una API con límites, no una infraestructura enorme.",
    description:
      "Construye un flujo mínimo, protege la clave y registra coste, calidad y errores. Solo después añade datos persistentes o más modelos.",
    next: "Publica una demo que una persona pueda probar y entender.",
    tool: "API económica + backend mínimo",
    budget: "5–25 € de prueba",
    icon: Braces,
  },
};

const milestones = [
  { period: "Días 01–14", title: "Define una tarea", text: "Prompts reutilizables y una forma clara de comprobar el resultado." },
  { period: "Días 15–30", title: "Domina la base", text: "Terminal, archivos, Git y un primer programa pequeño." },
  { period: "Días 31–60", title: "Conecta una API", text: "Claves protegidas, topes de gasto y una salida estructurada." },
  { period: "Días 61–90", title: "Haz una demo", text: "Datos, evaluación y una experiencia que otra persona pueda probar." },
];

const apiOptions = [
  { name: "Gemini API", tag: "Prototipos", color: "bg-[#ecefe2] text-[#28443c]", note: "Nivel gratuito limitado y herramientas de inicio." },
  { name: "Groq API", tag: "Velocidad", color: "bg-[#e7eef2] text-[#173447]", note: "Útil para practicar límites y respuestas rápidas." },
  { name: "OpenRouter", tag: "Comparar", color: "bg-[#f6e4dc] text-[#8d3f23]", note: "Una pasarela para probar modelos con topes por clave." },
  { name: "Ollama", tag: "Local", color: "bg-[#eae8e2] text-[#3f403c]", note: "Modelos abiertos en tu propio equipo, sin coste por llamada." },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <b />
      <em />
    </span>
  );
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{index}</span>
      <div />
      <p>{children}</p>
    </div>
  );
}

export default function Home() {
  const [route, setRoute] = useState<RouteKey>("explorar");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeRoute = routeProfiles[route];
  const ActiveIcon = activeRoute.icon;

  return (
    <div id="inicio" className="min-h-screen overflow-x-hidden bg-[#f7f3ea] text-[#142d3a]">
      <header className="site-header">
        <a href="#inicio" className="brand-lockup" aria-label="Empieza con IA, inicio">
          <BrandMark />
          <span>Empieza<br />con IA</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#ruta">Tu ruta</a>
          <a href="#modelos">Modelos</a>
          <a href="#coste">Coste</a>
          <a href="#datos">Datos</a>
        </nav>
        <Button className="header-cta" onClick={() => scrollTo("ruta")}>
          Trazar mi ruta <ArrowDownRight size={16} />
        </Button>
        <button
          type="button"
          className="mobile-menu-button"
          aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Navegación móvil">
            {[
              ["Tu ruta", "ruta"],
              ["Modelos", "modelos"],
              ["Coste", "coste"],
              ["Datos", "datos"],
            ].map(([label, id]) => (
              <button key={id} type="button" onClick={() => { scrollTo(id); setMenuOpen(false); }}>
                {label} <ArrowUpRight size={16} />
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Guía práctica · edición 2026</div>
            <p className="hero-index">00 / ORIENTACIÓN</p>
            <h1>Tu primera decisión no es comprar.<br /><em>Es elegir una tarea.</em></h1>
            <p className="hero-description">
              Una ruta clara para entender modelos, APIs, equipo y datos sin gastar antes de tener un proyecto que lo merezca.
            </p>
            <div className="hero-actions">
              <Button className="primary-action" onClick={() => scrollTo("ruta")}>
                Empezar por mi objetivo <ArrowDownRight size={18} />
              </Button>
              <button type="button" className="text-action" onClick={() => scrollTo("plan")}>Ver plan de 90 días <ArrowDownRight size={16} /></button>
            </div>
            <div className="hero-note"><BadgeCheck size={17} /> Sin compras impulsivas. Con decisiones verificables.</div>
          </div>

          <div className="hero-map" aria-label="Ilustración de una ruta de aprendizaje en IA">
            <div className="map-paper map-paper-a" />
            <div className="map-paper map-paper-b" />
            <div className="map-paper map-paper-c" />
            <div className="map-grid" />
            <div className="map-route route-one"><span className="map-point point-one" /><span className="map-point point-two" /></div>
            <div className="map-route route-two"><span className="map-point point-three" /></div>
            <div className="map-card card-brief"><span>01</span><strong>Necesidad</strong><p>Una tarea que ya existe.</p></div>
            <div className="map-card card-build"><span>02</span><strong>Prueba</strong><p>Un flujo pequeño.</p></div>
            <div className="map-card card-scale"><span>03</span><strong>Decisión</strong><p>Escalar solo si aporta.</p></div>
            <div className="compass-sigil"><Compass size={28} strokeWidth={1.4} /><i /></div>
            <div className="map-caption"><RouteIcon size={15} /> Ruta de aprendizaje / 90 días</div>
          </div>
        </section>

        <div className="route-rail" aria-hidden="true">
          <div className="rail-line" />
          <span>01</span><span>02</span><span>03</span><span>04</span>
        </div>

        <section id="ruta" className="section-block route-section">
          <div className="section-aside"><SectionLabel index="01">ELIGE TU PUNTO DE PARTIDA</SectionLabel></div>
          <div className="section-content">
            <div className="section-heading split-heading">
              <h2>La mejor herramienta<br />depende de <em>para qué la usas.</em></h2>
              <p>Elige tu objetivo. La ruta se actualiza con un siguiente paso, una herramienta inicial y un presupuesto prudente.</p>
            </div>
            <div className="route-picker" role="group" aria-label="Selecciona tu objetivo principal">
              {(Object.keys(routeProfiles) as RouteKey[]).map((key) => {
                const profile = routeProfiles[key];
                const Icon = profile.icon;
                return (
                  <button
                    type="button"
                    key={key}
                    aria-pressed={route === key}
                    className={route === key ? "route-choice active" : "route-choice"}
                    onClick={() => setRoute(key)}
                  >
                    <Icon size={20} />
                    <span>{profile.label}</span>
                    <ArrowUpRight size={16} />
                  </button>
                );
              })}
            </div>
            <article className="route-result">
              <div className="route-result-icon"><ActiveIcon size={26} /></div>
              <div className="route-result-main">
                <p className="result-kicker">{activeRoute.kicker}</p>
                <h3>{activeRoute.title}</h3>
                <p>{activeRoute.description}</p>
              </div>
              <div className="result-details">
                <div><span>Empieza con</span><strong>{activeRoute.tool}</strong></div>
                <div><span>Presupuesto</span><strong>{activeRoute.budget}</strong></div>
                <div className="next-step"><Check size={16} /><p>{activeRoute.next}</p></div>
              </div>
            </article>
          </div>
        </section>

        <section id="modelos" className="section-block model-section">
          <div className="section-aside"><SectionLabel index="02">NUBE, LOCAL O TERMINAL</SectionLabel></div>
          <div className="section-content">
            <div className="section-heading">
              <h2>Tres caminos.<br /><em>Un criterio: la tarea.</em></h2>
            </div>
            <div className="model-grid">
              <article className="model-panel cloud-panel">
                <div className="model-heading"><span className="model-number">A</span><Cloud size={23} /><span>Nube</span></div>
                <h3>Para aprender y probar sin instalar nada.</h3>
                <p>Úsala en web o móvil cuando quieras redactar, estudiar, comparar respuestas o acceder a modelos grandes desde cualquier lugar.</p>
                <div className="panel-footer"><span>Primer paso</span><strong>Un asistente gratuito</strong></div>
              </article>
              <article className="model-panel local-panel">
                <div className="model-heading"><span className="model-number">B</span><Laptop size={23} /><span>Local</span></div>
                <h3>Para experimentar con privacidad y modelos abiertos.</h3>
                <p>Instala un modelo compacto solo cuando quieras aprender el flujo local o no debas enviar cierto contenido a un servicio externo.</p>
                <div className="panel-footer"><span>Primer paso</span><strong>Ollama + modelo pequeño</strong></div>
              </article>
              <article className="model-panel terminal-panel">
                <div className="model-heading"><span className="model-number">C</span><TerminalSquare size={23} /><span>Terminal</span></div>
                <h3>Para construir, revisar y versionar con intención.</h3>
                <p>La terminal no es un modelo: es tu mesa de trabajo para archivos, Git, pruebas y asistentes de programación.</p>
                <div className="panel-footer"><span>Primer paso</span><strong>Git + editor + un script</strong></div>
              </article>
            </div>
            <div className="selection-rule"><Compass size={18} /><p><strong>Regla de elección:</strong> usa un modelo rápido y económico para tareas repetitivas; reserva el modelo más capaz para revisión, razonamiento o código difícil.</p></div>
          </div>
        </section>

        <section id="coste" className="cost-section">
          <div className="cost-intro">
            <SectionLabel index="03">GASTO CON LÍMITES</SectionLabel>
            <h2>Tu presupuesto debe seguir a la evidencia, <em>no a la curiosidad.</em></h2>
            <p>Un gasto pequeño y medido enseña más que una infraestructura cara sin usuarios. Avanza solo cuando el entregable anterior funciona.</p>
          </div>
          <div className="budget-ladder">
            <article className="budget-step step-zero"><p>FASE 0</p><h3>Descubre</h3><strong>0 €</strong><span>1–2 semanas</span><div /><small>Una tarea, tres pruebas, cero compras.</small></article>
            <article className="budget-step step-one"><p>FASE 1</p><h3>Aprende</h3><strong>0–15 €</strong><span>por mes</span><div /><small>Una única suscripción o un saldo API pequeño.</small></article>
            <article className="budget-step step-two"><p>FASE 2</p><h3>Prototipa</h3><strong>15–50 €</strong><span>por mes</span><div /><small>Solo si ya existe un flujo que una persona pueda probar.</small></article>
            <article className="budget-step step-three"><p>FASE 3</p><h3>Valida</h3><strong>50–150 €</strong><span>máximo inicial</span><div /><small>Hosting, métricas y almacenamiento con usuarios reales.</small></article>
          </div>
          <p className="cost-disclaimer"><CircleDollarSign size={16} /> Los rangos son orientativos para un proyecto de aprendizaje; cada servicio cambia sus condiciones y tarifas.</p>
        </section>

        <section className="section-block api-section">
          <div className="section-aside"><SectionLabel index="04">APIs PARA APRENDER</SectionLabel></div>
          <div className="section-content">
            <div className="section-heading split-heading">
              <h2>Prueba con límites.<br /><em>Construye con control.</em></h2>
              <p>Una API conecta tu programa a un modelo. Para empezar, crea una clave por proyecto, define un tope y registra cada error.</p>
            </div>
            <div className="api-list">
              {apiOptions.map((api, index) => (
                <article key={api.name} className="api-row">
                  <span className="api-index">0{index + 1}</span>
                  <h3>{api.name}</h3>
                  <span className={`api-tag ${api.color}`}>{api.tag}</span>
                  <p>{api.note}</p>
                  <ExternalLink size={18} />
                </article>
              ))}
            </div>
            <div className="key-warning"><FileKey2 size={21} /><p><strong>La clave es una credencial, no una configuración visual.</strong> Nunca la pongas en el navegador, el móvil, una captura o un repositorio público.</p></div>
          </div>
        </section>

        <section id="datos" className="data-section">
          <div className="data-art" aria-hidden="true">
            <div className="data-orbit orbit-a" /><div className="data-orbit orbit-b" />
            <div className="data-core"><Database size={38} /><span>datos</span></div>
            <div className="data-node node-files"><Layers3 size={20} /><span>archivos<br />+ Git</span></div>
            <div className="data-node node-sql"><HardDrive size={20} /><span>SQLite</span></div>
            <div className="data-node node-vector"><ServerCog size={20} /><span>Postgres<br />+ vectores</span></div>
          </div>
          <div className="data-copy">
            <SectionLabel index="05">DATOS SIN SOBREDISEÑO</SectionLabel>
            <h2>No necesitas una “base de datos de IA”.</h2>
            <p>Necesitas guardar datos solo cuando tu proyecto los genera, los comparte o debe recuperarlos de forma fiable. Empieza por el formato más simple que cubra esa necesidad.</p>
            <div className="data-steps">
              <div><span>1</span><p><strong>Archivos y Git</strong> para notas, prompts y código.</p></div>
              <div><span>2</span><p><strong>SQLite</strong> para una app local o un primer programa con datos.</p></div>
              <div><span>3</span><p><strong>Postgres + vectores</strong> solo si buscas documentos semánticamente o atiendes a varias personas.</p></div>
            </div>
          </div>
        </section>

        <section id="plan" className="plan-section">
          <div className="plan-header">
            <SectionLabel index="06">RUTA DE 90 DÍAS</SectionLabel>
            <h2>Aprende construyendo<br />cosas que <em>puedes enseñar.</em></h2>
          </div>
          <div className="milestone-list">
            {milestones.map((milestone, index) => (
              <article key={milestone.period} className="milestone">
                <div className="milestone-dot">{String(index + 1).padStart(2, "0")}</div>
                <p>{milestone.period}</p>
                <h3>{milestone.title}</h3>
                <span>{milestone.text}</span>
                <ArrowUpRight size={19} />
              </article>
            ))}
          </div>
          <div className="plan-close"><Bot size={20} /><p>El objetivo no es usar más herramientas. Es aprender a elegir, medir y construir con criterio.</p></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><BrandMark /><span>Empieza con IA</span></div>
        <p>Una guía de decisiones para pasar de la curiosidad a tu primer proyecto.</p>
        <a href="https://github.com/belentani7/guia-primeros-pasos-ia" target="_blank" rel="noreferrer">Ver guía completa <GitBranch size={16} /></a>
      </footer>
    </div>
  );
}

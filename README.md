# Empieza con IA — Cuaderno de Ruta

Una guía editorial y ahora **interactiva** para aprender a usar inteligencia artificial de forma crítica: elección de modelos, presupuesto, APIs, privacidad, datos y un itinerario de 90 días que se puede completar y exportar. Este proyecto conserva su diseño original de papel marfil y señales de ruta, no es una plantilla genérica.

## Lo que puedes hacer hoy

- Seleccionar **Explorar / Programar / Crear una app** y obtener un siguiente paso, herramientas y presupuesto orientativos.
- Comparar nube, modelos locales y terminal con los límites reales de cada opción.
- Recorrer el plan de 90 días con **12 acciones específicas** distribuidas en 4 fases, cada una con ejercicio, entrega y criterio de aceptación.
- Marcar tareas terminadas y consultar porcentaje real en el navegador.
- Descargar un archivo **Markdown** con tus 12 tareas y casillas completadas, sin crear cuenta ni conectar datos.
- Habilitar voluntariamente medición Umami solo cuando el operador configure un endpoint HTTPS válido y el usuario pulse el consentimiento. Sin configuración o consentimiento, la página **no carga el script de medición**.

Ninguna tarea otorga acreditación. Los presupuestos son rangos ilustrativos de aprendizaje, no precios actualizados de proveedores. La guía no envía automáticamente tu progreso a servicios externos.

## Desarrollo y comprobación

Node 22, pnpm 10.4.1 (definido en `package.json`), sin secretos necesarios para explorar la aplicación:

```bash
git clone https://github.com/belentani7/guia-ia-web.git
cd guia-ia-web
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
pnpm dev
```

El entorno de Vite muestra la aplicación; la versión de producción utiliza Vite para el frontend y Express para servir archivos estáticos.

```bash
pnpm test
pnpm run check
pnpm run build
pnpm start
```

La suite comprueba las 12 tareas, su orden/fases, selección, límites del progreso, datos locales corruptos y exportación. La CI exige instalación reproducible con lockfile, suite, TypeScript estricto y build del frontend **y** del servidor. Si los runners de GitHub no llegan a ejecutar el workflow, **no** se considera aprobado.

## Privacidad

**Plan personal** — el almacenamiento se limita a una lista de IDs de tareas completadas en `localStorage` con clave `empieza-con-ia:plan-v1`. No se guardan respuestas a prompts, claves ni información personal. El estado puede perderse al borrar datos o cambiar de dispositivo; exporta el Markdown si deseas conservar una copia.

**Analítica** — las variables opcionales `VITE_ANALYTICS_ENDPOINT` (HTTPS) y `VITE_ANALYTICS_WEBSITE_ID` permiten cargar el script Umami **solo después** de que el visitante consienta. El usuario puede desactivar el consentimiento y recargar para detener el script en esa sesión. La configuración no contiene credenciales secretas. Si se utiliza medición real, el operador debe proporcionar su política de privacidad y cumplir los requisitos legales correspondientes; la interfaz por sí sola no acredita cumplimiento normativo.

La ruta del aprendizaje es local y no es una aplicación de pagos, academia acreditada ni motor de empleo. La versión actual no ofrece cuenta, sincronización entre dispositivos o evaluación de proyectos por tutor humano.

## Estructura

```text
client/src/pages/Home.tsx            página principal, navegación y ruta
client/src/components/StudyPlanTracker.tsx   checklist accesible, persistencia, exportación
client/src/lib/study-plan.ts         fuente de verdad de las 12 entregas y reglas puras
client/src/components/AnalyticsConsent.tsx   medición opcional y con consentimiento
client/index.html                   metadatos y entrada principal
server/index.ts                     servidor Express para archivos publicados
tests/study-plan.test.ts            prueba de dominio sin red
.github/workflows/ci.yml            gates de release
```

## Licencia

MIT — Pedro Belentani, 2026. Consulta el archivo [LICENSE](LICENSE). El código propio de esta guía no implica derechos sobre los modelos, marcas o servicios mencionados.

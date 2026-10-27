import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(staticPath: string) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.static(staticPath, { fallthrough: true }));

  // This application is a static educational guide, not a data API.
  // Do not answer fake /api/* requests with HTTP 200 + the homepage.
  app.get("/api/health", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({ status: "ready", service: "guia-ia-web", mode: "static-guide" });
  });
  app.use("/api", (_req, res) => res.status(404).json({ error: "API endpoint not available" }));

  // Only browser navigation requests should receive the SPA shell.
  app.get("*", (req, res) => {
    // Accept: */* (the fetch() default) is not a browser navigation.
    // Respect Sec-Fetch-Mode when supplied to avoid SPA 200s for fetch/XHR.
    const accept = req.get("accept") ?? "";
    const acceptsHtml = /(?:^|,)\s*text\/html(?:\s*;|,|$)/i.test(accept) && req.accepts("html") === "html";
    const fetchMode = req.get("sec-fetch-mode");
    const isNavigation = fetchMode === undefined || fetchMode === "navigate";
    const hasExtension = path.extname(req.path) !== "";
    if (!acceptsHtml || !isNavigation || hasExtension) {
      return res.status(404).send("Not found");
    }
    res.setHeader("Cache-Control", "no-cache");
    return res.sendFile(path.join(staticPath, "index.html"));
  });
  return app;
}

async function startServer() {
  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");
  const app = createApp(staticPath);
  const server = createServer(app);
  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => console.log("Guía IA server listening on port " + port));
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch(error => { console.error(error); process.exitCode = 1; });
}

import test from "node:test";
import assert from "node:assert/strict";
import { createServer, request as httpRequest } from "node:http";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Import the real TypeScript/Express application using the project's tsx dev dependency.
// This is an HTTP integration test, not a source-code regex check.
process.env.NODE_ENV = "test";
const { createApp } = await import("../server/index.ts");

test("HTTP health, SPA navigation and missing routes use truthful status codes", async t => {
  const root = mkdtempSync(path.join(tmpdir(), "guia-ia-http-"));
  mkdirSync(path.join(root, "assets"));
  writeFileSync(path.join(root, "index.html"), "<!doctype html><title>Empieza con IA</title>");
  writeFileSync(path.join(root, "assets", "app.js"), "console.log('guide');");
  const server = createServer(createApp(root));
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    t.after(async () => {
      await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
      rmSync(root, { recursive: true, force: true });
    });
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}`;
    async function request(route, headers = {}, method = "GET") {
      const response = await fetch(base + route, { method, headers });
      return { response, body: await response.text() };
    }

    // Node fetch always sends Sec-Fetch-Mode: cors, even if the caller
    // requests navigate. Use node:http to model a real browser navigation.
    async function navigate(route) {
      return await new Promise((resolve, reject) => {
        const req = httpRequest(base + route, {
          headers: { Accept: "text/html", "Sec-Fetch-Mode": "navigate" },
        }, response => {
          let body = "";
          response.setEncoding("utf8");
          response.on("data", chunk => { body += chunk; });
          response.on("end", () => resolve({ response, body }));
          response.on("error", reject);
        });
        req.on("error", reject);
        req.end();
      });
    }

    await t.test("health endpoint returns real JSON and disables caching", async () => {
      const { response, body } = await request("/api/health", { Accept: "application/json" });
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type") ?? "", /application\/json/);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.deepEqual(JSON.parse(body), { status: "ready", service: "guia-ia-web", mode: "static-guide" });
    });
    await t.test("unknown API GET and POST return JSON 404", async () => {
      for (const method of ["GET", "POST"]) {
        const { response, body } = await request("/api/missing", { Accept: "application/json" }, method);
        assert.equal(response.status, 404);
        assert.equal(JSON.parse(body).error, "API endpoint not available");
      }
    });
    await t.test("missing asset never receives the SPA shell", async () => {
      const { response, body } = await request("/assets/unknown.js", { Accept: "text/html" });
      assert.equal(response.status, 404);
      assert.doesNotMatch(body, /Empieza con IA/);
    });
    await t.test("default fetch Accept wildcard does not receive fake HTML 200", async () => {
      const { response } = await request("/not-a-page");
      assert.equal(response.status, 404);
    });
    await t.test("XHR/CORS with HTML Accept does not receive the SPA shell", async () => {
      const { response } = await request("/not-a-page", { Accept: "text/html", "Sec-Fetch-Mode": "cors" });
      assert.equal(response.status, 404);
    });
    await t.test("real HTML navigation retains SPA fallback", async () => {
      const { response, body } = await navigate("/plan/day-1");
      assert.equal(response.statusCode, 200);
      assert.equal(response.headers["cache-control"], "no-cache");
      assert.match(body, /Empieza con IA/);
    });
    await t.test("existing static assets are served", async () => {
      const { response, body } = await request("/assets/app.js", { Accept: "*/*" });
      assert.equal(response.status, 200);
      assert.match(body, /guide/);
    });
  } catch (error) {
    if (server.listening) await new Promise(resolve => server.close(resolve));
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
});

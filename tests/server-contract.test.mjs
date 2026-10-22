import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const server = readFileSync(new URL("../server/index.ts", import.meta.url), "utf8");
test("API health reports static guide mode and disables caching", () => {
  assert.match(server, /app\.get\("\/api\/health"/);
  assert.match(server, /mode: "static-guide"/);
  assert.match(server, /Cache-Control", "no-store"/);
});
test("unknown /api routes have explicit HTTP 404 and do not receive HTML SPA fallback", () => {
  const api = server.indexOf('app.use("/api"');
  const fallback = server.indexOf('app.get("*"');
  assert.ok(api > 0 && fallback > api);
  assert.match(server, /res\.status\(404\)\.json/);
});
test("missing assets are not returned as 200 index.html", () => {
  assert.match(server, /path\.extname\(req\.path\)/);
  assert.match(server, /res\.status\(404\)\.send\("Not found"\)/);
});
test("SPA shell only serves navigations with HTML Accept", () => {
  assert.match(server, /req\.accepts\(\["html", "json"\]\) === "html"/);
});

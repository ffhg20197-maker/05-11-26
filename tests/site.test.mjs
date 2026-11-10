import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("required website files exist", async () => {
  for (const file of ["index.html", "style.css", "script.js"]) {
    await access(new URL(file, root));
  }
});

test("HTML document has language, viewport and linked assets", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /href="style\.css"/);
  assert.match(html, /src="script\.js"/);
});

test("page contains the CI/CD learning sections", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  for (const section of ['id="lifecycle"', 'id="ci"', 'id="deploy"']) {
    assert.ok(html.includes(section), `Missing section: ${section}`);
  }
});

test("interactive checklist has checkboxes and a script handler", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const js = await readFile(new URL("script.js", root), "utf8");
  assert.match(html, /class="checks"/);
  assert.match(html, /type="checkbox"/);
  assert.match(js, /addEventListener\("change"/);
});

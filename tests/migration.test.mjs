import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("Next App Router files exist", () => {
  assert.match(read("app/layout.tsx"), /lang="fa" dir="rtl"/);
  assert.match(read("app/page.tsx"), /workspaceMarkup/);
  assert.match(read("app/page.tsx"), /afterInteractive/);
});

test("all ten workflow steps survived the migration", () => {
  const markup = read("lib/hafs-workspace.ts");
  for (const section of ["intake","interview","classification","scenario","codex","build","qa1","deploy","qa2","handover"]) {
    assert.ok(markup.includes('data-section=\\\"' + section + '\\\"'), "missing workflow section: " + section);
  }
});

test("storage, import/export and approvals remain in runtime", () => {
  const runtime = read("public/hafs/runtime.js");
  for (const feature of ["localStorage", "exportProject", "normalizeImportedProject", "approveCurrentStageAndContinue", "showSection"]) {
    assert.ok(runtime.includes(feature), "missing feature: " + feature);
  }
});

test("Rubika keeps its webhook entrypoint", () => {
  assert.match(read("app/api/rubika/route.ts"), /export async function POST/);
  assert.match(read("lib/rubika.js"), /RUBIKA_BOT_TOKEN/);
});

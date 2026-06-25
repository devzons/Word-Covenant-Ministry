#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const verifierScript = path.join(repoRoot, "scripts/timeline/verify-timeline-package.mjs");

const targets = {
  books: "docs/data-packages/timeline/books.66-canonical-skeleton.json",
  events: "docs/data-packages/timeline/events.core-biblical-skeleton.json",
  kings: "docs/data-packages/timeline/kings-kingdoms.skeleton.json",
  validFixtures: "docs/data-packages/timeline/fixtures/valid",
  invalidFixtures: "docs/data-packages/timeline/fixtures/invalid",
  warningFixtures: "docs/data-packages/timeline/fixtures/warnings",
};

function main() {
  const steps = [
    () => runSyntaxCheck(),
    () => runReadablePass("books.66-canonical-skeleton.json", [targets.books]),
    () => runReadablePass("events.core-biblical-skeleton.json", [targets.events]),
    () => runReadablePass("kings-kingdoms.skeleton.json", [targets.kings]),
    () => runReadablePass("valid fixtures", [targets.validFixtures]),
    () => runInvalidExpectedFail(),
    () => runWarningsExpectedPass(),
    () => runJsonSmoke(),
  ];

  for (const step of steps) {
    const result = step();
    if (!result.ok) {
      printFailure(result);
      process.exit(result.exitCode ?? 1);
    }
    console.log(`PASS ${result.label}`);
  }

  console.log("Timeline package verification passed.");
}

function runSyntaxCheck() {
  const result = spawnNode(["--check", verifierScript]);
  return {
    ok: result.status === 0,
    label: "verifier syntax check",
    exitCode: result.status === null ? 2 : result.status || 1,
    detail: collectOutput(result),
  };
}

function runReadablePass(label, verifierArgs) {
  const result = spawnNode([verifierScript, ...verifierArgs]);
  return {
    ok: result.status === 0,
    label,
    exitCode: result.status === null ? 2 : result.status || 1,
    detail: collectOutput(result),
  };
}

function runInvalidExpectedFail() {
  const result = spawnNode([verifierScript, targets.invalidFixtures]);
  const output = collectOutput(result);
  const hasFailBanner = output.includes("FAIL timeline package verification");
  const hasErrors = /Errors:\s*[1-9]/.test(output);

  return {
    ok: result.status === 1 && hasFailBanner && hasErrors,
    label: "invalid fixtures expected-fail",
    exitCode: result.status === null ? 2 : 1,
    detail: output,
  };
}

function runWarningsExpectedPass() {
  const result = spawnNode([verifierScript, "--json", targets.warningFixtures]);
  let parsed;

  try {
    parsed = JSON.parse(result.stdout);
  } catch (error) {
    return {
      ok: false,
      label: "warning fixtures warning-only",
      exitCode: 2,
      detail: `Failed to parse warning-fixture JSON output: ${error.message}\n${collectOutput(result)}`,
    };
  }

  return {
    ok: result.status === 0 && parsed.errorCount === 0 && parsed.warningCount >= 1,
    label: "warning fixtures warning-only",
    exitCode: result.status === null ? 2 : result.status || 1,
    detail: JSON.stringify(parsed, null, 2),
  };
}

function runJsonSmoke() {
  const result = spawnNode([verifierScript, "--json", targets.events]);
  let parsed;

  try {
    parsed = JSON.parse(result.stdout);
  } catch (error) {
    return {
      ok: false,
      label: "json smoke",
      exitCode: 2,
      detail: `Failed to parse events JSON output: ${error.message}\n${collectOutput(result)}`,
    };
  }

  return {
    ok: result.status === 0 && parsed.errorCount === 0 && parsed.warningCount === 0,
    label: "json smoke",
    exitCode: result.status === null ? 2 : result.status || 1,
    detail: JSON.stringify(parsed, null, 2),
  };
}

function spawnNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function collectOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

function printFailure(result) {
  console.error(`FAIL ${result.label}`);
  if (result.detail) {
    console.error(result.detail);
  }
}

main();

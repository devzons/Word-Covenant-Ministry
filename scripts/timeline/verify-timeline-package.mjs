#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const USAGE = `Usage:
  node scripts/timeline/verify-timeline-package.mjs <file-or-directory> [more paths...]
  node scripts/timeline/verify-timeline-package.mjs --json <file-or-directory> [more paths...]`;

const BANNED_BIBLE_TEXT_FIELDS = new Set([
  "text",
  "verseText",
  "bibleText",
  "scriptureText",
  "quotedText",
  "contentText",
]);

const BANNED_COORDINATE_FIELDS = new Set([
  "lat",
  "latitude",
  "lng",
  "lon",
  "longitude",
  "coordinates",
  "geojson",
  "geometry",
  "mapProvider",
  "tileUrl",
]);

const CANONICAL_SECTIONS = new Set([
  "Torah",
  "Historical Books",
  "Wisdom / Poetry",
  "Major Prophets",
  "Minor Prophets",
  "Gospels / Acts",
  "Pauline Epistles",
  "General Epistles",
  "Revelation",
]);

const CENTER_COLUMN_PACKAGE_TYPES = new Set([
  "timeline.events",
  "timeline.books",
  "timeline.psalms",
  "timeline.kings",
  "timeline.prophets",
  "timeline.empires",
  "timeline.places",
  "timeline.genealogy",
  "timeline.references",
  "timeline.sections",
]);

const SCRIPTURE_ROW_PACKAGE_TYPES = new Set([
  "timeline.events",
  "timeline.books",
  "timeline.psalms",
  "timeline.kings",
  "timeline.prophets",
  "timeline.places",
  "timeline.genealogy",
]);

function main(argv) {
  const { jsonOutput, targets } = parseArgs(argv);
  const targetFiles = collectTargetFiles(targets);
  const packageRoots = findPackageRoots(targetFiles);
  const registryFiles = collectRegistryFiles(targetFiles, packageRoots);
  const registry = buildIdRegistry(registryFiles);
  const issues = [];
  let unreadable = false;

  for (const filePath of targetFiles) {
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      let data;
      try {
        data = JSON.parse(raw);
      } catch (error) {
        issues.push(makeIssue("error", filePath, null, `Invalid JSON syntax: ${error.message}`));
        continue;
      }
      validatePackage(filePath, data, registry, issues);
    } catch (error) {
      unreadable = true;
      issues.push(makeIssue("fatal", filePath, null, `Unable to read file: ${error.message}`));
    }
  }

  const summary = summarizeIssues(targetFiles, issues);
  if (jsonOutput) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } else {
    printSummary(summary);
  }

  if (unreadable) {
    process.exitCode = 2;
  } else if (summary.errorCount > 0) {
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

function parseArgs(argv) {
  const args = [...argv];
  const jsonOutput = args[0] === "--json" ? !!args.shift() : false;
  if (args.length === 0) {
    console.error(USAGE);
    process.exit(2);
  }
  return { jsonOutput, targets: args };
}

function collectTargetFiles(targets) {
  const files = new Set();
  for (const target of targets) {
    const resolved = path.resolve(target);
    if (!fs.existsSync(resolved)) {
      console.error(`Target does not exist: ${target}`);
      process.exit(2);
    }
    walkJsonTargets(resolved, files);
  }
  const sorted = [...files].sort();
  if (sorted.length === 0) {
    console.error("No JSON files found in the provided targets.");
    process.exit(2);
  }
  return sorted;
}

function walkJsonTargets(targetPath, files) {
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
      walkJsonTargets(path.join(targetPath, entry.name), files);
    }
    return;
  }
  if (stat.isFile() && targetPath.endsWith(".json")) {
    files.add(targetPath);
  }
}

function findPackageRoots(files) {
  const roots = new Set();
  for (const filePath of files) {
    const parts = filePath.split(path.sep);
    const markerIndex = parts.lastIndexOf("timeline");
    const dataPackagesIndex = parts.lastIndexOf("data-packages");
    if (markerIndex > dataPackagesIndex && dataPackagesIndex !== -1) {
      roots.add(parts.slice(0, markerIndex + 1).join(path.sep));
    }
  }
  return [...roots];
}

function collectRegistryFiles(targetFiles, packageRoots) {
  const registryFiles = new Set(targetFiles);
  for (const root of packageRoots) {
    walkJsonTargets(root, registryFiles);
  }
  return [...registryFiles].sort();
}

function buildIdRegistry(files) {
  const ids = new Set();
  for (const filePath of files) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (Array.isArray(data?.items)) {
        for (const item of data.items) {
          if (item && typeof item === "object" && typeof item.id === "string") {
            ids.add(item.id);
          }
        }
      }
    } catch {
      // Ignore registry parse failures; the target validation pass will report them when applicable.
    }
  }
  return ids;
}

function validatePackage(filePath, data, registry, issues) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    issues.push(makeIssue("error", filePath, null, "Package root must be a JSON object."));
    return;
  }

  validateEnvelope(filePath, data, issues);
  const packageType = data.packageType;
  const items = Array.isArray(data.items) ? data.items : [];

  const idCounts = new Map();
  items.forEach((item, index) => {
    const rowLabel = item?.id ?? `row#${index + 1}`;
    validateRow(filePath, packageType, data.status, item, rowLabel, registry, issues, filePath);
    if (item && typeof item === "object" && typeof item.id === "string") {
      idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
    }
  });

  for (const [id, count] of idCounts.entries()) {
    if (count > 1) {
      issues.push(makeIssue("error", filePath, id, `Duplicate row id "${id}" (${count} occurrences).`));
    }
  }

  if (packageType === "timeline.books" && (data.status === "canonical-skeleton" || path.basename(filePath) === "books.66-canonical-skeleton.json")) {
    validateCanonicalBooks(filePath, items, issues);
  }
}

function validateEnvelope(filePath, data, issues) {
  const requiredEnvelopeFields = ["$schema", "packageType", "packageVersion", "status"];
  for (const field of requiredEnvelopeFields) {
    if (!hasNonEmptyValue(data[field])) {
      issues.push(makeIssue("error", filePath, null, `Missing required package envelope field "${field}".`));
    }
  }

  if (data.packageType !== "timeline.manifest") {
    if (!Array.isArray(data.items)) {
      issues.push(makeIssue("error", filePath, null, 'Missing required package envelope field "items" as an array.'));
    }
  } else if (data.items !== undefined && !Array.isArray(data.items)) {
    issues.push(makeIssue("error", filePath, null, 'If present, manifest "items" must be an array.'));
  }
}

function validateRow(filePath, packageType, packageStatus, item, rowLabel, registry, issues) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    issues.push(makeIssue("error", filePath, rowLabel, "Each row must be a JSON object."));
    return;
  }

  validateGuardrails(filePath, item, issues, rowLabel);

  if (!hasNonEmptyValue(item.id)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Missing required row field "id".'));
  }

  if (CENTER_COLUMN_PACKAGE_TYPES.has(packageType)) {
    for (const field of ["timelinePeriodId", "sectionId", "displayOrder", "accordionGroup"]) {
      if (!hasNonEmptyValue(item[field])) {
        issues.push(makeIssue("error", filePath, rowLabel, `Missing required center-column field "${field}".`));
      }
    }
  }

  if (requiresTitle(packageType) && !hasLocalizedField(item.title)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Missing required display field "title".'));
  }

  if (SCRIPTURE_ROW_PACKAGE_TYPES.has(packageType) && !hasNonEmptyArray(item.scriptureAnchors)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Missing required "scriptureAnchors" array on a Scripture-based row.'));
  }

  if (packageType === "timeline.cross-links") {
    validateCrossLinkRow(filePath, item, rowLabel, registry, issues);
  }

  if (packageType === "timeline.references" || item.isSupportingReference === true) {
    validateSupportingReferenceRow(filePath, item, rowLabel, issues);
  }

  const strictCanonicalBookValidation =
    packageType === "timeline.books" &&
    (packageStatus === "canonical-skeleton" || path.basename(filePath) === "books.66-canonical-skeleton.json");

  if (strictCanonicalBookValidation && isCanonicalBookRow(item)) {
    validateCanonicalBookRow(filePath, item, rowLabel, issues);
  }

  validateWarnings(filePath, packageType, item, rowLabel, issues);
}

function validateCrossLinkRow(filePath, item, rowLabel, registry, issues) {
  for (const field of ["fromType", "fromId", "toType", "toId", "relationLabel", "basisLabel", "confidenceLabel"]) {
    if (!hasNonEmptyValue(item[field])) {
      issues.push(makeIssue("error", filePath, rowLabel, `Missing required cross-link field "${field}".`));
    }
  }

  if (hasNonEmptyValue(item.fromId) && !registry.has(item.fromId)) {
    issues.push(makeIssue("error", filePath, rowLabel, `Cross-link fromId "${item.fromId}" does not resolve.`));
  }
  if (hasNonEmptyValue(item.toId) && !registry.has(item.toId)) {
    issues.push(makeIssue("error", filePath, rowLabel, `Cross-link toId "${item.toId}" does not resolve.`));
  }
}

function validateSupportingReferenceRow(filePath, item, rowLabel, issues) {
  if (!hasLocalizedField(item.referenceTypeLabel)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Missing required supporting-reference field "referenceTypeLabel".'));
  }

  const referenceLabelText = flattenText(item.referenceTypeLabel).toLowerCase();
  const cautionText = flattenText(item.cautionNote).toLowerCase();
  const confidenceText = flattenText(item.confidenceLabel).toLowerCase();
  const sourceBasisText = flattenText(item.sourceBasisLabel).toLowerCase();
  const isKoreanReference = flattenText(item.title).includes("한국");
  const referenceOnly = containsAny(referenceLabelText, ["reference only", "참조용"]);
  const interpretationBreach = containsAny(referenceLabelText, ["basis for biblical interpretation", "성경 해석 근거"]);
  const nonInterpretive = containsAny(cautionText, ["not a basis for biblical interpretation", "성경 해석 근거 아님"]);
  const reviewRequired = containsAny(`${sourceBasisText} ${confidenceText} ${cautionText}`, ["review required", "source review required", "검토 필요", "출처 검토 필요"]);

  if (item.isSupportingReference !== true) {
    issues.push(makeIssue("error", filePath, rowLabel, "Supporting reference rows must set isSupportingReference to true."));
  }

  if (interpretationBreach) {
    issues.push(makeIssue("error", filePath, rowLabel, "Supporting reference row is improperly presented as interpretive authority."));
  }

  if (referenceOnly && !nonInterpretive) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Supporting reference row is missing a "not a basis for biblical interpretation" caution.'));
  }

  if (!hasLocalizedField(item.confidenceLabel)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Missing required supporting-reference field "confidenceLabel".'));
  }

  if (!hasLocalizedField(item.cautionNote)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Missing required supporting-reference field "cautionNote".'));
  }

  if (isKoreanReference && !hasLocalizedField(item.sourceBasisLabel)) {
    if (reviewRequired) {
      issues.push(makeIssue("warning", filePath, rowLabel, "Korean supporting reference requires explicit source-basis review."));
    } else {
      issues.push(makeIssue("error", filePath, rowLabel, 'Korean supporting reference is missing "sourceBasisLabel".'));
    }
  }
}

function validateCanonicalBookRow(filePath, item, rowLabel, issues) {
  for (const field of [
    "bookId",
    "canonicalOrder",
    "testament",
    "canonicalSection",
    "timelinePeriodId",
    "sectionId",
    "displayOrder",
    "accordionGroup",
    "authorshipBasisLabel",
    "backgroundBasisLabel",
    "dateConfidenceLabel",
  ]) {
    if (!hasNonEmptyValue(item[field])) {
      issues.push(makeIssue("error", filePath, rowLabel, `Missing required canonical-book field "${field}".`));
    }
  }

  if (!hasLocalizedField(item.title)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Canonical book row is missing "title.ko" or "title.en".'));
  }

  if (!hasNonEmptyArray(item.scriptureAnchors)) {
    issues.push(makeIssue("error", filePath, rowLabel, 'Canonical book row is missing non-empty "scriptureAnchors".'));
  }

  if (item.testament && !["OT", "NT"].includes(item.testament)) {
    issues.push(makeIssue("error", filePath, rowLabel, `Invalid testament "${item.testament}". Expected OT or NT.`));
  }

  if (item.canonicalSection && !CANONICAL_SECTIONS.has(item.canonicalSection)) {
    issues.push(makeIssue("error", filePath, rowLabel, `Invalid canonicalSection "${item.canonicalSection}".`));
  }
}

function validateCanonicalBooks(filePath, items, issues) {
  if (items.length !== 66) {
    issues.push(makeIssue("error", filePath, null, `Canonical books package must contain 66 rows; found ${items.length}.`));
  }

  const bookIds = new Map();
  const canonicalOrders = new Map();

  for (const item of items) {
    const rowLabel = item?.id ?? "unknown-book-row";
    if (!hasNonEmptyValue(item?.bookId)) {
      issues.push(makeIssue("error", filePath, rowLabel, 'Canonical books row is missing "bookId".'));
    } else {
      bookIds.set(item.bookId, (bookIds.get(item.bookId) ?? 0) + 1);
    }

    if (typeof item?.canonicalOrder !== "number") {
      issues.push(makeIssue("error", filePath, rowLabel, 'Canonical books row is missing numeric "canonicalOrder".'));
    } else {
      canonicalOrders.set(item.canonicalOrder, (canonicalOrders.get(item.canonicalOrder) ?? 0) + 1);
    }

    if (item?.isSkeleton !== true) {
      issues.push(makeIssue("error", filePath, rowLabel, 'Canonical books skeleton row must set "isSkeleton" to true.'));
    }
  }

  for (const [bookId, count] of bookIds.entries()) {
    if (count > 1) {
      issues.push(makeIssue("error", filePath, bookId, `Duplicate canonical bookId "${bookId}" (${count} occurrences).`));
    }
  }

  for (const [order, count] of canonicalOrders.entries()) {
    if (count > 1) {
      issues.push(makeIssue("error", filePath, `canonicalOrder:${order}`, `Duplicate canonicalOrder "${order}" (${count} occurrences).`));
    }
  }

  if (items.length === 66) {
    for (let order = 1; order <= 66; order += 1) {
      if (!canonicalOrders.has(order)) {
        issues.push(makeIssue("error", filePath, null, `Missing canonicalOrder "${order}" in canonical books package.`));
      }
    }
  }
}

function validateWarnings(filePath, packageType, item, rowLabel, issues) {
  const dateText = `${flattenText(item.dateLabel)} ${flattenText(item.basisLabel)}`.toLowerCase();
  const cautionText = flattenText(item.cautionNote).toLowerCase();
  const confidenceText = flattenText(item.confidenceLabel).toLowerCase();
  const sourceBasisText = flattenText(item.sourceBasisLabel).toLowerCase();

  if (containsAny(dateText, ["approximate", "대략", "approx"]) && !containsAny(`${cautionText} ${confidenceText} ${sourceBasisText}`, ["review required", "검토 필요", "source review required", "출처 검토 필요"])) {
    issues.push(makeIssue("warning", filePath, rowLabel, "Approximate date is present without an explicit review flag."));
  }

  if (containsAny(dateText, ["uncertain", "불확실"]) && !containsAny(`${cautionText} ${confidenceText}`, ["review required", "검토 필요", "uncertain", "불확실"])) {
    issues.push(makeIssue("warning", filePath, rowLabel, "Chronology uncertainty should carry a clearer review flag."));
  }

  if (packageType === "timeline.sections" && !hasLocalizedField(item.title) && !hasLocalizedField(item.sectionTitle)) {
    issues.push(makeIssue("warning", filePath, rowLabel, "Section row is missing an optional display label."));
  }

  if ((packageType === "timeline.references" || item.isSupportingReference === true) && !hasLocalizedField(item.sourceBasisLabel)) {
    const reviewText = `${confidenceText} ${cautionText}`.toLowerCase();
    if (containsAny(reviewText, ["review required", "검토 필요"])) {
      issues.push(makeIssue("warning", filePath, rowLabel, "Supporting reference should add explicit sourceBasisLabel after review."));
    }
  }

  if (packageType === "timeline.cross-links") {
    const crossLinkReviewText = `${flattenText(item.basisLabel)} ${flattenText(item.confidenceLabel)}`.toLowerCase();
    if (containsAny(crossLinkReviewText, ["low", "낮음", "review required", "검토 필요"])) {
      issues.push(makeIssue("warning", filePath, rowLabel, "Cross-link is explicitly low-confidence and should be reviewed."));
    }
  }
}

function validateGuardrails(filePath, value, issues, rowLabel = null, seen = new Set()) {
  if (!value || typeof value !== "object") {
    return;
  }
  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((entry) => validateGuardrails(filePath, entry, issues, rowLabel, seen));
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (BANNED_BIBLE_TEXT_FIELDS.has(key)) {
      issues.push(makeIssue("error", filePath, rowLabel, `Forbidden Bible-text field "${key}" is present.`));
    }
    if (BANNED_COORDINATE_FIELDS.has(key)) {
      issues.push(makeIssue("error", filePath, rowLabel, `Forbidden no-coordinate field "${key}" is present.`));
    }
    validateGuardrails(filePath, nestedValue, issues, rowLabel, seen);
  }
}

function requiresTitle(packageType) {
  return !new Set(["timeline.cross-links", "timeline.sections", "timeline.periods", "timeline.manifest"]).has(packageType);
}

function isCanonicalBookRow(item) {
  return item && (item.isSkeleton === true || item.bookId || item.canonicalOrder || item.testament);
}

function hasNonEmptyValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
}

function hasNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function hasLocalizedField(value) {
  return value && typeof value === "object" && hasNonEmptyValue(value.ko) && hasNonEmptyValue(value.en);
}

function flattenText(value) {
  if (typeof value === "string") {
    return value;
  }
  if (!value || typeof value !== "object") {
    return "";
  }
  return Object.values(value)
    .filter((entry) => typeof entry === "string")
    .join(" ");
}

function containsAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function makeIssue(severity, filePath, rowId, message) {
  return {
    severity,
    filePath,
    rowId,
    message,
  };
}

function summarizeIssues(targetFiles, issues) {
  const sortedIssues = [...issues].sort((a, b) => {
    if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
    if ((a.rowId ?? "") !== (b.rowId ?? "")) return (a.rowId ?? "").localeCompare(b.rowId ?? "");
    return a.message.localeCompare(b.message);
  });

  return {
    targetCount: targetFiles.length,
    targets: targetFiles,
    errorCount: sortedIssues.filter((issue) => issue.severity === "error").length,
    warningCount: sortedIssues.filter((issue) => issue.severity === "warning").length,
    fatalCount: sortedIssues.filter((issue) => issue.severity === "fatal").length,
    issues: sortedIssues,
  };
}

function printSummary(summary) {
  const status = summary.errorCount > 0 || summary.fatalCount > 0 ? "FAIL" : "PASS";
  console.log(`${status} timeline package verification`);
  console.log(`Targets: ${summary.targetCount}`);
  console.log(`Errors: ${summary.errorCount}`);
  console.log(`Warnings: ${summary.warningCount}`);
  if (summary.fatalCount > 0) {
    console.log(`Fatal: ${summary.fatalCount}`);
  }
  if (summary.issues.length === 0) {
    return;
  }
  console.log("");
  for (const issue of summary.issues) {
    const rowSuffix = issue.rowId ? ` [${issue.rowId}]` : "";
    console.log(`${issue.severity.toUpperCase()} ${path.relative(process.cwd(), issue.filePath)}${rowSuffix}: ${issue.message}`);
  }
}

main(process.argv.slice(2));

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
  "coordinate",
  "geo",
  "geojson",
  "geometry",
  "point",
  "marker",
  "bounds",
  "viewport",
  "mapProvider",
  "tileUrl",
  "mapbox",
  "googleMaps",
  "googleMap",
  "naverMap",
  "kakaoMap",
]);

const MAP_PROVIDER_VALUES = new Set(["mapbox", "googlemaps", "googlemap", "navermap", "kakaomap"]);

const ALLOWED_CROSS_LINK_TYPES = new Set([
  "book",
  "event",
  "person",
  "genealogy",
  "place",
  "kingdom",
  "scriptureEvidence",
  "supportingReference",
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
  "timeline.kings-kingdoms",
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
  "timeline.kings-kingdoms",
  "timeline.prophets",
  "timeline.places",
  "timeline.genealogy",
]);

const KINGS_RECORD_TYPES = new Set([
  "kingdomPeriod",
  "kingdom",
  "king",
  "transition",
  "exileMarker",
  "templeMarker",
  "propheticContextMarker",
]);

const KINGS_PERIOD_TYPES = new Set([
  "kingdomPeriod",
  "exileMarker",
  "templeMarker",
  "propheticContextMarker",
]);

const KINGS_TRANSITION_TARGET_TYPES = new Set([
  "kingdom",
  "kingdomPeriod",
  "transition",
  "exileMarker",
  "templeMarker",
]);

const EXACT_CHRONOLOGY_FIELDS = new Set([
  "exactYear",
  "startYear",
  "endYear",
  "reignStartYear",
  "reignEndYear",
  "chronologyYear",
  "absoluteYear",
]);

const ISSUE = {
  JSON_INVALID: "TLN_JSON_INVALID",
  FILE_UNREADABLE: "TLN_FILE_UNREADABLE",
  PACKAGE_NOT_OBJECT: "TLN_PACKAGE_NOT_OBJECT",
  ENVELOPE_MISSING_FIELD: "TLN_ENVELOPE_MISSING_FIELD",
  ENVELOPE_ITEMS_INVALID: "TLN_ENVELOPE_ITEMS_INVALID",
  ROW_NOT_OBJECT: "TLN_ROW_NOT_OBJECT",
  ROW_ID_MISSING: "TLN_ROW_ID_MISSING",
  ROW_ID_DUPLICATE: "TLN_ROW_ID_DUPLICATE",
  CENTER_FIELD_MISSING: "TLN_CENTER_FIELD_MISSING",
  TITLE_MISSING: "TLN_TITLE_MISSING",
  SCRIPTURE_ANCHORS_MISSING: "TLN_SCRIPTURE_ANCHORS_MISSING",
  CROSS_LINK_FIELD_MISSING: "TLN_CROSS_LINK_FIELD_MISSING",
  CROSS_LINK_SOURCE_MISSING: "TLN_CROSS_LINK_SOURCE_MISSING",
  CROSS_LINK_TARGET_MISSING: "TLN_CROSS_LINK_TARGET_MISSING",
  CROSS_LINK_TARGET_DUPLICATE: "TLN_CROSS_LINK_TARGET_DUPLICATE",
  CROSS_LINK_TARGET_TYPE_INVALID: "TLN_CROSS_LINK_TARGET_TYPE_INVALID",
  CROSS_LINK_BIBLE_REFERENCE_AS_ID: "TLN_CROSS_LINK_BIBLE_REFERENCE_AS_ID",
  CROSS_LINK_SELF_LINK: "TLN_CROSS_LINK_SELF_LINK",
  CROSS_LINK_MISSING_TARGET_TYPE: "TLN_CROSS_LINK_MISSING_TARGET_TYPE",
  SUPPORTING_REFERENCE_FLAG_MISSING: "TLN_REFERENCE_FLAG_MISSING",
  SUPPORTING_REFERENCE_AUTHORITY_BREACH: "TLN_REFERENCE_AUTHORITY_BREACH",
  SUPPORTING_REFERENCE_INTERPRETATION_LABEL_MISSING: "TLN_REFERENCE_INTERPRETATION_LABEL_MISSING",
  SUPPORTING_REFERENCE_FIELD_MISSING: "TLN_REFERENCE_FIELD_MISSING",
  SUPPORTING_REFERENCE_REVIEW_REQUIRED: "TLN_REFERENCE_REVIEW_REQUIRED",
  BANNED_BIBLE_TEXT_FIELD: "TLN_BIBLE_TEXT_FIELD_FORBIDDEN",
  BANNED_COORDINATE_FIELD: "TLN_COORDINATE_FIELD_FORBIDDEN",
  BANNED_MAP_PROVIDER_FIELD: "TLN_MAP_PROVIDER_FORBIDDEN",
  WARNING_APPROXIMATE_DATE: "TLN_WARNING_APPROXIMATE_DATE",
  WARNING_CHRONOLOGY_REVIEW: "TLN_WARNING_CHRONOLOGY_REVIEW",
  WARNING_OPTIONAL_DISPLAY_LABEL: "TLN_WARNING_OPTIONAL_DISPLAY_LABEL",
  WARNING_LOW_CONFIDENCE_CROSS_LINK: "TLN_CROSS_LINK_LOW_CONFIDENCE_REVIEW",
  EVENTS_COUNT_MISMATCH: "TLN_EVENTS_COUNT_MISMATCH",
  EVENTS_EVENT_ID_MISSING: "TLN_EVENTS_EVENT_ID_MISSING",
  EVENTS_EVENT_ID_EMPTY: "TLN_EVENTS_EVENT_ID_EMPTY",
  EVENTS_EVENT_ID_DUPLICATE: "TLN_EVENTS_EVENT_ID_DUPLICATE",
  EVENTS_FIELD_MISSING: "TLN_EVENTS_FIELD_MISSING",
  BOOKS_COUNT_MISMATCH: "TLN_BOOKS_COUNT_MISMATCH",
  BOOKS_BOOK_ID_MISSING: "TLN_BOOKS_BOOK_ID_MISSING",
  BOOKS_BOOK_ID_EMPTY: "TLN_BOOKS_BOOK_ID_EMPTY",
  BOOKS_BOOK_ID_DUPLICATE: "TLN_BOOKS_BOOK_ID_DUPLICATE",
  BOOKS_ORDER_MISSING: "TLN_BOOKS_ORDER_MISSING",
  BOOKS_ORDER_NON_INTEGER: "TLN_BOOKS_ORDER_NON_INTEGER",
  BOOKS_ORDER_OUT_OF_RANGE: "TLN_BOOKS_ORDER_OUT_OF_RANGE",
  BOOKS_ORDER_DUPLICATE: "TLN_BOOKS_ORDER_DUPLICATE",
  BOOKS_ORDER_GAP: "TLN_BOOKS_ORDER_GAP",
  BOOKS_TESTAMENT_INVALID: "TLN_BOOKS_TESTAMENT_INVALID",
  BOOKS_TESTAMENT_COUNT_MISMATCH: "TLN_BOOKS_TESTAMENT_COUNT_MISMATCH",
  BOOKS_FIELD_MISSING: "TLN_BOOKS_FIELD_MISSING",
  BOOKS_TITLE_MISSING: "TLN_BOOKS_TITLE_MISSING",
  BOOKS_CANONICAL_TITLE_WARNING: "TLN_BOOKS_CANONICAL_TITLE_WARNING",
  BOOKS_SCRIPTURE_ANCHORS_MISSING: "TLN_BOOKS_SCRIPTURE_ANCHORS_MISSING",
  BOOKS_SKELETON_FLAG_INVALID: "TLN_BOOKS_SKELETON_FLAG_INVALID",
  KINGS_RECORD_TYPE_INVALID: "TLN_KINGS_RECORD_TYPE_INVALID",
  KINGS_FIELD_MISSING: "TLN_KINGS_FIELD_MISSING",
  KINGS_TITLE_MISSING: "TLN_KINGS_TITLE_MISSING",
  KINGS_KINGDOM_ID_MISSING: "TLN_KINGS_KINGDOM_ID_MISSING",
  KINGS_KINGDOM_ID_UNRESOLVED: "TLN_KINGS_KINGDOM_ID_UNRESOLVED",
  KINGS_KINGDOM_ID_TARGET_INVALID: "TLN_KINGS_KINGDOM_ID_TARGET_INVALID",
  KINGS_PREDECESSOR_UNRESOLVED: "TLN_KINGS_PREDECESSOR_UNRESOLVED",
  KINGS_SUCCESSOR_UNRESOLVED: "TLN_KINGS_SUCCESSOR_UNRESOLVED",
  KINGS_SUCCESSION_TARGET_INVALID: "TLN_KINGS_SUCCESSION_TARGET_INVALID",
  KINGS_SUCCESSION_SELF_REFERENCE: "TLN_KINGS_SUCCESSION_SELF_REFERENCE",
  KINGS_TRANSITION_TARGET_UNRESOLVED: "TLN_KINGS_TRANSITION_TARGET_UNRESOLVED",
  KINGS_TRANSITION_TARGET_INVALID: "TLN_KINGS_TRANSITION_TARGET_INVALID",
  KINGS_RELATED_KING_UNRESOLVED: "TLN_KINGS_RELATED_KING_UNRESOLVED",
  KINGS_RELATED_KING_TARGET_INVALID: "TLN_KINGS_RELATED_KING_TARGET_INVALID",
  KINGS_SCOPE_INVALID: "TLN_KINGS_SCOPE_INVALID",
  KINGS_PERIOD_TYPE_INVALID: "TLN_KINGS_PERIOD_TYPE_INVALID",
  KINGS_EXACT_CHRONOLOGY_REVIEW_REQUIRED: "TLN_KINGS_EXACT_CHRONOLOGY_REVIEW_REQUIRED",
  KINGS_EXACT_CHRONOLOGY_CAUTION: "TLN_KINGS_EXACT_CHRONOLOGY_CAUTION",
  KINGS_APPROXIMATE_DATE_REVIEW: "TLN_KINGS_APPROXIMATE_DATE_REVIEW",
  KINGS_LOW_CONFIDENCE_SYNCHRONISM: "TLN_KINGS_LOW_CONFIDENCE_SYNCHRONISM",
  KINGS_REIGN_LABEL_MISSING: "TLN_KINGS_REIGN_LABEL_MISSING",
};

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
        issues.push(makeIssue("error", ISSUE.JSON_INVALID, filePath, null, `Invalid JSON syntax: ${error.message}`));
        continue;
      }
      validatePackage(filePath, data, registry, issues);
    } catch (error) {
      unreadable = true;
      issues.push(makeIssue("fatal", ISSUE.FILE_UNREADABLE, filePath, null, `Unable to read file: ${error.message}`));
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
  const ids = new Map();
  for (const filePath of files) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (Array.isArray(data?.items)) {
        for (const item of data.items) {
          if (item && typeof item === "object" && typeof item.id === "string") {
            const entry = ids.get(item.id) ?? { count: 0, files: new Set() };
            entry.count += 1;
            entry.files.add(filePath);
            ids.set(item.id, entry);
          }
        }
      }
    } catch {
      // Ignore registry parse failures; the target validation pass will report them when applicable.
    }
  }
  return ids;
}

function buildLocalIndex(items) {
  const counts = new Map();
  const records = new Map();

  for (const item of items) {
    if (!item || typeof item !== "object" || typeof item.id !== "string") {
      continue;
    }
    counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
    if (!records.has(item.id)) {
      records.set(item.id, item);
    }
  }

  return { counts, records };
}

function validatePackage(filePath, data, registry, issues) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    issues.push(makeIssue("error", filePath, null, "Package root must be a JSON object."));
    return;
  }

  validateEnvelope(filePath, data, issues);
  const packageType = data.packageType;
  const items = Array.isArray(data.items) ? data.items : [];
  const localIndex = buildLocalIndex(items);

  const idCounts = new Map();
  items.forEach((item, index) => {
    const rowLabel = item?.id ?? `row#${index + 1}`;
      validateRow(filePath, data, packageType, data.status, item, rowLabel, registry, localIndex, issues);
      if (item && typeof item === "object" && typeof item.id === "string") {
        idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
      }
  });

  for (const [id, count] of idCounts.entries()) {
    if (count > 1) {
      issues.push(makeIssue("error", ISSUE.ROW_ID_DUPLICATE, filePath, id, `Duplicate row id "${id}" (${count} occurrences).`, { recordId: id }));
    }
  }

  if (isCanonicalBooksPackage(data, filePath)) {
    validateCanonicalBooks(filePath, data, items, issues);
  }

  if (isCoreBiblicalEventsPackage(data, filePath)) {
    validateCoreBiblicalEvents(filePath, data, items, issues);
  }
}

function validateEnvelope(filePath, data, issues) {
  const requiredEnvelopeFields = ["$schema", "packageType", "packageVersion", "status"];
  for (const field of requiredEnvelopeFields) {
    if (!hasNonEmptyValue(data[field])) {
      issues.push(makeIssue("error", ISSUE.ENVELOPE_MISSING_FIELD, filePath, null, `Missing required package envelope field "${field}".`, { path: field }));
    }
  }

  if (data.packageType !== "timeline.manifest") {
    if (!Array.isArray(data.items)) {
      issues.push(makeIssue("error", ISSUE.ENVELOPE_ITEMS_INVALID, filePath, null, 'Missing required package envelope field "items" as an array.', { path: "items" }));
    }
  } else if (data.items !== undefined && !Array.isArray(data.items)) {
    issues.push(makeIssue("error", ISSUE.ENVELOPE_ITEMS_INVALID, filePath, null, 'If present, manifest "items" must be an array.', { path: "items" }));
  }
}

function validateRow(filePath, data, packageType, packageStatus, item, rowLabel, registry, localIndex, issues) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    issues.push(makeIssue("error", ISSUE.ROW_NOT_OBJECT, filePath, rowLabel, "Each row must be a JSON object.", { recordId: rowLabel }));
    return;
  }

  validateGuardrails(filePath, item, issues, rowLabel);

  if (!hasNonEmptyValue(item.id)) {
    issues.push(makeIssue("error", ISSUE.ROW_ID_MISSING, filePath, rowLabel, 'Missing required row field "id".'));
  }

  if (CENTER_COLUMN_PACKAGE_TYPES.has(packageType)) {
    for (const field of ["timelinePeriodId", "sectionId", "displayOrder", "accordionGroup"]) {
      if (!hasNonEmptyValue(item[field])) {
        issues.push(makeIssue("error", ISSUE.CENTER_FIELD_MISSING, filePath, rowLabel, `Missing required center-column field "${field}".`, { path: field, recordId: item.id ?? rowLabel }));
      }
    }
  }

  if (requiresTitle(packageType) && !hasLocalizedField(item.title)) {
    issues.push(makeIssue("error", isKingsKingdomsPackageType(packageType) ? ISSUE.KINGS_TITLE_MISSING : ISSUE.TITLE_MISSING, filePath, rowLabel, 'Missing required display field "title".', { path: "title", recordId: item.id ?? rowLabel }));
  }

  if (SCRIPTURE_ROW_PACKAGE_TYPES.has(packageType) && !hasNonEmptyArray(item.scriptureAnchors)) {
    issues.push(makeIssue("error", ISSUE.SCRIPTURE_ANCHORS_MISSING, filePath, rowLabel, 'Missing required "scriptureAnchors" array on a Scripture-based row.', { path: "scriptureAnchors", recordId: item.id ?? rowLabel }));
  }

  if (packageType === "timeline.cross-links") {
    validateCrossLinkRow(filePath, item, rowLabel, registry, issues);
  }

  if (packageType === "timeline.references" || item.isSupportingReference === true) {
    validateSupportingReferenceRow(filePath, item, rowLabel, issues);
  }

  const strictCanonicalBookValidation = isCanonicalBooksPackage(data, filePath);

  if (strictCanonicalBookValidation && isCanonicalBookRow(item)) {
    validateCanonicalBookRow(filePath, item, rowLabel, issues);
  }

  if (isKingsKingdomsPackageType(packageType)) {
    validateKingsKingdomsRow(filePath, item, rowLabel, localIndex, issues);
  }

  validateWarnings(filePath, packageType, item, rowLabel, issues);
}

function validateKingsKingdomsRow(filePath, item, rowLabel, localIndex, issues) {
  const recordId = item.id ?? rowLabel;

  for (const field of ["recordType", "displayOrder", "timelinePeriodId", "confidence", "reviewRequired"]) {
    if (field === "reviewRequired") {
      if (typeof item.reviewRequired !== "boolean") {
        issues.push(makeIssue("error", ISSUE.KINGS_FIELD_MISSING, filePath, rowLabel, `Kings / Kingdoms row must include boolean "${field}".`, { path: field, rowId: recordId, recordType: item.recordType }));
      }
      continue;
    }

    if (!hasNonEmptyValue(item[field])) {
      issues.push(makeIssue("error", ISSUE.KINGS_FIELD_MISSING, filePath, rowLabel, `Kings / Kingdoms row is missing required field "${field}".`, { path: field, rowId: recordId, recordType: item.recordType }));
    }
  }

  if (!hasNonEmptyValue(item.recordType)) {
    return;
  }

  if (!KINGS_RECORD_TYPES.has(item.recordType)) {
    issues.push(makeIssue("error", ISSUE.KINGS_RECORD_TYPE_INVALID, filePath, rowLabel, `Kings / Kingdoms recordType "${item.recordType}" is not allowed.`, {
      path: "recordType",
      rowId: recordId,
      recordType: item.recordType,
      field: "recordType",
    }));
    return;
  }

  if (typeof item.periodType === "string" && !KINGS_PERIOD_TYPES.has(item.periodType)) {
    issues.push(makeIssue("error", ISSUE.KINGS_PERIOD_TYPE_INVALID, filePath, rowLabel, `Kings / Kingdoms periodType "${item.periodType}" is not allowed.`, {
      path: "periodType",
      rowId: recordId,
      recordType: item.recordType,
      field: "periodType",
    }));
  }

  const exactChronologyHits = collectExactChronologyFields(item);
  if (exactChronologyHits.length > 0) {
    const fieldList = exactChronologyHits.map((hit) => hit.path).join(", ");
    if (item.reviewRequired !== true) {
      issues.push(makeIssue("error", ISSUE.KINGS_EXACT_CHRONOLOGY_REVIEW_REQUIRED, filePath, rowLabel, `Kings / Kingdoms exact chronology fields require reviewRequired=true; found ${fieldList}.`, {
        path: exactChronologyHits[0].path,
        rowId: recordId,
        recordType: item.recordType,
        field: exactChronologyHits[0].field,
      }));
    } else {
      issues.push(makeIssue("warning", ISSUE.KINGS_EXACT_CHRONOLOGY_CAUTION, filePath, rowLabel, `Kings / Kingdoms exact chronology fields should remain caution-gated even when reviewRequired=true; found ${fieldList}.`, {
        path: exactChronologyHits[0].path,
        rowId: recordId,
        recordType: item.recordType,
        field: exactChronologyHits[0].field,
      }));
    }
  }

  if (item.recordType === "king") {
    validateKingsKingRow(filePath, item, rowLabel, localIndex, issues);
  }

  if (item.recordType === "transition") {
    validateKingsTransitionRow(filePath, item, rowLabel, localIndex, issues);
  }

  if (item.recordType === "kingdomPeriod") {
    validateKingsPeriodRow(filePath, item, rowLabel, localIndex, issues);
  }
}

function validateKingsKingRow(filePath, item, rowLabel, localIndex, issues) {
  const recordId = item.id ?? rowLabel;

  if (!hasNonEmptyValue(item.kingdomId)) {
    issues.push(makeIssue("error", ISSUE.KINGS_KINGDOM_ID_MISSING, filePath, rowLabel, 'King row must include non-empty "kingdomId".', {
      path: "kingdomId",
      rowId: recordId,
      recordType: item.recordType,
      field: "kingdomId",
    }));
  } else {
    validateKingsTargetReference(filePath, rowLabel, item, "kingdomId", item.kingdomId, ["kingdom"], localIndex, issues, ISSUE.KINGS_KINGDOM_ID_UNRESOLVED, ISSUE.KINGS_KINGDOM_ID_TARGET_INVALID);
  }

  if (hasNonEmptyValue(item.predecessorId)) {
    validateKingsSuccessionReference(filePath, rowLabel, item, "predecessorId", item.predecessorId, localIndex, issues, ISSUE.KINGS_PREDECESSOR_UNRESOLVED);
  }

  if (hasNonEmptyValue(item.successorId)) {
    validateKingsSuccessionReference(filePath, rowLabel, item, "successorId", item.successorId, localIndex, issues, ISSUE.KINGS_SUCCESSOR_UNRESOLVED);
  }

  if (Array.isArray(item.relatedTransitionIds)) {
    item.relatedTransitionIds.forEach((targetId, index) => {
      validateKingsTargetReference(filePath, rowLabel, item, `relatedTransitionIds[${index}]`, targetId, ["transition"], localIndex, issues, ISSUE.KINGS_TRANSITION_TARGET_UNRESOLVED, ISSUE.KINGS_TRANSITION_TARGET_INVALID);
    });
  }
}

function validateKingsTransitionRow(filePath, item, rowLabel, localIndex, issues) {
  const transitionFields = [
    ["previousStateId", item.previousStateId],
    ["nextStateId", item.nextStateId],
  ];

  for (const [fieldName, targetId] of transitionFields) {
    if (!hasNonEmptyValue(targetId)) {
      continue;
    }
    validateKingsTargetReference(filePath, rowLabel, item, fieldName, targetId, [...KINGS_TRANSITION_TARGET_TYPES], localIndex, issues, ISSUE.KINGS_TRANSITION_TARGET_UNRESOLVED, ISSUE.KINGS_TRANSITION_TARGET_INVALID);
  }

  if (Array.isArray(item.relatedKingIds)) {
    item.relatedKingIds.forEach((targetId, index) => {
      validateKingsTargetReference(filePath, rowLabel, item, `relatedKingIds[${index}]`, targetId, ["king"], localIndex, issues, ISSUE.KINGS_RELATED_KING_UNRESOLVED, ISSUE.KINGS_RELATED_KING_TARGET_INVALID);
    });
  }

  if (Array.isArray(item.relatedKingdomIds)) {
    item.relatedKingdomIds.forEach((targetId, index) => {
      validateKingsTargetReference(filePath, rowLabel, item, `relatedKingdomIds[${index}]`, targetId, ["kingdom"], localIndex, issues, ISSUE.KINGS_TRANSITION_TARGET_UNRESOLVED, ISSUE.KINGS_TRANSITION_TARGET_INVALID);
    });
  }

  if (Array.isArray(item.relatedPeriodIds)) {
    item.relatedPeriodIds.forEach((targetId, index) => {
      validateKingsTargetReference(filePath, rowLabel, item, `relatedPeriodIds[${index}]`, targetId, ["kingdomPeriod", "exileMarker"], localIndex, issues, ISSUE.KINGS_TRANSITION_TARGET_UNRESOLVED, ISSUE.KINGS_TRANSITION_TARGET_INVALID);
    });
  }
}

function validateKingsPeriodRow(filePath, item, rowLabel, localIndex, issues) {
  if (!Array.isArray(item.relatedKingIds)) {
    return;
  }

  item.relatedKingIds.forEach((targetId, index) => {
    validateKingsTargetReference(filePath, rowLabel, item, `relatedKingIds[${index}]`, targetId, ["king"], localIndex, issues, ISSUE.KINGS_RELATED_KING_UNRESOLVED, ISSUE.KINGS_RELATED_KING_TARGET_INVALID);
  });
}

function validateKingsSuccessionReference(filePath, rowLabel, item, fieldName, targetId, localIndex, issues, unresolvedCode) {
  if (targetId === item.id) {
    issues.push(makeIssue("error", ISSUE.KINGS_SUCCESSION_SELF_REFERENCE, filePath, rowLabel, `King ${fieldName} cannot point to itself via "${targetId}".`, {
      path: fieldName,
      rowId: item.id ?? rowLabel,
      recordType: item.recordType,
      field: fieldName,
      targetId,
    }));
    return;
  }

  validateKingsTargetReference(filePath, rowLabel, item, fieldName, targetId, ["king"], localIndex, issues, unresolvedCode, ISSUE.KINGS_SUCCESSION_TARGET_INVALID);
}

function validateKingsTargetReference(filePath, rowLabel, item, fieldName, targetId, allowedRecordTypes, localIndex, issues, unresolvedCode, invalidCode) {
  if (!hasNonEmptyValue(targetId)) {
    return;
  }

  const registryEntry = localIndex.counts.get(targetId);
  if (!registryEntry) {
    issues.push(makeIssue("error", unresolvedCode, filePath, rowLabel, `Kings / Kingdoms ${fieldName} "${targetId}" does not resolve within the same package.`, {
      path: fieldName,
      rowId: item.id ?? rowLabel,
      recordType: item.recordType,
      field: fieldName,
      targetId,
    }));
    return;
  }

  const targetRecord = localIndex.records.get(targetId);
  if (!targetRecord || !allowedRecordTypes.includes(targetRecord.recordType)) {
    issues.push(makeIssue("error", invalidCode, filePath, rowLabel, `Kings / Kingdoms ${fieldName} "${targetId}" must target ${allowedRecordTypes.join(" or ")} rows.`, {
      path: fieldName,
      rowId: item.id ?? rowLabel,
      recordType: item.recordType,
      field: fieldName,
      targetId,
      targetRecordType: targetRecord?.recordType,
    }));
    return;
  }

  if (registryEntry > 1) {
    issues.push(makeIssue("error", invalidCode, filePath, rowLabel, `Kings / Kingdoms ${fieldName} "${targetId}" is ambiguous because the id appears ${registryEntry} times in the package.`, {
      path: fieldName,
      rowId: item.id ?? rowLabel,
      recordType: item.recordType,
      field: fieldName,
      targetId,
      occurrences: registryEntry,
    }));
  }
}

function validateCrossLinkRow(filePath, item, rowLabel, registry, issues) {
  for (const field of ["fromType", "fromId", "toId", "relationLabel", "basisLabel", "confidenceLabel"]) {
    if (!hasNonEmptyValue(item[field])) {
      issues.push(makeIssue("error", ISSUE.CROSS_LINK_FIELD_MISSING, filePath, rowLabel, `Missing required cross-link field "${field}".`, { path: field, recordId: item.id ?? rowLabel }));
    }
  }

  if (hasNonEmptyValue(item.toType) && !ALLOWED_CROSS_LINK_TYPES.has(item.toType)) {
    issues.push(makeIssue("error", ISSUE.CROSS_LINK_TARGET_TYPE_INVALID, filePath, rowLabel, `Cross-link toType "${item.toType}" is not allowed.`, {
      path: "toType",
      recordId: item.id ?? rowLabel,
      sourceId: item.fromId,
      targetId: item.toId,
      field: "toType",
    }));
  }

  if (!hasNonEmptyValue(item.toType)) {
    issues.push(makeIssue("warning", ISSUE.CROSS_LINK_MISSING_TARGET_TYPE, filePath, rowLabel, "Cross-link is missing toType and should add an explicit target type.", {
      path: "toType",
      recordId: item.id ?? rowLabel,
      sourceId: item.fromId,
      targetId: item.toId,
      field: "toType",
    }));
  }

  validateInternalIdReference(filePath, rowLabel, "fromId", item.fromId, registry, issues, item);
  validateInternalIdReference(filePath, rowLabel, "toId", item.toId, registry, issues, item);

  if (hasNonEmptyValue(item.fromId) && hasNonEmptyValue(item.toId) && item.fromId === item.toId) {
    issues.push(makeIssue("warning", ISSUE.CROSS_LINK_SELF_LINK, filePath, rowLabel, `Cross-link points to itself via "${item.fromId}".`, {
      path: "toId",
      recordId: item.id ?? rowLabel,
      sourceId: item.fromId,
      targetId: item.toId,
      field: "toId",
    }));
  }
}

function validateSupportingReferenceRow(filePath, item, rowLabel, issues) {
  if (!hasLocalizedField(item.referenceTypeLabel)) {
    issues.push(makeIssue("error", ISSUE.SUPPORTING_REFERENCE_FIELD_MISSING, filePath, rowLabel, 'Missing required supporting-reference field "referenceTypeLabel".', { path: "referenceTypeLabel", recordId: item.id ?? rowLabel }));
  }

  const referenceLabelText = flattenText(item.referenceTypeLabel).toLowerCase();
  const cautionText = flattenText(item.cautionNote).toLowerCase();
  const confidenceText = flattenText(item.confidenceLabel).toLowerCase();
  const sourceBasisText = flattenText(item.sourceBasisLabel).toLowerCase();
  const isKoreanReference = flattenText(item.title).includes("한국");
  const referenceOnly = containsAny(referenceLabelText, ["reference only", "참조용"]);
  const interpretationBreach = containsAny(referenceLabelText, ["basis for biblical interpretation", "성경 해석 근거"]) &&
    !containsAny(referenceLabelText, ["not a basis for biblical interpretation", "성경 해석 근거 아님"]);
  const nonInterpretive = containsAny(cautionText, ["not a basis for biblical interpretation", "성경 해석 근거 아님"]);
  const reviewRequired = containsAny(`${sourceBasisText} ${confidenceText} ${cautionText}`, ["review required", "source review required", "검토 필요", "출처 검토 필요"]);
  const authorityText = `${referenceLabelText} ${confidenceText} ${cautionText} ${flattenText(item.authority).toLowerCase()} ${flattenText(item.role).toLowerCase()}`;
  const authorityBreach = containsAny(authorityText, [
    "basis for biblical interpretation",
    "성경 해석 근거",
    "primary authority",
    "equal authority",
    "scripture-equivalent",
    "doctrinal authority",
    "동등 권위",
    "주 권위",
  ]) && !containsAny(authorityText, ["not a basis for biblical interpretation", "성경 해석 근거 아님"]);

  if (item.isSupportingReference !== true) {
    issues.push(makeIssue("error", ISSUE.SUPPORTING_REFERENCE_FLAG_MISSING, filePath, rowLabel, "Supporting reference rows must set isSupportingReference to true.", { path: "isSupportingReference", recordId: item.id ?? rowLabel }));
  }

  if (interpretationBreach || authorityBreach) {
    issues.push(makeIssue("error", ISSUE.SUPPORTING_REFERENCE_AUTHORITY_BREACH, filePath, rowLabel, "Supporting reference row is improperly presented as interpretive authority.", { path: "referenceTypeLabel", recordId: item.id ?? rowLabel }));
  }

  if (referenceOnly && !nonInterpretive) {
    issues.push(makeIssue("error", ISSUE.SUPPORTING_REFERENCE_INTERPRETATION_LABEL_MISSING, filePath, rowLabel, 'Supporting reference row is missing a "not a basis for biblical interpretation" caution.', { path: "cautionNote", recordId: item.id ?? rowLabel }));
  }

  if (!hasLocalizedField(item.confidenceLabel)) {
    issues.push(makeIssue("error", ISSUE.SUPPORTING_REFERENCE_FIELD_MISSING, filePath, rowLabel, 'Missing required supporting-reference field "confidenceLabel".', { path: "confidenceLabel", recordId: item.id ?? rowLabel }));
  }

  if (!hasLocalizedField(item.cautionNote)) {
    issues.push(makeIssue("error", ISSUE.SUPPORTING_REFERENCE_FIELD_MISSING, filePath, rowLabel, 'Missing required supporting-reference field "cautionNote".', { path: "cautionNote", recordId: item.id ?? rowLabel }));
  }

  if (isKoreanReference && !hasLocalizedField(item.sourceBasisLabel)) {
    if (reviewRequired) {
      issues.push(makeIssue("warning", ISSUE.SUPPORTING_REFERENCE_REVIEW_REQUIRED, filePath, rowLabel, "Korean supporting reference requires explicit source-basis review.", { path: "sourceBasisLabel", recordId: item.id ?? rowLabel }));
    } else {
      issues.push(makeIssue("error", ISSUE.SUPPORTING_REFERENCE_FIELD_MISSING, filePath, rowLabel, 'Korean supporting reference is missing "sourceBasisLabel".', { path: "sourceBasisLabel", recordId: item.id ?? rowLabel }));
    }
  } else if (reviewRequired) {
    issues.push(makeIssue("warning", ISSUE.SUPPORTING_REFERENCE_REVIEW_REQUIRED, filePath, rowLabel, "Supporting reference is explicitly marked for review.", {
      path: "sourceBasisLabel",
      recordId: item.id ?? rowLabel,
    }));
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
      issues.push(makeIssue("error", ISSUE.BOOKS_FIELD_MISSING, filePath, rowLabel, `Missing required canonical-book field "${field}".`, { path: field, recordId: item.id ?? rowLabel, bookId: item.bookId, order: item.canonicalOrder }));
    }
  }

  if (!hasLocalizedField(item.title)) {
    issues.push(makeIssue("error", ISSUE.BOOKS_TITLE_MISSING, filePath, rowLabel, 'Canonical book row is missing "title.ko" or "title.en".', { path: "title", recordId: item.id ?? rowLabel, bookId: item.bookId, order: item.canonicalOrder }));
  }

  if (!hasLocalizedField(item.canonicalTitle)) {
    issues.push(makeIssue("warning", ISSUE.BOOKS_CANONICAL_TITLE_WARNING, filePath, rowLabel, 'Canonical book row is missing optional "canonicalTitle.ko" or "canonicalTitle.en".', { path: "canonicalTitle", recordId: item.id ?? rowLabel, bookId: item.bookId, order: item.canonicalOrder }));
  }

  if (!hasNonEmptyArray(item.scriptureAnchors)) {
    issues.push(makeIssue("error", ISSUE.BOOKS_SCRIPTURE_ANCHORS_MISSING, filePath, rowLabel, 'Canonical book row is missing non-empty "scriptureAnchors".', { path: "scriptureAnchors", recordId: item.id ?? rowLabel, bookId: item.bookId, order: item.canonicalOrder }));
  }

  if (item.testament && !["OT", "NT"].includes(item.testament)) {
    issues.push(makeIssue("error", ISSUE.BOOKS_TESTAMENT_INVALID, filePath, rowLabel, `Invalid testament "${item.testament}". Expected OT or NT.`, { path: "testament", recordId: item.id ?? rowLabel, bookId: item.bookId, order: item.canonicalOrder }));
  }

  if (item.canonicalSection && !CANONICAL_SECTIONS.has(item.canonicalSection)) {
    issues.push(makeIssue("error", ISSUE.BOOKS_FIELD_MISSING, filePath, rowLabel, `Invalid canonicalSection "${item.canonicalSection}".`, { path: "canonicalSection", recordId: item.id ?? rowLabel, bookId: item.bookId, order: item.canonicalOrder }));
  }
}

function validateCoreBiblicalEvents(filePath, data, items, issues) {
  const packageIdentifier = data.packageId ?? path.basename(filePath);

  if (items.length !== 85) {
    issues.push(makeIssue("error", ISSUE.EVENTS_COUNT_MISMATCH, filePath, null, `Core biblical events package must contain exactly 85 rows; expected 85 and found ${items.length}.`, {
      packageId: packageIdentifier,
      expected: 85,
      actual: items.length,
    }));
  }

  const eventIds = new Map();

  for (const item of items) {
    const rowLabel = item?.id ?? "unknown-event-row";

    if (item?.eventId === undefined || item?.eventId === null) {
      issues.push(makeIssue("error", ISSUE.EVENTS_EVENT_ID_MISSING, filePath, rowLabel, 'Core event row is missing "eventId".', { path: "eventId", recordId: rowLabel }));
    } else if (typeof item.eventId !== "string" || item.eventId.trim().length === 0) {
      issues.push(makeIssue("error", ISSUE.EVENTS_EVENT_ID_EMPTY, filePath, rowLabel, 'Core event row must use a non-empty string "eventId".', { path: "eventId", recordId: rowLabel }));
    } else {
      eventIds.set(item.eventId, (eventIds.get(item.eventId) ?? 0) + 1);
    }

    for (const field of [
      "summary",
      "dateLabel",
      "dateBasisLabel",
      "dateConfidenceLabel",
      "relatedPeopleLabels",
    ]) {
      if (!hasNonEmptyValue(item?.[field])) {
        issues.push(makeIssue("error", ISSUE.EVENTS_FIELD_MISSING, filePath, rowLabel, `Core event row is missing required field "${field}".`, {
          path: field,
          recordId: rowLabel,
          eventId: item?.eventId,
        }));
      }
    }

    if (item?.recordType !== "event") {
      issues.push(makeIssue("error", ISSUE.EVENTS_FIELD_MISSING, filePath, rowLabel, 'Core event row must set recordType to "event".', {
        path: "recordType",
        recordId: rowLabel,
        eventId: item?.eventId,
      }));
    }

    if (item?.isSkeleton !== true) {
      issues.push(makeIssue("error", ISSUE.EVENTS_FIELD_MISSING, filePath, rowLabel, 'Core event row must set "isSkeleton" to true.', {
        path: "isSkeleton",
        recordId: rowLabel,
        eventId: item?.eventId,
      }));
    }
  }

  for (const [eventId, count] of eventIds.entries()) {
    if (count > 1) {
      issues.push(makeIssue("error", ISSUE.EVENTS_EVENT_ID_DUPLICATE, filePath, eventId, `Duplicate core eventId "${eventId}" (${count} occurrences).`, {
        path: "eventId",
        eventId,
        occurrences: count,
      }));
    }
  }
}

function validateCanonicalBooks(filePath, data, items, issues) {
  const packageIdentifier = data.packageId ?? path.basename(filePath);

  if (items.length !== 66) {
    issues.push(makeIssue("error", ISSUE.BOOKS_COUNT_MISMATCH, filePath, null, `Canonical books package must contain exactly 66 rows; expected 66 and found ${items.length}.`, { packageId: packageIdentifier, expected: 66, actual: items.length }));
  }

  const bookIds = new Map();
  const canonicalOrders = new Map();
  const testamentCounts = new Map([
    ["OT", 0],
    ["NT", 0],
  ]);

  for (const item of items) {
    const rowLabel = item?.id ?? "unknown-book-row";
    if (item?.bookId === undefined || item?.bookId === null) {
      issues.push(makeIssue("error", ISSUE.BOOKS_BOOK_ID_MISSING, filePath, rowLabel, 'Canonical books row is missing "bookId".', { path: "bookId", recordId: rowLabel, order: item?.canonicalOrder }));
    } else if (typeof item.bookId !== "string" || item.bookId.trim().length === 0) {
      issues.push(makeIssue("error", ISSUE.BOOKS_BOOK_ID_EMPTY, filePath, rowLabel, 'Canonical books row must use a non-empty string "bookId".', { path: "bookId", recordId: rowLabel, order: item?.canonicalOrder }));
    } else {
      bookIds.set(item.bookId, (bookIds.get(item.bookId) ?? 0) + 1);
    }

    if (item?.canonicalOrder === undefined || item?.canonicalOrder === null) {
      issues.push(makeIssue("error", ISSUE.BOOKS_ORDER_MISSING, filePath, rowLabel, 'Canonical books row is missing "canonicalOrder".', { path: "canonicalOrder", recordId: rowLabel, bookId: item?.bookId }));
    } else if (!Number.isInteger(item.canonicalOrder)) {
      issues.push(makeIssue("error", ISSUE.BOOKS_ORDER_NON_INTEGER, filePath, rowLabel, `Canonical books row must use an integer canonicalOrder; received "${item.canonicalOrder}".`, { path: "canonicalOrder", recordId: rowLabel, bookId: item?.bookId, order: item?.canonicalOrder }));
    } else if (item.canonicalOrder < 1 || item.canonicalOrder > 66) {
      issues.push(makeIssue("error", ISSUE.BOOKS_ORDER_OUT_OF_RANGE, filePath, rowLabel, `Canonical books row canonicalOrder must be within 1..66; received "${item.canonicalOrder}".`, { path: "canonicalOrder", recordId: rowLabel, bookId: item?.bookId, order: item?.canonicalOrder }));
    } else {
      canonicalOrders.set(item.canonicalOrder, (canonicalOrders.get(item.canonicalOrder) ?? 0) + 1);
    }

    if (item?.isSkeleton !== true) {
      issues.push(makeIssue("error", ISSUE.BOOKS_SKELETON_FLAG_INVALID, filePath, rowLabel, 'Canonical books skeleton row must set "isSkeleton" to true.', { path: "isSkeleton", recordId: rowLabel, bookId: item?.bookId, order: item?.canonicalOrder }));
    }

    if (item?.testament === "OT" || item?.testament === "NT") {
      testamentCounts.set(item.testament, (testamentCounts.get(item.testament) ?? 0) + 1);
    }
  }

  for (const [bookId, count] of bookIds.entries()) {
    if (count > 1) {
      issues.push(makeIssue("error", ISSUE.BOOKS_BOOK_ID_DUPLICATE, filePath, bookId, `Duplicate canonical bookId "${bookId}" (${count} occurrences).`, { path: "bookId", bookId, occurrences: count }));
    }
  }

  for (const [order, count] of canonicalOrders.entries()) {
    if (count > 1) {
      issues.push(makeIssue("error", ISSUE.BOOKS_ORDER_DUPLICATE, filePath, `canonicalOrder:${order}`, `Duplicate canonicalOrder "${order}" (${count} occurrences).`, { path: "canonicalOrder", order, occurrences: count }));
    }
  }

  const missingOrders = [];
  for (let order = 1; order <= 66; order += 1) {
    if (!canonicalOrders.has(order)) {
      missingOrders.push(order);
    }
  }
  if (missingOrders.length > 0) {
    issues.push(makeIssue("error", ISSUE.BOOKS_ORDER_GAP, filePath, null, `Canonical books package must cover canonicalOrder 1..66 without gaps; missing ${missingOrders.join(", ")}.`, { path: "canonicalOrder", missingOrders }));
  }

  if (testamentCounts.get("OT") !== 39 || testamentCounts.get("NT") !== 27) {
    issues.push(makeIssue("error", ISSUE.BOOKS_TESTAMENT_COUNT_MISMATCH, filePath, null, `Canonical books package must contain OT=39 and NT=27; found OT=${testamentCounts.get("OT")} and NT=${testamentCounts.get("NT")}.`, {
      path: "testament",
      expectedOT: 39,
      actualOT: testamentCounts.get("OT"),
      expectedNT: 27,
      actualNT: testamentCounts.get("NT"),
    }));
  }
}

function validateWarnings(filePath, packageType, item, rowLabel, issues) {
  const dateText = `${flattenText(item.dateLabel)} ${flattenText(item.basisLabel)}`.toLowerCase();
  const cautionText = flattenText(item.cautionNote).toLowerCase();
  const confidenceText = flattenText(item.confidenceLabel).toLowerCase();
  const sourceBasisText = flattenText(item.sourceBasisLabel).toLowerCase();

  if (containsAny(dateText, ["approximate", "대략", "approx"]) && !containsAny(`${cautionText} ${confidenceText} ${sourceBasisText}`, ["review required", "검토 필요", "source review required", "출처 검토 필요"])) {
    issues.push(makeIssue("warning", ISSUE.WARNING_APPROXIMATE_DATE, filePath, rowLabel, "Approximate date is present without an explicit review flag.", { recordId: item.id ?? rowLabel }));
  }

  if (containsAny(dateText, ["uncertain", "불확실"]) && !containsAny(`${cautionText} ${confidenceText}`, ["review required", "검토 필요", "uncertain", "불확실"])) {
    issues.push(makeIssue("warning", ISSUE.WARNING_CHRONOLOGY_REVIEW, filePath, rowLabel, "Chronology uncertainty should carry a clearer review flag.", { recordId: item.id ?? rowLabel }));
  }

  if (packageType === "timeline.sections" && !hasLocalizedField(item.title) && !hasLocalizedField(item.sectionTitle)) {
    issues.push(makeIssue("warning", ISSUE.WARNING_OPTIONAL_DISPLAY_LABEL, filePath, rowLabel, "Section row is missing an optional display label.", { recordId: item.id ?? rowLabel }));
  }

  if ((packageType === "timeline.references" || item.isSupportingReference === true) && !hasLocalizedField(item.sourceBasisLabel)) {
    const reviewText = `${confidenceText} ${cautionText}`.toLowerCase();
    if (containsAny(reviewText, ["review required", "검토 필요"])) {
      issues.push(makeIssue("warning", ISSUE.SUPPORTING_REFERENCE_REVIEW_REQUIRED, filePath, rowLabel, "Supporting reference should add explicit sourceBasisLabel after review.", { path: "sourceBasisLabel", recordId: item.id ?? rowLabel }));
    }
  }

  if (packageType === "timeline.cross-links") {
    const crossLinkReviewText = `${flattenText(item.basisLabel)} ${flattenText(item.confidenceLabel)}`.toLowerCase();
    if (containsLowConfidenceMarker(crossLinkReviewText) || containsAny(crossLinkReviewText, ["review required", "검토 필요"])) {
      issues.push(makeIssue("warning", ISSUE.WARNING_LOW_CONFIDENCE_CROSS_LINK, filePath, rowLabel, "Cross-link is explicitly low-confidence and should be reviewed.", { recordId: item.id ?? rowLabel }));
    }
  }

  if (isKingsKingdomsPackageType(packageType)) {
    const chronologyText = `${flattenText(item.approximateDateLabel)} ${flattenText(item.reignLabel)} ${flattenText(item.basisLabel)} ${flattenText(item.cautionNote)} ${flattenText(item.confidenceLabel)}`.toLowerCase();
    const reviewText = `${confidenceText} ${cautionText} ${sourceBasisText}`.toLowerCase();

    if (hasLocalizedField(item.approximateDateLabel) && item.reviewRequired !== true && !containsAny(reviewText, ["review required", "검토 필요", "source review required", "출처 검토 필요"])) {
      issues.push(makeIssue("warning", ISSUE.KINGS_APPROXIMATE_DATE_REVIEW, filePath, rowLabel, "Kings / Kingdoms approximate chronology should carry reviewRequired or clearer caution labeling.", {
        path: "approximateDateLabel",
        rowId: item.id ?? rowLabel,
        recordType: item.recordType,
        field: "approximateDateLabel",
      }));
    }

    if (item.recordType === "king" && !hasLocalizedField(item.reignLabel)) {
      issues.push(makeIssue("warning", ISSUE.KINGS_REIGN_LABEL_MISSING, filePath, rowLabel, "King row is missing optional reignLabel and should add one when chronology wording is refined.", {
        path: "reignLabel",
        rowId: item.id ?? rowLabel,
        recordType: item.recordType,
        field: "reignLabel",
      }));
    }

    if (containsAny(chronologyText, ["synchronism", "synchrony", "동시대"]) && containsLowConfidenceMarker(reviewText)) {
      issues.push(makeIssue("warning", ISSUE.KINGS_LOW_CONFIDENCE_SYNCHRONISM, filePath, rowLabel, "Kings / Kingdoms synchronism remains low-confidence and should stay review-gated.", {
        rowId: item.id ?? rowLabel,
        recordType: item.recordType,
      }));
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
      issues.push(makeIssue("error", ISSUE.BANNED_BIBLE_TEXT_FIELD, filePath, rowLabel, `Forbidden Bible-text field "${key}" is present.`, { path: key, recordId: rowLabel, field: key }));
    }
    if (isForbiddenMapProviderField(key, nestedValue)) {
      issues.push(makeIssue("error", ISSUE.BANNED_MAP_PROVIDER_FIELD, filePath, rowLabel, `Forbidden map-provider field "${key}" is present.`, { path: key, recordId: rowLabel, field: key }));
    } else if (BANNED_COORDINATE_FIELDS.has(key)) {
      issues.push(makeIssue("error", ISSUE.BANNED_COORDINATE_FIELD, filePath, rowLabel, `Forbidden no-coordinate field "${key}" is present.`, { path: key, recordId: rowLabel, field: key }));
    }
    validateGuardrails(filePath, nestedValue, issues, rowLabel, seen);
  }
}

function isCanonicalBooksPackage(data, filePath) {
  if (data?.packageType !== "timeline.books") {
    return false;
  }

  const basename = path.basename(filePath);
  const packageId = typeof data?.packageId === "string" ? data.packageId : "";
  const status = typeof data?.status === "string" ? data.status : "";

  return (
    basename === "books.66-canonical-skeleton.json" ||
    packageId === "timeline.books.66-canonical-skeleton" ||
    packageId === "timeline.books.66-canonical-fixture" ||
    status === "canonical-skeleton"
  );
}

function isCoreBiblicalEventsPackage(data, filePath) {
  if (data?.packageType !== "timeline.events") {
    return false;
  }

  const basename = path.basename(filePath);
  const packageId = typeof data?.packageId === "string" ? data.packageId : "";
  const status = typeof data?.status === "string" ? data.status : "";

  return (
    basename === "events.core-biblical-skeleton.json" ||
    packageId === "timeline.events.core-biblical-skeleton" ||
    status === "core-biblical-skeleton"
  );
}

function isKingsKingdomsPackageType(packageType) {
  return packageType === "timeline.kings-kingdoms";
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

function containsLowConfidenceMarker(text) {
  return /\blow\b/i.test(text) || text.includes("낮음");
}

function collectExactChronologyFields(value, basePath = "", hits = [], seen = new Set()) {
  if (!value || typeof value !== "object") {
    return hits;
  }
  if (seen.has(value)) {
    return hits;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      collectExactChronologyFields(entry, `${basePath}[${index}]`, hits, seen);
    });
    return hits;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const currentPath = basePath ? `${basePath}.${key}` : key;
    if (EXACT_CHRONOLOGY_FIELDS.has(key)) {
      hits.push({ field: key, path: currentPath });
    }
    collectExactChronologyFields(nestedValue, currentPath, hits, seen);
  }

  return hits;
}

function isScriptureReferenceLike(value) {
  if (typeof value !== "string") {
    return false;
  }
  const normalized = value.trim();
  return /^(gen|genesis|exod|exodus|matt|matthew|john|acts|rom|ps|psalm|창|출|마|요|행|롬)\s*\d+:\d+/i.test(normalized);
}

function validateInternalIdReference(filePath, rowLabel, fieldName, idValue, registry, issues, item) {
  if (!hasNonEmptyValue(idValue)) {
    return;
  }

  if (isScriptureReferenceLike(idValue)) {
    issues.push(makeIssue("error", ISSUE.CROSS_LINK_BIBLE_REFERENCE_AS_ID, filePath, rowLabel, `Cross-link ${fieldName} "${idValue}" looks like a Scripture reference, not a package row id.`, {
      path: fieldName,
      recordId: item.id ?? rowLabel,
      sourceId: item.fromId,
      targetId: item.toId,
      field: fieldName,
    }));
    return;
  }

  const registryEntry = registry.get(idValue);
  if (!registryEntry) {
    issues.push(makeIssue("error", fieldName === "fromId" ? ISSUE.CROSS_LINK_SOURCE_MISSING : ISSUE.CROSS_LINK_TARGET_MISSING, filePath, rowLabel, `Cross-link ${fieldName} "${idValue}" does not resolve.`, {
      path: fieldName,
      recordId: item.id ?? rowLabel,
      sourceId: item.fromId,
      targetId: item.toId,
      field: fieldName,
    }));
    return;
  }

  if (registryEntry.count > 1) {
    issues.push(makeIssue("error", ISSUE.CROSS_LINK_TARGET_DUPLICATE, filePath, rowLabel, `Cross-link ${fieldName} "${idValue}" is ambiguous because the target id appears ${registryEntry.count} times.`, {
      path: fieldName,
      recordId: item.id ?? rowLabel,
      sourceId: item.fromId,
      targetId: item.toId,
      field: fieldName,
      occurrences: registryEntry.count,
    }));
  }
}

function isForbiddenMapProviderField(key, value) {
  if (key === "mapProvider") {
    return true;
  }
  if (["provider", "sourceProvider"].includes(key) && typeof value === "string") {
    return MAP_PROVIDER_VALUES.has(value.trim().toLowerCase());
  }
  return false;
}

function makeIssue(level, code, filePath, rowId, message, details = {}) {
  return {
    level,
    severity: level,
    code,
    filePath,
    file: path.relative(process.cwd(), filePath),
    rowId,
    message,
    ...details,
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
    errorCount: sortedIssues.filter((issue) => issue.level === "error").length,
    warningCount: sortedIssues.filter((issue) => issue.level === "warning").length,
    fatalCount: sortedIssues.filter((issue) => issue.level === "fatal").length,
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
    const rowBits = [];
    if (issue.rowId) rowBits.push(issue.rowId);
    if (issue.bookId) rowBits.push(`bookId=${issue.bookId}`);
    if (issue.order !== undefined) rowBits.push(`order=${issue.order}`);
    if (issue.sourceId) rowBits.push(`sourceId=${issue.sourceId}`);
    if (issue.targetId) rowBits.push(`targetId=${issue.targetId}`);
    if (issue.field) rowBits.push(`field=${issue.field}`);
    const rowSuffix = rowBits.length > 0 ? ` [${rowBits.join(", ")}]` : "";
    console.log(`${issue.level.toUpperCase()} ${issue.code} ${path.relative(process.cwd(), issue.filePath)}${rowSuffix}: ${issue.message}`);
  }
}

main(process.argv.slice(2));

#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "WARN: Could not detect repo root with git."
  exit 0
fi

PACKAGE_PATH="${REPO_ROOT}/docs/data-packages/original-language/generated"
PLUGIN_PATH="${REPO_ROOT}/backend/app/public/wp-content/plugins/wcm-core"
VERIFY_SCRIPT="${PLUGIN_PATH}/tools/verify-original-language-package.php"

echo "== WCM Data Package Status =="
echo "Repo root: ${REPO_ROOT}"
echo "Package path: ${PACKAGE_PATH}"

MANIFEST="${PACKAGE_PATH}/manifest.json"
CHECKSUMS="${PACKAGE_PATH}/checksums.sha256"
TERMS_JSONL="${PACKAGE_PATH}/original-terms.jsonl"
OCCURRENCES_JSONL="${PACKAGE_PATH}/original-word-occurrences.jsonl"

echo "manifest.json: $([[ -f "${MANIFEST}" ]] && echo present || echo missing)"
echo "checksums.sha256: $([[ -f "${CHECKSUMS}" ]] && echo present || echo missing)"
echo "original-terms.jsonl: $([[ -f "${TERMS_JSONL}" ]] && echo present || echo missing)"
echo "original-word-occurrences.jsonl: $([[ -f "${OCCURRENCES_JSONL}" ]] && echo present || echo missing)"

if [[ ! -f "${MANIFEST}" || ! -f "${CHECKSUMS}" || ! -f "${TERMS_JSONL}" || ! -f "${OCCURRENCES_JSONL}" ]]; then
  echo "Data package not present; this is okay if DB is already populated"
  exit 0
fi

if [[ ! -f "${VERIFY_SCRIPT}" ]]; then
  echo "WARN: Verify script not found: ${VERIFY_SCRIPT}"
  exit 0
fi

if ! command -v php >/dev/null 2>&1; then
  echo "WARN: php is not available. Skipping package verification."
  exit 0
fi

echo "Running package verification..."
if ! VERIFY_OUTPUT="$(
  cd "${PLUGIN_PATH}"
  php tools/verify-original-language-package.php --package="${PACKAGE_PATH}" 2>&1
)"; then
  echo "WARN: Data package verification failed."
  echo "Verifier failure reason:"
  printf '%s\n' "${VERIFY_OUTPUT}"
  echo "NOTE: Package files are present, but verification needs manual review."
else
  printf '%s\n' "${VERIFY_OUTPUT}"
fi

echo "NOTE: This script never runs DB import or --apply."

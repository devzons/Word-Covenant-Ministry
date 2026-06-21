#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "ERROR: Could not detect repo root with git."
  exit 1
fi

DB_SCRIPT="${REPO_ROOT}/scripts/wcm-db-status.sh"
PACKAGE_SCRIPT="${REPO_ROOT}/scripts/wcm-data-package-status.sh"

echo "== WCM Session Start =="
echo "Repo root: ${REPO_ROOT}"

echo
echo "Git status before pull:"
PRE_STATUS="$(git -C "${REPO_ROOT}" status --short || true)"
if [[ -n "${PRE_STATUS}" ]]; then
  printf '%s\n' "${PRE_STATUS}"
else
  echo "(clean)"
fi

if [[ -n "${PRE_STATUS}" ]]; then
  echo
  echo "WARN: Working tree is dirty. Skipping automatic git pull."
else
  echo
  echo "Working tree is clean. Running git pull..."
  if ! git -C "${REPO_ROOT}" pull; then
    echo "WARN: git pull failed."
  fi
fi

echo
echo "Git status after pull check:"
POST_STATUS="$(git -C "${REPO_ROOT}" status --short || true)"
if [[ -n "${POST_STATUS}" ]]; then
  printf '%s\n' "${POST_STATUS}"
else
  echo "(clean)"
fi

for REQUIRED in \
  "${REPO_ROOT}/AGENTS.md" \
  "${REPO_ROOT}/docs/WORKFLOWS/SESSION_START_WORKFLOW.md" \
  "${REPO_ROOT}/docs/ROADMAP/PROJECT_STATUS.md"
do
  if [[ -f "${REQUIRED}" ]]; then
    echo "OK: Found ${REQUIRED#${REPO_ROOT}/}"
  else
    echo "WARN: Missing required file ${REQUIRED}"
  fi
done

echo
if [[ -x "${DB_SCRIPT}" ]]; then
  DB_OUTPUT="$("${DB_SCRIPT}" || true)"
  printf '%s\n' "${DB_OUTPUT}"
else
  DB_OUTPUT="WARN: DB status script is missing or not executable: ${DB_SCRIPT}"
  echo "${DB_OUTPUT}"
fi

echo
if [[ -x "${PACKAGE_SCRIPT}" ]]; then
  PACKAGE_OUTPUT="$("${PACKAGE_SCRIPT}" || true)"
  printf '%s\n' "${PACKAGE_OUTPUT}"
else
  PACKAGE_OUTPUT="WARN: Data package status script is missing or not executable: ${PACKAGE_SCRIPT}"
  echo "${PACKAGE_OUTPUT}"
fi

echo
echo "== WCM Session Start Report =="
echo "Git status:"
if [[ -n "${POST_STATUS}" ]]; then
  printf '%s\n' "${POST_STATUS}"
else
  echo "(clean)"
fi
echo
echo "DB status:"
printf '%s\n' "${DB_OUTPUT}"
echo
echo "Data Package status:"
printf '%s\n' "${PACKAGE_OUTPUT}"
echo
echo "Next action:"
if [[ -n "${POST_STATUS}" ]]; then
  echo "- Review and classify local changes before implementation."
else
  echo "- Review the reported DB and Data Package status, then begin the approved task."
fi
if grep -Eq 'WARN|MISMATCH|manual verification' <<< "${DB_OUTPUT}"; then
  echo "- DB status needs manual verification"
fi
echo "- DB import is not executed by this script."
echo "- --apply is not executed by this script."
echo "- commit is not executed by this script."
echo "- push is not executed by this script."

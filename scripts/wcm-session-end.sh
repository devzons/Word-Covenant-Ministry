#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "ERROR: Could not detect repo root with git."
  exit 1
fi

DB_SCRIPT="${REPO_ROOT}/scripts/wcm-db-status.sh"
PACKAGE_SCRIPT="${REPO_ROOT}/scripts/wcm-data-package-status.sh"

echo "== WCM Session End =="
echo "Repo root: ${REPO_ROOT}"

echo
echo "Git status --short --ignored:"
STATUS_OUTPUT="$(git -C "${REPO_ROOT}" status --short --ignored || true)"
if [[ -n "${STATUS_OUTPUT}" ]]; then
  printf '%s\n' "${STATUS_OUTPUT}"
else
  echo "(no changes)"
fi

echo
echo "Running git diff --check..."
if git -C "${REPO_ROOT}" diff --check; then
  DIFF_CHECK_RESULT="clean"
else
  DIFF_CHECK_RESULT="issues detected"
fi

echo
if grep -qE '(^|[[:space:]])\.DS_Store$' <<< "${STATUS_OUTPUT}"; then
  echo "WARN: .DS_Store change detected in git status."
fi

FORBIDDEN_PATTERN='(\.sql(\.gz)?|\.zip|\.tar|\.tar\.gz|\.tgz|\.gz|\.jsonl|(^|/)generated(/|$))'
if grep -Eiq "${FORBIDDEN_PATTERN}" <<< "${STATUS_OUTPUT}"; then
  echo "WARN: SQL/ZIP/TAR/GZ/JSONL/generated artifact detected in git status."
fi

GENERATED_PATH="${REPO_ROOT}/docs/data-packages/original-language/generated"
if git -C "${REPO_ROOT}" check-ignore -q "${GENERATED_PATH}"; then
  GENERATED_IGNORE_STATUS="ignored"
else
  GENERATED_IGNORE_STATUS="not ignored or not present"
fi
echo "generated/ ignore status: ${GENERATED_IGNORE_STATUS}"

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

COMMIT_ALLOWED=()
COMMIT_FORBIDDEN=()
IGNORED_FILES=()

while IFS= read -r LINE; do
  [[ -z "${LINE}" ]] && continue
  STATUS_CODE="${LINE:0:2}"
  PATH_VALUE="${LINE:3}"

  if [[ "${STATUS_CODE}" == "!!" ]]; then
    IGNORED_FILES+=("${PATH_VALUE}")
    continue
  fi

  if [[ "${PATH_VALUE}" =~ (^|/)\.DS_Store$ ]] || [[ "${PATH_VALUE}" =~ \.sql(\.gz)?$ ]] || [[ "${PATH_VALUE}" =~ \.zip$ ]] || [[ "${PATH_VALUE}" =~ \.tar$ ]] || [[ "${PATH_VALUE}" =~ \.tar\.gz$ ]] || [[ "${PATH_VALUE}" =~ \.tgz$ ]] || [[ "${PATH_VALUE}" =~ \.gz$ ]] || [[ "${PATH_VALUE}" =~ \.jsonl$ ]] || [[ "${PATH_VALUE}" =~ (^|/)generated(/|$) ]]; then
    COMMIT_FORBIDDEN+=("${PATH_VALUE}")
  else
    COMMIT_ALLOWED+=("${PATH_VALUE}")
  fi
done <<< "${STATUS_OUTPUT}"

echo
echo "commit 가능 파일:"
if (( ${#COMMIT_ALLOWED[@]} )); then
  printf '  %s\n' "${COMMIT_ALLOWED[@]}"
else
  echo "  (none)"
fi

echo "commit 금지 파일:"
if (( ${#COMMIT_FORBIDDEN[@]} )); then
  printf '  %s\n' "${COMMIT_FORBIDDEN[@]}"
else
  echo "  (none)"
fi

echo "ignored 파일:"
if (( ${#IGNORED_FILES[@]} )); then
  printf '  %s\n' "${IGNORED_FILES[@]}"
else
  echo "  (none)"
fi

echo
echo "Data Package export/zip decision:"
if grep -Eq '(^|\s)(docs/|AGENTS\.md|scripts/)' <<< "${STATUS_OUTPUT}"; then
  echo "- Review whether a package export or ZIP is needed later."
else
  echo "- No package action suggested by current git status."
fi

echo
echo "commit and push are not executed by this script."

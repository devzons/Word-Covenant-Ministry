#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "WARN: Could not detect repo root with git."
  exit 0
fi

WP_PATH="${REPO_ROOT}/backend/app/public"
WP_CONFIG_PATH="${WP_PATH}/wp-config.php"

echo "== WCM DB Status =="
echo "Repo root: ${REPO_ROOT}"
echo "WP path: ${WP_PATH}"

if ! command -v wp >/dev/null 2>&1; then
  echo "WARN: wp CLI is not available. Skipping DB checks."
  exit 0
fi

if [[ ! -d "${WP_PATH}" ]]; then
  echo "WARN: WP path not found: ${WP_PATH}"
  exit 0
fi

wp_eval() {
  wp --path="${WP_PATH}" "$@" 2>/dev/null
}

print_wp_cli_diagnostics() {
  echo "Diagnostics:"
  echo "  WP_PATH: ${WP_PATH}"

  if WP_INFO="$(wp --path="${WP_PATH}" --info 2>&1)"; then
    echo "  wp --info:"
    while IFS= read -r LINE; do
      [[ -n "${LINE}" ]] && echo "    ${LINE}"
    done <<< "${WP_INFO}"
  else
    echo "  wp --info:"
    while IFS= read -r LINE; do
      [[ -n "${LINE}" ]] && echo "    ${LINE}"
    done <<< "${WP_INFO}"
  fi

  if [[ -f "${WP_CONFIG_PATH}" ]]; then
    if grep -Eq "define\(\s*['\"]DB_HOST['\"]\s*," "${WP_CONFIG_PATH}"; then
      echo "  wp-config.php DB_HOST: present"
    else
      echo "  wp-config.php DB_HOST: missing"
    fi

    if grep -Eq "define\(\s*['\"]DB_NAME['\"]\s*," "${WP_CONFIG_PATH}"; then
      echo "  wp-config.php DB_NAME: present"
    else
      echo "  wp-config.php DB_NAME: missing"
    fi
  else
    echo "  wp-config.php: missing at ${WP_CONFIG_PATH}"
  fi

  echo "  Hint: This may be a Local/Flywheel DB connection issue."
}

expected_count_for_table() {
  case "$1" in
    wp_wcm_bible_books) echo 66 ;;
    wp_wcm_bible_versions) echo 4 ;;
    wp_wcm_bible_verses) echo 31102 ;;
    wp_wcm_original_terms) echo 16891 ;;
    wp_wcm_original_word_occurrences) echo 673263 ;;
    *) echo "" ;;
  esac
}

echo "wcm_core_db_version:"
DB_WARNINGS=0
if ! DB_VERSION="$(wp_eval option get wcm_core_db_version)"; then
  echo "  WARN: Unable to read wcm_core_db_version."
  DB_WARNINGS=1
else
  echo "  ${DB_VERSION}"
fi

echo "Table counts:"
for TABLE in \
  wp_wcm_bible_books \
  wp_wcm_bible_versions \
  wp_wcm_bible_verses \
  wp_wcm_original_terms \
  wp_wcm_original_word_occurrences
do
  EXPECTED="$(expected_count_for_table "${TABLE}")"
  if COUNT="$(wp_eval db query "SELECT COUNT(*) FROM ${TABLE};" --skip-column-names)"; then
    STATUS="OK"
    if [[ "${COUNT}" != "${EXPECTED}" ]]; then
      STATUS="MISMATCH"
      DB_WARNINGS=1
    fi
    echo "  ${TABLE}: ${COUNT} (expected ${EXPECTED}) [${STATUS}]"
  else
    echo "  ${TABLE}: WARN unable to query count (expected ${EXPECTED})"
    DB_WARNINGS=1
  fi
done

if [[ "${DB_WARNINGS}" -ne 0 ]]; then
  print_wp_cli_diagnostics
  echo "DB status needs manual verification"
fi

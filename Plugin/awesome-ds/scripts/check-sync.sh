#!/usr/bin/env bash
# CI guard: fail when Plugin/awesome-ds/ds/ differs from AwesomeDS/.
# Fix with: bash Plugin/awesome-ds/scripts/sync-ds.sh
set -uo pipefail

PLUGIN_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$PLUGIN_ROOT/../../AwesomeDS"
DST="$PLUGIN_ROOT/ds"

if [ ! -d "$SRC" ]; then
  echo "check-sync: source not found: $SRC" >&2
  exit 2
fi
if [ ! -d "$DST" ]; then
  echo "check-sync: ds/ copy missing. Run scripts/sync-ds.sh" >&2
  exit 1
fi

if diff -r --exclude '.DS_Store' "$SRC" "$DST" >/dev/null; then
  echo "check-sync: OK, Plugin/awesome-ds/ds/ matches AwesomeDS/"
  exit 0
else
  echo "check-sync: OUT OF SYNC. Differences:" >&2
  diff -rq --exclude '.DS_Store' "$SRC" "$DST" >&2 || true
  echo "Run: bash Plugin/awesome-ds/scripts/sync-ds.sh" >&2
  exit 1
fi

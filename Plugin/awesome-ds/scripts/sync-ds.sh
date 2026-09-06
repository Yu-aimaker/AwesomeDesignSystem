#!/usr/bin/env bash
# Copy the canonical design system (repo AwesomeDS/) into this plugin's ds/ folder.
# The copy exists so the plugin is self-contained when installed from the marketplace.
# Run from anywhere: the script resolves paths relative to itself.
set -euo pipefail

PLUGIN_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$PLUGIN_ROOT/../../AwesomeDS/"
DST="$PLUGIN_ROOT/ds/"

if [ ! -d "$SRC" ]; then
  echo "sync-ds: source not found: $SRC" >&2
  exit 2
fi

mkdir -p "$DST"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete --exclude '.DS_Store' "$SRC" "$DST"
else
  # Fallback when rsync is missing (minimal containers, Windows Git Bash).
  rm -rf "$DST"
  mkdir -p "$DST"
  cp -R "$SRC". "$DST"
fi

echo "sync-ds: $(find "$DST" -type f | wc -l | tr -d ' ') files synced from AwesomeDS/ to Plugin/awesome-ds/ds/"

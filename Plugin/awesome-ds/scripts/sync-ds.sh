#!/usr/bin/env bash
# Copy the canonical design system (repo AwesomeDS/) into this plugin's ds/ folder,
# and the Knowledge entries (repo Knowledge/) into knowledge/.
# The copies exist so the plugin is self-contained when installed from the marketplace.
# knowledge/README.md is not copied: scripts/build-reference.mjs writes a plugin-local index.
# Run from anywhere: the script resolves paths relative to itself.
set -euo pipefail

PLUGIN_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$PLUGIN_ROOT/../.."

# copy_tree <src-dir> <dst-dir> [file-name-to-keep-in-dst]
copy_tree() {
  local src="$1/" dst="$2/" keep="${3:-}"
  if [ ! -d "$src" ]; then
    echo "sync-ds: source not found: $src" >&2
    exit 2
  fi
  mkdir -p "$dst"
  if command -v rsync >/dev/null 2>&1; then
    if [ -n "$keep" ]; then
      rsync -a --delete --exclude '.DS_Store' --exclude "/$keep" "$src" "$dst"
    else
      rsync -a --delete --exclude '.DS_Store' "$src" "$dst"
    fi
  else
    # Fallback when rsync is missing (minimal containers, Windows Git Bash).
    find "$dst" -mindepth 1 -maxdepth 1 ! -name "${keep:-.never}" -exec rm -rf {} +
    (cd "$src" && find . -type f ! -name '.DS_Store' ! -path "./${keep:-.never}" -print0 |
      while IFS= read -r -d '' f; do mkdir -p "$dst/$(dirname "$f")"; cp "$f" "$dst/$f"; done)
  fi
}

copy_tree "$REPO_ROOT/AwesomeDS" "$PLUGIN_ROOT/ds"
copy_tree "$REPO_ROOT/Knowledge" "$PLUGIN_ROOT/knowledge" README.md

echo "sync-ds: $(find "$PLUGIN_ROOT/ds" -type f | wc -l | tr -d ' ') files in ds/, $(find "$PLUGIN_ROOT/knowledge" -type f ! -name README.md | wc -l | tr -d ' ') entries in knowledge/"

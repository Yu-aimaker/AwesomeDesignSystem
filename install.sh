#!/usr/bin/env bash
#
# AwesomeDesignSystem — skill installer
#
# Installs the five AwesomeDesignSystem skills into your Claude Code skills
# directory via symlinks (so repo updates propagate automatically), and safely
# backs up any pre-existing `awesome-design-skills` skill before redirecting it.
#
# Usage:
#   ./install.sh            # install / update all skills
#   ./install.sh --copy     # copy instead of symlink (for sandboxed setups)
#   ./install.sh --uninstall
#
set -euo pipefail

# --- Resolve paths --------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"
SKILLS_SRC="$REPO_ROOT/skills"

# Target skills dir: override with CLAUDE_SKILLS_DIR if you use a custom path.
SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

# The five skills shipped by this repo (directory name = skill name).
SKILLS=(awesome-ds make-awesome-ds awesome-html awesome-review awesome-motion)

MODE="symlink"
ACTION="install"
for arg in "$@"; do
  case "$arg" in
    --copy) MODE="copy" ;;
    --uninstall) ACTION="uninstall" ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

c_green=$'\033[32m'; c_yellow=$'\033[33m'; c_dim=$'\033[2m'; c_reset=$'\033[0m'
info()  { printf '%s\n' "$*"; }
ok()    { printf '%s✓%s %s\n' "$c_green" "$c_reset" "$*"; }
warn()  { printf '%s!%s %s\n' "$c_yellow" "$c_reset" "$*"; }

mkdir -p "$SKILLS_DIR"

backup_path() {
  # Prints a non-colliding backup path for an existing entry.
  local base="$1" ts
  ts="$(date +%Y%m%d-%H%M%S)"
  printf '%s.backup.%s' "$base" "$ts"
}

uninstall() {
  for s in "${SKILLS[@]}"; do
    local target="$SKILLS_DIR/$s"
    if [ -L "$target" ] || [ -e "$target" ]; then
      rm -rf "$target"
      ok "removed $target"
    fi
  done
  warn "Note: backups of awesome-design-skills (if any) were left in place."
  exit 0
}

[ "$ACTION" = "uninstall" ] && uninstall

# --- Back up legacy awesome-design-skills --------------------------------
# The new /AwesomeDS supersedes the old `awesome-design-skills`. We never
# destroy it: move it aside so it can be restored if desired.
LEGACY="$SKILLS_DIR/awesome-design-skills"
if [ -e "$LEGACY" ] || [ -L "$LEGACY" ]; then
  BK="$(backup_path "$LEGACY")"
  # Preserve symlink-ness: mv handles both real dirs and symlinks.
  mv "$LEGACY" "$BK"
  ok "backed up legacy awesome-design-skills -> $c_dim$BK$c_reset"
  # Leave a redirect so old references still resolve to the new hub skill.
  ln -s "$SKILLS_SRC/awesome-ds" "$LEGACY"
  ok "redirected awesome-design-skills -> skills/awesome-ds"
fi

# --- Install the five skills ---------------------------------------------
for s in "${SKILLS[@]}"; do
  src="$SKILLS_SRC/$s"
  dst="$SKILLS_DIR/$s"
  if [ ! -d "$src" ]; then
    warn "source skill missing, skipping: $src"
    continue
  fi
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    BK="$(backup_path "$dst")"
    mv "$dst" "$BK"
    warn "existing $s backed up -> $c_dim$BK$c_reset"
  fi
  if [ "$MODE" = "copy" ]; then
    cp -R "$src" "$dst"
    ok "copied  $s"
  else
    ln -s "$src" "$dst"
    ok "linked  $s -> $c_dim$src$c_reset"
  fi
done

info ""
ok "AwesomeDesignSystem skills installed into: $SKILLS_DIR"
info "Restart Claude Code (or your agent) to pick up the new skills."
info "Try: ${c_green}/AwesomeDS${c_reset}, ${c_green}/MakeAwesomeDS${c_reset}, ${c_green}/AwesomeHTML${c_reset}, ${c_green}/AwesomeReview${c_reset}, ${c_green}/AwesomeMotion${c_reset}"

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

# Backups live OUTSIDE the skills dir, so the loader never mistakes a backup for a skill.
BACKUP_DIR="$(dirname "$SKILLS_DIR")/skills-backups"
BUNDLE_ROOT="$(dirname "$SKILLS_DIR")"
BUNDLE_MARKER="$SKILLS_DIR/.awesome-ds-copy-bundle"
mkdir -p "$SKILLS_DIR" "$BACKUP_DIR"

# stash <path> : move an existing entry out to BACKUP_DIR (timestamped). Symlinks are
# recreated with an ABSOLUTE target so they don't break when moved to another directory.
# Prints the backup path it created.
stash() {
  local src="$1" ts name bk
  ts="$(date +%Y%m%d-%H%M%S)"
  name="$(basename "$src")"
  bk="$BACKUP_DIR/$name.backup.$ts"
  if [ -L "$src" ]; then
    local tgt abstgt
    tgt="$(readlink "$src")"
    case "$tgt" in
      /*) abstgt="$tgt" ;;
      *)  abstgt="$(cd "$(dirname "$src")" && cd "$(dirname "$tgt")" 2>/dev/null && pwd)/$(basename "$tgt")" ;;
    esac
    ln -s "$abstgt" "$bk"
    rm "$src"
  else
    mv "$src" "$bk"
  fi
  printf '%s' "$bk"
}

# Copy-mode skills cannot follow symlinks back into this repository. Their
# documented ../../ paths resolve from <bundle-root>/skills/<skill>, so install
# the shared knowledge at that public layout as a self-contained bundle.
install_copy_bundle() {
  local design_contract="$BUNDLE_ROOT/DESIGN.md"
  local design_system="$BUNDLE_ROOT/design-system"
  local shared_dir="$SKILLS_DIR/shared"
  local shared_file

  for target in "$design_contract" "$design_system"; do
    if [ -e "$target" ] || [ -L "$target" ]; then
      BK="$(stash "$target")"
      warn "existing $(basename "$target") backed up -> $c_dim$BK$c_reset"
    fi
  done

  mkdir -p "$shared_dir"
  for shared_file in rule-contract.md reference-atlas.md; do
    target="$shared_dir/$shared_file"
    if [ -e "$target" ] || [ -L "$target" ]; then
      BK="$(stash "$target")"
      warn "existing shared/$shared_file backed up -> $c_dim$BK$c_reset"
    fi
    cp "$SKILLS_SRC/shared/$shared_file" "$target"
  done

  cp "$REPO_ROOT/DESIGN.md" "$design_contract"
  cp -R "$REPO_ROOT/design-system" "$design_system"
  printf '%s\n' "AwesomeDesignSystem copy bundle" > "$BUNDLE_MARKER"
  ok "copied  shared DESIGN.md, design-system, and skill contracts"
}

remove_copy_bundle() {
  [ -f "$BUNDLE_MARKER" ] || return 0
  rm -f "$BUNDLE_ROOT/DESIGN.md"
  rm -rf "$BUNDLE_ROOT/design-system"
  rm -f "$SKILLS_DIR/shared/rule-contract.md" "$SKILLS_DIR/shared/reference-atlas.md"
  rmdir "$SKILLS_DIR/shared" 2>/dev/null || true
  rm -f "$BUNDLE_MARKER"
}

uninstall() {
  for s in "${SKILLS[@]}"; do
    local target="$SKILLS_DIR/$s"
    if [ -L "$target" ] || [ -e "$target" ]; then
      rm -rf "$target"
      ok "removed $target"
    fi
  done
  remove_copy_bundle
  warn "Note: backups of awesome-design-skills (if any) were left in place."
  exit 0
}

[ "$ACTION" = "uninstall" ] && uninstall

# Switching an existing copy install to symlink mode should not leave stale
# knowledge that shadows the repository reached through the skill symlinks.
[ "$MODE" = "symlink" ] && remove_copy_bundle

# --- Back up legacy awesome-design-skills --------------------------------
# The new /AwesomeDS supersedes the old `awesome-design-skills`. We never
# destroy it: move it aside so it can be restored if desired.
LEGACY="$SKILLS_DIR/awesome-design-skills"
if [ -e "$LEGACY" ] || [ -L "$LEGACY" ]; then
  BK="$(stash "$LEGACY")"
  ok "backed up legacy awesome-design-skills -> $c_dim$BK$c_reset"
  # Leave a redirect so old references still resolve to the new hub skill.
  ln -s "$SKILLS_SRC/awesome-ds" "$LEGACY"
  ok "redirected awesome-design-skills -> skills/awesome-ds"
fi

# --- Install the five skills ---------------------------------------------
[ "$MODE" = "copy" ] && install_copy_bundle

for s in "${SKILLS[@]}"; do
  src="$SKILLS_SRC/$s"
  dst="$SKILLS_DIR/$s"
  if [ ! -d "$src" ]; then
    warn "source skill missing, skipping: $src"
    continue
  fi
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    BK="$(stash "$dst")"
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

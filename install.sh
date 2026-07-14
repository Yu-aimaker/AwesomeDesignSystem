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
MANIFEST="$SKILLS_DIR/.awesome-ds-install-manifest"
mkdir -p "$SKILLS_DIR" "$BACKUP_DIR"

# Ownership is content-addressed. The installer removes a path only when its
# current type and contents still match the entry it wrote. A replaced symlink,
# edited copy, or user-created path is therefore never mistaken for our own.
entry_type() {
  if [ -L "$1" ]; then printf '%s' "symlink"
  elif [ -f "$1" ]; then printf '%s' "file"
  elif [ -d "$1" ]; then printf '%s' "dir"
  else printf '%s' "missing"
  fi
}

fingerprint() {
  local target="$1" type
  type="$(entry_type "$target")"
  case "$type" in
    symlink) printf 'symlink\t%s\n' "$(readlink "$target")" | shasum -a 256 | awk '{print $1}' ;;
    file) shasum -a 256 "$target" | awk '{print $1}' ;;
    dir)
      (
        cd "$target"
        # Hash regular files in one shasum process instead of spawning one per
        # file. Directory and symlink entries remain explicit so empty folders
        # and link-target changes are part of ownership.
        find . -mindepth 1 -type d -print | LC_ALL=C sort | sed 's/^/dir\t/'
        find . -mindepth 1 -type l -print | LC_ALL=C sort | while IFS= read -r entry; do
          printf 'symlink\t%s\t%s\n' "$entry" "$(readlink "$entry")"
        done
        find . -mindepth 1 -type f -exec shasum -a 256 {} + | LC_ALL=C sort -k 2
      ) | shasum -a 256 | awk '{print $1}'
      ;;
    *) printf '%s' "missing" ;;
  esac
}

manifest_record() {
  local target="$1"
  [ -f "$MANIFEST" ] || return 1
  awk -F '\t' -v target="$target" '$1 == target { print $2 "\t" $3; found=1; exit } END { if (!found) exit 1 }' "$MANIFEST"
}

is_owned_unchanged() {
  local target="$1" record expected_type expected_hash
  record="$(manifest_record "$target")" || return 1
  expected_type="${record%%$'\t'*}"
  expected_hash="${record#*$'\t'}"
  [ "$(entry_type "$target")" = "$expected_type" ] || return 1
  [ "$(fingerprint "$target")" = "$expected_hash" ]
}

remove_path() {
  if [ -L "$1" ] || [ -f "$1" ]; then rm -f "$1"; else rm -rf "$1"; fi
}

remove_if_owned() {
  local target="$1"
  if is_owned_unchanged "$target"; then
    remove_path "$target"
    ok "removed $target"
    return 0
  fi
  if [ -e "$target" ] || [ -L "$target" ]; then
    if manifest_record "$target" >/dev/null 2>&1; then
      warn "preserved $target: installer-owned path changed"
    else
      warn "preserved $target: not owned by this installer"
    fi
  fi
  return 1
}

record_owned() {
  local target="$1"
  printf '%s\t%s\t%s\n' "$target" "$(entry_type "$target")" "$(fingerprint "$target")" >> "$NEXT_MANIFEST"
}

# stash <path> : move an existing entry out to BACKUP_DIR (timestamped). Symlinks are
# recreated with an ABSOLUTE target so they don't break when moved to another directory.
# Prints the backup path it created.
stash() {
  local src="$1" ts name bk suffix
  ts="$(date +%Y%m%d-%H%M%S)"
  name="$(basename "$src")"
  bk="$BACKUP_DIR/$name.backup.$ts"
  suffix=1
  while [ -e "$bk" ] || [ -L "$bk" ]; do
    bk="$BACKUP_DIR/$name.backup.$ts.$suffix"
    suffix=$((suffix + 1))
  done
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

prepare_target() {
  local target="$1"
  if [ -e "$target" ] || [ -L "$target" ]; then
    if is_owned_unchanged "$target"; then
      remove_path "$target"
    else
      BK="$(stash "$target")"
      warn "existing $(basename "$target") preserved in backup -> $c_dim$BK$c_reset"
    fi
  fi
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
    prepare_target "$target"
  done

  mkdir -p "$shared_dir"
  for shared_file in rule-contract.md reference-atlas.md; do
    target="$shared_dir/$shared_file"
    prepare_target "$target"
    cp "$SKILLS_SRC/shared/$shared_file" "$target"
    record_owned "$target"
  done

  cp "$REPO_ROOT/DESIGN.md" "$design_contract"
  cp -R "$REPO_ROOT/design-system" "$design_system"
  prepare_target "$BUNDLE_MARKER"
  printf '%s\n' "AwesomeDesignSystem copy bundle" > "$BUNDLE_MARKER"
  record_owned "$design_contract"
  record_owned "$design_system"
  record_owned "$BUNDLE_MARKER"
  ok "copied  shared DESIGN.md, design-system, and skill contracts"
}

remove_copy_bundle() {
  local target
  for target in \
    "$BUNDLE_ROOT/DESIGN.md" \
    "$BUNDLE_ROOT/design-system" \
    "$SKILLS_DIR/shared/rule-contract.md" \
    "$SKILLS_DIR/shared/reference-atlas.md" \
    "$BUNDLE_MARKER"; do
    if manifest_record "$target" >/dev/null 2>&1; then
      remove_if_owned "$target" || true
    fi
  done
  rmdir "$SKILLS_DIR/shared" 2>/dev/null || true
}

uninstall() {
  for s in "${SKILLS[@]}"; do
    local target="$SKILLS_DIR/$s"
    remove_if_owned "$target" || true
  done
  remove_if_owned "$SKILLS_DIR/awesome-design-skills" || true
  remove_copy_bundle
  rm -f "$MANIFEST"
  warn "Note: backups of awesome-design-skills (if any) were left in place."
  exit 0
}

[ "$ACTION" = "uninstall" ] && uninstall

NEXT_MANIFEST="$(mktemp "$SKILLS_DIR/.awesome-ds-install-manifest.next.XXXXXX")"
trap 'rm -f "$NEXT_MANIFEST"' EXIT

# Switching an existing copy install to symlink mode should not leave stale
# knowledge that shadows the repository reached through the skill symlinks.
[ "$MODE" = "symlink" ] && remove_copy_bundle

# --- Back up legacy awesome-design-skills --------------------------------
# The new /AwesomeDS supersedes the old `awesome-design-skills`. We never
# destroy it: move it aside so it can be restored if desired.
LEGACY="$SKILLS_DIR/awesome-design-skills"
if [ -e "$LEGACY" ] || [ -L "$LEGACY" ]; then
  if is_owned_unchanged "$LEGACY"; then
    remove_path "$LEGACY"
  else
    BK="$(stash "$LEGACY")"
    ok "backed up legacy awesome-design-skills -> $c_dim$BK$c_reset"
  fi
  # Leave a redirect so old references still resolve to the new hub skill.
  if [ "$MODE" = "copy" ]; then
    cp -R "$SKILLS_SRC/awesome-ds" "$LEGACY"
    ok "copied legacy awesome-design-skills redirect"
  else
    ln -s "$SKILLS_SRC/awesome-ds" "$LEGACY"
    ok "redirected awesome-design-skills -> skills/awesome-ds"
  fi
  record_owned "$LEGACY"
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
    prepare_target "$dst"
  fi
  if [ "$MODE" = "copy" ]; then
    cp -R "$src" "$dst"
    ok "copied  $s"
  else
    ln -s "$src" "$dst"
    ok "linked  $s -> $c_dim$src$c_reset"
  fi
  record_owned "$dst"
done

mv "$NEXT_MANIFEST" "$MANIFEST"
trap - EXIT

info ""
ok "AwesomeDesignSystem skills installed into: $SKILLS_DIR"
info "Restart Claude Code (or your agent) to pick up the new skills."
info "Try: ${c_green}/AwesomeDS${c_reset}, ${c_green}/MakeAwesomeDS${c_reset}, ${c_green}/AwesomeHTML${c_reset}, ${c_green}/AwesomeReview${c_reset}, ${c_green}/AwesomeMotion${c_reset}"

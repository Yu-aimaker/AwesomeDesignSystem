#!/usr/bin/env bash
# Renders banner-light.png and banner-dark.png (2560x800, 2x) from banner.html with headless Chrome.
# Needs network for Google Fonts (Geist, Geist Mono, Noto Sans JP).
set -euo pipefail
dir="$(cd "$(dirname "$0")" && pwd)"
chrome="${CHROME:-google-chrome}"
for theme in light dark; do
  tmp="$(mktemp --suffix=.html)"
  sed "s|<html lang=\"ja\">|<html lang=\"ja\" data-theme=\"$theme\">|" "$dir/banner.html" > "$tmp"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --default-background-color=00000000 --virtual-time-budget=8000 \
    --window-size=1280,400 --screenshot="$dir/banner-$theme.png" "file://$tmp" >/dev/null 2>&1
  rm -f "$tmp"
done
echo "wrote $dir/banner-light.png $dir/banner-dark.png"

#!/usr/bin/env bash
# Builds the single-file demo from the parts in src/.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
out=dist/keysville-demo.html
src=src
# HOSTED=1 adds the small adapter that connects the assistant to the hosting
# page's language service. The plain build has no such hook.
hosthead=""
if [ "${HOSTED:-0}" = "1" ]; then
  hosthead=$(cat $src/00-host-head.html)
fi

css=$(cat $src/10-base.css $src/20-public-a.css $src/23-shop.css $src/21-public-b.css $src/26-visit.css $src/24-living.css $src/29-bizdesk.css $src/27-security.css $src/25-docs.css $src/28-forms.css $src/22-desk.css $src/31-guard.css $src/33-extras.css $src/32-polish.css $src/30-helpme.css 2>/dev/null)
js=$(cat $src/40-core.js $src/41e-biz-real.js $src/41-data.js $src/41b-docs-real.js $src/41d-doc-index.js $src/41c-history.js $src/42-chrome.js $src/50-public-a.js $src/51-public-b.js $src/52-desk.js $src/53-strings-a.js $src/54-strings-b.js $src/55-legal.js $src/58l-guard.js $src/58m-strings-guard.js $src/58j-helpme.js $src/58k-strings-helpme.js $src/58b-visit.js $src/58c-strings-visit.js $src/56-living.js $src/57-strings-living.js $src/58o-strings-extras.js $src/58n-extras.js $src/58h-bizdesk.js $src/58i-strings-bizdesk.js $src/58d-security.js $src/58e-strings-security.js $src/58-docs.js $src/59-strings-docs.js $src/58f-forms.js $src/58g-strings-forms.js $src/60-boot.js 2>/dev/null)
spriteA=$(cat $src/sprite-a.svg 2>/dev/null || true)
spriteB=$(cat $src/sprite-b.svg 2>/dev/null || true)
spriteL=$(cat $src/sprite-living.svg 2>/dev/null || true)
spriteV=$(cat $src/sprite-visit.svg 2>/dev/null || true)

{
  awk -v h="$hosthead" '{ if ($0 ~ /<!--HOST-HEAD-->/) print h; else print }' $src/00-head.html
  printf '%s\n' "$css"
  awk -v a="$spriteA" -v b="$spriteB" -v l="$spriteL" -v v="$spriteV" '{
    if ($0 ~ /<!--SPRITE-A-->/) print a;
    else if ($0 ~ /<!--SPRITE-B-->/) print b;
    else if ($0 ~ /<!--SPRITE-L-->/) print l;
    else if ($0 ~ /<!--SPRITE-V-->/) print v;
    else print
  }' $src/30-body.html
  printf '(function () {\n'"'"'use strict'"'"';\n'
  printf '%s\n' "$js"
  printf '})();\n</script>\n'
} > "$out"

echo "built $out ($(wc -c < "$out") bytes)"

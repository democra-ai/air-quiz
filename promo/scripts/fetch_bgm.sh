#!/usr/bin/env bash
# Fetch a bright, royalty-free background track into public/audio/bgm.mp3.
#
# Default: "Carefree" by Kevin MacLeod (https://incompetech.com) — licensed
# CC-BY 4.0. If you PUBLISH the video you must credit the author, e.g.:
#   "Carefree" Kevin MacLeod (incompetech.com) — Licensed under CC BY 4.0
# …or just point BGM_URL at your own track / a no-attribution Pixabay track.
#
# Usage:  bash scripts/fetch_bgm.sh
#         BGM_URL="https://.../my-track.mp3" BGM_LEN=100 bash scripts/fetch_bgm.sh
set -e
cd "$(dirname "$0")/.."
URL="${BGM_URL:-https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3}"
LEN="${BGM_LEN:-98}"
tmp="$(mktemp).mp3"
curl -sL -A "Mozilla/5.0" --max-time 40 -o "$tmp" "$URL"
ffmpeg -y -ss 0 -t "$LEN" -i "$tmp" -c:a libmp3lame -b:a 192k public/audio/bgm.mp3
rm -f "$tmp"
echo "BGM → public/audio/bgm.mp3 (${LEN}s) from $URL"

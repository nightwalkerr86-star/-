#!/bin/sh
# Builds a clean copy of the site (no prompts / old images) and deploys it to Cloudflare Pages.
set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir -p dist/assets
cp index.html dist/
for f in room-pano.jpg room.jpg room-dark.mp4 kru-candles.mp4 kru-candles-poster.jpg incense-wait.mp4 incense-light.mp4 incense-plant.mp4 write.mp4 fate.mp4 player.png btn-frame.svg card-frame.svg zodiac-frame.svg zodiac-frame.png divider.png bullet.png avoid-x.png reasey-logo.svg og-preview.jpg; do
  if [ -f "assets/$f" ]; then cp "assets/$f" dist/assets/; fi
done
mkdir -p dist/assets/fonts && cp assets/fonts/*.ttf dist/assets/fonts/ 2>/dev/null || true
mkdir -p dist/assets/frame && cp assets/frame/*.svg dist/assets/frame/
mkdir -p dist/assets/zodiac && cp assets/zodiac/*.png dist/assets/zodiac/
mkdir -p dist/assets/comic && cp assets/comic/page*.jpg dist/assets/comic/ && mkdir -p dist/assets/comic/zh && cp assets/comic/zh/page*.jpg dist/assets/comic/zh/
npx --yes wrangler pages deploy dist --project-name pagoda-fortune --branch main --commit-dirty=true

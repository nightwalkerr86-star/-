# Art prompts — The Pagoda Fortune Teller

Save finished images into `assets/` with the exact filenames below. The page picks them up automatically.

**Size for all:** vertical 9:16, 1080×1920 (Midjourney: `--ar 9:16`).
**Shared style line** (already inside every prompt — keep it identical so all images match):
> semi-realistic Korean manhwa painted illustration, cinematic low-key lighting, deep crimson and black palette with warm candle gold, detailed digital painting, moody mysterious atmosphere

**Shared negative prompt:**
```
bright daylight, overexposed, flat lighting, cartoon, chibi, 3D render, photo, text, watermark, logo, extra fingers, deformed hands, blurry face
```

---

## 1. `assets/hall.jpg` — the pagoda hall (opening scenes)

Used for: rain stops, the open gate, walking in, the murals, calling out.

```
Interior of an old Cambodian Buddhist pagoda hall at night, vertical 9:16, viewed from the entrance looking down the long aisle. Tall dark red pillars with faded gold Khmer kbach patterns, walls covered with old Jataka mural paintings barely visible in shadow, worn patterned tile floor reflecting faint candlelight. Far at the end, a small warm glow from the altar. Rain-wet open wooden doors in the foreground, a pair of sandals left at the step. Thin incense haze in the air. Mostly dark, quiet, empty, no people. Semi-realistic Korean manhwa painted illustration, cinematic low-key lighting, deep crimson and black palette with warm candle gold, detailed digital painting, moody mysterious atmosphere.
```

**Important:** keep the middle of the image fairly empty and dark, because the story text appears there.

---

## 2. `assets/altar.jpg` — the altar (Achar scenes)

Used for: the bell, the incense, and everything the Achar says (he stands in front of it).

```
Close view of a Cambodian pagoda altar at night, vertical 9:16. A large golden seated Buddha with half-closed eyes in the upper middle of the frame, softly glowing, surrounded by smaller Buddha statues, lotus flowers, brass offering bowls and a small bronze bell. Rows of lit candles and incense sticks with smoke rising straight up. Deep shadows on both sides, red and gold cloth draping the altar. Lower half of the image darker and simpler, leaving space for a character standing in front. No people. Semi-realistic Korean manhwa painted illustration, cinematic low-key lighting, deep crimson and black palette with warm candle gold, detailed digital painting, moody mysterious atmosphere.
```

---

## 3. `assets/achar.png` — the Achar (character, transparent background)

```
Semi-realistic Korean manhwa character illustration, vertical 9:16, full upper body from head to hips, centered. A handsome mysterious young Cambodian man about 28 years old, the achar (lay temple master and fortune reader) of an old pagoda. Calm, knowing half-smile, sharp dark eyes looking directly at the viewer. Black hair tied loosely back, a few strands falling on his face. Wearing a white traditional Khmer achar shirt under a dark crimson silk robe with gold Khmer embroidery, a red-and-white checkered krama scarf over one shoulder, sacred cotton string bracelets on his wrist, holding wooden prayer beads in one hand. Warm candlelight from below and the side, soft rim light on his hair. Plain solid black background. Semi-realistic Korean manhwa painted illustration, cinematic low-key lighting, deep crimson and black palette with warm candle gold, detailed digital painting.
```

**Making the background transparent:** generate on solid black, then remove the background with remove.bg, Canva "BG Remover", or Photoshop, and export as **PNG**.

**Keep the same face:** once you like one, reuse it.
- Midjourney: add `--cref <image URL> --cw 100`
- Leonardo: use **Character Reference** with your chosen image
- ChatGPT: upload the image and say "same character, same face"

---

## 3b. `assets/monk.png` — the Monk (CURRENT character, replaces the Achar)

```
Semi-realistic Korean manhwa character illustration, vertical 9:16, upper body from head to waist, centered. A calm young Cambodian Buddhist monk about 28 years old, cleanly shaved head and shaved eyebrows, serene gentle half-smile, wise dark eyes looking directly at the viewer. Wearing a traditional saffron-orange Theravada monk robe draped over the left shoulder with the right shoulder bare, holding a string of wooden prayer beads in one hand, a few white sacred cotton strings on the wrist. Warm candlelight from below and the side, soft rim light along his head and shoulder, peaceful and mysterious presence. Plain solid black background. Semi-realistic Korean manhwa painted illustration, cinematic low-key lighting, saffron orange and deep crimson palette with warm candle gold, detailed digital painting, respectful and dignified.
```

Extra negative words for the monk: `hair, jewelry, necklace, earrings, tattoos, muscular, shirtless, sexualized`

Remove the black background (remove.bg / Canva) and save as **PNG** at `assets/monk.png`.

---

## Optional extra poses (for later)

Reuse the Achar prompt and only change the action line:

| Pose | Replace the "Calm, knowing half-smile…" part with |
|---|---|
| Laughing quietly | `soft amused laugh, eyes closed, hand near his mouth` |
| Lighting incense | `turned slightly sideways, lighting an incense stick with a candle, looking down` |
| Serious reading | `serious focused expression, holding an old palm-leaf manuscript open` |

## Optional motion (video loops)

Put any finished image into **Kling, Runway or Hailuo**, image-to-video, 5 seconds:
```
very slow camera push in, candle flames flicker, incense smoke drifts upward, subtle hair movement, no other motion
```
Export as MP4. The page currently uses still images, but these clips can be swapped in later.

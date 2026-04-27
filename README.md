# REVIVECHIZL™ Website

Dark cinematic artist website based on the supplied REVIVECHIZL mockups.

## Run locally

```bash
npm install
cp .env.example .env
# add your YouTube API key in .env or export it in your shell
npm start
```

Open `http://localhost:3000`.

For local `.env` loading, use your host platform's environment variable system, or run:

```bash
YOUTUBE_API_KEY=your_key_here npm start
```

## YouTube API key safety

Do **not** place the YouTube API key in frontend JavaScript, `config.txt`, or any public file. This project uses `server.js` as a backend route at `/api/latest-video`. Set these variables on your host:

```bash
YOUTUBE_CHANNEL_ID=UC-mzz7IOUA_eNFTFVQIwJTw
YOUTUBE_API_KEY=your_private_key
```

If the API key is missing or YouTube fails, the video area displays a visible API error. There is no fallback video card in this build.


## Test the YouTube API locally

Run the backend server, not a static preview:

```bash
npm start
```

Then open:

```txt
http://localhost:3000/api/latest-video
```

If the API is working, you should see JSON containing `videoId`, `title`, `publishedAt`, and `channelId`. If you see "path not found" or "Cannot GET", the site is being opened with a static server instead of `server.js`. On Windows, use `run.bat`; it starts `node server.js`, not a static file server.

## Update `config.txt`

Edit simple one-line values:

```txt
ticketsUrl=https://placeholder.com
instagramUrl=https://instagram.com/REVIVECHIZL
bio=REVIVECHIZL™ is an artist creating...
```

Keep one `key=value` per line. Lines beginning with `#` are ignored.

## Add a release in `releases.txt`

Copy a block and increase the release number:

```txt
[release_006]
arc=THE REBIRTH ARC
date=2026-09-09
title=NEW TITLE
type=SINGLE
cover=/assets/releases/006-new-title.png
description=Short release description.
spotify=https://...
apple=https://...
soundcloud=https://...
youtube=https://...
```

Releases automatically sort newest first by date, then by release number. They are grouped by `arc`.

## Add cover PNGs

Put release covers in:

```txt
/assets/releases/
```

Use the naming style:

```txt
005-rebirth.png
004-rebirth-ep.png
003-crimson.png
```

If the cover is missing, the website displays a dark red placeholder.

## Edit bio and links

Use `config.txt` for the hero bio and main platform links. Use each release block in `releases.txt` for per-release links.

## Files

- `index.html` — page structure
- `styles.css` — cinematic red/black styling, responsive layout, hover states
- `script.js` — intro transition, config/release parsing, timeline rendering, embers, YouTube loading
- `server.js` — backend route for latest YouTube video
- `config.txt` — editable global site settings
- `releases.txt` — editable discography data
- `assets/releases/` — release artwork

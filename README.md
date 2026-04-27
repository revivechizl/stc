# REVIVECHIZL™ Website

Static red/black artist website. The intro keeps the large R entry screen, then fades into the main page.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Update the latest YouTube video

Edit `config.txt`:

```txt
latestVideoTitle=LATEST RELEASE: DEATHWISH
latestVideoUrl=https://www.youtube.com/watch?v=VIDEO_ID_HERE
```

The frontend reads this file directly, converts supported YouTube links into an embed URL, and falls back to the REVIVECHIZL YouTube channel if the URL is missing or invalid.

Supported video URL formats include:

```txt
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
https://www.youtube.com/shorts/VIDEO_ID
https://www.youtube.com/live/VIDEO_ID
```

## Update links

Add or edit these optional values in `config.txt`:

```txt
ticketsUrl=https://...
instagramUrl=https://...
spotifyUrl=https://...
appleUrl=https://...
youtubeUrl=https://...
soundcloudUrl=https://...
```

Keep one `key=value` per line. Lines beginning with `#` are ignored.

## Files

- `index.html` — page structure
- `styles.css` — base styling
- `custom.css` — final overrides and mobile centering fixes
- `script.js` — intro transition and `config.txt` video/link loading
- `server.js` — local static server only
- `config.txt` — editable latest video title and URL

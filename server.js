import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually so local `npm start` works without needing extra packages.
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) continue;
    const i = clean.indexOf('=');
    if (i === -1) continue;
    const key = clean.slice(0, i).trim();
    const value = clean.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UC-mzz7IOUA_eNFTFVQIwJTw';
const API_KEY = process.env.YOUTUBE_API_KEY;

async function youtubeJson(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `YouTube API ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data?.error || data;
    throw error;
  }
  return data;
}

app.get('/api/latest-video', async (_req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (!API_KEY) {
    return res.status(503).json({
      error: 'Missing YOUTUBE_API_KEY. Check the .env file next to server.js.',
      channelId: CHANNEL_ID
    });
  }

  try {
    // Same direct YouTube Data API v3 search pattern as the working prototype:
    // query the channel, order by newest upload, return the first video.
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.search = new URLSearchParams({
      key: API_KEY,
      channelId: CHANNEL_ID,
      part: 'snippet,id',
      order: 'date',
      maxResults: '1',
      type: 'video'
    });

    const data = await youtubeJson(url);
    const item = data.items?.[0];
    const videoId = item?.id?.videoId;

    if (!videoId) {
      return res.status(404).json({
        error: 'YouTube API returned no video for this channel ID.',
        channelId: CHANNEL_ID,
        itemCount: data.items?.length || 0
      });
    }

    res.json({
      videoId,
      title: item?.snippet?.title || 'Latest REVIVECHIZL video',
      publishedAt: item?.snippet?.publishedAt,
      thumbnailUrl: item?.snippet?.thumbnails?.maxres?.url || item?.snippet?.thumbnails?.high?.url || item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url || null,
      channelId: CHANNEL_ID
    });
  } catch (error) {
    console.error('YouTube latest-video error:', error);
    res.status(error.status || 502).json({
      error: error.message || 'Unable to load latest YouTube video',
      channelId: CHANNEL_ID,
      details: error.details || null
    });
  }
});

app.use(express.static(__dirname));
app.listen(PORT, () => {
  console.log(`REVIVECHIZL site running at http://localhost:${PORT}`);
  console.log(`Latest video endpoint: http://localhost:${PORT}/api/latest-video`);
});

export async function onRequestGet(context) {
  const API_KEY = context.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = context.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    return Response.json({ error: "Missing API key or channel ID" }, { status: 500 });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  const item = data.items?.[0];

  if (!item) {
    return Response.json({ error: "No video found" }, { status: 404 });
  }

  return Response.json({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high.url
  });
}
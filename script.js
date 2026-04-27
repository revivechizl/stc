const defaults = {
  ticketsUrl: 'https://events.bookitbee.com/ukundergroundnetwork/ukundergroundnetwork-presents-private-members-club/',
  instagramUrl: 'https://instagram.com/REVIVECHIZL',
  spotifyUrl: 'https://open.spotify.com/artist/4u9eiYZ4gxfGc4VYd2DsfD',
  appleUrl: 'https://music.apple.com/gb/artist/revivechizl/',
  youtubeUrl: 'https://www.youtube.com/@ReviveChizl',
  soundcloudUrl: 'https://soundcloud.com/ReviveChizl',
  latestVideoTitle: 'LATEST RELEASE: DEATHWISH',
  latestVideoUrl: 'https://www.youtube.com/@ReviveChizl'
};

init();

async function init() {
  document.body.classList.add('no-scroll');
  wireIntro();

  const config = { ...defaults, ...(await loadKeyValueFile('config.txt')) };
  applyConfig(config);
  renderConfiguredVideo(config.latestVideoUrl, config.latestVideoTitle, config.youtubeUrl || defaults.youtubeUrl);
}

function wireIntro() {
  const enter = document.getElementById('enterSite');
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  if (!enter || !intro || !site) return;

  enter.addEventListener('click', () => {
    intro.classList.add('exiting');
    setTimeout(() => {
      intro.remove();
      site.classList.remove('is-hidden');
      document.body.classList.remove('no-scroll');
    }, 880);
  });
}

async function loadKeyValueFile(path) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) return {};
    const text = await response.text();
    const out = {};

    text.split(/\r?\n/).forEach(line => {
      const clean = line.trim();
      if (!clean || clean.startsWith('#')) return;
      const i = clean.indexOf('=');
      if (i < 0) return;
      out[clean.slice(0, i).trim()] = clean.slice(i + 1).trim();
    });

    return out;
  } catch {
    return {};
  }
}

function applyConfig(config) {
  const title = config.latestVideoTitle || defaults.latestVideoTitle;
  const videoTitle = document.getElementById('latestVideoTitle');
  if (videoTitle) videoTitle.textContent = title;

  const ticketsButton = document.getElementById('ticketsButton');
  if (ticketsButton) ticketsButton.href = config.ticketsUrl || defaults.ticketsUrl;

  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.dataset.link;
    el.href = config[key] || defaults[key] || '#';
    el.target = '_blank';
    el.rel = 'noopener';
  });
}

function renderConfiguredVideo(videoUrl, title, fallbackUrl) {
  const frame = document.getElementById('latestVideo');
  if (!frame) return;

  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  const safeTitle = title || defaults.latestVideoTitle;

  if (embedUrl) {
    frame.innerHTML = `<iframe src="${escapeAttr(embedUrl)}" title="${escapeAttr(safeTitle)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
    return;
  }

  const linkUrl = videoUrl && isHttpUrl(videoUrl) ? videoUrl : fallbackUrl;
  renderVideoLink(linkUrl || defaults.youtubeUrl, safeTitle);
}

function getYouTubeEmbedUrl(url) {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : '';
}

function extractYouTubeId(input = '') {
  if (!input || !isHttpUrl(input)) return '';

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') return cleanVideoId(url.pathname.slice(1));

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (url.pathname === '/watch') return cleanVideoId(url.searchParams.get('v'));
      if (url.pathname.startsWith('/embed/')) return cleanVideoId(url.pathname.split('/')[2]);
      if (url.pathname.startsWith('/shorts/')) return cleanVideoId(url.pathname.split('/')[2]);
      if (url.pathname.startsWith('/live/')) return cleanVideoId(url.pathname.split('/')[2]);
    }
  } catch {
    return '';
  }

  return '';
}

function cleanVideoId(value = '') {
  const id = String(value).trim().split(/[?&#/]/)[0];
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
}

function isHttpUrl(value = '') {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function renderVideoLink(url, title) {
  const frame = document.getElementById('latestVideo');
  if (!frame) return;

  frame.innerHTML = `<a class="video-fallback" href="${escapeAttr(url)}" target="_blank" rel="noopener">
    <span class="video-title">${escapeHtml(title)}</span>
    <span class="play-button">▶</span>
    <span class="watch-copy">WATCH ON YOUTUBE</span>
  </a>`;
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>\"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
}

function escapeAttr(str = '') {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

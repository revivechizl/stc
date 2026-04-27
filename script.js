const defaults = {
  ticketsUrl: 'https://placeholder.com',
  instagramUrl: 'https://instagram.com/REVIVECHIZL',
  spotifyUrl: 'https://open.spotify.com/artist/4u9eiYZ4gxfGc4VYd2DsfD',
  appleUrl: 'https://music.apple.com/gb/artist/revivechizl/',
  youtubeUrl: 'https://www.youtube.com/@ReviveChizl',
  soundcloudUrl: 'https://soundcloud.com/ReviveChizl',
  bio: 'REVIVECHIZL™ is a Birmingham, United Kingdom artist creating dark, minimal, emotionally direct music, shaped by underground energy, raw visuals, and cinematic release concepts. Founder of the REVIVE THA RAGE event series.'
};

init();

async function init() {
  document.body.classList.add('no-scroll');
  wireIntro();
  wireEntryPrompt();

  const config = { ...defaults, ...(await loadKeyValueFile('config.txt')) };
  applyConfig(config);

  await loadLatestVideo(config.youtubeUrl || defaults.youtubeUrl).catch(error => {
    console.error('Latest video failed to load:', error);
    renderVideoLink(defaults.youtubeUrl, 'REVIVECHIZL™ — LATEST VIDEO');
  });
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

function wireEntryPrompt() {
  const intro = document.getElementById('intro');
  const modal = document.getElementById('soundModal');
  const yes = document.getElementById('soundYes');
  const no = document.getElementById('soundNo');
  const audio = document.getElementById('entryAudio');
  const nowPlaying = document.getElementById('nowPlaying');
  const audioToggle = document.getElementById('audioToggle');

  if (!intro || !modal || !yes || !no) return;

  const revealIntro = () => {
    modal.classList.add('is-hidden');
    intro.classList.remove('prompt-gated');
  };

  yes.addEventListener('click', async () => {
    revealIntro();
    if (!audio) return;

    try {
      audio.volume = 0.64;
      await audio.play();
      nowPlaying?.classList.remove('is-hidden');
      if (audioToggle) audioToggle.textContent = '▮▮';
    } catch (error) {
      console.warn('Audio could not start. Make sure assets/song.mp3 exists.', error);
      nowPlaying?.classList.remove('is-hidden');
      nowPlaying?.classList.add('needs-audio-file');
      if (audioToggle) audioToggle.textContent = '▶';
    }
  });

  no.addEventListener('click', revealIntro);

  audioToggle?.addEventListener('click', async () => {
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        audioToggle.textContent = '▮▮';
        nowPlaying?.classList.remove('needs-audio-file');
      } catch (error) {
        console.warn('Audio could not start. Make sure assets/song.mp3 exists.', error);
      }
    } else {
      audio.pause();
      audioToggle.textContent = '▶';
    }
  });
}

async function loadKeyValueFile(path) {
  try {
    const text = await fetch(path, { cache: 'no-store' }).then(r => r.ok ? r.text() : '');
    const out = {};
    text.split(/\r?\n/).forEach(line => {
      const clean = line.trim();
      if (!clean || clean.startsWith('#')) return;
      const i = clean.indexOf('=');
      if (i < 0) return;
      out[clean.slice(0, i).trim()] = clean.slice(i + 1).trim();
    });
    return out;
  } catch { return {}; }
}

function applyConfig(config) {
  document.getElementById('artistBio').textContent = config.bio || defaults.bio;
  document.getElementById('ticketsButton').href = config.ticketsUrl || defaults.ticketsUrl;
  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.dataset.link;
    el.href = config[key] || defaults[key] || '#';
    el.target = '_blank';
    el.rel = 'noopener';
  });
}

async function loadLatestVideo(channelFallbackUrl) {
  const response = await fetch('/api/latest-video', { cache: 'no-store' });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.videoId) {
    throw new Error(data.error || `Latest video API failed with HTTP ${response.status}`);
  }

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(data.videoId)}`;
  renderVideoLink(watchUrl, data.title || 'REVIVECHIZL™ — LATEST VIDEO', data.thumbnailUrl || ('https://i.ytimg.com/vi/' + encodeURIComponent(data.videoId) + '/hqdefault.jpg'));
}

function renderVideoLink(url, title, thumbnailUrl='') {
  const frame = document.getElementById('latestVideo');
  if (!frame) return;

  const image = thumbnailUrl ? `<img class="video-thumb" src="${escapeAttr(thumbnailUrl)}" alt="${escapeAttr(title)} thumbnail" loading="lazy" referrerpolicy="no-referrer">` : '';

  frame.innerHTML = `<a class="video-fallback has-thumb" href="${escapeAttr(url)}" target="_blank" rel="noopener">
    ${image}
    <span class="video-shade" aria-hidden="true"></span>
    <span class="video-title">${escapeHtml(title)}</span>
    <span class="play-button">▶</span>
    <span class="watch-copy">Watch latest video on YouTube</span>
  </a>`;
}

function escapeHtml(str='') { return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
function escapeAttr(str='') { return escapeHtml(str).replace(/'/g, '&#39;'); }

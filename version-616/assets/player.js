async function loadHlsModule() {
  try {
    const module = await import('./video-player-dru42stk.js');
    return module.H || module.default || window.Hls || null;
  } catch (error) {
    return window.Hls || null;
  }
}

async function attachHls(video, sourceUrl) {
  if (!video || !sourceUrl) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = sourceUrl;
    return;
  }

  const Hls = await loadHlsModule();

  if (Hls && typeof Hls.isSupported === 'function' && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(sourceUrl);
    hls.attachMedia(video);
    video.__hlsInstance = hls;
  } else {
    video.src = sourceUrl;
  }
}

function setupMoviePlayer(shell) {
  const video = shell.querySelector('video');
  const playButton = shell.querySelector('[data-player-start]');
  const source = shell.getAttribute('data-video-src') || (video.querySelector('source') ? video.querySelector('source').src : '');
  let ready = false;

  async function ensureReady() {
    if (ready) {
      return;
    }

    ready = true;
    await attachHls(video, source);
  }

  async function startPlayback() {
    await ensureReady();
    shell.classList.add('is-playing');

    try {
      await video.play();
    } catch (error) {
      shell.classList.remove('is-playing');
    }
  }

  if (playButton) {
    playButton.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    shell.classList.add('is-playing');
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      shell.classList.remove('is-playing');
    }
  });

  video.addEventListener('ended', function () {
    shell.classList.remove('is-playing');
  });

  ensureReady();
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-video-src]').forEach(setupMoviePlayer);
});

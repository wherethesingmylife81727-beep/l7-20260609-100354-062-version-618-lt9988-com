(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var index = 0;
      var timer = null;
      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }
      function start() {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          window.clearInterval(timer);
          show(i);
          start();
        });
      });
      start();
    }

    document.querySelectorAll('[data-filter-panel]').forEach(function (panelNode) {
      var keyword = panelNode.querySelector('.filter-keyword');
      var year = panelNode.querySelector('.filter-year');
      var region = panelNode.querySelector('.filter-region');
      var type = panelNode.querySelector('.filter-type');
      var grid = panelNode.nextElementSibling ? panelNode.nextElementSibling.querySelector('.filter-grid') : null;
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
      function apply() {
        var q = keyword ? keyword.value.trim().toLowerCase() : '';
        var y = year ? year.value : '';
        var r = region ? region.value : '';
        var t = type ? type.value : '';
        cards.forEach(function (card) {
          var haystack = [card.dataset.title, card.dataset.tags, card.querySelector('.card-desc') ? card.querySelector('.card-desc').textContent : ''].join(' ').toLowerCase();
          var matched = true;
          if (q && haystack.indexOf(q) === -1) {
            matched = false;
          }
          if (y && card.dataset.year !== y) {
            matched = false;
          }
          if (r && card.dataset.region !== r) {
            matched = false;
          }
          if (t && card.dataset.type !== t) {
            matched = false;
          }
          card.classList.toggle('is-filter-hidden', !matched);
        });
      }
      [keyword, year, region, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });

    var results = document.getElementById('search-results');
    if (results && window.SEARCH_MOVIES) {
      var params = new URLSearchParams(window.location.search);
      var q = (params.get('q') || '').trim();
      var input = document.getElementById('search-page-input');
      if (input) {
        input.value = q;
      }
      if (q) {
        var lower = q.toLowerCase();
        var matched = window.SEARCH_MOVIES.filter(function (movie) {
          return [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.category, movie.desc, (movie.tags || []).join(' ')].join(' ').toLowerCase().indexOf(lower) !== -1;
        }).slice(0, 96);
        renderSearchResults(matched, q);
      }
    }
  });

  function escapeText(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char];
    });
  }

  function renderSearchResults(items, query) {
    var results = document.getElementById('search-results');
    var title = document.getElementById('search-title');
    var subtitle = document.getElementById('search-subtitle');
    if (title) {
      title.textContent = '搜索结果：' + query;
    }
    if (subtitle) {
      subtitle.textContent = items.length ? '已为你匹配相关影视内容。' : '没有匹配结果，可尝试更换关键词。';
    }
    if (!items.length) {
      results.innerHTML = '<div class="empty-state">没有找到相关影片</div>';
      return;
    }
    results.innerHTML = items.map(function (movie) {
      return '<article class="movie-card">' +
        '<a class="poster-link" href="' + escapeText(movie.href) + '" aria-label="' + escapeText(movie.title) + '">' +
        '<img src="' + escapeText(movie.poster) + '" alt="' + escapeText(movie.title) + '" loading="lazy">' +
        '<span class="quality">HD</span>' +
        '<span class="score">★ ' + escapeText(movie.rating) + '</span>' +
        '</a>' +
        '<div class="card-body">' +
        '<h2><a href="' + escapeText(movie.href) + '">' + escapeText(movie.title) + '</a></h2>' +
        '<p class="card-meta">' + escapeText(movie.year) + ' · ' + escapeText(movie.region) + ' · ' + escapeText(movie.type) + '</p>' +
        '<p class="card-desc">' + escapeText(movie.desc) + '</p>' +
        '</div>' +
        '</article>';
    }).join('');
  }
})();

function initMoviePlayer(streamUrl) {
  var video = document.getElementById('movie-player');
  var start = document.getElementById('player-start');
  if (!video || !start || !streamUrl) {
    return;
  }
  var loaded = false;
  var hls = null;
  function attach() {
    if (loaded) {
      return;
    }
    loaded = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }
  function play() {
    attach();
    start.classList.add('is-hidden');
    video.controls = true;
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }
  start.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (!loaded) {
      play();
    }
  });
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

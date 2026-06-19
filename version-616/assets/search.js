import { MOVIES } from './search-data.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createCard(movie) {
  const text = [movie.title, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine].join(' ');

  return `
    <article class="movie-card" data-search-text="${escapeHtml(text)}">
      <a href="movie/${movie.id}.html" aria-label="观看${escapeHtml(movie.title)}">
        <div class="movie-poster">
          <img src="${movie.image}.jpg" alt="${escapeHtml(movie.title)}" loading="lazy">
          <span class="card-badge">${escapeHtml(movie.primary)}</span>
          <span class="card-time">${escapeHtml(movie.duration)}</span>
          <span class="play-float"><span>▶</span></span>
        </div>
        <div class="movie-body">
          <h3 class="movie-title">${escapeHtml(movie.title)}</h3>
          <p class="movie-desc">${escapeHtml(movie.oneLine)}</p>
          <div class="movie-meta">
            <span>${escapeHtml(movie.region)}</span>
            <span>${escapeHtml(movie.year)}</span>
          </div>
        </div>
      </a>
    </article>`;
}

function searchMovies(query) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return MOVIES.slice(0, 30);
  }

  return MOVIES.filter(function (movie) {
    const haystack = [
      movie.title,
      movie.region,
      movie.type,
      movie.year,
      movie.genre,
      movie.tags,
      movie.oneLine,
      movie.summary,
      movie.review
    ].join(' ').toLowerCase();

    return haystack.indexOf(keyword) !== -1;
  }).slice(0, 120);
}

function renderSearchPage() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const input = document.querySelector('[data-search-page-input]');
  const title = document.querySelector('[data-search-title]');
  const resultNode = document.querySelector('[data-search-results]');

  if (input) {
    input.value = query;
  }

  if (!resultNode) {
    return;
  }

  const results = searchMovies(query);

  if (title) {
    title.textContent = query ? '搜索：' + query : '精选搜索入口';
  }

  if (!results.length) {
    resultNode.innerHTML = '<div class="empty-state">没有找到匹配的影视内容，请换一个关键词再试。</div>';
    return;
  }

  resultNode.innerHTML = results.map(createCard).join('');
}

renderSearchPage();

(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-site-menu]');
    var headerSearch = document.querySelector('.header-search');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
            if (headerSearch) {
                headerSearch.classList.toggle('is-open');
            }
        });
    }

    document.querySelectorAll('[data-site-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var value = input ? input.value.trim() : '';
            if (value) {
                window.location.href = './movies.html?q=' + encodeURIComponent(value);
            }
        });
    });

    var hero = document.querySelector('[data-hero-carousel]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        var setSlide = function (index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                setSlide((current + 1) % slides.length);
            }, 5200);
        }
    }

    var filterGrid = document.querySelector('[data-filter-grid]');
    if (filterGrid) {
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card'));
        var searchInput = document.querySelector('[data-filter-search]');
        var regionSelect = document.querySelector('[data-filter-region]');
        var typeSelect = document.querySelector('[data-filter-type]');
        var yearSelect = document.querySelector('[data-filter-year]');
        var emptyState = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (query && searchInput) {
            searchInput.value = query;
        }

        var normalize = function (value) {
            return String(value || '').toLowerCase().trim();
        };

        var applyFilters = function () {
            var text = normalize(searchInput ? searchInput.value : '');
            var region = normalize(regionSelect ? regionSelect.value : '');
            var type = normalize(typeSelect ? typeSelect.value : '');
            var year = normalize(yearSelect ? yearSelect.value : '');
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.tags,
                    card.textContent
                ].join(' '));
                var matched = true;

                if (text && haystack.indexOf(text) === -1) {
                    matched = false;
                }
                if (region && normalize(card.dataset.region) !== region) {
                    matched = false;
                }
                if (type && normalize(card.dataset.type) !== type) {
                    matched = false;
                }
                if (year && normalize(card.dataset.year) !== year) {
                    matched = false;
                }

                card.classList.toggle('hidden-by-filter', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        };

        [searchInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }

    var video = document.querySelector('[data-player]');
    var playButton = document.querySelector('[data-play-button]');

    if (video) {
        var streamUrl = video.getAttribute('data-stream-url');
        var playerReady = false;
        var hlsInstance = null;

        var preparePlayer = function () {
            if (playerReady || !streamUrl) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }

            playerReady = true;
        };

        var startPlayer = function () {
            preparePlayer();
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
        };

        if (playButton) {
            playButton.addEventListener('click', startPlayer);
        }

        video.addEventListener('click', function () {
            if (!playerReady || video.paused) {
                startPlayer();
            }
        });

        video.addEventListener('play', function () {
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();

(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = $('[data-mobile-menu-button]');
    var menu = $('[data-mobile-menu]');

    if (!button || !menu) {
      return;
    }

    button.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function setupSearchForms() {
    $all('form[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var action = form.getAttribute('action') || 'search.html';

        if (query) {
          window.location.href = action + '?q=' + encodeURIComponent(query);
        }
      });
    });
  }

  function setupHeroSlider() {
    var hero = $('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = $all('.hero-slide', hero);
    var dots = $all('.hero-dot', hero);
    var previous = $('[data-hero-prev]', hero);
    var next = $('[data-hero-next]', hero);
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
        dot.setAttribute('aria-selected', dotIndex === current ? 'true' : 'false');
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupLocalFilter() {
    var filter = $('[data-local-filter]');
    var grid = $('[data-filter-grid]');

    if (!filter || !grid) {
      return;
    }

    var items = $all('[data-search-text]', grid);

    filter.addEventListener('input', function () {
      var query = filter.value.trim().toLowerCase();

      items.forEach(function (item) {
        var text = item.getAttribute('data-search-text') || '';
        item.style.display = text.toLowerCase().indexOf(query) === -1 ? 'none' : '';
      });
    });
  }

  function setupCherryBlossoms() {
    var layer = $('[data-cherry-layer]');

    if (!layer) {
      return;
    }

    var fragment = document.createDocumentFragment();

    for (var index = 0; index < 18; index += 1) {
      var blossom = document.createElement('span');
      blossom.className = 'cherry-blossom';
      blossom.style.left = Math.round(Math.random() * 100) + '%';
      blossom.style.animationDelay = (Math.random() * 8).toFixed(2) + 's';
      blossom.style.animationDuration = (10 + Math.random() * 14).toFixed(2) + 's';
      blossom.style.transform = 'scale(' + (0.72 + Math.random() * 0.76).toFixed(2) + ')';
      fragment.appendChild(blossom);
    }

    layer.appendChild(fragment);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupSearchForms();
    setupHeroSlider();
    setupLocalFilter();
    setupCherryBlossoms();
  });
}());

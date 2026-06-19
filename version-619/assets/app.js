(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (menuButton && mobilePanel) {
      menuButton.addEventListener('click', function() {
        mobilePanel.classList.toggle('is-open');
      });
    }

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
      var tabs = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-tab]'));
      var current = 0;

      function showSlide(index) {
        current = index;
        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        tabs.forEach(function(tab, tabIndex) {
          tab.classList.toggle('is-active', tabIndex === current);
        });
      }

      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          var index = Number(tab.getAttribute('data-hero-tab')) || 0;
          showSlide(index);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function() {
          showSlide((current + 1) % slides.length);
        }, 5200);
      }
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var queryInput = document.querySelector('[data-query-input]');
    if (queryInput && query) {
      queryInput.value = query;
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function(panel) {
      var input = panel.querySelector('[data-local-search]');
      var grid = document.querySelector('[data-card-grid]');
      var cards = grid ? Array.prototype.slice.call(grid.children) : [];
      var yearButtons = Array.prototype.slice.call(panel.querySelectorAll('[data-year-filter]'));
      var activeYear = 'all';

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function applyFilter() {
        var keyword = normalize(input ? input.value : '');
        cards.forEach(function(card) {
          var text = normalize(card.textContent + ' ' + (card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-genre') || '') + ' ' + (card.getAttribute('data-region') || ''));
          var year = card.getAttribute('data-year') || '';
          var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
          var yearMatch = activeYear === 'all' || year.indexOf(activeYear) !== -1;
          card.classList.toggle('is-hidden', !(keywordMatch && yearMatch));
        });
      }

      if (input) {
        input.addEventListener('input', applyFilter);
        if (query && input.hasAttribute('data-query-input')) {
          applyFilter();
        }
      }

      yearButtons.forEach(function(button) {
        button.addEventListener('click', function() {
          activeYear = button.getAttribute('data-year-filter') || 'all';
          yearButtons.forEach(function(item) {
            item.classList.toggle('is-active', item === button);
          });
          applyFilter();
        });
      });
    });
  });
}());

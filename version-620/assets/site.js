(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-main-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(index);
        start();
      });
    });

    show(0);
    start();
  }

  function setupFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
    if (!forms.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    forms.forEach(function (form) {
      var input = form.querySelector("[data-filter-input]");
      if (!input) {
        return;
      }
      if (query && !input.value) {
        input.value = query;
      }

      function apply() {
        var value = input.value.trim().toLowerCase();
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-search-text") || "").toLowerCase();
          var matched = !value || haystack.indexOf(value) !== -1;
          card.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });
        Array.prototype.slice.call(document.querySelectorAll("[data-empty-state]")).forEach(function (state) {
          state.classList.toggle("is-visible", visible === 0);
        });
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        apply();
      });
      input.addEventListener("input", apply);
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
}());

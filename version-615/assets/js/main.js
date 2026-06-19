(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        mobileNav.hidden = expanded;
      });
    }

    document.querySelectorAll(".hero-slider").forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".slider-dots button"));
      var index = 0;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });

      show(0);
      if (slides.length > 1) {
        window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var query = normalize(params.get("q"));
    var pageSearchInput = document.querySelector(".filter-search input[name='q']");
    var typeSelect = document.querySelector("select[data-filter='type']");
    var yearSelect = document.querySelector("select[data-filter='year']");
    var regionSelect = document.querySelector("select[data-filter='region']");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var rankItems = Array.prototype.slice.call(document.querySelectorAll(".rank-item"));
    var emptyTip = document.querySelector(".empty-tip");

    if (pageSearchInput && query) {
      pageSearchInput.value = query;
    }

    function matchCard(card, currentQuery, typeValue, yearValue, regionValue) {
      var text = normalize(card.getAttribute("data-text"));
      var type = normalize(card.getAttribute("data-type"));
      var year = normalize(card.getAttribute("data-year"));
      var region = normalize(card.getAttribute("data-region"));
      return (!currentQuery || text.indexOf(currentQuery) !== -1) &&
        (!typeValue || type === typeValue) &&
        (!yearValue || year === yearValue) &&
        (!regionValue || region === regionValue);
    }

    function applyFilters() {
      var currentQuery = normalize(pageSearchInput ? pageSearchInput.value : query);
      var typeValue = normalize(typeSelect ? typeSelect.value : "");
      var yearValue = normalize(yearSelect ? yearSelect.value : "");
      var regionValue = normalize(regionSelect ? regionSelect.value : "");
      var shown = 0;

      cards.forEach(function (card) {
        var ok = matchCard(card, currentQuery, typeValue, yearValue, regionValue);
        card.hidden = !ok;
        if (ok) {
          shown += 1;
        }
      });

      rankItems.forEach(function (item) {
        var ok = !currentQuery || normalize(item.getAttribute("data-text")).indexOf(currentQuery) !== -1;
        item.hidden = !ok;
      });

      if (emptyTip) {
        emptyTip.style.display = shown ? "none" : "block";
      }
    }

    if (cards.length) {
      applyFilters();
    }

    [pageSearchInput, typeSelect, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-type") || "";
        if (typeSelect) {
          typeSelect.value = value;
        }
        document.querySelectorAll(".filter-chip").forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        applyFilters();
      });
    });
  });
})();

function initMoviePlayer(source) {
  var video = document.getElementById("movie-video");
  var start = document.querySelector(".player-start");
  var loaded = false;
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function attach() {
    if (loaded) {
      return;
    }
    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function play() {
    attach();
    if (start) {
      start.classList.add("is-hidden");
    }
    video.setAttribute("controls", "controls");
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (start) {
    start.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}

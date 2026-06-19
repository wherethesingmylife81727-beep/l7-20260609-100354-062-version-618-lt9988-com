(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    function runFilter(scope) {
        var input = scope.querySelector('[data-search-input]');
        var activeButton = scope.querySelector('[data-filter-button].is-active');
        var query = input ? input.value.trim().toLowerCase() : '';
        var kind = activeButton ? activeButton.getAttribute('data-filter-value') : 'all';
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.filter-card'));

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var cardKind = card.getAttribute('data-kind') || 'movie';
            var matchedText = !query || text.indexOf(query) !== -1;
            var matchedKind = kind === 'all' || cardKind === kind;
            card.classList.toggle('is-hidden', !(matchedText && matchedKind));
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]')).forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-button]'));

        if (input) {
            input.addEventListener('input', function () {
                runFilter(scope);
            });
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                button.classList.add('is-active');
                runFilter(scope);
            });
        });
    });
})();

(function () {
    window.setupMoviePlayer = function (videoId, overlayId, playlistUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var prepared = false;
        var hlsInstance = null;

        if (!video || !playlistUrl) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playlistUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(playlistUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = playlistUrl;
            }

            prepared = true;
        }

        function start() {
            prepare();
            video.setAttribute('controls', 'controls');

            if (overlay) {
                overlay.classList.add('is-hidden');
                overlay.setAttribute('aria-hidden', 'true');
            }

            var playRequest = video.play();
            if (playRequest && typeof playRequest.catch === 'function') {
                playRequest.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', start);
            overlay.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    start();
                }
            });
        }

        video.addEventListener('click', function () {
            if (!prepared) {
                start();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();

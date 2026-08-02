// Transisi fade antar halaman — halus, lambat, tempo tidak terburu-buru.
// Dipakai bersama di index.html dan galeri.html.
(function () {

    // Fade-in begitu halaman selesai dimuat
    function revealPage() {
        requestAnimationFrame(function () {
            document.body.classList.add("is-visible");
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", revealPage);
    } else {
        revealPage();
    }

    // Fade-out sebelum berpindah ke halaman internal lain,
    // baru navigasi dijalankan setelah animasi selesai.
    var FADE_DURATION = 1100; // samakan dengan --dur-page di style.css

    document.addEventListener("click", function (e) {
        var link = e.target.closest("a");
        if (!link) return;

        var href = link.getAttribute("href");
        if (!href) return;

        // Lewati: buka tab baru, link eksternal, atau anchor di halaman yang sama
        if (link.target === "_blank") return;
        if (/^https?:\/\//i.test(href) || href.startsWith("//")) return;
        if (href.startsWith("#")) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;

        e.preventDefault();
        document.body.classList.remove("is-visible");
        document.body.classList.add("is-leaving");

        setTimeout(function () {
            window.location.href = href;
        }, FADE_DURATION);
    });

})();

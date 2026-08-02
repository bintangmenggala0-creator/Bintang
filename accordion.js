// Logic accordion toggle detail — dipakai bersama di past.html, present.html, music.html
// Sama persis dengan logic yang sebelumnya ada di index.html:
// klik toggle hanya menggerakkan deskripsi (detail-content) ke bawah,
// dan toggle lain yang masih terbuka otomatis tertutup.
document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".detail-toggle");

    function closeBlock(block) {
        const btn = block.querySelector(".detail-toggle");
        const textEl = block.querySelector(".detail-toggle-text");
        block.classList.remove("is-open");
        if (btn) btn.setAttribute("aria-expanded", "false");
        if (textEl) textEl.textContent = "Detail";
    }

    toggleButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const block = this.closest(".detail-block");
            if (!block) return;

            const willOpen = !block.classList.contains("is-open");

            // Accordion — tutup toggle lain yang masih terbuka (pakai animasi close yang sama)
            if (willOpen) {
                document.querySelectorAll(".detail-block.is-open").forEach(function (openBlock) {
                    if (openBlock !== block) closeBlock(openBlock);
                });
            }

            block.classList.toggle("is-open", willOpen);
            this.setAttribute("aria-expanded", willOpen ? "true" : "false");

            const textEl = this.querySelector(".detail-toggle-text");
            if (textEl) textEl.textContent = willOpen ? "Tutup" : "Detail";
        });
    });
});

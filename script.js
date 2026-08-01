document.addEventListener("DOMContentLoaded", function () {

    // 1. Render mini galeri dari data-gallery.js
    const galleryGrid = document.getElementById("profile-gallery");
    if (galleryGrid && typeof galleryData !== "undefined") {
        galleryData.forEach(function (item) {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="img-container">
                    <img src="${item.src}" alt="${item.title}" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-desc">${item.desc}</p>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    }

    // 2. Klik area teks card untuk toggle (pop) deskripsi — sama seperti album.html
    document.querySelectorAll(".gallery-grid .card-content").forEach(function (content) {
        content.addEventListener("click", function () {
            const card = this.closest(".card");
            if (!card) return;

            const wasOpen = card.classList.contains("is-expanded");
            document.querySelectorAll(".gallery-grid .card.is-expanded").forEach(function (c) {
                if (c !== card) c.classList.remove("is-expanded");
            });
            card.classList.toggle("is-expanded", !wasOpen);
        });
    });

    // 3. Lightbox — klik foto untuk memperbesar (bukan fullscreen), background di belakangnya blur
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const lightboxClose = document.getElementById("lightbox-close");

    document.querySelectorAll(".img-container").forEach(function (container) {
        container.addEventListener("click", function () {
            const img = this.querySelector("img");
            const content = this.nextElementSibling;
            if (!lightbox || !img) return;

            lightboxImg.src = img.src;
            if (lightboxTitle) lightboxTitle.innerText = content ? content.querySelector(".card-title").innerText : "";
            if (lightboxDesc) lightboxDesc.innerText = content ? content.querySelector(".card-desc").innerText : "";
            lightbox.classList.add("active");
        });
    });

    if (lightboxClose && lightbox) {
        const closeLightbox = () => lightbox.classList.remove("active");
        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeLightbox();
        });
    }

});

"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.noticias = (() => {
    let currentNewsIndex = 0;
    let currentLightboxIndex = null;

    function getNewsItems(dashboardData) {
        return Array.isArray(dashboardData.news) ? dashboardData.news : [];
    }

    function render(elements, dashboardData) {
        const newsItems = getNewsItems(dashboardData);
        const item = newsItems[currentNewsIndex];
        const prevIndex = (currentNewsIndex - 1 + newsItems.length) % newsItems.length;
        const nextIndex = (currentNewsIndex + 1) % newsItems.length;

        if (!item) {
            elements.newsList.innerHTML = '<p class="muted">No hay noticias disponibles.</p>';
            return;
        }

        elements.newsList.innerHTML = `
            <div class="news-carousel simple-carousel student-news-carousel" aria-live="polite">
                <div class="student-news-glow" aria-hidden="true" ${item.image ? `style="--news-bg: url('${item.image}')"` : ""}></div>
                <button class="carousel-nav carousel-prev" type="button" aria-label="Noticia anterior">
                    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <article class="news-slide is-active student-news-slide" role="group" aria-label="${currentNewsIndex + 1} de ${newsItems.length}">
                    <div class="student-news-media-shell">
                        <button class="news-slide-image${item.image ? "" : " is-empty"}" type="button" data-open-lightbox="${currentNewsIndex}" aria-label="Ver flyer: ${item.title}">
                            ${item.image ? `<img src="${item.image}" alt="${item.title}" loading="eager">` : '<i class="fa-solid fa-newspaper" aria-hidden="true"></i>'}
                        </button>
                    </div>
                    <div class="news-slide-info student-news-info">
                        <div class="student-news-meta">
                            <time class="news-date">${item.date}</time>
                            <span>${currentNewsIndex + 1}/${newsItems.length}</span>
                        </div>
                        <span class="student-news-kicker">Comunidad PSM</span>
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                        <div class="student-news-actions">
                            <button class="student-news-primary" type="button" data-open-lightbox="${currentNewsIndex}" ${item.image ? "" : "disabled"}>
                                <i class="fa-solid fa-expand" aria-hidden="true"></i>
                                <span>Ver flyer</span>
                            </button>
                            <button class="student-news-secondary" type="button" data-news-index="${nextIndex}">
                                <span>Siguiente</span>
                                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </article>
                <button class="carousel-nav carousel-next" type="button" aria-label="Siguiente noticia">
                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
                <div class="carousel-dots" aria-label="Indicadores de noticias">
                    ${newsItems.map((_, index) => `<button type="button" class="carousel-dot${index === currentNewsIndex ? " is-active" : ""}" data-news-index="${index}" aria-label="Ir a noticia ${index + 1}"></button>`).join("")}
                </div>
                <div class="student-news-strip" aria-label="Noticias destacadas">
                    ${[prevIndex, currentNewsIndex, nextIndex].map((index) => {
                        const newsItem = newsItems[index];
                        return `
                            <button class="student-news-thumb${index === currentNewsIndex ? " is-active" : ""}" type="button" data-news-index="${index}" aria-label="Ir a ${newsItem.title}">
                                ${newsItem.image ? `<img src="${newsItem.image}" alt="" loading="lazy">` : '<i class="fa-solid fa-newspaper" aria-hidden="true"></i>'}
                                <span>${newsItem.title}</span>
                            </button>
                        `;
                    }).join("")}
                </div>
            </div>
        `;

        initCarousel(elements, dashboardData);
    }

    function goTo(elements, dashboardData, index) {
        const newsItems = getNewsItems(dashboardData);
        currentNewsIndex = (index + newsItems.length) % newsItems.length;
        render(elements, dashboardData);
    }

    function initCarousel(elements, dashboardData) {
        const newsItems = getNewsItems(dashboardData);
        const prev = elements.newsList.querySelector(".carousel-prev");
        const next = elements.newsList.querySelector(".carousel-next");
        const dots = elements.newsList.querySelectorAll(".carousel-dot");

        if (newsItems.length <= 1) {
            prev.hidden = true;
            next.hidden = true;
        }

        prev.addEventListener("click", () => goTo(elements, dashboardData, currentNewsIndex - 1));
        next.addEventListener("click", () => goTo(elements, dashboardData, currentNewsIndex + 1));

        dots.forEach((dot) => {
            dot.addEventListener("click", (event) => {
                goTo(elements, dashboardData, Number(event.currentTarget.dataset.newsIndex));
            });
        });

        elements.newsList.querySelectorAll(".student-news-thumb, .student-news-secondary").forEach((button) => {
            button.addEventListener("click", (event) => {
                goTo(elements, dashboardData, Number(event.currentTarget.dataset.newsIndex));
            });
        });

        elements.newsList.querySelectorAll("[data-open-lightbox]").forEach((button) => {
            button.addEventListener("click", (event) => {
                if (event.currentTarget.disabled) {
                    return;
                }
                openLightbox(dashboardData, Number(event.currentTarget.dataset.openLightbox));
            });
        });
    }

    function openLightbox(dashboardData, index) {
        currentLightboxIndex = index;
        showLightboxAt(dashboardData, index);
    }

    function showLightboxAt(dashboardData, index) {
        const newsItem = getNewsItems(dashboardData)[index];
        const lightbox = document.querySelector("#news-lightbox");
        const image = document.querySelector("#news-lightbox-img");
        const title = document.querySelector("#news-lightbox-title");
        const text = document.querySelector("#news-lightbox-text");
        const date = document.querySelector("#news-lightbox-date");
        const download = document.querySelector("#news-lightbox-download");

        if (!newsItem || !lightbox || !image) {
            return;
        }

        image.src = newsItem.image || "";
        image.alt = newsItem.title || "Flyer noticia";
        title.textContent = newsItem.title || "";
        text.textContent = newsItem.text || "";
        date.textContent = newsItem.date || "";
        download.href = newsItem.image || "#";

        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("news-lightbox-open");
    }

    function closeLightbox() {
        const lightbox = document.querySelector("#news-lightbox");
        const image = document.querySelector("#news-lightbox-img");

        if (!lightbox || !image) {
            return;
        }

        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        image.src = "";
        document.body.classList.remove("news-lightbox-open");
        currentLightboxIndex = null;
    }

    function showNext(dashboardData) {
        const newsItems = getNewsItems(dashboardData);
        if (currentLightboxIndex === null || !newsItems.length) {
            return;
        }
        currentLightboxIndex = (currentLightboxIndex + 1) % newsItems.length;
        showLightboxAt(dashboardData, currentLightboxIndex);
    }

    function showPrev(dashboardData) {
        const newsItems = getNewsItems(dashboardData);
        if (currentLightboxIndex === null || !newsItems.length) {
            return;
        }
        currentLightboxIndex = (currentLightboxIndex - 1 + newsItems.length) % newsItems.length;
        showLightboxAt(dashboardData, currentLightboxIndex);
    }

    return {
        render,
        closeLightbox,
        showNext,
        showPrev
    };
})();
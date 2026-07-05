const header = document.querySelector("[data-site-header]");
const menuButton = document.querySelector("[data-menu-button]");
const siteNav = document.querySelector("[data-site-nav]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const lifeButtons = [...document.querySelectorAll("[data-life-filter]")];
const lifeCards = [...document.querySelectorAll("[data-life-card]")];
const careerCarousel = document.querySelector("[data-career-carousel]");
const careerCards = [...document.querySelectorAll(".career-card")];
const pensumModal = document.querySelector("[data-pensum-modal]");
const floatingActions = document.querySelector("[data-floating-actions]");
const scrollTopButton = document.querySelector("[data-scroll-top]");
const sistemasPensum = window.PSM_DASHBOARD_DATA?.pensum || [];
const reduceMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function initSmoothScroll() {
    if (!window.Lenis || reduceMotionPreference.matches) {
        return null;
    }

    const lenis = new Lenis({
        duration: 1.12,
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.08,
        anchors: {
            offset: -96,
            duration: 1.05
        }
    });

    function animateSmoothScroll(time) {
        lenis.raf(time);
        requestAnimationFrame(animateSmoothScroll);
    }

    requestAnimationFrame(animateSmoothScroll);
    document.documentElement.classList.add("has-smooth-scroll");

    return lenis;
}

const lenis = initSmoothScroll();

function updateHeaderState() {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
    floatingActions?.classList.toggle("is-visible", window.scrollY > 640);
}

lenis?.on?.("scroll", updateHeaderState);

function scrollToPageTop() {
    if (lenis) {
        lenis.scrollTo(0, { duration: 1.12 });
        return;
    }

    window.scrollTo({ top: 0, behavior: reduceMotionPreference.matches ? "auto" : "smooth" });
}

function closeMenu() {
    siteNav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-label", "Abrir menu");
}

menuButton?.addEventListener("click", () => {
    const isOpen = siteNav?.classList.toggle("is-open");
    menuButton.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => closeMenu());
});

scrollTopButton?.addEventListener("click", scrollToPageTop);

lifeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.lifeFilter;

        lifeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
        lifeCards.forEach((card) => {
            const shouldShow = filter === "all" || card.dataset.lifeCard === filter;
            card.classList.toggle("is-hidden", !shouldShow);
        });
    });
});

let careerSwiper = null;
let careerPauseTimeout = null;

function pauseCareerMarquee(duration = 0) {
    if (!careerCarousel?.classList.contains("is-marquee")) {
        return;
    }

    window.clearTimeout(careerPauseTimeout);
    careerCarousel.classList.add("is-paused");

    if (duration > 0) {
        careerPauseTimeout = window.setTimeout(() => {
            careerCarousel.classList.remove("is-paused");
        }, duration);
    }
}

function resumeCareerMarquee() {
    window.clearTimeout(careerPauseTimeout);
    careerCarousel?.classList.remove("is-paused");
}

if (careerCarousel && careerCards.length > 0) {
    const careerTrack = careerCarousel.querySelector("[data-career-track]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (careerTrack && !reduceMotion) {
        careerCards.forEach((card) => {
            const clone = card.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            clone.tabIndex = -1;
            careerTrack.appendChild(clone);
        });

        careerCarousel.classList.add("is-marquee");
        careerCarousel.addEventListener("click", () => pauseCareerMarquee(2400));

        const careerVisibilityObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                resumeCareerMarquee();
                return;
            }

            pauseCareerMarquee();
        }, { threshold: 0.08 });

        careerVisibilityObserver.observe(careerCarousel);
    } else if (window.Swiper) {
        careerSwiper = new Swiper(careerCarousel, {
            slidesPerView: "auto",
            spaceBetween: 14,
            navigation: {
                prevEl: "[data-career-prev]",
                nextEl: "[data-career-next]"
            }
        });
    }
} else if (careerCarousel) {
    careerCarousel.classList.add("is-fallback");
}

function closePensumModal() {
    pensumModal?.setAttribute("hidden", "");
    document.body.classList.remove("is-modal-open");
    lenis?.start?.();
}

function renderSistemasPensum() {
    if (sistemasPensum.length === 0) {
        return "";
    }

    return sistemasPensum.map((semester, index) => `
        <details class="pensum-semester"${index === 0 ? " open" : ""}>
            <summary>${semester.semester}<span>${semester.subjects.length} materias</span></summary>
            <div class="pensum-subject-list">
                ${semester.subjects.map((subject) => `
                    <div class="pensum-subject">
                        <code>${subject.code}</code>
                        <strong>${subject.name}</strong>
                        <small>${subject.uc} UC</small>
                    </div>
                `).join("")}
            </div>
        </details>
    `).join("");
}

function openPensumModal(card) {
    if (!card || !pensumModal) {
        return;
    }

    const isSistemas = card.dataset.careerKey === "sistemas";
    const summary = pensumModal.querySelector(".pensum-summary");
    const detail = pensumModal.querySelector("[data-pensum-detail]");
    const subjectCount = sistemasPensum.reduce((total, semester) => total + semester.subjects.length, 0);

    pensumModal.querySelector("[data-pensum-title]").textContent = card.dataset.careerName || card.querySelector("h3")?.textContent || "Pensum";
    pensumModal.querySelector("[data-pensum-faculty]").textContent = card.dataset.careerFaculty || "Oferta academica";
    pensumModal.querySelector("[data-pensum-focus]").textContent = card.dataset.careerFocus || card.querySelector("p")?.textContent || "Pensum academico de la carrera.";

    if (summary) {
        summary.innerHTML = isSistemas && sistemasPensum.length > 0
            ? `<span><strong>${sistemasPensum.length}</strong> semestres</span><span><strong>${subjectCount}</strong> materias</span><span><strong>INF</strong> Sistemas</span>`
            : `<span><strong>10</strong> semestres</span><span><strong>5</strong> ejes formativos</span><span><strong>PSM</strong> Cabimas</span>`;
    }

    if (detail) {
        detail.innerHTML = isSistemas ? renderSistemasPensum() : "";
    }

    pensumModal.removeAttribute("hidden");
    document.body.classList.add("is-modal-open");
    lenis?.stop?.();
    pensumModal.querySelector("[data-pensum-close]")?.focus();
}

document.querySelectorAll("[data-pensum-open]").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        openPensumModal(button.closest(".career-card"));
    });
});

document.querySelectorAll(".career-card").forEach((card) => {
    card.addEventListener("click", () => {
        openPensumModal(card);
    });
});

document.querySelectorAll("[data-pensum-close]").forEach((button) => {
    button.addEventListener("click", closePensumModal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePensumModal();
    }
});

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

function initWebsiteReveals() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        return;
    }

    const revealGroups = [
        ...document.querySelectorAll(".section-heading, .about-grid article, .career-card:not([aria-hidden='true']), .admission-card, .admission-info, .life-card, .footer-hero, .footer-grid > *, .footer-bottom")
    ];

    revealGroups.forEach((element, index) => {
        const isCard = element.matches(".about-grid article, .career-card, .admission-card, .life-card, .footer-grid > *");
        const direction = index % 3 === 0 ? "left" : index % 3 === 1 ? "scale" : "right";

        element.classList.add("reveal-item");
        element.dataset.reveal = isCard ? direction : "scale";
        element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.16 });

    revealGroups.forEach((element) => revealObserver.observe(element));
}

initWebsiteReveals();
window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

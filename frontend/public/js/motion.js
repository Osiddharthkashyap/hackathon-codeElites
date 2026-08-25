const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initialiseMotion = () => {
    if (prefersReducedMotion || !window.anime?.animate) return;

    const animatedElements = document.querySelectorAll(
        "[data-animate], .hero-content, .section-heading, .feature-card, .auth-card, .onboarding-card, .roadmap-generating-card, .roadmap-header, .roadmap-stat, .roadmap-phase, .not-found-card, .dashboard-card"
    );

    if (animatedElements.length) {
        window.anime.animate(animatedElements, {
            opacity: [0, 1],
            translateY: [18, 0],
            delay: window.anime.stagger(65),
            duration: 560,
            ease: "out(3)",
        });
    }

    document.querySelectorAll(".primary-button, .secondary-button, .nav-button, .continue-button, .auth-submit-button, .roadmap-primary-button").forEach((button) => {
        button.addEventListener("mouseenter", () => window.anime.animate(button, { scale: 1.025, duration: 160, ease: "out(3)" }));
        button.addEventListener("mouseleave", () => window.anime.animate(button, { scale: 1, duration: 180, ease: "out(3)" }));
    });
};

document.addEventListener("DOMContentLoaded", initialiseMotion);

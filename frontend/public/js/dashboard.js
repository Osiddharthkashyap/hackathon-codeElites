const dashboardMotion = () => {
    const anime = window.anime;
    if (!anime?.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll("[data-progress-ring]").forEach((ring) => {
        const value = Number(ring.dataset.progressRing || 0);
        const circumference = 2 * Math.PI * 42;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
        anime.animate(ring, { strokeDashoffset: circumference * (1 - value / 100), duration: 1100, delay: 250, ease: "out(3)" });
    });

    document.querySelectorAll("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count || 0);
        const counter = { value: 0 };
        anime.animate(counter, {
            value: target,
            duration: 850,
            delay: 180,
            ease: "out(3)",
            onUpdate: () => { element.textContent = Math.round(counter.value).toString(); },
        });
    });
};

document.addEventListener("DOMContentLoaded", dashboardMotion);

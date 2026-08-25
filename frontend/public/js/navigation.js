const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.setAttribute("aria-expanded", "false");
    const closeMenu = () => {
        mobileMenu.hidden = true;
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.setAttribute("aria-label", "Open navigation menu");
    };

    const openMenu = () => {
        mobileMenu.hidden = false;
        mobileMenuButton.setAttribute("aria-expanded", "true");
        mobileMenuButton.setAttribute("aria-label", "Close navigation menu");
    };

    mobileMenuButton.addEventListener("click", () => mobileMenu.hidden ? openMenu() : closeMenu());
    mobileMenu.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !mobileMenu.hidden) { closeMenu(); mobileMenuButton.focus(); }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 700) closeMenu(); });
}

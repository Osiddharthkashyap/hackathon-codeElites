export const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
};

export const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("/dashboard");
    }

    next();
};

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) {
        return res.status(403).render("errors/forbidden", { pageTitle: "Access denied" });
    }

    next();
};

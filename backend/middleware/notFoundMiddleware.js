import { getApplicationRoutes, suggestClosestRoute } from "../services/routeSuggestionService.js";

const STATIC_ASSET_PATH = /^\/(?:css|js|images)\//;

export const notFoundMiddleware = (app) => (req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            success: false,
            error: { message: "API endpoint not found", status: 404 },
        });
    }

    if (STATIC_ASSET_PATH.test(req.path) || req.path === "/favicon.ico") {
        return res.status(404).type("text/plain").send("Not found");
    }

    const isHtmlRequest = req.accepts(["html", "json"]) === "html";
    if (!isHtmlRequest) return res.status(404).json({ success: false, error: { message: "Route not found", status: 404 } });

    const requestedPath = req.path;
    const suggestion = suggestClosestRoute(requestedPath, getApplicationRoutes(app));

    return res.status(404).render("errors/not-found", {
        pageTitle: "Page Not Found | LearnFlow AI",
        requestedPath,
        suggestion,
        isAuthenticated: Boolean(req.session?.userId),
    });
};

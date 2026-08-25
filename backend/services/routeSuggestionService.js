const SUGGESTION_THRESHOLD = 0.58;

const normalisePath = (value = "/") => {
    const path = value.startsWith("/") ? value : `/${value}`;
    return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

const levenshteinDistance = (first, second) => {
    const previous = Array.from({ length: second.length + 1 }, (_, index) => index);

    for (let row = 1; row <= first.length; row += 1) {
        let diagonal = previous[0];
        previous[0] = row;

        for (let column = 1; column <= second.length; column += 1) {
            const above = previous[column];
            previous[column] = Math.min(
                previous[column] + 1,
                previous[column - 1] + 1,
                diagonal + (first[row - 1] === second[column - 1] ? 0 : 1)
            );
            diagonal = above;
        }
    }

    return previous[second.length];
};

const similarity = (first, second) => {
    const longest = Math.max(first.length, second.length);
    return longest === 0 ? 1 : 1 - levenshteinDistance(first, second) / longest;
};

export const routeLabel = (routePath) => {
    if (routePath === "/") return "Home";

    return routePath
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.replace(/[-_]+/g, " "))
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" · ");
};

// Reads registered GET routes from the existing Express router stack. Dynamic
// paths and API-only routes are intentionally excluded because neither is a
// safe destination for a browser navigation suggestion.
export const getApplicationRoutes = (app) => {
    const routes = new Set();

    const inspectStack = (stack) => {
        for (const layer of stack || []) {
            if (layer.route?.path && layer.route.methods?.get) {
                const paths = Array.isArray(layer.route.path) ? layer.route.path : [layer.route.path];
                for (const path of paths) {
                    const routePath = normalisePath(path);
                    if (!routePath.includes(":" ) && !routePath.startsWith("/api/")) routes.add(routePath);
                }
            }

            if (layer.handle?.stack) inspectStack(layer.handle.stack);
        }
    };

    inspectStack(app.router?.stack);
    return [...routes];
};

export const suggestClosestRoute = (requestedPath, availableRoutes, threshold = SUGGESTION_THRESHOLD) => {
    const requested = normalisePath(requestedPath).toLowerCase();
    let closest = null;

    for (const route of availableRoutes) {
        const candidate = normalisePath(route);
        const score = similarity(requested, candidate.toLowerCase());
        if (!closest || score > closest.score) closest = { path: candidate, score };
    }

    if (!closest || closest.score < threshold) return null;
    return { path: closest.path, label: routeLabel(closest.path), score: closest.score };
};

export { SUGGESTION_THRESHOLD };

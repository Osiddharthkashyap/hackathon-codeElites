import User from "../models/User.js";
import { decryptSecret, encryptSecret } from "../utils/secretVault.js";

const safeUrl = (value, provider) => {
    if (!value) return provider === "gemini"
        ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        : "https://api.openai.com/v1/chat/completions";
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) throw new Error("AI endpoint must use HTTP or HTTPS.");
    return url.toString();
};

export const showAiSettings = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId).select("+aiCredentials").lean();
        res.render("settings/ai", { settings: user?.aiCredentials || {}, error: null, saved: false });
    } catch (error) { next(error); }
};

export const saveAiSettings = async (req, res, next) => {
    try {
        const provider = req.body.provider === "openai-compatible" ? "openai-compatible" : "gemini";
        const endpoint = safeUrl(String(req.body.baseUrl || "").trim(), provider);
        const apiKey = String(req.body.apiKey || "").trim();
        const update = { "aiCredentials.baseUrl": endpoint, "aiCredentials.provider": provider, "aiCredentials.updatedAt": new Date() };
        if (apiKey) update["aiCredentials.encryptedApiKey"] = encryptSecret(apiKey);
        await User.findByIdAndUpdate(req.session.userId, { $set: update }, { runValidators: true });
        res.render("settings/ai", { settings: { baseUrl: endpoint, provider }, error: null, saved: true });
    } catch (error) {
        res.status(400).render("settings/ai", { settings: { baseUrl: req.body.baseUrl, provider: req.body.provider }, error: "Choose a supported provider and enter a valid HTTPS endpoint and API key.", saved: false });
    }
};

export const getUserCredentials = async (userId) => {
    const user = await User.findById(userId).select("+aiCredentials").lean();
    if (!user?.aiCredentials?.encryptedApiKey) return {};
    return { provider: user.aiCredentials.provider, baseUrl: user.aiCredentials.baseUrl, apiKey: decryptSecret(user.aiCredentials.encryptedApiKey) };
};

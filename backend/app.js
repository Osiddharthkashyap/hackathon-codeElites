import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/authRoute.js";
import connectDB, { isValidMongoUri } from "./config/db.js";
import { requireAuth, requireRole } from "./middleware/authMiddlewares.js";
import User from "./models/User.js";


// ------------------------------------
// ES Module replacement for __dirname
// ------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
}
if (!isValidMongoUri(process.env.MONGODB_URI)) {
    throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

if (isProduction) {
    app.set("trust proxy", 1);
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    express.static(
        path.join(__dirname, "../frontend/public")
    )
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, crypto: { secret: process.env.SESSION_SECRET } }),

        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);

app.use((req, res, next) => {
    res.locals.currentUser = req.session?.user || null;
    next();
});

app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.get("origin")) {
        const origin = new URL(req.get("origin")).origin;
        if (origin !== `${req.protocol}://${req.get("host")}`) return res.status(403).send("Invalid request origin.");
    }
    next();
});

app.use("/", authRoutes);

// ------------------------------------
// Routes
// ------------------------------------

// Landing page
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/onboarding", requireAuth, (req, res) => {
    res.render("onboarding/goal");
});

app.get("/onboarding/experience", requireAuth, (req, res) => {
    res.render("onboarding/experience");
});

app.get("/onboarding/preferences", requireAuth, (req, res) => {
    res.render("onboarding/preferences");
});

app.get("/roadmap/generating", requireAuth, (req, res) => {
    res.render("roadmap/generating");
});

app.get("/roadmap", requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId).lean();
        res.render("roadmap/index", { onboarding: user?.onboarding || {} });
    } catch (error) { next(error); }
});

app.get("/learning", requireAuth, (req, res) => {
    res.render("learning/index");
});

app.post("/api/onboarding", requireAuth, async (req, res, next) => {
    try {
        const { learningGoal = "", customGoal = "", experience, studyTime, learningStyles = [], target = "" } = req.body;
        if (!learningGoal.trim() && !customGoal.trim()) return res.status(400).json({ error: "Choose or describe a learning goal." });
        if (!["beginner", "intermediate", "advanced"].includes(experience)) return res.status(400).json({ error: "Choose your experience level." });
        if (!Array.isArray(learningStyles)) return res.status(400).json({ error: "Learning styles must be a list." });
        await User.findByIdAndUpdate(req.session.userId, { onboarding: { learningGoal, customGoal, experience, studyTime, learningStyles: learningStyles.slice(0, 4), target, completedAt: new Date() } }, { runValidators: true });
        res.status(204).end();
    } catch (error) { next(error); }
});

app.get("/dashboard", requireAuth, (req, res) => {
    res.render("dashboard/index", {
        user: req.session.user,
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/admin", requireAuth, requireRole("admin"), (req, res) => {
    res.render("admin/index");
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Backend server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render("errors/server", { pageTitle: "Something went wrong" });
});

startServer();

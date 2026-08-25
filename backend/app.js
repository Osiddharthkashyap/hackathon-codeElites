import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";


const app = express();

const PORT = process.env.PORT || 3000;

// ------------------------------------
// ES Module replacement for __dirname
// ------------------------------------

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.json());
app.set("view engine", "ejs");

// Tell Express where the views folder is located
app.set("views", path.join(__dirname, "../frontend/views"));

// ------------------------------------
// Middleware
// ------------------------------------

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(
    express.static(
        path.join(__dirname, "../frontend/public")
    )
);
// ------------------------------------
// Routes
// ------------------------------------

// Landing page
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/onboarding", (req, res) => {
    res.render("onboarding/goal");
});

app.get("/onboarding/experience", (req, res) => {
    res.render("onboarding/experience");
});

app.get("/onboarding/preferences", (req, res) => {
    res.render("onboarding/preferences");
});

app.get("/roadmap", (req, res) => {
    res.send("Roadmap generation page coming next.");
});

app.get("/login", (req, res) => {
    res.render("auth/login");
});

app.get("/register", (req, res) => {
    res.render("auth/register");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});

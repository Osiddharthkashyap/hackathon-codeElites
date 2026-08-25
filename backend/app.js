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


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get("/roadmap/generating", (req, res) => {
    res.render("roadmap/generating");
});

app.get("/roadmap", (req, res) => {
    res.render("roadmap/index");
});

app.get("/learning", (req, res) => {
    res.render("learning/index", {
        lesson: {
            slug: "html-fundamentals",
            title: "HTML Fundamentals",
            description:
                "Build a strong foundation in the language that gives every webpage its structure."
        }
    });
});

app.get("/learning/html-fundamentals", (req, res) => {
    res.render("learning/lesson", {
        lesson: {
            title: "HTML Fundamentals",
            duration: "25 min",
            objective:
                "Learn how HTML elements organize content into a clear, meaningful webpage."
        }
    });
});

app.get("/quiz", (req, res) => {
    res.render("quiz/index", {
        quiz: {
            title: "HTML Fundamentals",
            description:
                "Let's check what you learned in this lesson.",
            questions: [
                {
                    id: 1,
                    question:
                        "What is the primary purpose of HTML?",
                    options: [
                        "To style webpages",
                        "To structure webpage content",
                        "To create databases",
                        "To manage server requests"
                    ]
                },
                {
                    id: 2,
                    question:
                        "Which HTML element is used for the main heading of a page?",
                    options: [
                        "<p>",
                        "<head>",
                        "<h1>",
                        "<title>"
                    ]
                },
                {
                    id: 3,
                    question:
                        "Which element is commonly used to create a link?",
                    options: [
                        "<link>",
                        "<a>",
                        "<href>",
                        "<url>"
                    ]
                },
                {
                    id: 4,
                    question:
                        "What does CSS primarily control?",
                    options: [
                        "Page structure",
                        "Database logic",
                        "Visual presentation",
                        "Server authentication"
                    ]
                },
                {
                    id: 5,
                    question:
                        "Which element is used to create a paragraph?",
                    options: [
                        "<text>",
                        "<paragraph>",
                        "<p>",
                        "<content>"
                    ]
                }
            ]
        }
    });
});

app.get("/results", (req, res) => {
    res.render("results/index");
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

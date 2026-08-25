# LearnFlow AI — Project AI Skill Instructions

## Project Overview

LearnFlow AI is an AI-powered adaptive learning platform built for an EduTech hackathon.

The main product idea is:

> Your learning path evolves with you.

The application helps students:

1. Define a learning goal.
2. Define their experience level.
3. Define their available study time.
4. Generate a personalized learning roadmap.
5. Learn topics in sequence.
6. Take AI-generated quizzes.
7. Identify weak areas.
8. Receive personalized recommendations.
9. Practice weak areas.
10. Unlock the next topic after demonstrating mastery.

The core adaptive learning loop is:

Goal
→ Personalized Roadmap
→ Learn
→ Quiz
→ Performance Analysis
→ Weak Area Detection
→ Recommendation
→ Practice
→ Reassessment
→ Mastery
→ Unlock Next Topic

---

# Technology Stack

## Frontend

- EJS
- HTML5
- CSS3
- Vanilla JavaScript

Do not use React, Vue, Angular, or other frontend frameworks unless explicitly requested.

## Backend

- Node.js
- Express.js
- ES Modules

## Database

- MongoDB
- Mongoose

## Authentication

- Express sessions
- MongoDB session storage
- bcryptjs for password hashing

## AI Integration

The AI provider will be integrated through backend services.

Never expose AI API keys in frontend code.

---

# Project Structure

The project uses the following structure:

hackathon-codeElites/
│
├── AI_SKILL.md
├── README.md
├── LICENSE
│
├── backend/
│ ├── app.js
│ │
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ └── utils/
│
└── frontend/
├── public/
│ ├── css/
│ ├── images/
│ └── js/
│
└── views/
├── assistant/
├── auth/
├── dashboard/
├── layouts/
├── learning/
├── onboarding/
├── partials/
├── profile/
├── quiz/
├── results/
└── roadmap/

---

# Module System Rules

This project uses ES Modules.

Always use:

```js
import express from "express";
```

Never use:

```js
const express = require("express");
```

For local imports, always include the `.js` extension.

Correct:

```js
import User from "../models/User.js";
```

Incorrect:

```js
import User from "../models/User";
```

Export functions using ES Module syntax.

Example:

```js
export const getDashboard = async (req, res) => {
  // Controller logic
};
```

---

# EJS Rules

Use EJS for all server-rendered pages.

Example route:

```js
app.get("/", (req, res) => {
  res.render("home");
});
```

For nested pages:

```js
res.render("auth/login");
```

corresponds to:

```text
frontend/views/auth/login.ejs
```

Reusable UI should eventually be moved into:

```text
frontend/views/partials/
```

Examples:

- navbar.ejs
- footer.ejs
- sidebar.ejs
- flash.ejs
- progress-bar.ejs
- ai-recommendation.ejs

Do not duplicate large navigation or layout blocks unnecessarily.

---

# Static Asset Rules

All static assets must be inside:

```text
frontend/public/
```

CSS:

```text
frontend/public/css/
```

JavaScript:

```text
frontend/public/js/
```

Images:

```text
frontend/public/images/
```

EJS should reference static files using root-relative paths.

Example:

```html
<link rel="stylesheet" href="/css/style.css" />
```

Example:

```html
<script src="/js/home.js"></script>
```

---

# UI Design System

The UI should feel:

- Modern
- Minimal
- Intelligent
- Premium
- Student-friendly
- SaaS-inspired

Avoid making the interface look like a traditional school website.

Use:

- Rounded cards
- Clean spacing
- Soft borders
- Subtle shadows
- Indigo and purple accents
- White or very light backgrounds
- Clear typography
- Responsive layouts
- Smooth transitions

Preferred visual direction:

- Primary: Indigo / Purple
- Background: Soft light gray
- Cards: White
- Success: Green
- Warning: Amber
- Error: Red
- Text: Dark navy or dark gray

Suggested border radius:

```css
8px
12px
16px
20px
```

Avoid excessive gradients, excessive animations, and excessive AI icons.

---

# Landing Page Rules

The landing page should communicate the product within the first few seconds.

Primary message:

> Your Learning Path Evolves With You

Supporting message:

> LearnFlow AI creates personalized learning roadmaps, identifies weak areas, and adapts your learning journey based on your progress.

Primary CTA:

> Start Learning

Secondary CTA:

> See How It Works

The landing page should visually demonstrate the product with a roadmap preview showing:

- Completed topics
- Current topic
- Weak topic
- Locked topics
- Overall progress

The hero should have a strong two-column layout on desktop.

Left:

- Headline
- Description
- CTA buttons

Right:

- Learning path preview card

---

# Responsive Design Rules

The UI must work on:

- Desktop
- Tablet
- Mobile

Desktop can use multi-column layouts.

On smaller screens:

- Stack sections vertically.
- Make buttons easy to tap.
- Avoid horizontal overflow.
- Keep text readable.
- Collapse navigation when needed.

Always use responsive CSS.

---

# Accessibility Rules

Use semantic HTML where possible.

Examples:

```html
<nav>
  <main>
    <section>
      <button>
        <form>
          <label></label>
        </form>
      </button>
    </section>
  </main>
</nav>
```

Buttons must have meaningful text.

Form inputs should have labels.

Interactive elements should have visible hover and focus states.

Do not rely only on color to communicate important status.

---

# JavaScript Rules

Use vanilla JavaScript.

Prefer:

- Small functions
- Clear variable names
- Event listeners
- Modular logic when necessary

Do not write unnecessarily complex JavaScript.

Avoid inline JavaScript unless necessary.

Place page-specific JavaScript inside:

```text
frontend/public/js/
```

---

# Backend Rules

Use the following separation:

Routes
→ Controllers
→ Services
→ Models

Example:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
MongoDB
```

Routes should define endpoints.

Controllers should handle request and response logic.

Services should contain reusable business logic and AI integration logic.

Models should define MongoDB schemas.

---

# Error Handling Rules

Use clear error messages.

Do not expose sensitive backend information to users.

Use appropriate HTTP status codes.

Examples:

- 200 — Success
- 201 — Created
- 400 — Invalid request
- 401 — Unauthorized
- 403 — Forbidden
- 404 — Not found
- 500 — Server error

---

# Security Rules

Never hardcode:

- MongoDB connection strings
- API keys
- Session secrets
- Passwords

Use environment variables.

Store secrets in:

```text
backend/.env
```

Ensure `.env` is included in `.gitignore`.

Never send sensitive keys to the frontend.

Passwords must always be hashed before storing.

---

# Coding Style Rules

Use:

- 4 spaces for JavaScript indentation.
- Clear names.
- Small functions.
- Comments only where useful.
- Consistent formatting.

Avoid:

- Unused code.
- Duplicate code.
- Giant controller functions.
- Hardcoded secrets.
- Placeholder implementations unless explicitly requested.

When creating code, provide complete working files rather than partial fragments.

---

# Development Workflow

Build LearnFlow AI screen by screen and feature by feature.

Current implementation order:

1. Landing Page
2. Authentication
3. Onboarding
4. AI Roadmap Generation
5. Dashboard
6. Roadmap
7. Learning Topic
8. AI Quiz
9. Quiz Results
10. AI Performance Analysis
11. Practice Flow
12. AI Assistant
13. Progress Page
14. Profile
15. Mastery and Next Topic

Do not jump ahead and implement unrelated features.

Complete and verify each screen before moving to the next.

---

# Current Task Context

The current screen being implemented is:

> Landing Page

Reference design:

- Clean SaaS landing page
- LearnFlow AI branding
- Navigation bar
- Hero section
- Strong headline
- Personalized learning path preview
- Primary and secondary CTA buttons
- Trusted-by section
- Responsive design

When generating code for this screen:

1. Preserve the existing project structure.
2. Use EJS.
3. Use external CSS files.
4. Use external JavaScript files.
5. Do not use React.
6. Do not change the backend architecture unnecessarily.
7. Keep the UI consistent with the LearnFlow AI design system.
8. Write production-quality, readable code.

# LearnFlow AI 🚀

> **An AI-powered personalized learning platform that helps students understand what to learn, how to learn, and what to do next.**

LearnFlow AI is an adaptive EdTech platform designed to create personalized learning experiences for students. Instead of following a fixed learning path, users can set their learning goals, generate AI-powered roadmaps, take assessments, identify weak areas, and receive intelligent recommendations for their next learning step.

## 🌟 Problem Statement

Students often face challenges such as:

* Not knowing where to start learning.
* Feeling overwhelmed by too many learning resources.
* Following random tutorials without a proper roadmap.
* Being unable to identify their weak areas.
* Receiving the same learning experience as everyone else.

Traditional learning platforms usually provide structured content, but they do not always adapt to the individual learner.

**LearnFlow AI aims to solve this problem by creating a personalized and adaptive learning journey for every student.**

## 💡 Our Solution

LearnFlow AI allows students to define their learning goals and receive an AI-generated learning roadmap based on their requirements.

The platform continuously analyzes the student's progress and performance to provide personalized recommendations.

The learning flow looks like this:

```text
Set Learning Goal
        ↓
AI Skill Assessment
        ↓
Personalized Learning Roadmap
        ↓
Learn & Practice
        ↓
AI-Generated Quiz
        ↓
Performance Analysis
        ↓
Identify Weak Areas
        ↓
Get Recommended Next Step
```

## ✨ Key Features

### 🤖 AI-Powered Learning Roadmap

Students can enter a learning goal such as:

> "I want to become a Full Stack Developer."

LearnFlow AI generates a structured learning path with topics arranged in the correct sequence.

Example:

```text
HTML & CSS
     ↓
JavaScript
     ↓
Node.js
     ↓
Express.js
     ↓
MongoDB
     ↓
Full Stack Projects
```

### 💬 AI Study Assistant

Students can interact with an AI assistant to:

* Ask questions about a topic.
* Get simplified explanations.
* Request real-world examples.
* Generate practice questions.
* Understand mistakes.
* Get guidance while learning.

### 📝 AI-Generated Assessments

LearnFlow AI can generate quizzes based on the student's selected topic.

The platform can then evaluate performance and help students understand where they need improvement.

### 📊 Personalized Progress Dashboard

Students can track their learning journey through a dashboard containing:

* Learning goals.
* Roadmap progress.
* Completed topics.
* Quiz performance.
* Weak areas.
* Learning streaks.
* Personalized recommendations.

### 🎯 AI Next-Step Recommendation

One of the main features of LearnFlow AI is its adaptive recommendation system.

Instead of simply showing a quiz score, the platform provides actionable feedback.

For example:

> **Your performance in Arrays needs improvement. Complete 5 practice problems before moving to Functions.**

This helps students understand exactly what they should do next.

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### AI Integration

* Large Language Model API for:

  * Learning roadmap generation
  * Study assistance
  * Quiz generation
  * Performance feedback
  * Personalized recommendations

## 🏗️ Project Architecture

```text
User
  │
  ▼
EJS Frontend
  │
  ▼
Express Routes
  │
  ▼
Controllers
  │
  ├──────────────► AI Service
  │
  ▼
Models
  │
  ▼
MongoDB Database
```

## 📂 Project Structure

```text
LearnFlow-AI/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── roadmapController.js
│   ├── quizController.js
│   └── dashboardController.js
│
├── models/
│   ├── User.js
│   ├── Roadmap.js
│   ├── Quiz.js
│   └── Progress.js
│
├── routes/
│   ├── authRoutes.js
│   ├── roadmapRoutes.js
│   ├── quizRoutes.js
│   └── dashboardRoutes.js
│
├── services/
│   └── aiService.js
│
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── auth/
│   ├── dashboard/
│   ├── roadmap/
│   └── quiz/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── middleware/
│   └── authMiddleware.js
│
├── .env
├── app.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd LearnFlow-AI
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key
SESSION_SECRET=your_session_secret
```

### 5. Start the Application

```bash
npm start
```

For development:

```bash
npm run dev
```

The application will run on:

```text
http://localhost:3000
```

## 🎯 Target Users

LearnFlow AI is designed for:

* School and college students.
* Self-learners.
* Beginners learning technical skills.
* Students preparing for competitive examinations.
* Anyone who needs a structured and personalized learning path.

## 🔮 Future Scope

Future versions of LearnFlow AI could include:

* Voice-based AI tutor.
* Collaborative learning groups.
* Gamified achievements and badges.
* Smart study schedules.
* Integration with online learning resources.
* AI-generated project ideas.
* Resume-based skill gap analysis.
* Personalized career recommendations.

## 🧠 Why LearnFlow AI?

LearnFlow AI is more than just a learning management system or an AI chatbot.

It focuses on **adaptive learning** by answering three important questions for every learner:

> **What should I learn?**

> **How should I learn it?**

> **What should I do next?**

By combining AI-powered roadmaps, assessments, performance analysis, and personalized recommendations, LearnFlow AI aims to make learning more structured, focused, and personalized.

## 👥 Team

Built with ❤️ for **HACKN'TECH**.

### Our Mission

> **To make learning more personalized, adaptive, and accessible with the power of Artificial Intelligence.**

---

⭐ If you like this project, consider giving it a star!

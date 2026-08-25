import mongoose from "mongoose";
import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";
import { generateQuiz, generateRoadmap, generateTopicExplanation, updateRoadmap } from "../services/aiService.js";
import { getUserCredentials } from "./settingsController.js";

const durationFromStudyTime = (studyTime = "30-60 minutes") => {
    const match = String(studyTime).match(/(\d+)/);
    return Math.max(0.25, Math.min(24, Number(match?.[1] || 30) / 60));
};

const getOwnedRoadmap = async (req, res) => {
    const roadmapId = req.params.id || req.body.roadmapId;
    if (!mongoose.isValidObjectId(roadmapId)) {
        res.status(404).render("errors/not-found", { pageTitle: "Roadmap not found" });
        return null;
    }
    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: req.session.userId }).select("+weeks.topics.quizQuestions");
    if (!roadmap) {
        res.status(403).render("errors/forbidden", { pageTitle: "Roadmap unavailable" });
        return null;
    }
    return roadmap;
};

export const listRoadmaps = async (req, res, next) => {
    try {
        const roadmaps = await Roadmap.find({ user: req.session.userId }).sort({ updatedAt: -1 }).lean();
        res.render("roadmaps/index", { roadmaps });
    } catch (error) { next(error); }
};

export const showCreateRoadmap = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId).lean();
        res.render("roadmaps/create", { onboarding: user?.onboarding || {}, error: null });
    } catch (error) { next(error); }
};

export const createRoadmap = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId).lean();
        const goal = String(req.body.goal || user?.onboarding?.customGoal || user?.onboarding?.learningGoal || "").trim();
        const currentLevel = String(req.body.currentLevel || user?.onboarding?.experience || "beginner");
        const durationWeeks = Number(req.body.durationWeeks || 6);
        const studyHoursPerDay = Number(req.body.studyHoursPerDay || durationFromStudyTime(user?.onboarding?.studyTime));
        if (!goal || !["beginner", "intermediate", "advanced"].includes(currentLevel) || durationWeeks < 1 || durationWeeks > 52 || studyHoursPerDay <= 0 || studyHoursPerDay > 24) {
            return res.status(400).render("roadmaps/create", { onboarding: user?.onboarding || {}, error: "Enter valid roadmap details." });
        }
        const generated = await generateRoadmap({ goal, currentLevel, studyHoursPerDay, durationWeeks, learningStyle: user?.onboarding?.learningStyles?.join(", "), credentials: await getUserCredentials(req.session.userId) });
        const roadmap = await Roadmap.create({ user: req.session.userId, goal, currentLevel, studyHoursPerDay, durationWeeks, title: generated.title, description: generated.description, weeks: generated.weeks });
        res.redirect(`/roadmaps/${roadmap._id}`);
    } catch (error) {
        if (error.message.includes("AI")) return res.status(503).render("roadmaps/create", { onboarding: {}, error: error.message });
        next(error);
    }
};

export const showRoadmap = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (roadmap) res.render("roadmaps/show", { roadmap: roadmap.toObject() });
    } catch (error) { next(error); }
};

export const showTopic = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (!roadmap) return;
        const week = roadmap.weeks.find((item) => item.topics.id(req.params.topicId));
        const topic = week?.topics.id(req.params.topicId);
        if (!topic) return res.status(404).render("errors/not-found", { pageTitle: "Topic not found" });
        res.render("roadmaps/topic", { roadmap: roadmap.toObject(), week: week.toObject(), topic: topic.toObject() });
    } catch (error) { next(error); }
};

export const completeTopic = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (!roadmap) return;
        const week = roadmap.weeks.find((item) => item.topics.id(req.params.topicId));
        const topic = week?.topics.id(req.params.topicId);
        if (!topic) return res.status(404).json({ error: "Topic not found." });
        topic.completed = true;
        week.progress = Math.round((week.topics.filter((item) => item.completed).length / week.topics.length) * 100);
        week.completed = week.progress === 100;
        roadmap.completedTopics = roadmap.weeks.reduce((total, item) => total + item.topics.filter((entry) => entry.completed).length, 0);
        const totalTopics = roadmap.weeks.reduce((total, item) => total + item.topics.length, 0);
        roadmap.progress = totalTopics ? Math.round((roadmap.completedTopics / totalTopics) * 100) : 0;
        if (roadmap.progress === 100) roadmap.status = "completed";
        await roadmap.save();
        res.json({ progress: roadmap.progress, weekProgress: week.progress });
    } catch (error) { next(error); }
};

export const explainTopic = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (!roadmap) return;
        const topic = roadmap.weeks.flatMap((week) => week.topics).find((item) => item.id(req.body.topicId));
        if (!topic) return res.status(404).json({ error: "Topic not found." });
        const explanation = await generateTopicExplanation({ topic: topic.title, style: req.body.style || "simple", credentials: await getUserCredentials(req.session.userId) });
        topic.aiExplanation = explanation;
        await roadmap.save();
        res.json({ explanation });
    } catch (error) { next(error); }
};

export const quizTopic = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (!roadmap) return;
        const topic = roadmap.weeks.flatMap((week) => week.topics).find((item) => item.id(req.body.topicId));
        if (!topic) return res.status(404).json({ error: "Topic not found." });
        const quiz = await generateQuiz({ topic: topic.title, credentials: await getUserCredentials(req.session.userId) });
        topic.quizQuestions = quiz.questions;
        await roadmap.save();
        res.json({ questions: quiz.questions.map(({ answer, ...question }) => question) });
    } catch (error) { next(error); }
};

export const submitQuiz = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (!roadmap) return;
        const topic = roadmap.weeks.flatMap((week) => week.topics).find((item) => item.id(req.body.topicId));
        if (!topic) return res.status(404).json({ error: "Topic not found." });
        const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
        const questions = topic.quizQuestions || [];
        if (!questions.length || answers.length !== questions.length) return res.status(400).json({ error: "Submit an answer for every question." });
        const correct = questions.reduce((total, question, index) => total + (Number(answers[index]) === question.answer ? 1 : 0), 0);
        topic.quizScore = Math.round((correct / questions.length) * 100);
        await roadmap.save();
        res.json({ score: topic.quizScore, explanations: questions.map((question) => question.explanation) });
    } catch (error) { next(error); }
};

export const saveTopicNotes = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (!roadmap) return;
        const topic = roadmap.weeks.flatMap((week) => week.topics).find((item) => item.id(req.body.topicId));
        if (!topic) return res.status(404).json({ error: "Topic not found." });
        topic.notes = String(req.body.notes || "").slice(0, 5000);
        await roadmap.save();
        res.json({ saved: true });
    } catch (error) { next(error); }
};

export const replanRoadmap = async (req, res, next) => {
    try {
        const roadmap = await getOwnedRoadmap(req, res);
        if (!roadmap) return;
        const scores = roadmap.weeks.flatMap((week) => week.topics).map((topic) => topic.quizScore).filter((score) => score !== null && score !== undefined);
        const average = scores.length ? scores.reduce((total, score) => total + score, 0) / scores.length : 100;
        if (average >= 60) return res.json({ updated: false, message: "Your roadmap is on track." });
        roadmap.weeks = await updateRoadmap({ roadmap, credentials: await getUserCredentials(req.session.userId) });
        await roadmap.save();
        res.json({ updated: true, message: "Roadmap updated based on your progress." });
    } catch (error) { next(error); }
};

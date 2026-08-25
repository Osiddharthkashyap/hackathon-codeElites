import express from "express";
import { requireAuth } from "../middleware/authMiddlewares.js";
import { completeTopic, createRoadmap, explainTopic, listRoadmaps, quizTopic, showCreateRoadmap, showRoadmap, showTopic } from "../controllers/roadmapController.js";

const router = express.Router();
router.use(requireAuth);
router.get("/", listRoadmaps);
router.get("/create", showCreateRoadmap);
router.post("/", createRoadmap);
router.post("/api/:id/explanation", explainTopic);
router.post("/api/:id/quiz", quizTopic);
router.get("/:id/topic/:topicId", showTopic);
router.post("/:id/topic/:topicId/complete", completeTopic);
router.get("/:id", showRoadmap);
router.post("/:id/update", (req, res) => res.status(501).json({ error: "Replanning is not available yet." }));

export default router;

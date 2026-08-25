import express from "express";
import { requireAuth } from "../middleware/authMiddlewares.js";
import { saveAiSettings, showAiSettings } from "../controllers/settingsController.js";

const router = express.Router();
router.use(requireAuth);
router.get("/ai", showAiSettings);
router.post("/ai", saveAiSettings);

export default router;
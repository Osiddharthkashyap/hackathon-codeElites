import express from "express";

import {
    showRegister,
    register,
    showLogin,
    login,
    logout,
} from "../controllers/authController.js";

import {
    requireAuth,
    redirectIfAuthenticated,
} from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/register", redirectIfAuthenticated, showRegister);
router.post("/register", redirectIfAuthenticated, register);

router.get("/login", redirectIfAuthenticated, showLogin);
router.post("/login", redirectIfAuthenticated, login);

router.post("/logout", requireAuth, logout);

export default router;
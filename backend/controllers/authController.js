import bcrypt from "bcryptjs";
import User from "../models/User.js";

const normaliseEmail = (email = "") => email.trim().toLowerCase();
const userSession = (user) => ({
    id: user._id.toString(), name: user.name, email: user.email, role: user.role,
});

const establishSession = (req, user) => new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
        if (error) return reject(error);
        req.session.userId = user._id.toString();
        req.session.user = userSession(user);
        req.session.save((saveError) => saveError ? reject(saveError) : resolve());
    });
});

export const showRegister = (req, res) => {
    res.render("auth/register", {
        title: "Create Account",
        error: null,
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.render("auth/register", {
                title: "Create Account",
                error: "Please fill in all fields.",
            });
        }

        if (password !== confirmPassword) {
            return res.render("auth/register", {
                title: "Create Account",
                error: "Passwords do not match.",
            });
        }

        if (password.length < 6) {
            return res.render("auth/register", {
                title: "Create Account",
                error: "Password must be at least 6 characters.",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = normaliseEmail(email);
        if (!cleanName || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
            return res.render("auth/register", { title: "Create Account", error: "Enter a valid name and email address." });
        }
        const existingUser = await User.findOne({ email: cleanEmail });

        if (existingUser) {
            return res.render("auth/register", {
                title: "Create Account",
                error: "An account with this email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
        });

        await establishSession(req, user);

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Registration error:", error);

        res.render("auth/register", {
            title: "Create Account",
            error: "Something went wrong. Please try again.",
        });
    }
};

export const showLogin = (req, res) => {
    res.render("auth/login", {
        title: "Login",
        error: null,
    });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("auth/login", {
                title: "Login",
                error: "Please enter your email and password.",
            });
        }

        const user = await User.findOne({ email: normaliseEmail(email) }).select("+password");

        if (!user) {
            return res.render("auth/login", {
                title: "Login",
                error: "Invalid email or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.render("auth/login", {
                title: "Login",
                error: "Invalid email or password.",
            });
        }

        await establishSession(req, user);

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Login error:", error);

        res.render("auth/login", {
            title: "Login",
            error: "Something went wrong. Please try again.",
        });
    }
};

export const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.redirect("/dashboard");
        }

        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};

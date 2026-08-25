import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
        onboarding: {
            learningGoal: { type: String, trim: true, maxlength: 120 },
            customGoal: { type: String, trim: true, maxlength: 500 },
            experience: { type: String, enum: ["beginner", "intermediate", "advanced"] },
            studyTime: { type: String, trim: true, maxlength: 60 },
            learningStyles: [{ type: String, trim: true, maxlength: 40 }],
            target: { type: String, trim: true, maxlength: 120 },
            completedAt: Date,
        },
        aiCredentials: {
            provider: { type: String, enum: ["openai-compatible"], default: "openai-compatible" },
            baseUrl: { type: String, trim: true, maxlength: 300 },
            encryptedApiKey: { type: String, select: false },
            updatedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;

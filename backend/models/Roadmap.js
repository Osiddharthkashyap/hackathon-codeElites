import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 160 },
        url: { type: String, trim: true, maxlength: 500 },
        type: { type: String, trim: true, maxlength: 40 },
    },
    { _id: false }
);

const topicSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 160 },
        description: { type: String, trim: true, maxlength: 1000 },
        estimatedMinutes: { type: Number, min: 1, max: 1440, default: 30 },
        resources: { type: [resourceSchema], default: [] },
        quizScore: { type: Number, min: 0, max: 100, default: null },
        notes: { type: String, trim: true, maxlength: 5000, default: "" },
        aiExplanation: { type: String, trim: true, maxlength: 10000, default: "" },
        quizQuestions: {
            type: [{
                question: { type: String, required: true },
                options: { type: [String], required: true },
                answer: { type: Number, required: true, min: 0, max: 3 },
                explanation: { type: String, default: "" },
            }],
            select: false,
            default: [],
        },
        completed: { type: Boolean, default: false },
    },
    { _id: true }
);

const weekSchema = new mongoose.Schema(
    {
        weekNumber: { type: Number, required: true, min: 1 },
        title: { type: String, required: true, trim: true, maxlength: 160 },
        estimatedHours: { type: Number, required: true, min: 0.5, max: 168 },
        difficulty: { type: String, required: true, enum: ["beginner", "intermediate", "advanced"] },
        learningObjectives: { type: [String], default: [] },
        topics: { type: [topicSchema], default: [] },
        miniProject: { type: String, trim: true, maxlength: 1000 },
        completed: { type: Boolean, default: false },
        progress: { type: Number, min: 0, max: 100, default: 0 },
    },
    { _id: true }
);

const roadmapSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        goal: { type: String, required: true, trim: true, maxlength: 500 },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, trim: true, maxlength: 1000 },
        currentLevel: { type: String, required: true, enum: ["beginner", "intermediate", "advanced"] },
        studyHoursPerDay: { type: Number, required: true, min: 0.25, max: 24 },
        durationWeeks: { type: Number, required: true, min: 1, max: 52 },
        status: { type: String, enum: ["active", "completed", "paused"], default: "active" },
        progress: { type: Number, min: 0, max: 100, default: 0 },
        completedTopics: { type: Number, min: 0, default: 0 },
        weeks: { type: [weekSchema], default: [] },
    },
    { timestamps: true }
);

roadmapSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model("Roadmap", roadmapSchema);

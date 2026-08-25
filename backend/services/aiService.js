const endpoint = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";

const normaliseDifficulty = (value) => {
    const difficulty = String(value || "beginner").toLowerCase();
    return ["beginner", "intermediate", "advanced"].includes(difficulty) ? difficulty : "beginner";
};

const parseJson = (text) => {
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned);
};

const requestJson = async (prompt, credentials = {}) => {
    const apiKey = credentials.apiKey || process.env.AI_API_KEY;
    if (!apiKey) {
        throw new Error("AI roadmap generation is not configured yet.");
    }

    const response = await fetch(credentials.baseUrl || endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: process.env.AI_MODEL || "gpt-4o-mini",
            temperature: 0.2,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You create concise, practical learning plans. Return valid JSON only." },
                { role: "user", content: prompt },
            ],
        }),
        signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) throw new Error("The AI provider is unavailable.");
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("The AI provider returned an empty response.");
    return parseJson(content);
};

const validateRoadmap = (data) => {
    if (!data || typeof data.title !== "string" || !Array.isArray(data.weeks) || data.weeks.length === 0) {
        throw new Error("The AI returned an invalid roadmap.");
    }

    const weeks = data.weeks.map((week, index) => {
        if (!week || typeof week.title !== "string" || !Array.isArray(week.topics) || week.topics.length === 0) {
            throw new Error("The AI returned an incomplete roadmap.");
        }
        return {
            weekNumber: Number(week.week || week.weekNumber || index + 1),
            title: week.title,
            difficulty: normaliseDifficulty(week.difficulty),
            estimatedHours: Number(week.estimatedHours) || 4,
            learningObjectives: Array.isArray(week.learningObjectives) ? week.learningObjectives.slice(0, 8).map(String) : [],
            topics: week.topics.slice(0, 12).map((topic) => ({
                title: typeof topic === "string" ? topic : topic.title,
                description: typeof topic === "string" ? "" : String(topic.description || ""),
                estimatedMinutes: typeof topic === "string" ? 30 : Number(topic.estimatedMinutes) || 30,
                resources: Array.isArray(topic.resources) ? topic.resources.slice(0, 5) : [],
            })),
            miniProject: String(week.miniProject || "Review and apply this week's concepts."),
        };
    });

    return {
        title: data.title,
        description: String(data.description || "A personalized learning path built around your goals."),
        duration: Number(data.duration || weeks.length),
        weeks,
    };
};

export const generateRoadmap = async ({ goal, currentLevel, studyHoursPerDay, durationWeeks, learningStyle, credentials }) => {
    const prompt = `Generate structured JSON for a ${durationWeeks}-week roadmap for goal "${goal}". Learner level: ${currentLevel}. Daily study hours: ${studyHoursPerDay}. Preferred style: ${learningStyle || "mixed"}. Return {title,description,duration,weeks:[{week,title,difficulty,estimatedHours,learningObjectives:[string],topics:[{title,description,estimatedMinutes,resources:[{title,url,type}]}],miniProject,quizTopics:[string]}]}. Do not return markdown.`;

    let lastError;
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            return validateRoadmap(await requestJson(prompt, credentials));
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError;
};

export const updateRoadmap = async ({ roadmap, credentials }) => {
    const remainingWeeks = roadmap.weeks.filter((week) => !week.completed).length;
    if (!remainingWeeks) return roadmap.weeks;
    const generated = await generateRoadmap({
        goal: `${roadmap.goal}. Reinforce weak areas based on recent quiz performance.`,
        currentLevel: roadmap.currentLevel,
        studyHoursPerDay: roadmap.studyHoursPerDay,
        durationWeeks: remainingWeeks,
        credentials,
    });
    let nextWeek = roadmap.weeks.find((week) => !week.completed)?.weekNumber || 1;
    return [
        ...roadmap.weeks.filter((week) => week.completed),
        ...generated.weeks.map((week) => ({ ...week, weekNumber: nextWeek++ })),
    ];
};

export const generateTopicExplanation = async ({ topic, style = "simple", credentials }) => {
    const prompt = `Explain the learning topic "${topic}" in ${style} style. Return JSON exactly as {"explanation":"..."}. No markdown.`;
    const data = await requestJson(prompt, credentials);
    if (!data || typeof data.explanation !== "string" || !data.explanation.trim()) throw new Error("The AI returned an invalid explanation.");
    return data.explanation.trim();
};

export const generateQuiz = async ({ topic, credentials }) => {
    const prompt = `Create a short quiz about "${topic}". Return JSON exactly as {"questions":[{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"..."}]}. Include 3 questions and no markdown.`;
    const data = await requestJson(prompt, credentials);
    if (!data || !Array.isArray(data.questions) || data.questions.length === 0) throw new Error("The AI returned an invalid quiz.");
    return { questions: data.questions.slice(0, 10).map((question) => ({
        question: String(question.question),
        options: Array.isArray(question.options) ? question.options.slice(0, 4).map(String) : [],
        answer: Number(question.answer),
        explanation: String(question.explanation || ""),
    })) };
};

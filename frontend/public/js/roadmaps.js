const roadmapForm = document.querySelector("[data-roadmap-form]");
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
roadmapForm?.addEventListener("submit", () => {
    const button = roadmapForm.querySelector("button[type=submit]");
    const status = roadmapForm.querySelector("[data-roadmap-status]");
    if (button) button.disabled = true;
    if (status) status.hidden = false;
});

const explanationButton = document.querySelector("[data-explain-topic]");
explanationButton?.addEventListener("click", async () => {
    const output = document.querySelector("[data-ai-explanation]");
    explanationButton.disabled = true;
    explanationButton.textContent = "Generating explanation...";
    try {
        const response = await fetch("/api/roadmap/explanation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roadmapId: explanationButton.dataset.roadmapId, topicId: explanationButton.dataset.topicId, style: "simple" }) });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to generate explanation.");
        output.textContent = payload.explanation;
    } catch (error) { output.textContent = error.message; }
    explanationButton.disabled = false;
    explanationButton.textContent = "Explain with AI";
});

const completeButton = document.querySelector("[data-complete-topic]");
completeButton?.addEventListener("click", async () => {
    const status = document.querySelector("[data-topic-status]");
    completeButton.disabled = true;
    status.textContent = "Saving progress...";
    try {
        const response = await fetch(`/roadmaps/${completeButton.dataset.roadmapId}/topic/${completeButton.dataset.topicId}/complete`, { method: "POST" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to save progress.");
        status.textContent = `Topic complete. Roadmap progress: ${payload.progress}%.`;
        completeButton.textContent = "Completed";
    } catch (error) { status.textContent = error.message; completeButton.disabled = false; }
});

const notes = document.querySelector("[data-topic-notes]");
let notesTimer;
notes?.addEventListener("input", () => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(async () => {
        await fetch("/api/roadmap/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roadmapId: notes.dataset.roadmapId, topicId: notes.dataset.topicId, notes: notes.value }) });
    }, 500);
});

const quizButton = document.querySelector("[data-quiz-topic]");
quizButton?.addEventListener("click", async () => {
    const output = document.querySelector("[data-quiz-output]");
    quizButton.disabled = true;
    quizButton.textContent = "Generating quiz...";
    try {
        const response = await fetch("/api/roadmap/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roadmapId: quizButton.dataset.roadmapId, topicId: quizButton.dataset.topicId }) });
        const quiz = await response.json();
        if (!response.ok) throw new Error(quiz.error || "Unable to generate quiz.");
        output.innerHTML = `<form data-quiz-form>${quiz.questions.map((question, index) => `<fieldset><legend>${index + 1}. ${escapeHtml(question.question)}</legend>${question.options.map((option, optionIndex) => `<label><input type="radio" name="q${index}" value="${optionIndex}" required> ${escapeHtml(option)}</label>`).join("")}</fieldset>`).join("")}<button class="primary-button" type="submit">Submit quiz</button></form>`;
        output.querySelector("form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const answers = quiz.questions.map((_, index) => Number(new FormData(event.currentTarget).get(`q${index}`)));
            const result = await fetch("/api/roadmap/quiz/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roadmapId: quizButton.dataset.roadmapId, topicId: quizButton.dataset.topicId, answers }) });
            const payload = await result.json();
            output.insertAdjacentHTML("beforeend", `<p class="topic-status">${result.ok ? `Score: ${payload.score}%` : payload.error}</p>`);
        });
    } catch (error) { output.textContent = error.message; }
    quizButton.disabled = false;
    quizButton.textContent = "Generate quiz";
});

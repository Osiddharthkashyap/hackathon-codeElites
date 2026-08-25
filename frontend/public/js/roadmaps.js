const roadmapForm = document.querySelector("[data-roadmap-form]");
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

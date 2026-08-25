const goalForm = document.getElementById("goalForm");

const learningGoalSelect =
    document.getElementById("learningGoal");

const goalOptions =
    document.querySelectorAll(".goal-option");


goalOptions.forEach((goalOption) => {

    goalOption.addEventListener("click", () => {

        goalOptions.forEach((option) => {
            option.classList.remove("selected");
        });


        goalOption.classList.add("selected");


        const selectedGoal =
            goalOption.dataset.goal;


        const availableOptions =
            Array.from(learningGoalSelect.options);


        const matchingOption =
            availableOptions.find((option) =>
                option.text === selectedGoal
            );


        if (matchingOption) {

            learningGoalSelect.value =
                matchingOption.value;

        }

    });

});


goalForm?.addEventListener("submit", (event) => {

    event.preventDefault();


    const learningGoal =
        learningGoalSelect.value;


    const customGoal =
        document
            .getElementById("customGoal")
            .value
            .trim();


    if (!learningGoal && !customGoal) {

        alert(
            "Please choose or describe what you want to learn."
        );

        return;

    }


    /*
        Temporary UI-only storage.

        We will later replace this with
        database-backed onboarding data.
    */

    const onboardingData = {
        learningGoal,
        customGoal
    };


    localStorage.setItem(
        "learnFlowOnboarding",
        JSON.stringify(onboardingData)
    );


    // Next onboarding screen.
    window.location.href = "/onboarding/experience";

});

const experienceForm =
    document.getElementById("experienceForm");


const experienceOptions =
    document.querySelectorAll(".experience-option");


let selectedExperience = "beginner";


experienceOptions.forEach((option) => {

    option.addEventListener("click", () => {

        experienceOptions.forEach((experienceOption) => {

            experienceOption.classList.remove(
                "selected"
            );

        });


        option.classList.add("selected");


        selectedExperience =
            option.dataset.level;

    });

});


experienceForm?.addEventListener("submit", (event) => {

    event.preventDefault();


    const savedData =
        JSON.parse(
            localStorage.getItem(
                "learnFlowOnboarding"
            )
        ) || {};


    const updatedData = {
        ...savedData,
        experience: selectedExperience
    };


    localStorage.setItem(
        "learnFlowOnboarding",
        JSON.stringify(updatedData)
    );


    window.location.href =
        "/onboarding/preferences";

});

/* =========================================
   ONBOARDING STEP 3 - PREFERENCES
========================================= */

const preferencesForm =
    document.getElementById("preferencesForm");


const timeOptions =
    document.querySelectorAll(".time-option");


const learningStyleOptions =
    document.querySelectorAll(".learning-style-option");


let selectedStudyTime = "30-60 minutes";


timeOptions.forEach((option) => {

    option.addEventListener("click", () => {

        timeOptions.forEach((timeOption) => {

            timeOption.classList.remove(
                "selected"
            );

        });


        option.classList.add("selected");


        selectedStudyTime =
            option.dataset.time;

    });

});


learningStyleOptions.forEach((option) => {

    option.addEventListener("click", () => {

        option.classList.toggle("selected");

    });

});


preferencesForm?.addEventListener("submit", (event) => {

    event.preventDefault();


    const selectedLearningStyles =
        Array.from(
            document.querySelectorAll(
                ".learning-style-option.selected"
            )
        ).map((option) => {

            return option.dataset.style;

        });


    const selectedTarget =
        document.querySelector(
            'input[name="target"]:checked'
        );


    const savedData =
        JSON.parse(
            localStorage.getItem(
                "learnFlowOnboarding"
            )
        ) || {};


    const completeOnboardingData = {

        ...savedData,

        studyTime: selectedStudyTime,

        learningStyles: selectedLearningStyles,

        target:
            selectedTarget?.value || ""

    };


    fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(completeOnboardingData),
    })
        .then(async (response) => {
            if (response.ok) {
                localStorage.removeItem("learnFlowOnboarding");
                window.location.href = "/roadmap/generating";
                return;
            }
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || "We could not save your preferences.");
        })
        .catch((error) => alert(error.message));

});

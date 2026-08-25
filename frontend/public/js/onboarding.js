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
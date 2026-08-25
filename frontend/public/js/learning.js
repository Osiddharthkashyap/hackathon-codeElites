/* =========================================
   LEARNING PAGE
========================================= */

const practiceEditor =
    document.getElementById("practiceEditor");


const runPracticeButton =
    document.getElementById("runPracticeButton");


const practiceOutput =
    document.getElementById("practiceOutput");


runPracticeButton?.addEventListener(
    "click",
    () => {

        const code =
            practiceEditor?.value.trim();


        if (!code) {

            practiceOutput.textContent =
                "Write some HTML first.";

            return;

        }


        /*
         * Demo-only rendering.
         *
         * Later this should use a sandboxed
         * preview rather than directly inserting
         * arbitrary user HTML.
         */

        practiceOutput.innerHTML =
            code;

    }
);


/* =========================================
   COPY CODE
========================================= */

const copyCodeButton =
    document.querySelector(
        ".copy-code-button"
    );


copyCodeButton?.addEventListener(
    "click",
    async () => {

        const code =
            document.querySelector(
                ".code-example code"
            )?.textContent;


        if (!code) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                code
            );


            copyCodeButton.textContent =
                "Copied!";


            setTimeout(() => {

                copyCodeButton.textContent =
                    "Copy";

            }, 1500);

        } catch (error) {

            console.error(
                "Unable to copy code:",
                error
            );

        }

    }
);


/* =========================================
   COMPLETE LESSON
========================================= */

const completeLessonButton =
    document.getElementById(
        "completeLessonButton"
    );


completeLessonButton?.addEventListener(
    "click",
    () => {

        completeLessonButton.disabled =
            true;


        completeLessonButton.innerHTML =
            "Completed ✓";


        completeLessonButton.style.opacity =
            "0.7";


        /*
         * Temporary client-side progress.
         *
         * Later this will become an API request
         * that saves progress to MongoDB.
         */

        const progressData = {

            completedLessons: [
                "html-fundamentals"
            ],

            progress: 16

        };


        localStorage.setItem(
            "learnFlowProgress",
            JSON.stringify(progressData)
        );


        setTimeout(() => {

            window.location.href =
                "/quiz";

        }, 800);

    }
);
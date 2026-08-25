const quizForm =
    document.getElementById("quizForm");


const questionCards =
    document.querySelectorAll(
        ".quiz-question-card"
    );


const previousButton =
    document.getElementById(
        "previousQuestionButton"
    );


const nextButton =
    document.getElementById(
        "nextQuestionButton"
    );


const submitButton =
    document.getElementById(
        "submitQuizButton"
    );


const questionCounter =
    document.getElementById(
        "questionCounter"
    );


const progressPercentage =
    document.getElementById(
        "progressPercentage"
    );


const progressBar =
    document.getElementById(
        "quizProgressBar"
    );


const answeredCount =
    document.getElementById(
        "answeredCount"
    );


let currentQuestion = 0;


const totalQuestions =
    window.learnFlowQuiz?.totalQuestions ||
    questionCards.length;


/* =========================================
   INITIAL STATE
========================================= */

questionCards.forEach(
    (card, index) => {

        card.style.display =
            index === 0
                ? "block"
                : "none";

    }
);


updateQuizUI();


/* =========================================
   SHOW QUESTION
========================================= */

function showQuestion(index) {

    if (
        index < 0 ||
        index >= totalQuestions
    ) {
        return;
    }


    currentQuestion = index;


    questionCards.forEach(
        (card, cardIndex) => {

            card.style.display =
                cardIndex === currentQuestion
                    ? "block"
                    : "none";

        }
    );


    updateQuizUI();

}


/* =========================================
   UPDATE UI
========================================= */

function updateQuizUI() {

    const currentNumber =
        currentQuestion + 1;


    const percentage =
        Math.round(
            (currentNumber / totalQuestions) * 100
        );


    questionCounter.textContent =
        `Question ${currentNumber} of ${totalQuestions}`;


    progressPercentage.textContent =
        `${percentage}%`;


    progressBar.style.width =
        `${percentage}%`;


    previousButton.disabled =
        currentQuestion === 0;


    if (
        currentQuestion ===
        totalQuestions - 1
    ) {

        nextButton.style.display =
            "none";

        submitButton.style.display =
            "inline-flex";

    } else {

        nextButton.style.display =
            "inline-flex";

        submitButton.style.display =
            "none";

    }


    updateAnsweredCount();

}


/* =========================================
   NEXT
========================================= */

nextButton?.addEventListener(
    "click",
    () => {

        const currentCard =
            questionCards[currentQuestion];


        const selectedAnswer =
            currentCard.querySelector(
                "input[type='radio']:checked"
            );


        if (!selectedAnswer) {

            currentCard.classList.add(
                "quiz-question-warning"
            );


            setTimeout(() => {

                currentCard.classList.remove(
                    "quiz-question-warning"
                );

            }, 700);


            return;

        }


        showQuestion(
            currentQuestion + 1
        );

    }
);


/* =========================================
   PREVIOUS
========================================= */

previousButton?.addEventListener(
    "click",
    () => {

        showQuestion(
            currentQuestion - 1
        );

    }
);


/* =========================================
   ANSWERS
========================================= */

quizForm?.addEventListener(
    "change",
    () => {

        updateAnsweredCount();

    }
);


function updateAnsweredCount() {

    const answered =
        document.querySelectorAll(
            ".quiz-option input:checked"
        ).length;


    answeredCount.textContent =
        `${answered} answered`;

}


/* =========================================
   SUBMIT
========================================= */

quizForm?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const answered =
            document.querySelectorAll(
                ".quiz-option input:checked"
            ).length;


        if (
            answered < totalQuestions
        ) {

            const remaining =
                totalQuestions - answered;


            answeredCount.textContent =
                `${remaining} question${
                    remaining === 1
                        ? ""
                        : "s"
                } remaining`;


            return;

        }


        const answers = {};


        questionCards.forEach(
            (card, index) => {

                const selected =
                    card.querySelector(
                        "input[type='radio']:checked"
                    );


                if (selected) {

                    answers[index] =
                        selected.value;

                }

            }
        );


        /*
         * Temporary client-side storage.
         *
         * Later this becomes:
         *
         * POST /api/quiz/submit
         *
         * and the backend calculates the
         * score and stores the attempt.
         */

        localStorage.setItem(
            "learnFlowQuizAnswers",
            JSON.stringify(answers)
        );


        submitButton.disabled =
            true;


        submitButton.innerHTML =
            "Submitting...";


        setTimeout(() => {

            window.location.href =
                "/results";

        }, 700);

    }
);
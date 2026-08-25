/* =========================================
   ROADMAP GENERATION
========================================= */

const progressBar =
    document.getElementById("generatingProgressBar");

const progressText =
    document.getElementById("generatingProgressText");


const statusProfile =
    document.getElementById("statusProfile");

const statusRoadmap =
    document.getElementById("statusRoadmap");

const statusResources =
    document.getElementById("statusResources");


if (progressBar && progressText) {

    let progress = 0;


    const generationInterval =
        setInterval(() => {

            progress += 5;


            if (progress > 100) {
                progress = 100;
            }


            progressBar.style.width =
                `${progress}%`;

            progressText.textContent =
                `${progress}%`;


            if (progress >= 35) {

                statusProfile?.classList.add(
                    "active"
                );

                statusRoadmap?.classList.add(
                    "active"
                );

            }


            if (progress >= 70) {

                statusResources?.classList.add(
                    "active"
                );

            }


            if (progress >= 100) {

                clearInterval(
                    generationInterval
                );


                setTimeout(() => {

                    window.location.href =
                        "/roadmap";

                }, 700);

            }

        }, 120);

}


/* =========================================
   ROADMAP INTERACTIONS
========================================= */

const phaseButtons =
    document.querySelectorAll(
        ".phase-expand-button"
    );


phaseButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const isExpanded =
            button.dataset.expanded === "true";


        button.dataset.expanded =
            String(!isExpanded);


        button.querySelector("span").textContent =
            isExpanded ? "↓" : "↑";

    });

});


const startLearningButton =
    document.getElementById(
        "startLearningButton"
    );


startLearningButton?.addEventListener(
    "click",
    () => {

        window.location.href =
            "/learning";

    }
);
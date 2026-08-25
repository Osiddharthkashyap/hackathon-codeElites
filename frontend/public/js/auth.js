const passwordToggleButtons = document.querySelectorAll(
    "[data-password-toggle]"
);


passwordToggleButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const passwordWrapper =
            button.closest(".password-input-wrapper");

        const passwordInput =
            passwordWrapper.querySelector("input");


        const isVisible =
            passwordInput.type === "text";


        passwordInput.type = isVisible
            ? "password"
            : "text";


        button.textContent = isVisible
            ? "Show"
            : "Hide";

    });

});


const registerForm =
    document.getElementById("registerForm");


registerForm?.addEventListener("submit", (event) => {

    event.preventDefault();


    const password =
        document.getElementById("password").value;


    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }


    // Temporary navigation.
    // Backend authentication will be added later.

    window.location.href = "/onboarding";

});


const loginForm =
    document.getElementById("loginForm");


loginForm?.addEventListener("submit", (event) => {

    event.preventDefault();


    // Temporary navigation.
    // Backend authentication will be added later.

    window.location.href = "/onboarding";

});
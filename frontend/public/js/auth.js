const passwordToggleButtons = document.querySelectorAll(
    "[data-password-toggle]"
);


passwordToggleButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const passwordWrapper =
            button.closest(".password-input-wrapper");

        if (!passwordWrapper) {
            return;
        }

        const passwordInput =
            passwordWrapper.querySelector("input");

        if (!passwordInput) {
            return;
        }


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
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");

    if (!passwordField || !confirmPasswordField) {
        return;
    }

    const password = passwordField.value;


    const confirmPassword =
        confirmPasswordField.value;


    if (password !== confirmPassword) {

        event.preventDefault();

        alert("Passwords do not match.");

        return;

    }
});

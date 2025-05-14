document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const signupForm = document.getElementById("signup-form");
    const signinForm = document.getElementById("signin-form");
    
    // Password toggle elements
    const toggleSignupPassword = document.getElementById("toggleSignupPassword");
    const signupPassword = document.getElementById("signupPassword");
    const toggleSigninPassword = document.getElementById("toggleSigninPassword");
    const signinPassword = document.getElementById("signinPassword");

    // Ensure "Keep me signed in" checkbox is NOT required
    const keepSignedInCheckbox = signinForm.querySelector('input[name="keep-signed-in"]');
    if (keepSignedInCheckbox) {
        keepSignedInCheckbox.removeAttribute("required");
    }

    // Tab switching functionality
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs
            document.querySelector(".tab.active")?.classList.remove("active");
            // Add active class to clicked tab
            tab.classList.add("active");
            
            // Show the appropriate form
            const formToShow = tab.dataset.form;
            if (formToShow === "signup") {
                signupForm.classList.remove("hidden");
                signinForm.classList.add("hidden");
            } else {
                signinForm.classList.remove("hidden");
                signupForm.classList.add("hidden");
            }
        });
    });

    // Toggle signup password visibility
    toggleSignupPassword?.addEventListener("click", () => {
        signupPassword.type = signupPassword.type === "password" ? "text" : "password";
    });
    
    // Toggle signin password visibility
    toggleSigninPassword?.addEventListener("click", () => {
        signinPassword.type = signinPassword.type === "password" ? "text" : "password";
    });

    // Gmail validation function
    function validateGmail(email) {
        return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());
    }

    // Sign up form validation
    signupForm.addEventListener("submit", (event) => {
        const emailInput = signupForm.querySelector('input[name="email"]');
        if (!validateGmail(emailInput.value)) {
            event.preventDefault();
            alert("Please enter a valid @gmail.com email address.");
            emailInput.focus();
        }
    });

    // Sign in form validation
    signinForm.addEventListener("submit", (event) => {
        const emailInput = signinForm.querySelector('input[name="username"]');
        // Only validate as email if it contains an @ symbol
        if (emailInput.value.includes('@') && !validateGmail(emailInput.value)) {
            event.preventDefault();
            alert("Please enter a valid @gmail.com email address.");
            emailInput.focus();
        }
    });
});
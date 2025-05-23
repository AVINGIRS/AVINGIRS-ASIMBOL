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

    // Create notification styles
    const notificationStyles = `
        .success-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: rgba(255, 255, 255, 0.95);
            color: #432818;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(67, 40, 24, 0.15);
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(67, 40, 24, 0.1);
            text-align: center;
            min-width: 280px;
            font-family: 'Nunito Sans', sans-serif;
        }
        
        .success-notification.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .success-notification .icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            display: block;
            color: #432818;
            animation: fadeIn 0.4s ease-in-out;
        }
        
        .success-notification h3 {
            margin: 0 0 0.3rem 0;
            font-size: 1rem;
            font-weight: 600;
            color: #432818;
        }
        
        .success-notification p {
            margin: 0;
            font-size: 0.85rem;
            line-height: 1.4;
            color: #432818;
            opacity: 0.8;
        }
        
        @keyframes fadeIn {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @media (max-width: 480px) {
            .success-notification {
                padding: 0.8rem 1.2rem;
                min-width: 240px;
                margin: 0 20px;
            }
            
            .success-notification .icon {
                font-size: 1.3rem;
            }
            
            .success-notification h3 {
                font-size: 0.9rem;
            }
            
            .success-notification p {
                font-size: 0.8rem;
            }
        }
    `;

    // Inject styles into the document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);

    // Function to show success notification
    function showSuccessNotification(title = "Account Created!", message = "Welcome aboard! You're ready to get started.") {        
        // Create notification
        const notification = document.createElement("div");
        notification.className = "success-notification";
        notification.innerHTML = `
            <span class="icon">✓</span>
            <h3>${title}</h3>
            <p>${message}</p>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add("show");
        });
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 3000);
    }

    // Function to hide notification
    function hideNotification(notification) {
        notification.classList.remove("show");
        
        setTimeout(() => {
            notification.remove();
        }, 300);
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

    // Sign up form validation and success handling
    signupForm.addEventListener("submit", (event) => {
        const emailInput = signupForm.querySelector('input[name="email"]');
        
        if (!validateGmail(emailInput.value)) {
            event.preventDefault();
            alert("Please enter a valid @gmail.com email address.");
            emailInput.focus();
            return;
        }
        
        // Prevent default form submission for demo
        event.preventDefault();
        
        // Simulate successful account creation
        // In a real application, this would happen after successful API response
        setTimeout(() => {
            showSuccessNotification(
                "Account Created!",
                `Welcome ${emailInput.value.split('@')[0]}! You're all set.`
            );
            
            // Reset form after success
            signupForm.reset();
        }, 500);
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
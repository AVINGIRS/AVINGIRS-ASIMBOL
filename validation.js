document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');

    // Create success popup
    const successPopup = document.createElement('div');
    successPopup.className = 'success-popup';
    successPopup.style.display = 'none';
    successPopup.style.position = 'fixed';
    successPopup.style.top = '50%';
    successPopup.style.left = '50%';
    successPopup.style.transform = 'translate(-50%, -50%)';
    successPopup.style.backgroundColor = '#FEFAE0';
    successPopup.style.color = '#3b2a20';
    successPopup.style.padding = '25px 40px';
    successPopup.style.borderRadius = '6px';
    successPopup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    successPopup.style.zIndex = '1000';
    successPopup.style.textAlign = 'center';
    successPopup.style.fontFamily = "'Maven Pro', sans-serif";
    successPopup.style.border = '1px solid #D4A373';
    successPopup.style.maxWidth = '90%';
    successPopup.style.minWidth = '300px';
    successPopup.style.animation = 'fadeIn 0.3s ease-out forwards';

    // Add animation keyframes
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes fadeIn {
            0% { opacity: 0; transform: translate(-50%, -55%); }
            100% { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes fadeOut {
            0% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -55%); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Create message text
    const message = document.createElement('div');
    message.innerHTML = '<h3 style="margin:0;padding:0;font-size:20px;font-weight:500;color:#3b2a20;">Thanks for Contacting Us!</h3>';
    message.style.padding = '0';
    
    // Add decorative element
    const decorativeLine = document.createElement('div');
    decorativeLine.style.width = '40px';
    decorativeLine.style.height = '3px';
    decorativeLine.style.backgroundColor = '#D4A373';
    decorativeLine.style.margin = '12px auto 0';
    decorativeLine.style.borderRadius = '2px';

    // Add message and decorative line to popup
    successPopup.appendChild(message);
    successPopup.appendChild(decorativeLine);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(59, 42, 32, 0.4)';
    overlay.style.zIndex = '999';
    overlay.style.display = 'none';
    overlay.style.backdropFilter = 'blur(2px)';

    // Add popup and overlay to document body
    document.body.appendChild(overlay);
    document.body.appendChild(successPopup);

    // Fix for nav links interference with form submission
    const navLinks = document.querySelectorAll('.nav-links a');

    // Properly handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow the default anchor behavior but prevent event issues
            e.stopPropagation();
        });
    });

    // Create notification element with improved design
    const notification = document.createElement('div');
    notification.className = 'email-notification';
    notification.style.display = 'none';
    notification.style.backgroundColor = '#f8f9fa';
    notification.style.color = '#5a5a5a';
    notification.style.padding = '12px 15px';
    notification.style.marginTop = '8px';
    notification.style.marginBottom = '8px';
    notification.style.borderRadius = '4px';
    notification.style.fontSize = '14px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    notification.style.border = '1px solid #e9ecef';
    notification.style.position = 'absolute';
    notification.style.width = 'calc(100% - 2px)';
    notification.style.zIndex = '100';
    notification.style.transition = 'opacity 0.2s ease-in-out';
    
    // Create a container for the notification to maintain layout
    const notificationContainer = document.createElement('div');
    notificationContainer.style.position = 'relative';
    notificationContainer.style.width = '100%';
    
    // Insert notification container after email input
    const emailInput = document.getElementById('email');
    emailInput.parentNode.insertBefore(notificationContainer, emailInput.nextSibling);
    notificationContainer.appendChild(notification);

    // Email validation on form submission
    contactForm.addEventListener('submit', function(event) {
        // Get the email input value
        const email = emailInput.value;
        
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        
        // Get the domain part of the email (after the @ symbol)
        const domain = email.split('@')[1]?.toLowerCase();
        
        // List of allowed email domains
        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'];
        
        // Check if email is valid and uses an allowed domain
        if (!emailRegex.test(email) || !domain || !allowedDomains.includes(domain)) {
            // Prevent form submission only if invalid
            event.preventDefault();
            
            // Add error styling to the email input
            emailInput.style.borderColor = 'red';
            
            // Show notification with example and allowed domains in cleaner format
            notification.innerHTML = '<div style="display:flex;align-items:center;margin-bottom:8px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a5a5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span style="margin-left:8px;font-weight:500;">Please use a valid email domain</span></div>' +
            '<span style="display:block;margin-bottom:5px;">Example: <strong>yourname@gmail.com</strong></span>' +
            '<span style="display:block;font-size:12px;color:#6c757d;">Accepted domains: gmail.com, yahoo.com, outlook.com, hotmail.com, icloud.com, aol.com, protonmail.com, mail.com</span>';
            notification.style.display = 'block';
            notification.style.opacity = '1';
            
            // Focus on the email input
            emailInput.focus();
        } else {
            // Valid email submitted - show success popup
            event.preventDefault(); // Prevent actual form submission for demo purposes
            
            notification.style.display = 'none';
            
            // Show popup and overlay
            overlay.style.display = 'block';
            successPopup.style.display = 'block';
            
            // Hide popup after 3 seconds
            setTimeout(function() {
                successPopup.style.animation = 'fadeOut 0.3s ease-in forwards';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                
                setTimeout(function() {
                    successPopup.style.display = 'none';
                    overlay.style.display = 'none';
                    overlay.style.opacity = '1';
                    successPopup.style.animation = 'fadeIn 0.3s ease-out forwards';
                    contactForm.reset();
                }, 300);
            }, 3000);
        }
    });

    // Remove red border and hide notification when user starts typing again
    emailInput.addEventListener('input', function() {
        this.style.borderColor = '';
        notification.style.opacity = '0';
        setTimeout(function() {
            notification.style.display = 'none';
        }, 200);
    });
    
    // Add click handler to close popup if user clicks overlay
    overlay.addEventListener('click', function() {
        successPopup.style.animation = 'fadeOut 0.3s ease-in forwards';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        
        setTimeout(function() {
            successPopup.style.display = 'none';
            overlay.style.display = 'none';
            overlay.style.opacity = '1';
            successPopup.style.animation = 'fadeIn 0.3s ease-out forwards';
        }, 300);
    });
});
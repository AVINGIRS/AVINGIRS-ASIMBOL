document.addEventListener('DOMContentLoaded', function () {
    loadCart();
    setupThankYouModal();
    setupContactForm();
    removeContactSpacing();
});

// === CART LOGIC ===
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal-amount');
    const checkoutBtn = document.getElementById('checkout-btn');

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-cart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <p>Your cart is empty</p>
                <a href="menu.html" class="empty-cart-link">Browse Menu</a>
            </div>`;
        subtotalElement.textContent = '₱0';
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const template = document.getElementById('cart-item-template');
        const clone = document.importNode(template.content, true);

        clone.querySelector('.item-image').src = item.image || 'img/default-product.png';
        clone.querySelector('.item-image').alt = item.name;
        clone.querySelector('.item-name').textContent = item.name;
        clone.querySelector('.item-description').textContent = item.description || '';
        clone.querySelector('.item-price').textContent = `₱${item.price}`;
        clone.querySelector('.quantity-value').textContent = item.quantity;

        const itemTotal = item.price * item.quantity;
        clone.querySelector('.item-total').textContent = `₱${itemTotal}`;
        subtotal += itemTotal;

        clone.querySelector('.remove-btn').addEventListener('click', () => removeItem(index));
        clone.querySelector('.decrease-btn').addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCart(cart);
            }
        });
        clone.querySelector('.increase-btn').addEventListener('click', () => {
            item.quantity++;
            updateCart(cart);
        });

        cartItemsContainer.appendChild(clone);
    });

    subtotalElement.textContent = `₱${subtotal}`;
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
    cart.splice(index, 1);
    updateCart(cart);
}

function updateCart(cart) {
    localStorage.setItem('cafeCart', JSON.stringify(cart));
    loadCart();
}

// === THANK YOU MODAL ===
function setupThankYouModal() {
    const modal = document.createElement('div');
    modal.className = 'thank-you-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="checkmark-container">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <h2>Thank you for your order!</h2>
            <p>Please proceed to your payment.</p>
            <button class="close-modal-btn">PAYMENT</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal-btn').addEventListener('click', function () {
        modal.classList.remove('show');
        // Store cart data for payment page and redirect
        const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        localStorage.setItem('paymentCart', JSON.stringify(cart));
        window.location.href = 'payment.html';
    });
    
    // Set up checkout button with empty cart check
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        
        if (cart.length === 0) {
            showEmptyCartWarning();
        } else {
            document.querySelector('.thank-you-modal').classList.add('show');
        }
    });
}

// Function to show empty cart warning
function showEmptyCartWarning() {
    const warningModal = document.createElement('div');
    warningModal.className = 'empty-cart-warning-modal';
    warningModal.innerHTML = `
        <div class="warning-modal-content">
            <div class="warning-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h3>Empty Cart</h3>
            <p>Please add items to your cart before checking out.</p>
            <button class="close-warning-btn">OK</button>
        </div>
    `;
    
    // Add styles for the warning modal
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .empty-cart-warning-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(59, 42, 32, 0.4);
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(2px);
        }
        
        .warning-modal-content {
            background-color: #FEFAE0;
            color: #3b2a20;
            padding: 25px 40px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            text-align: center;
            font-family: 'Maven Pro', sans-serif;
            border: 1px solid #3b2a20;
            max-width: 90%;
            min-width: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: fadeIn 0.3s ease-out forwards;
        }
        
        .warning-icon {
            margin: 0 auto 15px;
        }
        
        .close-warning-btn {
            background-color: #3b2a20;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 20px;
            margin-top: 15px;
            cursor: pointer;
            font-family: 'Maven Pro', sans-serif;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .close-warning-btn:hover {
            background-color:rgb(141, 106, 85);
        }
        
        .empty-cart-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
            background-color: #FEFAE0;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            border: 1px dashed #D4A373;
        }
        
        .empty-cart-icon {
            margin-bottom: 15px;
        }
        
        .empty-cart-message p {
            color: #3b2a20;
            font-size: 18px;
            margin-bottom: 15px;
        }
        
        .empty-cart-link {
            display: inline-block;
            background-color: #D4A373;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .empty-cart-link:hover {
            background-color: #c69c6d;
        }
    `;
    document.head.appendChild(styleSheet);
    document.body.appendChild(warningModal);
    
    warningModal.querySelector('.close-warning-btn').addEventListener('click', function() {
        warningModal.remove();
    });
}

// Remove extra spacing below Contact section
function removeContactSpacing() {
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
        contactSection.style.marginBottom = '0';
    }
}

// === CONTACT FORM ===
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    const successPopup = createSuccessPopup();
    const overlay = createOverlay();
    const notification = createEmailNotification();
    const emailInput = document.getElementById('email');

    // Insert notification
    const notificationContainer = document.createElement('div');
    notificationContainer.style.position = 'relative';
    notificationContainer.style.width = '100%';
    emailInput.parentNode.insertBefore(notificationContainer, emailInput.nextSibling);
    notificationContainer.appendChild(notification);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
    });

    contactForm.addEventListener('submit', function (event) {
        const email = emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const domain = email.split('@')[1]?.toLowerCase();
        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'];

        if (!emailRegex.test(email) || !domain || !allowedDomains.includes(domain)) {
            event.preventDefault();
            emailInput.style.borderColor = 'red';
            notification.innerHTML = `
                <div style="display:flex;align-items:center;margin-bottom:8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a5a5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span style="margin-left:8px;font-weight:500;">Please use a valid email domain</span>
                </div>
                <span style="display:block;margin-bottom:5px;">Example: <strong>yourname@gmail.com</strong></span>
                <span style="display:block;font-size:12px;color:#6c757d;">Accepted domains: ${allowedDomains.join(', ')}</span>
            `;
            notification.style.display = 'block';
            notification.style.opacity = '1';
            emailInput.focus();
        } else {
            event.preventDefault();
            notification.style.display = 'none';
            overlay.style.display = 'block';
            successPopup.style.display = 'block';

            setTimeout(() => {
                successPopup.style.animation = 'fadeOut 0.3s ease-in forwards';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';

                setTimeout(() => {
                    successPopup.style.display = 'none';
                    overlay.style.display = 'none';
                    overlay.style.opacity = '1';
                    successPopup.style.animation = 'fadeIn 0.3s ease-out forwards';
                    contactForm.reset();
                }, 300);
            }, 3000);
        }
    });

    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 200);
    });

    overlay.addEventListener('click', () => {
        successPopup.style.animation = 'fadeOut 0.3s ease-in forwards';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            successPopup.style.display = 'none';
            overlay.style.display = 'none';
            overlay.style.opacity = '1';
            successPopup.style.animation = 'fadeIn 0.3s ease-out forwards';
        }, 300);
    });
}

function createSuccessPopup() {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.style.cssText = `
        display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background-color: #FEFAE0; color: #3b2a20; padding: 25px 40px; border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; text-align: center;
        font-family: 'Maven Pro', sans-serif; border: 1px solid #D4A373;
        max-width: 90%; min-width: 300px; animation: fadeIn 0.3s ease-out forwards;
    `;
    popup.innerHTML = `
        <h3 style="margin:0;padding:0;font-size:20px;font-weight:500;">Thanks for Contacting Us!</h3>
        <div style="width:40px;height:3px;background:#D4A373;margin:12px auto 0;border-radius:2px;"></div>
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn { 0% { opacity: 0; transform: translate(-50%, -55%); } 100% { opacity: 1; transform: translate(-50%, -50%); } }
        @keyframes fadeOut { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(-50%, -55%); } }
    `;
    document.head.appendChild(styleSheet);
    document.body.appendChild(popup);
    return popup;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(59, 42, 32, 0.4); z-index: 999; display: none;
        backdrop-filter: blur(2px);
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function createEmailNotification() {
    const note = document.createElement('div');
    note.className = 'email-notification';
    note.style.cssText = `
        display: none; background-color: #f8f9fa; color: #5a5a5a; padding: 12px 15px;
        margin: 8px 0; border-radius: 4px; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        border: 1px solid #e9ecef; position: absolute; width: calc(100% - 2px); z-index: 100;
        transition: opacity 0.2s ease-in-out;
    `;
    return note;
}
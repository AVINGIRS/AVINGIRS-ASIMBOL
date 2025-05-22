document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    setupPaymentForm();
    initializePaymentOptions();
    setupFormValidation();
});

function initializePaymentOptions() {
    // Set initial state - GCash is selected by default, so show its details
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.classList.remove('hidden');
}

function setupFormValidation() {
    // Add real-time validation for phone number
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            validatePhoneNumber(e.target);
        });
        
        phoneInput.addEventListener('blur', function(e) {
            validatePhoneNumber(e.target);
        });
    }
    
    // Add validation for postal code
    const postalCodeInput = document.querySelector('input[name="postalCode"]');
    if (postalCodeInput) {
        postalCodeInput.addEventListener('input', function(e) {
            validatePostalCode(e.target);
        });
        
        postalCodeInput.addEventListener('blur', function(e) {
            validatePostalCode(e.target);
        });
    }
    
    // Add validation for city
    const cityInput = document.querySelector('input[name="city"]');
    if (cityInput) {
        cityInput.addEventListener('input', function(e) {
            validateCity(e.target);
        });
        
        cityInput.addEventListener('blur', function(e) {
            validateCity(e.target);
        });
    }
    
    // Add validation for required text fields
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        // Skip fields that have their own specific validation
        if (!['phone', 'postalCode', 'city'].includes(input.name)) {
            input.addEventListener('input', function(e) {
                validateTextField(e.target);
            });
            
            input.addEventListener('blur', function(e) {
                validateTextField(e.target);
            });
        }
    });
}

// List of major Philippine cities (case-insensitive validation)
const philippineCities = [
    'quezon city', 'manila', 'caloocan', 'davao', 'cebu city', 'zamboanga city',
    'antipolo', 'pasig', 'taguig', 'valenzuela', 'marikina', 'muntinlupa',
    'las piñas', 'parañaque', 'makati', 'mandaluyong', 'san juan', 'pasay',
    'malabon', 'navotas', 'pateros', 'iloilo city', 'general santos',
    'bacolod', 'olongapo', 'tacloban', 'dagupan', 'naga', 'ormoc',
    'santiago', 'tuguegarao', 'tabuk', 'malaybalay', 'iligan', 'butuan',
    'cabanatuan', 'san fernando', 'malolos', 'meycauayan', 'san jose del monte',
    'bacoor', 'imus', 'dasmariñas', 'general trias', 'silang', 'carmona',
    'cavite city', 'tagaytay', 'trece martires', 'kawit', 'noveleta',
    'rosario', 'tanza', 'naic', 'maragondon', 'ternate', 'magallanes',
    'alfonso', 'mendez', 'indang', 'gen. aguinaldo', 'amadeo',
    'lipa', 'batangas city', 'tanauan', 'santo tomas', 'calamba', 'biñan',
    'santa rosa', 'cabuyao', 'san pedro', 'los baños', 'bay', 'alaminos',
    'san pablo', 'calauan', 'majayjay', 'magdalena', 'paete', 'kalayaan',
    'lumban', 'cavinti', 'pagsanjan', 'santa cruz', 'pila', 'victoria',
    'rizal', 'nagcarlan', 'liliw', 'san antonio', 'dolores', 'mabitac',
    'famy', 'siniloan', 'pangil', 'pakil', 'santa maria', 'longos',
    'bagac', 'hermosa', 'dinalupihan', 'abucay', 'samal', 'orani',
    'balanga', 'pilar', 'orion', 'limay', 'mariveles', 'morong',
    'baguio', 'la trinidad', 'itogon', 'sablan', 'tuba', 'tublay',
    'kapangan', 'atok', 'buguias', 'kabayan', 'bakun', 'mankayan',
    'bauang', 'naguilian', 'bagulin', 'burgos', 'caba',
    'luna', 'sudipen', 'san gabriel', 'bacnotan', 'balaoan', 'bangar',
    'santol', 'rosario', 'pugo', 'tubao',
    'agoo', 'aringay', 'damortis', 'sto. tomas',
    'angeles', 'mabalacat', 'mexico', 'santa rita',
    'bacolor', 'guagua', 'lubao', 'sasmuan', 'floridablanca', 'porac',
    'arayat', 'candaba', 'san luis', 'san simon', 'apalit', 'macabebe',
    'masantol', 'minalin'
];

function validateCity(input) {
    const cityValue = input.value.trim().toLowerCase();
    const errorElement = getOrCreateErrorElement(input);
    
    if (cityValue === '') {
        showError(input, errorElement, 'City is required');
        return false;
    }
    
    // Check if the city is in the Philippine cities list (case-insensitive)
    const isValidCity = philippineCities.some(city => {
        const cityLower = city.toLowerCase();
        return cityLower === cityValue || 
               cityValue.includes(cityLower) || 
               cityLower.includes(cityValue);
    });
    
    if (!isValidCity) {
        showError(input, errorElement, 'Please enter a valid Philippine city');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validatePhoneNumber(input) {
    const phoneValue = input.value.trim();
    const errorElement = getOrCreateErrorElement(input);
    
    if (phoneValue === '') {
        showError(input, errorElement, 'Phone number is required');
        return false;
    }
    
    // Philippine mobile number patterns
    const philippinePatterns = [
        /^(09)\d{9}$/,           // 09XXXXXXXXX
        /^(\+639)\d{9}$/,        // +639XXXXXXXXX
        /^(639)\d{9}$/,          // 639XXXXXXXXX
        /^(9)\d{9}$/             // 9XXXXXXXXX
    ];
    
    // Check if it matches any Philippine pattern
    const isValid = philippinePatterns.some(pattern => pattern.test(phoneValue));
    
    if (!isValid) {
        showError(input, errorElement, 'Please enter a valid Philippine mobile number (09xxxxxxxxx, +639xxxxxxxxx, or 639xxxxxxxxx)');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validatePostalCode(input) {
    const postalValue = input.value.trim();
    const errorElement = getOrCreateErrorElement(input);
    
    if (postalValue === '') {
        showError(input, errorElement, 'Postal code is required');
        return false;
    }
    
    // Philippine postal code validation - exactly 4 digits
    const philippinePostalPattern = /^\d{4}$/;
    
    if (!philippinePostalPattern.test(postalValue)) {
        showError(input, errorElement, 'Please enter a valid Philippine postal code (4 digits)');
        return false;
    }
    
    // Additional validation for Philippine postal code ranges
    const postalNum = parseInt(postalValue);
    
    // Philippine postal codes range from 0001 to 9999, but let's be more specific
    // Most Philippine postal codes are between 1000-9999
    if (postalNum < 1000 || postalNum > 9999) {
        showError(input, errorElement, 'Please enter a valid Philippine postal code (1000-9999)');
        return false;
    }
    
    showSuccess(input, errorElement);
    return true;
}

function validateTextField(input) {
    const value = input.value.trim();
    const errorElement = getOrCreateErrorElement(input);
    const fieldName = input.getAttribute('name');
    
    // Check if field is required
    if (input.hasAttribute('required') || ['firstName', 'lastName', 'address'].includes(fieldName)) {
        if (value === '') {
            const fieldLabel = getFieldLabel(fieldName);
            showError(input, errorElement, `${fieldLabel} is required`);
            return false;
        }
        
        // Validate minimum length for address
        if (fieldName === 'address' && value.length < 10) {
            showError(input, errorElement, 'Please provide a complete address (minimum 10 characters)');
            return false;
        }
        
        // Validate name fields (only letters, spaces, and common punctuation)
        if (['firstName', 'lastName'].includes(fieldName)) {
            const namePattern = /^[a-zA-Z\s\-\.\']+$/;
            if (!namePattern.test(value)) {
                showError(input, errorElement, 'Please enter a valid name (letters only)');
                return false;
            }
            
            // Check minimum length for names
            if (value.length < 2) {
                showError(input, errorElement, 'Name must be at least 2 characters long');
                return false;
            }
        }
    }
    
    showSuccess(input, errorElement);
    return true;
}

function getFieldLabel(fieldName) {
    const labels = {
        'firstName': 'First name',
        'lastName': 'Last name', 
        'address': 'Complete address',
        'apartment': 'Apartment/Unit',
        'postalCode': 'Postal code',
        'city': 'City',
        'phone': 'Phone number'
    };
    return labels[fieldName] || fieldName;
}

function getOrCreateErrorElement(input) {
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 12px;
            margin-top: 4px;
            display: none;
        `;
        input.parentNode.appendChild(errorElement);
    }
    return errorElement;
}

function showError(input, errorElement, message) {
    input.style.borderColor = '#dc3545';
    input.style.backgroundColor = '#fff5f5';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Remove success styling if it exists
    input.classList.remove('valid');
    input.classList.add('invalid');
}

function showSuccess(input, errorElement) {
    input.style.borderColor = '#28a745';
    input.style.backgroundColor = '#f8fff8';
    errorElement.style.display = 'none';
    
    // Add success class and remove error class
    input.classList.remove('invalid');
    input.classList.add('valid');
}

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('paymentCart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    const totalAmountElement = document.getElementById('total-amount');
    
    // If no cart data, keep the sample data from HTML
    if (cart.length === 0) {
        return;
    }
    
    // Clear existing items and load from cart
    orderItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image || '/api/placeholder/60/60'}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">₱${itemTotal}</div>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
    
    totalAmountElement.textContent = `₱${total}`;
}

function selectPayment(paymentType) {
    // Remove selected class from all options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.currentTarget.classList.add('selected');
    
    // Check the radio button
    document.getElementById(paymentType).checked = true;
    
    // Get payment details container
    const paymentDetails = document.getElementById('payment-details');
    
    if (paymentType === 'gcash') {
        // Show GCash details with slide down animation
        paymentDetails.innerHTML = `
            <div class="payment-info gcash-info">
                <p>Kindly wait for the QR code or Gcash number that will be sent to your contact number indicated in your order form.</p>
                <ol>
                    <li>Upon receiving QR code, proceed to the Gcash app > Send Money > Input Gcash number or scan the QR code and enter the total order amount.</li>
                    <li>Please provide the screenshot of the proof of payment to the Meows & Brews representative.</li>
                </ol>
                <div class="note">
                    <strong>NOTE: YOUR ORDER IS PROCESSED ONCE PROOF OF PAYMENT IS CONFIRMED.</strong>
                </div>
            </div>
        `;
        
        paymentDetails.classList.remove('hidden');
    } else if (paymentType === 'cod') {
        // Hide payment details for COD with slide up animation
        paymentDetails.classList.add('hidden');
        
        // After animation completes, update content
        setTimeout(() => {
            paymentDetails.innerHTML = `
                <div class="payment-info cod-info">
                    <p><strong>Cash on Delivery (COD)</strong></p>
                    <p>You will pay when your order is delivered to your address.</p>
                    <p><strong>Please note:</strong></p>
                    <ul>
                        <li>Have exact change ready for faster transaction</li>
                        <li>COD orders are confirmed upon delivery</li>
                        <li>Make sure someone is available to receive the order</li>
                    </ul>
                </div>
            `;
        }, 300);
    }
}

function setupPaymentForm() {
    const form = document.getElementById('payment-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        const validationResults = [];
        
        // Validate phone number
        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) {
            validationResults.push(validatePhoneNumber(phoneInput));
        }
        
        // Validate postal code
        const postalInput = form.querySelector('input[name="postalCode"]');
        if (postalInput) {
            validationResults.push(validatePostalCode(postalInput));
        }
        
        // Validate city
        const cityInput = form.querySelector('input[name="city"]');
        if (cityInput) {
            validationResults.push(validateCity(cityInput));
        }
        
        // Validate text fields
        const textInputs = form.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            if (!['phone', 'postalCode', 'city'].includes(input.name)) {
                validationResults.push(validateTextField(input));
            }
        });
        
        // Check if all validations passed
        isValid = validationResults.every(result => result === true);
        
        if (!isValid) {
            // Scroll to first error
            const firstError = form.querySelector('.error-message[style*="block"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Show general error message
            showNotification('Please correct the errors in the form before submitting.', 'error');
            return;
        }
        
        // Check payment method selection
        const paymentMethod = form.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            showNotification('Please select a payment method.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const orderData = {
            billingInfo: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                address: formData.get('address'),
                apartment: formData.get('apartment') || '',
                postalCode: formData.get('postalCode'),
                city: formData.get('city'),
                phone: formData.get('phone')
            },
            paymentMethod: formData.get('payment'),
            items: JSON.parse(localStorage.getItem('paymentCart')) || [],
            orderDate: new Date().toISOString(),
            orderId: generateOrderId()
        };
        
        // Store order data
        localStorage.setItem('completedOrder', JSON.stringify(orderData));
        
        // Clear payment cart
        localStorage.removeItem('paymentCart');
        localStorage.removeItem('cafeCart');
        
        // Show success message
        showOrderConfirmation(orderData.orderId);
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const isError = type === 'error';
    const bgColor = isError ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' : 'linear-gradient(135deg, #28a745, #20c997)';
    const icon = isError ? 
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' :
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="flex-shrink: 0;">${icon}</div>
        <div>${message}</div>
        <button onclick="this.parentElement.remove()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-left: auto;
            flex-shrink: 0;
            font-size: 16px;
            transition: background 0.2s;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
    `;
    
    // Add animation keyframes to document if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 6 seconds with slide out animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 6000);
}

function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `MB${timestamp}${random}`.slice(-10);
}

function showOrderConfirmation(orderId) {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, -apple-system, sans-serif;
        animation: fadeIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div class="confirmation-content" style="
            background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
            border-radius: 24px;
            padding: 48px 40px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 480px;
            width: 90%;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: slideUp 0.4s ease-out;
        ">
            <div class="success-icon" style="
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #28a745, #20c997);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
                animation: bounceIn 0.6s ease-out 0.2s both;
            ">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                </svg>
            </div>
            
            <h2 style="
                color: #2c3e50;
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 16px;
                letter-spacing: -0.5px;
            ">Order Confirmed! 🎉</h2>
            
            <p style="
                color: #6c757d;
                font-size: 18px;
                margin: 0 0 24px;
                line-height: 1.5;
            ">Your delicious order has been successfully placed and is now being prepared with love!</p>
            
            <div style="
                background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
                border-radius: 16px;
                padding: 20px;
                margin: 24px 0;
                border: 2px solid rgba(139, 69, 19, 0.1);
            ">
                <p style="
                    color: #5d4037;
                    font-size: 14px;
                    margin: 0 0 8px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">Order ID</p>
                <p style="
                    font-size: 24px;
                    font-weight: 700;
                    color: #8b4513;
                    margin: 0;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 2px;
                ">${orderId}</p>
            </div>
            
            <p style="
                color: #6c757d;
                font-size: 14px;
                margin: 0 0 32px;
                line-height: 1.6;
            ">Please save this Order ID for tracking your delicious treats. We'll notify you once your order is ready for pickup or delivery! ☕🐱</p>
            
            <button class="ok-btn" onclick="goToHome()" style="
                background: linear-gradient(135deg, #8b4513, #a0522d);
                color: white;
                border: none;
                padding: 16px 40px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
                text-transform: uppercase;
                letter-spacing: 1px;
            " onmouseover="
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.4)';
            " onmouseout="
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.3)';
            ">Continue Shopping</button>
        </div>
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes bounceIn {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

function goBack() {
    window.history.back();
}

function goToHome() {
    // Remove modal and restore scrolling
    const modal = document.querySelector('.confirmation-modal');
    if (modal) {
        modal.remove();
    }
    document.body.style.overflow = 'auto';
    
    // Redirect to home page
    window.location.href = 'index.html'; // Change to your home page URL
}
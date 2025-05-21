document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Create and append the modal to the body
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
            <p>We're preparing your delicious items.</p>
            <button class="close-modal-btn">Continue</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listener to close the modal
    document.querySelector('.close-modal-btn').addEventListener('click', function() {
        document.querySelector('.thank-you-modal').classList.remove('show');
        localStorage.removeItem('cafeCart');
        loadCart();
    });
});

function loadCart() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal-amount');
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    // If cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        subtotalElement.textContent = '₱0';
        return;
    }
    
    let subtotal = 0;
    
    // Add each item to the cart
    cart.forEach((item, index) => {
        const template = document.getElementById('cart-item-template');
        const clone = document.importNode(template.content, true);
        
        // Set item details
        clone.querySelector('.item-image').src = item.image || 'img/default-product.png';
        clone.querySelector('.item-image').alt = item.name;
        clone.querySelector('.item-name').textContent = item.name;
        clone.querySelector('.item-description').textContent = item.description || '';
        clone.querySelector('.item-price').textContent = `₱${item.price}`;
        clone.querySelector('.quantity-value').textContent = item.quantity;
        
        const itemTotal = item.price * item.quantity;
        clone.querySelector('.item-total').textContent = `₱${itemTotal}`;
        
        // Add to subtotal
        subtotal += itemTotal;
        
        // Setup remove button
        const removeBtn = clone.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => removeItem(index));
        
        // Setup quantity buttons
        const decreaseBtn = clone.querySelector('.decrease-btn');
        const increaseBtn = clone.querySelector('.increase-btn');
        const quantityValue = clone.querySelector('.quantity-value');
        
        decreaseBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                quantityValue.textContent = item.quantity;
                updateCart(cart);
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            item.quantity++;
            quantityValue.textContent = item.quantity;
            updateCart(cart);
        });
        
        // Add item to container
        cartItemsContainer.appendChild(clone);
    });
    
    // Update subtotal
    subtotalElement.textContent = `₱${subtotal}`;
    
    // Setup checkout button with animated modal
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        document.querySelector('.thank-you-modal').classList.add('show');
    });
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


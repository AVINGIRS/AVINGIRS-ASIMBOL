document.addEventListener('DOMContentLoaded', function () {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const categoryId = tab.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });

    // Setup shopping cart functionality
    setupCartFunctionality();

    // Update cart icon counter
    updateCartCounter();

    // Setup search functionality
    setupSearch();
});

function setupCartFunctionality() {
    const addButtons = document.querySelectorAll('.add-btn');
    const cartNotification = document.getElementById('cart-notification');

    addButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const card = this.closest('.card');
            const name = card.querySelector('.product-name').textContent;
            const price = parseInt(card.querySelector('.price').textContent.replace('₱', ''));
            const image = card.querySelector('.product-img').src;

            // Get existing cart or create new one
            const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];

            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.name === name);

            if (existingItemIndex > -1) {
                // Item exists, increase quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item
                cart.push({
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1,
                    description: getProductDescription(name)
                });
            }

            // Save cart
            localStorage.setItem('cafeCart', JSON.stringify(cart));

            // Show notification
            cartNotification.querySelector('.item-name').textContent = name;
            cartNotification.classList.remove('hide');
            cartNotification.classList.add('show');

            // Hide notification after 3 seconds
            setTimeout(() => {
                cartNotification.classList.remove('show');
                cartNotification.classList.add('hide');
            }, 3000);

            // Update cart counter
            updateCartCounter();
        });
    });
}

function getProductDescription(productName) {
    const descriptions = {
        'Tabby Cream': 'Chilled espresso and milk, lightly bold and perfectly balanced.',
        'Americato': 'Bold espresso poured over ice with water',
        'Spawnish Latte': 'Espresso with steamed milk and a touch of cinnamon',
        'Caramel Meowchiato': 'Espresso with caramel and milk topped with whipped cream',
        'Salty Whiskers': 'Espresso with sweet cream and a hint of sea salt',
        'Purr-fect Espresso': 'Our signature espresso blend, rich and bold'
        // Add more descriptions as needed
    };

    return descriptions[productName] || '';
}

function updateCartCounter() {
    const cartIcon = document.querySelector('.cart-icon');
    const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    if (document.querySelector('.cart-count')) {
        document.querySelector('.cart-count').textContent = totalItems;
    } else if (totalItems > 0) {
        const counter = document.createElement('span');
        counter.className = 'cart-count';
        counter.textContent = totalItems;
        cartIcon.parentNode.appendChild(counter);
    }
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const productCards = document.querySelectorAll('.card');

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            card.style.display = productName.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

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

// Search functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const itemName = card.querySelector('.product-name').textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Add to cart with position-fixed notification
const addBtns = document.querySelectorAll('.add-btn');
const notification = document.getElementById('cart-notification');

addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const itemName = card.querySelector('.product-name').textContent;

        // Update notification text
        document.querySelector('.item-name').textContent = itemName;

        // Show notification with animation
        notification.classList.remove('hide');
        notification.classList.add('show');

        // Hide notification after 3 seconds with fade out
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
        }, 3000);
    });
});

// Function to get the current cart from localStorage
function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

// Function to save the cart to localStorage
function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Function to update the cart count in the header to show TOTAL item quantity
function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // Calculate the total quantity of all items in the cart
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalQuantity;
    }
}

// Function to display a temporary notification
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.warn("Notification container not found. Message:", message);
        return;
    }

    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'}; /* Green for success, Red for error */
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        margin-bottom: 10px;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    notificationContainer.appendChild(notification);

    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10); // Small delay to allow reflow and transition

    // Fade out and remove after a few seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.addEventListener('transitionend', () => {
            notification.remove();
        }, { once: true }); // Ensure listener is removed after first use
    }, 3000); // Notification visible for 3 seconds
}


// Function to add item to cart
// `redirect` parameter determines if the user is redirected to cart.html after adding
function addToCart(productName, productPrice, productImage, redirect = false) {
    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.name === productName);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage, // Include image path
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    if (redirect) {
        window.location.href = 'cart.html'; // Redirect to cart page
    } else {
        showNotification(`${productName} added to cart!`); // Show notification for 'Add to Cart' button
    }
}


// Event listeners for product cards
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Update cart count on page load

    // Add to cart buttons (existing functionality)
    const addToCartButtons = document.querySelectorAll('.product-card .add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productName = productCard.dataset.name;
            const productPrice = parseFloat(productCard.dataset.price); // Ensure price is a number
            const productImage = productCard.dataset.image; // Get image path
            addToCart(productName, productPrice, productImage, false); // Don't redirect for 'Add to Cart'
        });
    });

    // Shop Now buttons (new functionality: add to cart and redirect)
    const shopNowButtons = document.querySelectorAll('.product-card .shop-now');
    shopNowButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productName = productCard.dataset.name;
            const productPrice = parseFloat(productCard.dataset.price); // Ensure price is a number
            const productImage = productCard.dataset.image; // Get image path
            addToCart(productName, productPrice, productImage, true); // Redirect for 'Shop Now'
        });
    });

    // Search functionality (assuming there's a search input and button on index/catalog)
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const productCards = document.querySelectorAll('.product-grid .product-card');

    if (searchButton && searchInput && productCards.length > 0) {
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase();
            productCards.forEach(card => {
                const productNameElement = card.querySelector('h4');
                if (productNameElement) {
                    const productName = productNameElement.textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        card.style.display = 'block'; // Show matching cards
                    } else {
                        card.style.display = 'none';  // Hide non-matching cards
                    }
                }
            });
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Newsletter Subscription functionality
    const subscribeButton = document.getElementById('subscribe-button');
    const newsletterEmailInput = document.getElementById('newsletter-email');

    if (subscribeButton && newsletterEmailInput) {
        subscribeButton.addEventListener('click', () => {
            const email = newsletterEmailInput.value.trim();
            if (email && email.includes('@') && email.includes('.')) {
                showNotification(`Thank you for subscribing, ${email}!`);
                newsletterEmailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});

function getProductImage(productName) {
    const imageMap = {
        'Espresso': 'images/espresso.jpg',
        'Cappuccino': 'images/Cappuccino.webp',
        'Latte': 'images/latte.jpg',
        'Americano': 'images/americano.webp',
        'Mocha': 'images/mocha.jpg',
        'Tea': 'images/tea.jpg',
        'Croissant': 'images/croissants.webp',
        'Muffin': 'images/Muffins.webp',
        'Smoothie': 'images/Smoothie.jpg'
    };
    
    const imagePath = imageMap[productName];
    if (imagePath) {
        return `<img src="${imagePath}" alt="${productName}" class="img-fluid" style="height: 200px; object-fit: cover; width: 100%;">`;
    }
    
    return `
        <div class="bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
            <i class="bi bi-image text-muted fs-1"></i>
        </div>
    `;
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('loggedInUser');
    
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userInfo').classList.remove('d-none');
        document.getElementById('guestActions').classList.add('d-none');
        document.getElementById('username').textContent = username;
    } else {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

function loadFavouriteItems() {
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    const favouriteSection = document.getElementById('favouriteSection');
    const favouriteItemsContainer = document.getElementById('favouriteItems');
    
    if (favourites.length === 0) {
        favouriteSection.classList.add('d-none');
        return;
    }
    
    favouriteSection.classList.remove('d-none');
    favouriteItemsContainer.innerHTML = '';
    
    favourites.forEach((item, index) => {
        const favouriteItem = document.createElement('div');
        favouriteItem.className = 'col-md-3 mb-3';
        favouriteItem.innerHTML = `
            <div class="card h-100">
                ${getProductImage(item.name)}
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${item.name}</h6>
                    <p class="card-text text-muted mb-2">$${item.price}</p>
                    <div class="mt-auto text-center">
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromFavourites(${index})">
                            <i class="bi bi-heart-fill text-danger"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        favouriteItemsContainer.appendChild(favouriteItem);
    });
}

function removeFromFavourites(index) {
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    favourites.splice(index, 1);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    loadFavouriteItems();
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCart.classList.remove('d-none');
        cartSummary.classList.add('d-none');
        updateCartCount();
        return;
    }
    
    emptyCart.classList.add('d-none');
    cartSummary.classList.remove('d-none');
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'col-md-4 mb-3';
        cartItem.innerHTML = `
            <div class="card">
                ${getProductImage(item.name)}
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text-muted mb-1">Price: $${item.price}</p>
                    <p class="card-text text-muted mb-1">Quantity: ${item.quantity}</p>
                    <p class="card-text text-muted mb-3">Total: $${item.price * item.quantity}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${index})">-</button>
                            <span class="px-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${index})">+</button>
                        </div>
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})">
                            <i class="bi bi-trash text-danger me-1"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    document.getElementById('totalPrice').textContent = `$${total}`;
    updateCartCount();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

function increaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

function decreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadCartItems();
    loadFavouriteItems();
});

const CART_KEY = 'cart';
const FAV_KEY = 'favourites';

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function getFavourites() {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}
function setFavourites(list) {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
}
function getProductInfoFromCard(card) {
    return {
        name: card.querySelector('.card-title').textContent,
        price: parseInt(card.querySelector('.fs-4').textContent.replace('$', '')),
        category: card.querySelector('.card-text').textContent
    };
}
function isSameProduct(a, b) {
    return a.name === b.name && a.price === b.price && a.category === b.category;
}
function updateCartUI() {
    updateCartCount();
    updateCartDropdown();
    updateButtonStates();
}

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('loggedInUser');
    
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userInfo').classList.remove('d-none');
        document.getElementById('guestActions').classList.add('d-none');
        document.getElementById('username').textContent = username;
    } else {
        document.getElementById('userInfo').classList.add('d-none');
        document.getElementById('guestActions').classList.remove('d-none');
    }
}


function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('cart');
    localStorage.removeItem('favourites');
    window.location.reload();
}


function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}


function updateCartDropdown() {
    const cart = getCart();
    const cartDropdownItems = document.getElementById('cartDropdownItems');
    
    if (cart.length === 0) {
        cartDropdownItems.innerHTML = '<li class="px-3 py-2 text-muted text-center">Your cart is empty</li>';
        return;
    }
    
    cartDropdownItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const totalPrice = item.price * item.quantity;
        
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            <div class="px-3 py-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">${item.name}</div>
                        <div class="text-muted small">$${totalPrice}</div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${index})">-</button>
                        <span class="px-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${index})">+</button>
                    </div>
                </div>
            </div>
        `;
        
        cartDropdownItems.appendChild(cartItem);
    });
}

function increaseQuantity(index) {
    const cart = getCart();
    cart[index].quantity += 1;
    setCart(cart);
    updateCartUI();
}

function decreaseQuantity(index) {
    const cart = getCart();
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    setCart(cart);
    updateCartUI();
}

function showCartDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = 'block';
    
    if (window.hideTimeout) {
        clearTimeout(window.hideTimeout);
        window.hideTimeout = null;
    }
}

function hideCartDropdown() {
    window.hideTimeout = setTimeout(() => {
        const dropdown = document.querySelector('.dropdown-menu');
        dropdown.style.display = 'none';
    }, 200);
}

function updateButtonStates() {
    const cart = getCart();
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    cartButtons.forEach(button => {
        const productCard = button.closest('.card');
        const productName = productCard.querySelector('.card-title').textContent;
        const productPrice = parseInt(productCard.querySelector('.fs-4').textContent.replace('$', ''));
        const productCategory = productCard.querySelector('.card-text').textContent;
        
        const isInCart = cart.some(item => 
            item.name === productName && item.price === productPrice && item.category === productCategory
        );
        
        if (isInCart) {
            button.textContent = 'Remove from Cart';
            button.style.backgroundColor = 'red';
            button.style.color = 'white';
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');
        } else {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
            button.style.color = '';
            button.classList.remove('btn-danger');
            button.classList.add('btn-primary');
        }
    });
}

function updateFavouriteStates() {
    const favourites = getFavourites();
    const favouriteButtons = document.querySelectorAll('.favorite-btn');
    
    favouriteButtons.forEach(button => {
        const productCard = button.closest('.card');
        const productName = productCard.querySelector('.card-title').textContent;
        const productPrice = parseInt(productCard.querySelector('.fs-4').textContent.replace('$', ''));
        const productCategory = productCard.querySelector('.card-text').textContent;
        
        const isFavourite = favourites.some(item => 
            item.name === productName && item.price === productPrice && item.category === productCategory
        );
        
        const icon = button.querySelector('i');
        if (isFavourite) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            button.style.color = 'red';
        } else {
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            button.style.color = 'gray';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    checkLoginStatus();
    
    updateCartCount();
    
    updateCartDropdown();
    
    updateButtonStates();
    
    updateFavouriteStates();
    
    var searchBox = document.querySelector('input[placeholder="Search..."]');
    var searchDropdown = document.querySelector('select');
    var allProducts = document.querySelectorAll('.card');
    
    // Search function
    function performSearch() {
        var searchWord = searchBox.value.toLowerCase();
        var searchType = searchDropdown.value;
        
        if (searchWord === '') {
            for (var i = 0; i < allProducts.length; i++) {
                allProducts[i].style.display = 'block';
            }
            return;
        }
        
        for (var i = 0; i < allProducts.length; i++) {
            var product = allProducts[i];
            var productName = product.querySelector('.card-title').textContent.toLowerCase();
            var productCategory = product.querySelector('.card-text').textContent.toLowerCase();
            
            var shouldShow = false;
            
            if (searchType === 'Search by Item Name') {
                shouldShow = productName.includes(searchWord);
            } else if (searchType === 'Search by Category') {
                shouldShow = productCategory.includes(searchWord);
            }
            
            if (shouldShow) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        }
    }
    
    // Search event listeners
    searchBox.addEventListener('input', performSearch);
    
    searchDropdown.addEventListener('change', performSearch);
   
    

    
    // Favorite buttons
    var hearts = document.querySelectorAll('.favorite-btn');
    for (var i = 0; i < hearts.length; i++) {
        hearts[i].onclick = function() {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn !== 'true') {
                window.location.href = 'login.html';
                return;
            }
            
            const productCard = this.closest('.card');
            const p = getProductInfoFromCard(productCard);
            
            var icon = this.querySelector('i');
            if (icon.classList.contains('bi-heart')) {
                const favourites = getFavourites();
                favourites.push(p);
                setFavourites(favourites);
                
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                this.style.color = 'red';
            } else {
                const favourites = getFavourites();
                const updatedFavourites = favourites.filter(item => !isSameProduct(item, p));
                setFavourites(updatedFavourites);
                
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                this.style.color = 'gray';
            }
        };
    }
    
    // Add to cart buttons
    var cartButtons = document.querySelectorAll('.add-to-cart-btn');
    for (var i = 0; i < cartButtons.length; i++) {
        cartButtons[i].onclick = function() {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn !== 'true') {
                window.location.href = 'login.html';
                return;
            }
            
            const productCard = this.closest('.card');
            const p = getProductInfoFromCard(productCard);
            
            if (this.textContent === 'Remove from Cart') {
                const cart = getCart();
                const itemIndex = cart.findIndex(item => isSameProduct(item, p));
                
                if (itemIndex !== -1) {
                    cart.splice(itemIndex, 1);
                }
                
                setCart(cart);
                updateCartUI();
            } else {
                const cart = getCart();
                
                const existingItemIndex = cart.findIndex(item => isSameProduct(item, p));
                
                if (existingItemIndex !== -1) {
                    cart[existingItemIndex].quantity += 1;
                } else {
                    cart.push({
                        name: p.name,
                        price: p.price,
                        category: p.category,
                        quantity: 1
                    });
                }
                
                setCart(cart);
                updateCartUI();
                
                this.textContent = 'Remove from Cart';
                this.classList.remove('btn-primary');
                this.classList.add('btn-danger');
            }
        };
    }


});

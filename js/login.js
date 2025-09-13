document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        
        const username = email.split('@')[0];
        localStorage.setItem('loggedInUser', username);
        localStorage.setItem('isLoggedIn', 'true');
        
        window.location.href = 'index.html';
    });
});

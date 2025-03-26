// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Check if user is logged in on page load
    checkAuthStatus();

    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
});

// Check if user is logged in
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    const authSection = document.getElementById('auth-section');
    const userProfile = document.getElementById('user-profile');
    const usernameDisplay = document.getElementById('username-display');

    if (user) {
        // User is logged in
        if (authSection) authSection.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            if (usernameDisplay) usernameDisplay.textContent = JSON.parse(user).username;
        }
    } else {
        // User is not logged in
        if (authSection) authSection.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    checkAuthStatus();
    window.location.href = 'index.html';
}


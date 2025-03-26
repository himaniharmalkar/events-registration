document.addEventListener('DOMContentLoaded', function() {
    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!username || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Check if username already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(user => user.username === username);
            
            if (existingUser) {
                alert('Username already exists. Please choose another one.');
                return;
            }
            
            // Create new user
            const newUser = {
                username,
                email,
                password // In a real app, you should hash this password
            };
            
            // Save to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            // Simple validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Check credentials
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(user => user.username === username && user.password === password);
            
            if (user) {
                // Store logged in user (don't include password in session)
                const loggedInUser = {
                    username: user.username,
                    email: user.email
                };
                
                localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
                
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }
});

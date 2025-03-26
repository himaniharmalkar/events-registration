document.addEventListener('DOMContentLoaded', function() {
    // Get event details from localStorage
    const eventDetailsString = localStorage.getItem('selectedEvent');
    
    if (!eventDetailsString) {
        // If no event details found, redirect to events page
        window.location.href = 'index.html';
        return;
    }
    
    const eventDetails = JSON.parse(eventDetailsString);
    
    // Populate the event details page with the event information
    document.getElementById('event-title').textContent = eventDetails.title;
    document.getElementById('event-image').src = eventDetails.image;
    document.getElementById('event-image').alt = eventDetails.title;
    document.getElementById('event-date').textContent = eventDetails.date;
    document.getElementById('event-location').textContent = eventDetails.location;
    document.getElementById('event-description').textContent = eventDetails.description;
    
    // Set page title
    document.title = `${eventDetails.title} - EventHub`;
    
    // Handle registration button click
    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', function() {
        // Check if user is logged in before showing registration form
        if (isUserLoggedIn()) {
            showRegistrationForm(eventDetails);
        } else {
            // Directly redirect to login page
            window.location.href = 'login.html';
        }
    });
    
    // Only check if registered when user is logged in
    if (isUserLoggedIn()) {
        checkIfRegistered(eventDetails.id);
    }
});

// Function to check if user is logged in
function isUserLoggedIn() {
    // Check if user data exists in localStorage or session
    const userData = localStorage.getItem('currentUser');
    return !!userData; // Returns true if userData exists, false otherwise
}

// Function to check if already registered
function checkIfRegistered(eventId) {
    const registrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        return; // Not logged in, so can't be registered
    }
    
    // Check if this event is already in registrations for the current user
    const isRegistered = registrations.some(reg => 
        reg.eventId === eventId && 
        (reg.userId === currentUser.id || reg.attendeeEmail === currentUser.email)
    );
    
    if (isRegistered) {
        // Update register button to show already registered
        updateRegisterButton();
    }
}

// Function to show registration form
function showRegistrationForm(eventDetails) {
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create form HTML with pre-filled user data
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>Register for ${eventDetails.title}</h2>
            <button class="close-modal">&times;</button>
        </div>
        <form id="registration-form">
            <div class="form-group">
                <label for="reg-name">Your Username</label>
                <input type="text" id="reg-name" name="name" value="${currentUser?.username || ''}" required>
            </div>
            <div class="form-group">
                <label for="reg-email">Email Address</label>
                <input type="email" id="reg-email" name="email" value="${currentUser?.email || ''}" required>
            </div>
            <button type="submit" class="submit-registration">Complete Registration</button>
        </form>
    `;
    
    // Append modal to body
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Show modal with animation
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    // Close modal when clicking on X or outside
    const closeButton = modalContent.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        closeModal(modalOverlay);
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal(modalOverlay);
        }
    });
    
    // Handle form submission
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        
        // Save registration to localStorage
        saveRegistration(eventDetails, name, email);
        
        // Close modal
        closeModal(modalOverlay);
        
        // Show success message
        showSuccessMessage();
        
        // Update register button
        updateRegisterButton();
    });
}

// Function to close modal
function closeModal(modalOverlay) {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modalOverlay);
    }, 300);
}

// Function to save registration
function saveRegistration(eventDetails, name, email) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        console.error('Cannot register: User not logged in');
        return;
    }
    
    // Create registration object
    const registration = {
        eventId: eventDetails.id,
        eventTitle: eventDetails.title,
        eventImage: eventDetails.image,
        eventDate: eventDetails.date,
        eventLocation: eventDetails.location,
        attendeeName: name,
        attendeeEmail: email,
        userId: currentUser.id || currentUser.email, // Use user ID or email as identifier
        registrationDate: new Date().toISOString()
    };
    
    // Get existing registrations or initialize empty array
    const registrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
    
    // Check if already registered for this event
    const alreadyRegistered = registrations.some(reg => 
        reg.eventId === eventDetails.id && 
        (reg.userId === currentUser.id || reg.attendeeEmail === currentUser.email)
    );
    
    if (!alreadyRegistered) {
        // Add new registration
        registrations.push(registration);
        
        // Save back to localStorage
        localStorage.setItem('userRegistrations', JSON.stringify(registrations));
        
        // Log for debugging
        console.log('Registration saved:', registration);
        console.log('All registrations:', registrations);
    }
}

// Function to show success message
function showSuccessMessage() {
    const registrationSection = document.querySelector('.registration-section');
    
    // Create success message if it doesn't exist
    let successMessage = document.querySelector('.registration-success');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'registration-success';
        registrationSection.appendChild(successMessage);
    }
    
    successMessage.textContent = 'Registration successful! You are now registered for this event.';
    successMessage.style.display = 'block';
    
    // Scroll to registration section
    registrationSection.scrollIntoView({ behavior: 'smooth' });
}

// Function to update register button
function updateRegisterButton() {
    const registerButton = document.getElementById('register-button');
    registerButton.textContent = 'Registered';
    registerButton.disabled = true;
    registerButton.classList.add('registered');
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const loginMessage = document.getElementById('login-message');
    const noRegistrations = document.getElementById('no-registrations');
    const registrationsList = document.getElementById('registrations-list');
    
    // If user is not logged in, show login message and hide other elements
    if (!currentUser) {
        if (loginMessage) {
            loginMessage.style.display = 'block';
        }
        if (noRegistrations) {
            noRegistrations.style.display = 'none';
        }
        if (registrationsList) {
            registrationsList.style.display = 'none';
        }
        return; // Exit the function early
    }
    
    // User is logged in, hide login message
    if (loginMessage) {
        loginMessage.style.display = 'none';
    }
    
    // Get all registrations
    const allRegistrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
    
    // Filter registrations for current user only
    const userRegistrations = allRegistrations.filter(reg => 
        reg.userId === currentUser.id || reg.attendeeEmail === currentUser.email
    );
    
    if (userRegistrations.length === 0) {
        // No registrations found for this user
        noRegistrations.style.display = 'block';
        registrationsList.style.display = 'none';
    } else {
        // Show registrations
        noRegistrations.style.display = 'none';
        registrationsList.style.display = 'grid';
        
        // Populate registrations list
        displayRegistrations(userRegistrations);
    }
});

// Function to display registrations
function displayRegistrations(registrations) {
    const registrationsList = document.getElementById('registrations-list');
    
    // Clear existing content
    registrationsList.innerHTML = '';
    
    // Add each registration as a card
    registrations.forEach(registration => {
        const card = createRegistrationCard(registration);
        registrationsList.appendChild(card);
    });
}

// Function to create a registration card
function createRegistrationCard(registration) {
    const card = document.createElement('div');
    card.className = 'event-card registration-card';
    
    card.innerHTML = `
        <div class="event-image">
            <img src="${registration.eventImage}" alt="${registration.eventTitle}">
            <div class="registration-badge">Registered</div>
        </div>
        <div class="event-details">
            <h3>${registration.eventTitle}</h3>
            <div class="event-meta">
                <p><i class="fas fa-calendar-alt"></i> ${registration.eventDate}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${registration.eventLocation}</p>
            </div>
            <div class="registration-info">
                <p><i class="fas fa-user"></i> ${registration.attendeeName}</p>
                <p><i class="fas fa-envelope"></i> ${registration.attendeeEmail}</p>
            </div>
            <a href="event-details.html?id=${registration.eventId}" class="view-details-btn">View Event Details</a>
        </div>
    `;
    
    return card;
}

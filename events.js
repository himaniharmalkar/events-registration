document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for "More Info" buttons
    const moreInfoButtons = document.querySelectorAll('.more-info-btn');
    
    moreInfoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the event card that contains this button
            const eventCard = this.closest('.event-card');
            
            // Extract event details
            const eventId = eventCard.getAttribute('data-event-id');
            const eventTitle = eventCard.querySelector('h3').textContent;
            const eventImage = eventCard.querySelector('.event-image img').src;
            const eventDate = eventCard.querySelector('.event-meta p:first-child').textContent.replace('calendar-alt', '').trim();
            const eventLocation = eventCard.querySelector('.event-meta p:last-child').textContent.replace('map-marker-alt', '').trim();
            const eventDescription = eventCard.querySelector('.event-description').textContent;
            
            // Store event details in localStorage for the details page to access
            const eventDetails = {
                id: eventId,
                title: eventTitle,
                image: eventImage,
                date: eventDate,
                location: eventLocation,
                description: eventDescription
            };
            
            localStorage.setItem('selectedEvent', JSON.stringify(eventDetails));
            
            // Navigate to the event details page
            window.location.href = `event-details.html?id=${eventId}`;
        });
    });
});

// Smooth scrolling for all links with the class 'smooth-scroll'
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Sticky Navbar
window.onscroll = function() {
    var navbar = document.querySelector("header");
    if (window.pageYOffset > 0) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create and append the LED lights container
    const ledLightsContainer = document.createElement('div');
    ledLightsContainer.className = 'led-lights-container';
    document.body.appendChild(ledLightsContainer);

    // Number of LED lights
    const numLights = 100;

    // Create and position LED lights randomly
    for (let i = 0; i < numLights; i++) {
        const ledLight = document.createElement('div');
        ledLight.className = 'led-light';
        ledLight.style.left = `${Math.random() * 100}%`;
        ledLight.style.top = `${Math.random() * 100}%`;
        ledLightsContainer.appendChild(ledLight);
    }

    // Handle mouse movement to move lights away from the cursor
    document.addEventListener('mousemove', function(e) {
        const lights = document.querySelectorAll('.led-light');
        lights.forEach(light => {
            const rect = light.getBoundingClientRect();
            const distance = Math.hypot(rect.left - e.clientX, rect.top - e.clientY);

            if (distance < 100) { // Adjust the distance threshold as needed
                const angle = Math.atan2(rect.top - e.clientY, rect.left - e.clientX);
                const offsetX = Math.cos(angle) * 50;
                const offsetY = Math.sin(angle) * 50;
                light.style.transform = `translate(${offsetX}px, ${offsetY}px)`; // Move light away
            } else {
                light.style.transform = 'translate(0, 0)'; // Reset position
            }
        });
    });
});





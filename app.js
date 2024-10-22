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
    if (window.scrollY > 0) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const ledLightsContainer = document.createElement('div');
    ledLightsContainer.className = 'led-lights-container';
    document.body.appendChild(ledLightsContainer);

    // Function to create a new light
    function createLight() {
        const ledLight = document.createElement('div');
        ledLight.className = 'led-light';

        // Set initial position
        const leftPos = Math.random() * window.innerWidth;
        const topPos = Math.random() * window.innerHeight;
        ledLight.style.left = `${leftPos}px`;
        ledLight.style.top = `${topPos}px`;

        // Add the light to the container
        ledLightsContainer.appendChild(ledLight);

        return ledLight;
    }

    // Create an infinite number of lights over time
    setInterval(function() {
        const light = createLight();
        setTimeout(() => light.remove(), 30000); // Remove the light after 30 seconds to prevent overload
    }, 300); // Create a new light every 300 milliseconds

    // Handle mouse movement to move lights away from the cursor
    document.addEventListener('mousemove', function(e) {
        const lights = document.querySelectorAll('.led-light');
        lights.forEach(light => {
            const rect = light.getBoundingClientRect();
            const distance = Math.hypot(rect.left - e.clientX, rect.top - e.clientY);

            if (distance < 100) { // If the mouse is near the light
                const angle = Math.atan2(rect.top - e.clientY, rect.left - e.clientX);
                const offsetX = Math.cos(angle) * 50;
                const offsetY = Math.sin(angle) * 50;

                // Pause the light's animation and move it away from the mouse
                light.style.animationPlayState = 'paused';
                light.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            } else {
                // Resume animation when the mouse moves away
                light.style.animationPlayState = 'running';
                light.style.transform = 'translate(0, 0)'; // Reset the transform
            }
        });
    });
});

// Select the image by its ID
const coinImage = document.getElementById('coinImage');

// Add a click event listener to trigger the animation
coinImage.addEventListener('click', function() {
  // Add the 'spin-bounce' class when clicked
  this.classList.add('spin-bounce');
  
  // Remove the class after the animation ends, so it can be applied again on the next click
  setTimeout(() => {
    this.classList.remove('spin-bounce');
  }, 1000); // The duration matches the animation time
});


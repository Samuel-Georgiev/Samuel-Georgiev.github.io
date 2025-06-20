// Modern JavaScript for Samuel Georgiev's Portfolio

// Smooth scrolling for navigation links
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced navbar with scroll effects
class NavbarController {
    constructor() {
        this.header = document.querySelector('header');
        this.lastScrollTop = 0;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.updateNavbar();
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional - disabled for better UX)
        // if (scrollTop > this.lastScrollTop && scrollTop > 100) {
        //     this.header.style.transform = 'translateY(-100%)';
        // } else {
        //     this.header.style.transform = 'translateY(0)';
        // }
        
        this.lastScrollTop = scrollTop;
        this.updateActiveNav();
    }
    
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    updateNavbar() {
        this.updateActiveNav();
    }
}

// Intersection Observer for scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        // Observe all elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(element => {
            this.observer.observe(element);
        });
        
        // Observe project cards for staggered animation
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
        
        // Observe skill items for staggered animation
        document.querySelectorAll('.skill-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.05}s`;
            this.observer.observe(item);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation to improve performance
                // this.observer.unobserve(entry.target);
            }
        });
    }
}

// Enhanced LED Lights System
class LEDLightsManager {
    constructor() {
        this.container = null;
        this.lights = [];
        this.maxLights = 15;
        this.creationInterval = null;
        this.mousePosition = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        this.createContainer();
        this.startLightCreation();
        this.setupMouseTracking();
        this.setupPerformanceOptimization();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'led-lights-container';
        document.body.appendChild(this.container);
    }
    
    createLight() {
        if (this.lights.length >= this.maxLights) return;
        
        const light = document.createElement('div');
        light.className = 'led-light';
        
        // Random starting position at bottom
        const leftPos = Math.random() * window.innerWidth;
        light.style.left = `${leftPos}px`;
        light.style.top = `${window.innerHeight + 10}px`;
        
        // Random animation duration for variety
        const duration = 12 + Math.random() * 8; // 12-20 seconds
        light.style.animationDuration = `${duration}s`;
        
        // Random delay for more organic feel
        const delay = Math.random() * 2;
        light.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(light);
        this.lights.push(light);
        
        // Remove light after animation
        setTimeout(() => {
            this.removeLight(light);
        }, (duration + delay) * 1000);
    }
    
    removeLight(light) {
        const index = this.lights.indexOf(light);
        if (index > -1) {
            this.lights.splice(index, 1);
        }
        if (light.parentNode) {
            light.parentNode.removeChild(light);
        }
    }
    
    startLightCreation() {
        this.creationInterval = setInterval(() => {
            this.createLight();
        }, 800); // Create a light every 800ms
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.handleMouseInteraction();
        });
    }
    
    handleMouseInteraction() {
        this.lights.forEach(light => {
            const rect = light.getBoundingClientRect();
            const lightX = rect.left + rect.width / 2;
            const lightY = rect.top + rect.height / 2;
            
            const distance = Math.hypot(
                lightX - this.mousePosition.x,
                lightY - this.mousePosition.y
            );
            
            if (distance < 80) {
                const angle = Math.atan2(
                    lightY - this.mousePosition.y,
                    lightX - this.mousePosition.x
                );
                const force = Math.max(0, 80 - distance) / 80;
                const offsetX = Math.cos(angle) * force * 40;
                const offsetY = Math.sin(angle) * force * 40;
                
                light.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                light.style.animationPlayState = 'paused';
                
                // Resume animation after a delay
                setTimeout(() => {
                    if (light.parentNode) {
                        light.style.transform = '';
                        light.style.animationPlayState = 'running';
                    }
                }, 1000);
            }
        });
    }
    
    setupPerformanceOptimization() {
        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Reduce lights on mobile for better performance
        if (window.innerWidth < 768) {
            this.maxLights = 8;
        }
    }
    
    pauseAnimations() {
        if (this.creationInterval) {
            clearInterval(this.creationInterval);
        }
        this.lights.forEach(light => {
            light.style.animationPlayState = 'paused';
        });
    }
    
    resumeAnimations() {
        this.startLightCreation();
        this.lights.forEach(light => {
            light.style.animationPlayState = 'running';
        });
    }
}

// Mobile Menu Controller
class MobileMenuController {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (!this.toggle) return;
        
        this.toggle.addEventListener('click', this.toggleMenu.bind(this));
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    this.toggleMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('nav')) {
                this.toggleMenu();
            }
        });
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.toggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
}

// Smooth scroll to top functionality
class ScrollToTop {
    constructor() {
        this.button = this.createButton();
        this.init();
    }
    
    createButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(button);
        return button;
    }
    
    init() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', this.toggleVisibility.bind(this));
    }
    
    toggleVisibility() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// Performance optimization for animations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
        
        // Optimize for mobile
        if (window.innerWidth < 768) {
            this.optimizeForMobile();
        }
    }
    
    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeForMobile() {
        // Add mobile-specific optimizations
        document.body.classList.add('mobile-optimized');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new NavbarController();
    new ScrollAnimations();
    new LEDLightsManager();
    new MobileMenuController();
    new ScrollToTop();
    new PerformanceOptimizer();
    
    // Add initial fade-in to all sections
    document.querySelectorAll('section, header, footer').forEach(element => {
        if (!element.classList.contains('fade-in')) {
            element.classList.add('fade-in');
        }
    });
    
    console.log('Portfolio initialized successfully! 🚀');
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Reinitialize LED lights manager if significant size change
    const isNowMobile = window.innerWidth < 768;
    if (isNowMobile !== document.body.classList.contains('mobile-optimized')) {
        location.reload(); // Simple solution for dramatic layout changes
    }
}, 250));

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

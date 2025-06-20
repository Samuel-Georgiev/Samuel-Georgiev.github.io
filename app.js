// Modern JavaScript for Samuel Georgiev's Portfolio

// Theme Controller
class ThemeController {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.themeBtn = document.querySelector('.theme-btn');
        this.init();
    }
    
    init() {
        this.setTheme(this.theme);
        if (this.themeBtn) {
            this.themeBtn.addEventListener('click', this.toggleTheme.bind(this));
        }
    }
    
    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Stats Counter Animation
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { threshold: 0.5 }
        );
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.hasAnimated) {
                this.hasAnimated = true;
                this.animateCounters();
            }
        });
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
}

// Skills Animation Controller
class SkillsAnimator {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        if (this.skillBars.length === 0) return;
        
        const observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { threshold: 0.3 }
        );
        
        this.skillBars.forEach(bar => observer.observe(bar));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.hasAnimated) {
                this.hasAnimated = true;
                this.animateSkills();
            }
        });
    }
    
    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const percentage = bar.getAttribute('data-skill');
                bar.style.width = percentage + '%';
                bar.classList.add('animate');
            }, index * 200); // Stagger animation
        });
    }
}

// Crypto Dashboard
class MarketDashboard {
    constructor() {
        this.marketCards = document.querySelectorAll('.market-card');
        this.updateInterval = null;
        this.charts = new Map();
        this.init();
    }
    
    init() {
        if (this.marketCards.length === 0) return;
        
        // Add loading state initially
        this.marketCards.forEach(card => {
            card.classList.add('loading');
            this.initChart(card);
        });
        
        // Start fetching data
        this.fetchMarketData();
        
        // Update every 60 seconds for stock data
        this.updateInterval = setInterval(() => {
            this.fetchMarketData();
        }, 60000);
    }
    
    initChart(card) {
        const canvas = card.querySelector('canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const symbol = card.getAttribute('data-symbol');
        
        // Set canvas size
        canvas.width = 200;
        canvas.height = 60;
        
        this.charts.set(symbol, {
            canvas,
            ctx,
            data: []
        });
    }
    
    async fetchMarketData() {
        try {
            const symbols = Array.from(this.marketCards).map(card => 
                card.getAttribute('data-symbol')
            );
            
            // Using Alpha Vantage API for stock data (requires API key)
            // For demo purposes, we'll use Yahoo Finance proxy or simulate data
            const promises = symbols.map(symbol => 
                this.fetchStockData(symbol)
            );
            
            const results = await Promise.all(promises);
            
            results.forEach((data, index) => {
                if (data) {
                    this.updateMarketCard(this.marketCards[index], data);
                }
            });
        } catch (error) {
            console.log('Using demo data for market prices');
            this.useDemoData();
        }
    }
    
    async fetchStockData(symbol) {
        try {
            // Attempt to use Yahoo Finance API proxy
            // Note: In production, you'd use a proper financial data API
            const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
            const data = await response.json();
            
            if (data.chart && data.chart.result && data.chart.result[0]) {
                const result = data.chart.result[0];
                const meta = result.meta;
                const prices = result.indicators.quote[0];
                
                return {
                    symbol,
                    price: meta.regularMarketPrice,
                    change: meta.regularMarketPrice - meta.previousClose,
                    changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
                    history: prices.close.slice(-7) // Last 7 data points for chart
                };
            }
        } catch (error) {
            console.log(`Failed to fetch data for ${symbol}`);
        }
        return null;
    }
    
    updateMarketCard(card, data) {
        const priceValue = card.querySelector('.price-value');
        const priceChange = card.querySelector('.price-change');
        
        // Remove loading state
        card.classList.remove('loading');
        
        // Format price
        const formattedPrice = data.price.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
        
        // Format change percentage
        const formattedChange = `${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`;
        
        // Update DOM
        priceValue.textContent = formattedPrice;
        priceChange.textContent = formattedChange;
        
        // Add color class
        priceChange.classList.remove('positive', 'negative');
        priceChange.classList.add(data.changePercent >= 0 ? 'positive' : 'negative');
        
        // Update chart
        this.updateChart(data.symbol, data.history, data.changePercent >= 0);
    }
    
    updateChart(symbol, data, isPositive) {
        const chart = this.charts.get(symbol);
        if (!chart || !data || data.length === 0) return;
        
        const { ctx, canvas } = chart;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Filter out null values and use demo data if not enough points
        const validData = data.filter(d => d !== null && d !== undefined);
        const chartData = validData.length >= 2 ? validData : this.generateDemoChartData(7);
        
        if (chartData.length < 2) return;
        
        // Calculate min/max for scaling
        const min = Math.min(...chartData);
        const max = Math.max(...chartData);
        const range = max - min || 1;
        
        // Draw chart
        ctx.strokeStyle = isPositive ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Create gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        
        ctx.beginPath();
        
        const stepX = width / (chartData.length - 1);
        
        chartData.forEach((value, index) => {
            const x = index * stepX;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Fill area under line
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    generateDemoChartData(points) {
        const data = [];
        let base = 100;
        for (let i = 0; i < points; i++) {
            base += (Math.random() - 0.5) * 5;
            data.push(base);
        }
        return data;
    }
    
    useDemoData() {
        const demoData = [
            { 
                symbol: '^GSPC',
                price: 5847.63, 
                changePercent: 0.84,
                history: [5820, 5835, 5845, 5840, 5850, 5845, 5847.63]
            },
            { 
                symbol: '^IXIC',
                price: 18540.85, 
                changePercent: -0.23,
                history: [18600, 18580, 18565, 18570, 18550, 18545, 18540.85]
            },
            { 
                symbol: '^NYA',
                price: 19234.78, 
                changePercent: 1.12,
                history: [19100, 19150, 19180, 19200, 19220, 19230, 19234.78]
            }
        ];
        
        this.marketCards.forEach((card, index) => {
            if (demoData[index]) {
                this.updateMarketCard(card, demoData[index]);
            }
        });
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Enhanced AOS-like animations
class AOSAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        const observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.elements.forEach(element => observer.observe(element));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }
}

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

// Interactive Particle System
class InteractiveParticleSystem {    constructor() {
        this.container = null;
        this.particles = [];
        this.maxParticles = 15;
        this.mousePosition = { x: 0, y: 0 };
        this.draggedParticle = null;
        this.lastMousePosition = { x: 0, y: 0 };
        this.mouseVelocity = { x: 0, y: 0 };
        this.animationId = null;
        this.attractionMode = false; // Default to repulsion mode
        this.init();
    }
    
    init() {
        this.createContainer();
        this.createInitialParticles();
        this.setupEventListeners();
        this.startAnimation();
        this.setupPerformanceOptimization();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'interactive-particles';
        document.body.appendChild(this.container);
    }
    
    createInitialParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 300);
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        const sizes = ['small', 'medium', 'large', 'extra-large'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // Probability weights
        
        // Weighted random size selection
        const randomNum = Math.random();
        let cumulativeWeight = 0;
        let selectedSize = sizes[0];
        
        for (let i = 0; i < sizes.length; i++) {
            cumulativeWeight += weights[i];
            if (randomNum <= cumulativeWeight) {
                selectedSize = sizes[i];
                break;
            }
        }
        
        particle.className = `particle ${selectedSize}`;
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        // Particle physics properties
        const particleData = {
            element: particle,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 2, // Velocity X
            vy: (Math.random() - 0.5) * 2, // Velocity Y
            mass: this.getSizeValue(selectedSize),
            size: selectedSize,
            isDragging: false,
            lastX: startX,
            lastY: startY,
            trails: []
        };
        
        this.particles.push(particleData);
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        this.setupParticleEvents(particle, particleData);
        this.container.appendChild(particle);
        
        return particleData;
    }
    
    getSizeValue(size) {
        const sizeMap = {
            'small': 8,
            'medium': 15,
            'large': 25,
            'extra-large': 35
        };
        return sizeMap[size] || 15;
    }
    
    setupParticleEvents(element, particleData) {
        let isDragging = false;
        let startX, startY;
        
        const handleStart = (e) => {
            isDragging = true;
            particleData.isDragging = true;
            this.draggedParticle = particleData;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            startX = clientX - particleData.x;
            startY = clientY - particleData.y;
            
            element.classList.add('dragging');
            
            // Stop current velocity
            particleData.vx = 0;
            particleData.vy = 0;
            
            e.preventDefault();
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            const newX = clientX - startX;
            const newY = clientY - startY;
            
            // Calculate mouse velocity for flinging
            this.mouseVelocity.x = (newX - particleData.lastX) * 0.5;
            this.mouseVelocity.y = (newY - particleData.lastY) * 0.5;
            
            particleData.lastX = particleData.x;
            particleData.lastY = particleData.y;
            particleData.x = newX;
            particleData.y = newY;
            
            // Create trail effect
            this.createTrail(particleData.x, particleData.y, particleData.size);
            
            e.preventDefault();
        };
        
        const handleEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            particleData.isDragging = false;
            this.draggedParticle = null;
            
            element.classList.remove('dragging');
            
            // Apply fling velocity
            particleData.vx = this.mouseVelocity.x;
            particleData.vy = this.mouseVelocity.y;
            
            // Create ripple effect
            this.createRipple(particleData.x, particleData.y);
            
            // Reset mouse velocity
            this.mouseVelocity = { x: 0, y: 0 };
        };
        
        // Mouse events
        element.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Touch events for mobile
        element.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    }
    
    createTrail(x, y, size) {
        const trail = document.createElement('div');
        trail.className = 'particle-trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.width = `${this.getSizeValue(size) * 0.7}px`;
        trail.style.height = `${this.getSizeValue(size) * 0.7}px`;
        
        this.container.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 500);
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'particle-ripple';
        ripple.style.left = `${x - 50}px`;
        ripple.style.top = `${y - 50}px`;
        
        this.container.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
      updateParticle(particle) {
        if (particle.isDragging) {
            // Update position for dragged particles
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            return;
        }
        
        // Mouse interaction physics
        const mouseDistance = Math.sqrt(
            Math.pow(this.mousePosition.x - particle.x, 2) + 
            Math.pow(this.mousePosition.y - particle.y, 2)
        );
        
        const interactionRadius = 150; // Pixels from mouse where interaction occurs
        const maxForce = 0.5; // Maximum force applied
          if (mouseDistance < interactionRadius && mouseDistance > 0) {
            // Calculate force (attraction or repulsion based on mode)
            const forceMultiplier = (interactionRadius - mouseDistance) / interactionRadius;
            const force = maxForce * forceMultiplier;
            
            // Calculate direction (towards or away from mouse)
            let directionX, directionY;
            if (this.attractionMode) {
                // Attraction: particles move towards mouse
                directionX = (this.mousePosition.x - particle.x) / mouseDistance;
                directionY = (this.mousePosition.y - particle.y) / mouseDistance;
            } else {
                // Repulsion: particles move away from mouse
                directionX = (particle.x - this.mousePosition.x) / mouseDistance;
                directionY = (particle.y - this.mousePosition.y) / mouseDistance;
            }
            
            // Apply force
            particle.vx += directionX * force;
            particle.vy += directionY * force;
            
            // Add visual feedback based on interaction mode
            const hueShift = this.attractionMode ? -60 : 60; // Blue for attraction, red for repulsion
            particle.element.style.filter = `hue-rotate(${hueShift * forceMultiplier}deg) brightness(${1 + forceMultiplier * 0.3})`;
        } else {
            // Reset visual effects when not near mouse
            particle.element.style.filter = '';
        }
        
        // Physics simulation
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary collision with bounce
        if (particle.x <= 0 || particle.x >= window.innerWidth - this.getSizeValue(particle.size)) {
            particle.vx *= -0.8; // Energy loss on bounce
            particle.x = Math.max(0, Math.min(window.innerWidth - this.getSizeValue(particle.size), particle.x));
        }
        
        if (particle.y <= 0 || particle.y >= window.innerHeight - this.getSizeValue(particle.size)) {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(window.innerHeight - this.getSizeValue(particle.size), particle.y));
        }
        
        // Friction and damping
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // Reduced gravity effect to prevent settling at bottom
        particle.vy += 0.005;
        
        // Add slight floating effect to counteract gravity
        if (Math.abs(particle.vx) < 0.1 && Math.abs(particle.vy) < 0.1) {
            particle.vx += (Math.random() - 0.5) * 0.2;
            particle.vy += (Math.random() - 0.5) * 0.2;
        }
        
        // Update DOM position
        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
    }
    
    checkCollisions() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                if (p1.isDragging || p2.isDragging) continue;
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (this.getSizeValue(p1.size) + this.getSizeValue(p2.size)) / 2;
                
                if (distance < minDistance) {
                    // Collision detected
                    this.resolveCollision(p1, p2);
                    this.createRipple((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
                }
            }
        }
    }
    
    resolveCollision(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        // Normalize collision vector
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Relative velocity
        const rvx = p1.vx - p2.vx;
        const rvy = p1.vy - p2.vy;
        
        // Relative velocity in collision normal direction
        const speed = rvx * nx + rvy * ny;
        
        if (speed > 0) return; // Objects separating
        
        // Collision impulse
        const impulse = 2 * speed / (p1.mass + p2.mass);
        
        // Update velocities
        p1.vx -= impulse * p2.mass * nx;
        p1.vy -= impulse * p2.mass * ny;
        p2.vx += impulse * p1.mass * nx;
        p2.vy += impulse * p1.mass * ny;
        
        // Separate overlapping particles
        const overlap = (this.getSizeValue(p1.size) + this.getSizeValue(p2.size)) / 2 - distance;
        const separationX = nx * overlap * 0.5;
        const separationY = ny * overlap * 0.5;
        
        p1.x += separationX;
        p1.y += separationY;
        p2.x -= separationX;
        p2.y -= separationY;
    }
    
    startAnimation() {
        const animate = () => {
            // Update all particles
            this.particles.forEach(particle => {
                this.updateParticle(particle);
            });
            
            // Check for collisions
            this.checkCollisions();
            
            // Continue animation
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
      setupEventListeners() {
        // Track mouse position for interaction effects
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            // Create subtle mouse trail effect occasionally
            if (Math.random() < 0.1) {
                this.createMouseTrail(e.clientX, e.clientY);
            }
        });
        
        // Add particles on double-click in empty areas
        document.addEventListener('dblclick', (e) => {
            if (e.target === document.body || e.target.classList.contains('container') || e.target.classList.contains('particles-container')) {
                if (this.particles.length < this.maxParticles * 2) {
                    const newParticle = this.createParticle();
                    newParticle.x = e.clientX;
                    newParticle.y = e.clientY;
                    newParticle.vx = (Math.random() - 0.5) * 8;
                    newParticle.vy = (Math.random() - 0.5) * 8;
                    
                    // Create visual feedback for new particle creation
                    this.createRipple(e.clientX, e.clientY);
                }
            }
        });
        
        // Add click repulsion effect
        document.addEventListener('click', (e) => {
            if (e.target === document.body || e.target.classList.contains('container') || e.target.classList.contains('particles-container')) {
                this.createClickRepulsion(e.clientX, e.clientY);
            }
        });
        
        // Space bar for particle interaction mode toggle
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.toggleInteractionMode();
            }
        });
    }
    
    createMouseTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.left = `${x - 3}px`;
        trail.style.top = `${y - 3}px`;
        
        this.container.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 300);
    }
    
    createClickRepulsion(x, y) {
        // Create ripple effect at click location
        this.createRipple(x, y);
        
        // Apply repulsion force to nearby particles
        this.particles.forEach(particle => {
            const distance = Math.sqrt(
                Math.pow(x - particle.x, 2) + 
                Math.pow(y - particle.y, 2)
            );
            
            if (distance < 200 && distance > 0) {
                const force = (200 - distance) / 200 * 3;
                const directionX = (particle.x - x) / distance;
                const directionY = (particle.y - y) / distance;
                
                particle.vx += directionX * force;
                particle.vy += directionY * force;
            }
        });
    }
    
    toggleInteractionMode() {
        this.attractionMode = !this.attractionMode;
        
        // Visual feedback
        const indicator = document.createElement('div');
        indicator.className = 'interaction-mode-indicator';
        indicator.textContent = this.attractionMode ? 'Attraction Mode' : 'Repulsion Mode';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 2000);
    }
    
    setupPerformanceOptimization() {
        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else {
                this.resumeAnimation();
            }
        });
        
        // Reduce particles on mobile
        if (window.innerWidth < 768) {
            this.maxParticles = 8;
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.particles.forEach(particle => {
                // Keep particles within new boundaries
                particle.x = Math.min(particle.x, window.innerWidth - this.getSizeValue(particle.size));
                particle.y = Math.min(particle.y, window.innerHeight - this.getSizeValue(particle.size));
            });
        });
    }
    
    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resumeAnimation() {
        if (!this.animationId) {
            this.startAnimation();
        }
    }
    
    destroy() {
        this.pauseAnimation();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.particles = [];
    }
}

// Enhanced LED Lights System (Background ambient lights)
class LEDLightsManager {
    constructor() {
        this.container = null;
        this.lights = [];
        this.maxLights = 8; // Reduced to not compete with particles
        this.creationInterval = null;
        this.init();
    }
    
    init() {
        this.createContainer();
        this.startLightCreation();
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
        const types = ['', 'fast', 'slow', 'pulse'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        light.className = `led-light ${randomType}`;
        
        // Random starting position at bottom
        const leftPos = Math.random() * window.innerWidth;
        light.style.left = `${leftPos}px`;
        light.style.top = `${window.innerHeight + 10}px`;
        
        // Random animation duration for variety
        const baseDuration = randomType === 'fast' ? 12 : randomType === 'slow' ? 30 : 20;
        const duration = baseDuration + Math.random() * 5;
        light.style.animationDuration = `${duration}s`;
        
        this.container.appendChild(light);
        this.lights.push(light);
        
        // Remove light after animation
        setTimeout(() => {
            this.removeLight(light);
        }, duration * 1000);
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
        }, 2000); // Create a light every 2 seconds (less frequent)
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
            this.maxLights = 4;
        }
    }
    
    pauseAnimations() {
        if (this.creationInterval) {
            clearInterval(this.creationInterval);
        }
    }
    
    resumeAnimations() {
        if (!this.creationInterval) {
            this.startLightCreation();
        }
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
    new ThemeController();
    new NavbarController();
    new ScrollAnimations();
    new StatsCounter();
    new SkillsAnimator();
    new MarketDashboard();
    new AOSAnimations();
    new InteractiveParticleSystem(); // New interactive particle system
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
      // Add helpful instructions for particle interaction
    setTimeout(() => {
        console.log('🎉 Enhanced Interactive particles loaded!');
        console.log('🎯 Features:');
        console.log('   • Drag balls around with your mouse');
        console.log('   • Double-click empty areas to create new particles');
        console.log('   • Click empty areas for repulsion effect'); 
        console.log('   • Press SPACEBAR to toggle attraction/repulsion mode');
        console.log('   • Move your mouse near balls to see them react!');
        console.log('💡 Balls now actively interact with your mouse cursor!');
    }, 2000);
    
    console.log('Enhanced Portfolio with Interactive Particles initialized successfully! 🚀');
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

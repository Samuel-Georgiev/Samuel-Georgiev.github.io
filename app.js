// Debug logging to track loading issues
console.log('DEBUG: app.js file loaded successfully');
console.log('DEBUG: Current URL:', window.location.href);
console.log('DEBUG: Document ready state:', document.readyState);

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

// Enhanced Financial Dashboard with Real-Time APIs
class MarketDashboard {
    constructor() {        this.marketCards = document.querySelectorAll('.market-card');
        this.updateInterval = null;
        this.charts = new Map();        this.apiConfig = {
            // Financial APIs
            apis: [
                {
                    name: 'Finnhub',
                    key: 'd1au601r01qjhvtrdgv0d1au601r01qjhvtrdgvg', // Your Finnhub API key
                    baseUrl: 'https://finnhub.io/api/v1',
                    rateLimit: 60, // requests per minute for free tier
                    enabled: true
                }
            ],
            currentApiIndex: 0,
            lastRequestTime: 0,
            requestCount: 0
        };
        this.lastUpdateTime = 0;
        this.minUpdateInterval = 30000; // Minimum 30 seconds between updates
        this.init();
    }    init() {
        console.log('DEBUG: MarketDashboard init() called');
        console.log('DEBUG: Market cards found:', this.marketCards.length);
        
        if (this.marketCards.length === 0) {
            console.error('DEBUG: No market cards found! Dashboard will not initialize.');
            console.log('DEBUG: Checking if DOM is ready...');
            console.log('DEBUG: Document ready state:', document.readyState);
            
            // Try to find market cards again
            setTimeout(() => {
                const retryCards = document.querySelectorAll('.market-card');
                console.log('DEBUG: Retry: Found market cards after delay:', retryCards.length);
                if (retryCards.length > 0) {
                    this.marketCards = retryCards;
                    this.init(); // Retry initialization
                }
            }, 1000);
            return;
        }
        
        console.log('DEBUG: Initializing Enhanced Financial Dashboard...');
          // Add loading state initially
        this.marketCards.forEach((card, index) => {
            console.log(`DEBUG: Initializing card ${index}:`, card.getAttribute('data-symbol'));
            card.classList.add('loading');
            this.initChart(card);
        });
        
        // Start fetching data
        console.log('DEBUG: Starting initial data fetch...');
        this.fetchMarketData();
        
        // Update every 60 seconds for stock data (respecting rate limits)
        this.updateInterval = setInterval(() => {
            console.log('DEBUG: Periodic update triggered');
            this.fetchMarketData();
        }, 60000);
        
        console.log('DEBUG: MarketDashboard initialization complete');
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
    }      async fetchMarketData() {
        console.log('DEBUG: Starting enhanced market data fetch...');
        console.log('DEBUG: Market cards found:', this.marketCards.length);
        
        // Check if market cards exist
        if (this.marketCards.length === 0) {
            console.error('DEBUG: No market cards found in DOM!');
            console.log('DEBUG: Looking for elements with class "market-card"...');
            const allMarketCards = document.querySelectorAll('.market-card');
            console.log('DEBUG: Found market cards:', allMarketCards.length);
            return;
        }
        
        const now = Date.now();
        if (now - this.lastUpdateTime < this.minUpdateInterval) {
            console.log('DEBUG: Rate limit - using cached data');
            return;
        }
        
        this.lastUpdateTime = now;
        
        try {
            const symbols = Array.from(this.marketCards).map(card => 
                card.getAttribute('data-symbol')
            );
            
            console.log('DEBUG: Attempting to fetch real market data for:', symbols);
            console.log('DEBUG: Available APIs:', this.apiConfig.apis.map(api => `${api.name} (${api.enabled ? 'enabled' : 'disabled'})`));
            
            // Try APIs in order of preference
            let apiSuccess = false;
            
            for (let i = 0; i < this.apiConfig.apis.length && !apiSuccess; i++) {
                const api = this.apiConfig.apis[i];
                if (!api.enabled) {
                    console.log(`DEBUG: Skipping ${api.name} - disabled`);
                    continue;
                }
                
                try {
                    console.log(`DEBUG: Trying ${api.name} API...`);
                    console.log(`DEBUG: API Config:`, { 
                        name: api.name, 
                        baseUrl: api.baseUrl, 
                        hasKey: api.key !== 'demo',
                        key: api.key.substring(0, 8) + '...' // Show first 8 chars for debugging
                    });
                    
                    const results = await this.fetchFromAPI(api, symbols);
                    console.log(`DEBUG: ${api.name} API results:`, results);
                    
                    if (results && results.length > 0) {
                        let validResults = 0;
                        results.forEach((data, index) => {
                            if (data && this.marketCards[index]) {
                                console.log(`DEBUG: Updating card ${index} with data:`, data);
                                this.updateMarketCard(this.marketCards[index], data);
                                validResults++;
                            } else {
                                console.log(`DEBUG: No data for card ${index}`);
                            }
                        });
                        
                        if (validResults > 0) {
                            console.log(`Real market data loaded successfully from ${api.name} (${validResults}/${results.length} cards updated)`);
                            apiSuccess = true;
                            break;
                        }
                    } else {
                        console.log(`DEBUG: ${api.name} returned no valid results`);
                    }
                } catch (error) {
                    console.log(`${api.name} API failed:`, error.message);
                    console.error('DEBUG: Full error:', error);
                    continue;
                }
            }
            
            // Fallback to demo data if all APIs fail
            if (!apiSuccess) {
                console.log('DEBUG: All APIs failed, falling back to demo data');
                throw new Error('All financial APIs failed');
            }
            
        } catch (error) {
            console.log('All real market data sources failed, using demo data:', error.message);
            this.useDemoData();
        }
    }async fetchFromAPI(api, symbols) {
        const results = [];
        
        switch (api.name) {
            case 'Finnhub':
                return await this.fetchFromFinnhub(api, symbols);
                
            default:
                throw new Error(`Unknown API: ${api.name}`);
        }
    }    async fetchFromFinnhub(api, symbols) {
        const results = [];
        
        for (const symbol of symbols) {
            try {
                const mappedSymbol = this.mapSymbolForFinnhub(symbol);
                console.log(`DEBUG: Fetching Finnhub data for ${symbol} (mapped to ${mappedSymbol})`);
                
                // Get quote data
                const quoteUrl = `${api.baseUrl}/quote?symbol=${mappedSymbol}&token=${api.key}`;
                console.log(`DEBUG: Request URL: ${quoteUrl}`);
                
                const quoteResponse = await fetch(quoteUrl);
                
                if (!quoteResponse.ok) {
                    throw new Error(`HTTP ${quoteResponse.status}: ${quoteResponse.statusText}`);
                }
                
                const quoteData = await quoteResponse.json();
                console.log(`DEBUG: Finnhub response for ${symbol}:`, quoteData);
                
                // Check for error response from Finnhub
                if (quoteData.error) {
                    throw new Error(`Finnhub API error: ${quoteData.error}`);
                }
                
                if (quoteData.c && quoteData.c > 0) {
                    const change = quoteData.c - quoteData.pc;
                    const changePercent = (change / quoteData.pc) * 100;
                    
                    results.push({
                        symbol: symbol,
                        price: quoteData.c,
                        change: change,
                        changePercent: changePercent,
                        history: await this.fetchFinnhubCandles(api, mappedSymbol)
                    });
                    console.log(`DEBUG: Successfully processed ${symbol}`);
                } else {
                    console.log(`DEBUG: Invalid data for ${symbol}: current price = ${quoteData.c}`);
                    results.push(null);
                }
                
                // Respect rate limits (60 requests per minute = 1 request per second)
                await this.delay(1000);
                
            } catch (error) {
                console.log(`Finnhub error for ${symbol}:`, error.message);
                console.error('DEBUG: Full error:', error);
                results.push(null);
            }
        }
        
        return results;
    }    // Symbol mapping functions for Finnhub API
    mapSymbolForFinnhub(symbol) {
        const mappings = {
            '^GSPC': 'SPY',
            '^IXIC': 'QQQ', 
            '^NYA': 'VTI'
        };
        return mappings[symbol] || symbol;
    }    async fetchFinnhubCandles(api, symbol) {
        try {
            // Note: stock/candle endpoint requires Premium subscription
            // For free tier, we'll generate demo data or use alternative approach
            console.log('Note: Finnhub candle data requires Premium subscription');
            console.log('Using demo chart data for symbol:', symbol);
            
            // Uncomment below if you have Premium Finnhub subscription:
            /*
            const to = Math.floor(Date.now() / 1000);
            const from = to - (7 * 24 * 60 * 60); // 7 days ago
            
            const response = await fetch(
                `${api.baseUrl}/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${api.key}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.s === 'ok' && data.c && data.c.length > 0) {
                return data.c.slice(-7); // Last 7 closing prices
            }
            */
        } catch (error) {
            console.log('Finnhub candles fetch error:', error);
        }
        
        return this.generateDemoChartData(7);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateDemoChartData(length) {
        const data = [];
        let value = 100 + Math.random() * 50;
        
        for (let i = 0; i < length; i++) {
            value += (Math.random() - 0.5) * 5;
            data.push(Math.max(50, value));
        }
        
        return data;
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
        if (priceValue) priceValue.textContent = formattedPrice;
        if (priceChange) priceChange.textContent = formattedChange;
        
        // Add color class
        if (priceChange) {
            priceChange.classList.remove('positive', 'negative');
            priceChange.classList.add(data.changePercent >= 0 ? 'positive' : 'negative');
        }
        
        // Update chart
        this.updateChart(data.symbol, data.history, data.changePercent >= 0);
        
        // Add visual feedback for successful update
        card.classList.add('updated');
        setTimeout(() => card.classList.remove('updated'), 1000);
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
      async useDemoData() {
        console.log('DEBUG: Using enhanced demo market data');
        
        // More realistic current market data with proper historical charts
        const demoData = [
            { 
                symbol: '^GSPC',
                price: 5847.63, 
                change: 48.45,
                changePercent: 0.84,
                history: [5800, 5820, 5835, 5845, 5840, 5850, 5847.63]
            },
            { 
                symbol: '^IXIC',
                price: 18540.85, 
                change: -42.73,
                changePercent: -0.23,
                history: [18600, 18580, 18565, 18570, 18550, 18545, 18540.85]
            },
            { 
                symbol: '^NYA',
                price: 19234.78, 
                change: 213.45,
                changePercent: 1.12,
                history: [19100, 19150, 19180, 19200, 19220, 19230, 19234.78]
            }
        ];
        
        this.marketCards.forEach((card, index) => {
            if (demoData[index]) {
                console.log(`DEBUG: Updating ${demoData[index].symbol} with enhanced demo data`);
                this.updateMarketCard(card, demoData[index]);
            }
        });
        
        // Add demo indicator
        this.addDemoIndicator();
        
        console.log('Enhanced demo market data loaded successfully');
    }
      addDemoIndicator() {
        // Add a small indicator that demo data is being used
        const indicator = document.createElement('div');
        indicator.className = 'demo-data-indicator';
        indicator.innerHTML = 'Demo Data - Add API keys for real-time data';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(255, 193, 7, 0.9);
            color: #000;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 1000;
            animation: fadeInOut 4s ease-in-out;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 4000);
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        // Clear charts
        this.charts.clear();
        
        // Remove API status display
        const statusDiv = document.querySelector('.api-status');
        if (statusDiv && statusDiv.parentNode) {
            statusDiv.parentNode.removeChild(statusDiv);
        }
        
        console.log('DEBUG: MarketDashboard destroyed');
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

// ===================================
// Interactive Code Playground
// ===================================

class CodePlayground {
    constructor() {
        this.currentLanguage = 'javascript';
        this.codeEditor = document.getElementById('codeEditor');
        this.codeOutput = document.getElementById('codeOutput');
        this.runBtn = document.getElementById('runCode');
        this.clearBtn = document.getElementById('clearCode');
        this.copyBtn = document.getElementById('copyCode');
        this.clearOutputBtn = document.getElementById('clearOutput');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.snippetBtns = document.querySelectorAll('.load-snippet-btn');
        
        this.codeExamples = {
            'js-arrays': {
                language: 'javascript',
                title: 'JavaScript Array Methods',
                code: `// JavaScript Array Methods Demo
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log('Original array:', numbers);

// Filter even numbers
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log('Even numbers:', evenNumbers);

// Map to squares
const squares = numbers.map(num => num * num);
console.log('Squares:', squares);

// Reduce to sum
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log('Sum:', sum);

// Find first number > 5
const firstLarge = numbers.find(num => num > 5);
console.log('First number > 5:', firstLarge);

// Check if any number > 8
const hasLarge = numbers.some(num => num > 8);
console.log('Has number > 8:', hasLarge);`
            },
            'js-fetch': {
                language: 'javascript',
                title: 'Async/Await API Demo',
                code: `// Async/Await API Fetch Demo
async function fetchUserData() {
    try {
        console.log('Fetching user data...');
        
        // Simulate API call
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const user = await response.json();
        
        console.log('User data received:');
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        console.log('Company:', user.company.name);
        console.log('Address:', \`\${user.address.city}, \${user.address.zipcode}\`);
        
        return user;
    } catch (error) {
        console.error('Error fetching user data:', error.message);
    }
}

// Execute the async function
fetchUserData();`
            },            'py-data': {
                language: 'python',
                title: 'Python Data Analysis',
                code: `# Python Data Analysis Example
import json
from datetime import datetime

# Sample sales data
sales_data = [
    {"product": "Laptop", "price": 999.99, "quantity": 5, "date": "2024-01-15"},
    {"product": "Phone", "price": 599.99, "quantity": 12, "date": "2024-01-16"},
    {"product": "Tablet", "price": 299.99, "quantity": 8, "date": "2024-01-17"},
    {"product": "Monitor", "price": 199.99, "quantity": 6, "date": "2024-01-18"},
    {"product": "Keyboard", "price": 79.99, "quantity": 15, "date": "2024-01-19"}
]

print("Sales Data Analysis")
print("=" * 30)

# Calculate total revenue
total_revenue = sum(item["price"] * item["quantity"] for item in sales_data)
print(f"Total Revenue: \${total_revenue:,.2f}")

# Find best selling product by quantity
best_seller = max(sales_data, key=lambda x: x["quantity"])
print(f"Best Seller: {best_seller['product']} ({best_seller['quantity']} units)")

# Calculate average price
avg_price = sum(item["price"] for item in sales_data) / len(sales_data)
print(f"Average Price: \${avg_price:.2f}")

# Products over $200
expensive_products = [item["product"] for item in sales_data if item["price"] > 200]
print(f"Products over $200: {', '.join(expensive_products)}")

# Generate summary report
print("\\nDetailed Report:")
for item in sales_data:
    revenue = item["price"] * item["quantity"]
    print(f"• {item['product']}: {item['quantity']} × \${item['price']:.2f} = \${revenue:,.2f}")`
            },
            'html-component': {
                language: 'html',
                title: 'Interactive HTML Component',
                code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Counter</title>
    <style>
        .counter-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            color: white;
            font-family: 'Arial', sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 300px;
            margin: 20px auto;
        }
        
        .counter-display {
            font-size: 3rem;
            font-weight: bold;
            margin: 20px 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .counter-btn {
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            padding: 12px 24px;
            margin: 0 10px;
            border-radius: 50px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }
        
        .counter-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        
        .reset-btn {
            background: rgba(255,99,99,0.8);
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="counter-container">
        <h2>Interactive Counter</h2>
        <div id="counterDisplay" class="counter-display">0</div>
        <div>
            <button class="counter-btn" onclick="decrement()">-</button>
            <button class="counter-btn" onclick="increment()">+</button>
        </div>
        <button class="counter-btn reset-btn" onclick="reset()">Reset</button>
    </div>

    <script>
        let count = 0;
        const display = document.getElementById('counterDisplay');
        
        function updateDisplay() {
            display.textContent = count;
            display.style.transform = 'scale(1.1)';
            setTimeout(() => display.style.transform = 'scale(1)', 150);
        }
        
        function increment() {
            count++;
            updateDisplay();
        }
        
        function decrement() {
            count--;
            updateDisplay();
        }
        
        function reset() {
            count = 0;
            updateDisplay();
        }
    </script>
</body>
</html>`
            }
        };
        
        this.init();
    }
    
    init() {
        if (!this.codeEditor) return; // Exit if playground elements don't exist
        
        this.setupEventListeners();
        this.loadDefaultCode();
    }
    
    setupEventListeners() {
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchLanguage(btn.dataset.language));
        });
        
        // Control buttons
        if (this.runBtn) this.runBtn.addEventListener('click', () => this.runCode());
        if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearCode());
        if (this.copyBtn) this.copyBtn.addEventListener('click', () => this.copyCode());
        if (this.clearOutputBtn) this.clearOutputBtn.addEventListener('click', () => this.clearOutput());
        
        // Snippet loading
        this.snippetBtns.forEach(btn => {
            btn.addEventListener('click', () => this.loadSnippet(btn.dataset.snippet));
        });
        
        // Keyboard shortcuts
        this.codeEditor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.runCode();
                } else if (e.key === 'k') {
                    e.preventDefault();
                    this.clearOutput();
                }
            }
            
            // Tab handling
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.codeEditor.selectionStart;
                const end = this.codeEditor.selectionEnd;
                const value = this.codeEditor.value;
                
                this.codeEditor.value = value.substring(0, start) + '  ' + value.substring(end);
                this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 2;
            }
        });
    }
    
    switchLanguage(language) {
        this.currentLanguage = language;
        
        // Update active tab
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.language === language);
        });
        
        // Update placeholder
        const placeholders = {
            javascript: '// Write your JavaScript code here...\\nconsole.log("Hello, World!");',
            python: '# Write your Python code here...\\nprint("Hello, World!")',
            html: '<!-- Write your HTML/CSS/JS code here -->\\n<!DOCTYPE html>\\n<html>\\n<head>\\n    <title>My Page</title>\\n</head>\\n<body>\\n    <h1>Hello, World!</h1>\\n</body>\\n</html>'
        };
        
        this.codeEditor.placeholder = placeholders[language] || '// Write your code here...';
        
        // Clear editor if switching languages
        if (this.codeEditor.value.trim() === '') {
            this.loadDefaultCode();
        }
    }
    
    loadDefaultCode() {
        const defaultCode = {
            javascript: `// Welcome to the JavaScript Playground!
console.log("Hello, World!");

// Try some array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);`,
            python: `# Welcome to the Python Playground!
print("Hello, World!")

# Try some list operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Original:", numbers)
print("Doubled:", doubled)`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Demo Page</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .highlight { color: #ca254e; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Hello, <span class="highlight">World!</span></h1>
    <p>Welcome to the HTML playground.</p>
    
    <script>
        console.log("JavaScript is working!");
    </script>
</body>
</html>`
        };
        
        this.codeEditor.value = defaultCode[this.currentLanguage] || '';
    }
    
    runCode() {
        const code = this.codeEditor.value.trim();
        if (!code) {
            this.addOutput('Please enter some code to run.', 'info');
            return;
        }
        
        this.clearOutput();
        this.addOutput(`Running ${this.currentLanguage} code...`, 'info');
        
        try {
            if (this.currentLanguage === 'javascript') {
                this.runJavaScript(code);
            } else if (this.currentLanguage === 'python') {
                this.runPython(code);
            } else if (this.currentLanguage === 'html') {
                this.runHTML(code);
            }
        } catch (error) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }
    }
    
    runJavaScript(code) {
        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        const outputs = [];
        
        console.log = (...args) => {
            outputs.push({ type: 'log', content: args.map(arg => this.formatValue(arg)).join(' ') });
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            outputs.push({ type: 'error', content: args.map(arg => this.formatValue(arg)).join(' ') });
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            outputs.push({ type: 'warn', content: args.map(arg => this.formatValue(arg)).join(' ') });
            originalWarn.apply(console, args);
        };
        
        try {
            // Execute the code
            const result = eval(code);
            
            // Show console outputs
            outputs.forEach(output => {
                this.addOutput(output.content, output.type === 'error' ? 'error' : output.type === 'warn' ? 'info' : 'success');
            });
            
            // Show return value if it exists and isn't undefined
            if (result !== undefined) {
                this.addOutput(`Return value: ${this.formatValue(result)}`, 'info');
            }
            
            if (outputs.length === 0 && result === undefined) {
                this.addOutput('Code executed successfully (no output)', 'success');
            }
            
        } catch (error) {
            this.addOutput(`JavaScript Error: ${error.message}`, 'error');
        } finally {
            // Restore original console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        }
    }
    
    runPython(code) {
        this.addOutput('Python execution is simulated in this demo.', 'info');
        this.addOutput('In a real implementation, this would use:', 'info');
        this.addOutput('• Pyodide (Python in WebAssembly)', 'info');
        this.addOutput('• Server-side Python execution', 'info');
        this.addOutput('• Or browser-based Python interpreter', 'info');
        this.addOutput('', '');
        this.addOutput('Simulated output for your Python code:', 'success');
        
        // Simple simulation - look for print statements
        const printMatches = code.match(/print\\([^)]+\\)/g);
        if (printMatches) {
            printMatches.forEach(match => {
                const content = match.replace(/print\\(|\\)/g, '').replace(/['"]/g, '');
                this.addOutput(content, 'success');
            });
        } else {
            this.addOutput('Python code would execute here', 'success');
        }
    }
    
    runHTML(code) {
        // Create a new window/iframe to display HTML
        const newWindow = window.open('', '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        
        if (newWindow) {
            newWindow.document.write(code);
            newWindow.document.close();
            this.addOutput('HTML code opened in new window', 'success');
        } else {
            // Fallback: show in output area
            this.addOutput('HTML Preview:', 'info');
            this.addOutput('(Pop-up blocked - code would open in new window)', 'info');
            this.addOutput('', '');
            this.addOutput(code, 'info');
        }
    }
    
    formatValue(value) {
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    }
    
    addOutput(content, type = 'info') {
        const outputLine = document.createElement('div');
        outputLine.className = `output-line output-${type}`;
        outputLine.textContent = content;
        this.codeOutput.appendChild(outputLine);
        this.codeOutput.scrollTop = this.codeOutput.scrollHeight;
    }
    
    clearCode() {
        this.codeEditor.value = '';
        this.codeEditor.focus();
    }
    
    clearOutput() {
        this.codeOutput.innerHTML = '';
    }
    
    copyCode() {
        navigator.clipboard.writeText(this.codeEditor.value).then(() => {
            // Visual feedback
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
        });
    }
    
    loadSnippet(snippetId) {
        const snippet = this.codeExamples[snippetId];
        if (snippet) {
            // Switch to the correct language tab
            this.switchLanguage(snippet.language);
            
            // Load the code
            this.codeEditor.value = snippet.code;
            
            // Clear output and show info
            this.clearOutput();
            this.addOutput(`Loaded: ${snippet.title}`, 'info');
            this.addOutput('Click "Run Code" to execute this example', 'info');
        }
    }
}

// ===================================
// Application Initialization
// ===================================

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DEBUG: DOM loaded, initializing application components...');
    
    try {
        // Initialize core components
        const themeController = new ThemeController();
        const statsCounter = new StatsCounter();
        const skillsAnimator = new SkillsAnimator();
        const marketDashboard = new MarketDashboard();
        const navbarController = new NavbarController();
        const scrollAnimations = new ScrollAnimations();
        const mobileMenuController = new MobileMenuController();
        const scrollToTop = new ScrollToTop();
        const performanceOptimizer = new PerformanceOptimizer();
        const aosAnimations = new AOSAnimations();
        
        // Initialize interactive features
        const particleSystem = new InteractiveParticleSystem();
        const ledLights = new LEDLightsManager();
        
        // Initialize code playground
        const codePlayground = new CodePlayground();
        
        console.log('DEBUG: All application components initialized successfully');
        
        // Add global debug helpers
        window.debugMarketDashboard = window.debugMarketDashboard || (() => {
            console.log('Market Dashboard Debug not available');
        });
        
        window.testFinnhubAPI = window.testFinnhubAPI || (() => {
            console.log('Finnhub API test not available');
        });
        
    } catch (error) {
        console.error('DEBUG: Error initializing application:', error);
    }
});

console.log('DEBUG: Added CodePlayground class and initialization to app.js');

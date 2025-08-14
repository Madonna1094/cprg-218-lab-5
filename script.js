// OpenWeatherMap API Configuration
const OPENWEATHER_API_KEY = "c886592794cd631fd9a263f63e0fddd5"; // Replace with your actual API key
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Initialize website when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎨 LuxeLocks Hair Studio - Initializing...');

    initNavigation();
    initWeather();
    initQuotes();
    initContactForm();
    initServiceCards();
    initGallery();
    initScrollEffects();
    initOtherFeatures();

    console.log('✨ Website fully loaded and ready!');
});

// Navigation functionality
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Weather API functionality
function initWeather() {
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const cityInput = document.getElementById('cityInput');

    if (getWeatherBtn) {
        getWeatherBtn.addEventListener('click', fetchWeatherAPI);

        // Load Calgary weather by default
        setTimeout(fetchWeatherAPI, 1000);
    }

    if (cityInput) {
        cityInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                fetchWeatherAPI();
            }
        });
    }
}

async function fetchWeatherAPI() {
    console.log('🌤️ Fetching weather data...');

    const cityInput = document.getElementById("cityInput");
    const city = (cityInput && cityInput.value.trim()) ? cityInput.value.trim() : "Calgary";

    const elements = {
        cityName: document.getElementById('cityName'),
        weatherTemp: document.getElementById('weatherTemp'),
        weatherDesc: document.getElementById('weatherDesc'),
        humidity: document.getElementById('humidity'),
        windSpeed: document.getElementById('windSpeed')
    };

    if (!elements.cityName) {
        console.log('❌ Weather elements not found');
        return;
    }

    // Show loading state
    elements.cityName.textContent = 'Loading...';
    elements.weatherTemp.innerHTML = '<div class="loading"></div>';
    elements.weatherDesc.textContent = 'Fetching weather data...';
    elements.humidity.textContent = '--';
    elements.windSpeed.textContent = '--';

    try {
        let weatherData;

        // Check if API key is provided and valid
        if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== "YOUR_API_KEY_HERE" && OPENWEATHER_API_KEY.length > 10) {
            weatherData = await fetchOpenWeatherMap(city);
        } else {
            console.warn('⚠️ OpenWeatherMap API key not provided. Using fallback data.');
            throw new Error('No valid API key provided');
        }

        // Display the weather data
        elements.cityName.textContent = weatherData.location;
        elements.weatherTemp.textContent = `${weatherData.temperature}°C`;
        elements.weatherDesc.textContent = weatherData.description;
        elements.humidity.textContent = `Humidity: ${weatherData.humidity}%`;
        elements.windSpeed.textContent = `Wind: ${weatherData.windSpeed} km/h`;

        console.log('✅ Weather data loaded successfully from OpenWeatherMap');

    } catch (error) {
        console.error('❌ OpenWeatherMap API error:', error.message);
        displayFallbackWeather(city, elements);
    }
}

async function fetchOpenWeatherMap(city) {
    const url = `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else if (response.status === 404) {
            throw new Error(`City "${city}" not found. Please try a different city name.`);
        } else {
            throw new Error(`OpenWeatherMap API error: ${response.status}`);
        }
    }

    const data = await response.json();

    return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
    };
}

function displayFallbackWeather(city, elements) {
    console.log('🔄 Using fallback weather data');

    const fallbackData = {
        Calgary: { temp: 15, desc: 'Partly Cloudy', humidity: 65, wind: 12 },
        Toronto: { temp: 18, desc: 'Sunny', humidity: 55, wind: 8 },
        Vancouver: { temp: 12, desc: 'Light Rain', humidity: 80, wind: 15 },
        Montreal: { temp: 16, desc: 'Overcast', humidity: 70, wind: 10 },
        Edmonton: { temp: 10, desc: 'Clear', humidity: 50, wind: 8 },
        default: {
            temp: Math.floor(Math.random() * 25) + 5,
            desc: 'Variable Conditions',
            humidity: Math.floor(Math.random() * 40) + 40,
            wind: Math.floor(Math.random() * 20) + 5
        }
    };

    const weather = fallbackData[city] || fallbackData.default;

    elements.cityName.textContent = city;
    elements.weatherTemp.textContent = `${weather.temp}°C`;
    elements.weatherDesc.textContent = weather.desc;
    elements.humidity.textContent = `Humidity: ${weather.humidity}%`;
    elements.windSpeed.textContent = `Wind: ${weather.wind} km/h`;
}

// Quote functionality
function initQuotes() {
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', fetchQuote);

        // Load initial quote after a short delay
        setTimeout(fetchQuote, 2000);
    }
}

async function fetchQuote() {
    console.log('💭 Fetching inspirational quote...');

    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');

    if (!quoteText || !quoteAuthor) {
        return;
    }

    // Show loading
    quoteText.innerHTML = '<div class="loading"></div>';
    quoteAuthor.textContent = 'Loading inspiring quote...';

    try {
        // Using the Quotable API (free, no key required)
        const response = await fetch('https://api.quotable.io/random?tags=inspirational,motivational,wisdom&minLength=30');

        if (response.ok) {
            const data = await response.json();

            setTimeout(() => {
                quoteText.innerHTML = `"${data.content}"`;
                quoteAuthor.textContent = `— ${data.author}`;
            }, 800);

            console.log('✅ Quote loaded successfully from API');
        } else {
            throw new Error('Quote API unavailable');
        }
    } catch (error) {
        console.error('❌ Quote API error:', error.message);
        console.log('🔄 Using fallback quotes');

        // Fallback quotes
        const fallbackQuotes = [
            { content: "Life is too short to have boring hair.", author: "Hair Wisdom" },
            { content: "Good hair speaks louder than words.", author: "Beauty Proverb" },
            { content: "Invest in your hair, it is the crown you never take off.", author: "Style Philosophy" },
            { content: "A woman who cuts her hair is about to change her life.", author: "Coco Chanel" },
            { content: "Your hair is 90% of your selfie.", author: "Modern Truth" },
            { content: "Confidence is the best accessory, but great hair is a close second.", author: "Beauty Truth" },
            { content: "Great hair doesn't happen by chance, it happens by appointment.", author: "Stylist Motto" },
            { content: "Hair is a beautiful form of self-expression.", author: "Artistic Truth" },
            { content: "The difference between a bad hair day and a good hair day is attitude.", author: "Life Lesson" },
            { content: "Your hair is your best accessory.", author: "Fashion Wisdom" }
        ];

        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

        setTimeout(() => {
            quoteText.innerHTML = `"${randomQuote.content}"`;
            quoteAuthor.textContent = `— ${randomQuote.author}`;
        }, 800);
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value.trim();
    });

    // Validation
    if (!formObject.name || !formObject.email) {
        showAlert('Please fill in all required fields (Name and Email).', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }

    // Date validation (must be future date)
    if (formObject.date) {
        const selectedDate = new Date(formObject.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showAlert('Please select a future date for your appointment.', 'error');
            return;
        }
    }

    // Phone validation (basic)
    if (formObject.phone && formObject.phone.length < 10) {
        showAlert('Please enter a valid phone number.', 'error');
        return;
    }

    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            showAlert(`Thank you ${formObject.name}! We'll contact you within 24 hours to confirm your appointment.`, 'success');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Reset date minimum
            const dateInput = document.getElementById('date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }
        }, 1500);
    }
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: 15px; background: none; border: none; color: inherit; font-size: 18px; cursor: pointer;">&times;</button>
    `;

    // Style the alert
    const alertStyles = {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    Object.assign(alert.style, alertStyles);

    if (type === 'success') {
        alert.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        alert.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        alert.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Service cards functionality
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.dataset.service;
            const serviceSelect = document.getElementById('service');

            if (serviceSelect && service) {
                // Map service data to select options
                const serviceMap = {
                    'haircut': 'haircut',
                    'color': 'color',
                    'styling': 'styling'
                };

                serviceSelect.value = serviceMap[service] || '';

                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const offsetTop = contactSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Highlight the form briefly
                    const formContainer = document.querySelector('.form-container');
                    if (formContainer) {
                        formContainer.style.transform = 'scale(1.02)';
                        formContainer.style.transition = 'transform 0.3s ease';
                        setTimeout(() => {
                            formContainer.style.transform = 'scale(1)';
                        }, 300);
                    }

                    // Show success message
                    setTimeout(() => {
                        showAlert('Service pre-selected! Please fill out the form to book your appointment.', 'info');
                    }, 500);
                }
            }
        });
    });
}

// Gallery functionality
function initGallery() {
    // Modal functions are defined globally for onclick attributes
    console.log('🖼️ Gallery initialized');
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    if (modal && modalImage) {
        modal.style.display = 'block';
        modalImage.src = imageSrc;
        document.body.style.overflow = 'hidden';

        // Add fade in animation
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transition = 'opacity 0.3s ease';
        }, 10);
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .gallery-item, .footer-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVideo = document.querySelector('.hero-video');

        if (heroVideo) {
            const rate = scrolled * -0.5;
            heroVideo.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Other functionality and event listeners
function initOtherFeatures() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('imageModal');
        if (modal && e.target === modal) {
            closeModal();
        }
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();

            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });

    // Image loading optimization
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });

    // Add loading states to buttons
    const buttons = document.querySelectorAll('button, .cta, .submit-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');

            // Add validation feedback
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.parentElement.classList.add('error');
            } else {
                this.parentElement.classList.remove('error');
            }
        });

        // Real-time email validation
        if (input.type === 'email') {
            input.addEventListener('input', function () {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.parentElement.classList.add('error');
                } else {
                    this.parentElement.classList.remove('error');
                }
            });
        }

        // Phone number formatting
        if (input.type === 'tel') {
            input.addEventListener('input', function () {
                let value = this.value.replace(/\D/g, '');
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
                }
                this.value = value;
            });
        }
    });

    // Add custom CSS for enhanced form styles
    const style = document.createElement('style');
    style.textContent = `
        .form-group.focused input,
        .form-group.focused textarea,
        .form-group.focused select {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3) !important;
        }
        
        .form-group.error input,
        .form-group.error textarea,
        .form-group.error select {
            border-color: #f44336 !important;
            box-shadow: 0 0 10px rgba(244, 67, 54, 0.3) !important;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('🎯 All features initialized successfully!');
}

// Utility functions
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

// Performance optimization
const debouncedScroll = debounce(() => {
    // Any scroll-based animations or effects
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🔧 Service Worker registered successfully');
            })
            .catch(error => {
                console.log('Service Worker registration failed');
            });
    });
}

// Global functions for HTML onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;

// Test functions for debugging
window.testWeather = fetchWeatherAPI;
window.testQuote = fetchQuote;

// Easter egg - Konami code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);

    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }

    if (konamiCode.join(',') === konami.join(',')) {
        showAlert('🎉 Konami Code activated! You found the easter egg!', 'success');
        document.body.style.animation = 'rainbow 2s infinite';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);

        konamiCode = [];
    }
});

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

console.log('💇‍♀️ LuxeLocks Hair Studio script loaded successfully!');
console.log('💡 Tips:');
console.log('   - Test weather: testWeather()');
console.log('   - Test quote: testQuote()');
console.log('   - Try the Konami code: ↑↑↓↓←→←→BA');
console.log('🔧 To use real weather data, get your API key from https://openweathermap.org/api');
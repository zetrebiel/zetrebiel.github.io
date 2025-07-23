// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.area-card, .stat-item, .contact-item').forEach(el => {
    observer.observe(el);
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('%') ? '%' : '+');
        }
    }, 16);
};

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const number = entry.target.querySelector('.stat-number');
            const text = number.textContent;
            const value = parseInt(text);
            
            if (!isNaN(value)) {
                number.textContent = '0' + (text.includes('%') ? '%' : '+');
                animateCounter(number, value);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
    
    // If image is already loaded
    if (img.complete) {
        img.style.opacity = '1';
    }
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const rate = scrolled * -0.5;
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
});

// WhatsApp button click tracking
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        // You can add analytics tracking here if needed
        console.log('WhatsApp contact initiated');
    });
});

// Form validation (if you add a contact form later)
const validateForm = (form) => {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
};

// Debounce function for performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimize scroll performance
const optimizedScrollHandler = debounce(() => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (scrolled > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// Focus management for mobile menu
hamburger?.addEventListener('click', () => {
    if (navMenu?.classList.contains('active')) {
        // Focus first menu item when menu opens
        setTimeout(() => {
            navMenu.querySelector('a')?.focus();
        }, 100);
    }
});

// Auto-hide mobile menu when screen size changes
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// Preload critical images
const preloadImages = () => {
    const criticalImages = [
        'Background.png',
        'Background-2.png',
        'Adobe Express - file (1).png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    
    // Add loading class to body
    document.body.classList.add('loaded');
});

// Service Worker registration (for PWA capabilities - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want to add PWA support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}

// Performance monitoring
const measurePerformance = () => {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
};

measurePerformance();

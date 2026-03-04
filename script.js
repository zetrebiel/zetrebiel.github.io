// ═══════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Fechar menu com Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Fechar menu ao redimensionar
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ═══════════════════════════════════════
// HEADER SCROLL
// ═══════════════════════════════════════
const header = document.querySelector('.header');

const handleHeaderScroll = () => {
    if (window.scrollY > 60) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // run on load

// ═══════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ═══════════════════════════════════════
// INTERSECTION OBSERVER – FADE IN
// ═══════════════════════════════════════
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.area-card, .contact-item, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// ═══════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════
const animateCounter = (element, target, suffix = '') => {
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        element.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const numberEl = entry.target.querySelector('.stat-number');
            const spanEl = numberEl?.querySelector('span');

            if (numberEl) {
                const rawText = numberEl.textContent.replace(/[^0-9]/g, '');
                const value = parseInt(rawText);
                const suffix = spanEl ? spanEl.textContent : '';

                if (!isNaN(value)) {
                    numberEl.textContent = '0';
                    animateCounter(numberEl, value, suffix);
                    // re-append span after animation ends
                    if (suffix) {
                        setTimeout(() => {
                            numberEl.textContent = value;
                            const sp = document.createElement('span');
                            sp.textContent = suffix;
                            numberEl.appendChild(sp);
                        }, 1850);
                    }
                }
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-item').forEach(stat => statsObserver.observe(stat));

// ═══════════════════════════════════════
// PARALLAX HERO BG (suave)
// ═══════════════════════════════════════
const heroBackground = document.querySelector('.hero-background');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            if (heroBackground && scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ═══════════════════════════════════════
// WHATSAPP TRACKING
// ═══════════════════════════════════════
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', { 'send_to': 'AW-16557635612' });
        }
        console.log('WhatsApp contact initiated');
    });
});

// ═══════════════════════════════════════
// PRELOAD IMAGES
// ═══════════════════════════════════════
const preloadImages = () => {
    ['Background.png', 'Background-2.png', 'dr_gabriel007.png'].forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    document.body.classList.add('loaded');
});

// ═══════════════════════════════════════
// PERFORMANCE
// ═══════════════════════════════════════
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

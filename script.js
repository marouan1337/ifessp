// ===========================
// Splash Screen & Scroll Lock
// ===========================
document.body.style.overflow = 'hidden';

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            document.body.style.overflow = '';
            setTimeout(() => {
                splashScreen.remove();
            }, 800);
        }, 2200);
    }
});

// ===========================
// Mobile Menu Toggle
// ===========================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// ===========================
// Scroll Indicator Click
// ===========================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ===========================
// Navbar Scroll Effect (opacity from 0 → 1 across hero)
// ===========================
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('accueil');

function updateNavbarOpacity() {
    const scrollY = window.pageYOffset;
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    if (!heroSection) {
        if (navbar) {
            navbar.style.setProperty('--navbar-bg-opacity', '1');
            navbar.style.setProperty('--navbar-blur', '12px');
            navbar.classList.add('scrolled');
        }
        return;
    }
    const heroHeight = heroSection.offsetHeight;
    const halfRange = Math.max(1, (heroHeight - navbarHeight) / 2);
    const progress = Math.min(1, Math.max(0, scrollY / halfRange));
    if (navbar) {
        navbar.style.setProperty('--navbar-bg-opacity', progress.toFixed(2));
        navbar.style.setProperty('--navbar-blur', `${(progress * 12).toFixed(1)}px`);
        if (progress > 0.05) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

window.addEventListener('scroll', updateNavbarOpacity);
window.addEventListener('load', updateNavbarOpacity);

// ===========================
// Active Navigation Link
// ===========================
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ===========================
// Counter Animation for Stats
// ===========================
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Intersection Observer for Stats Animation
const statsSection = document.querySelector('.stats-section');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===========================
// Scroll Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animateElements = document.querySelectorAll(`
    .pillar-card, 
    .program-card, 
    .pedagogy-item, 
    .step,
    .contact-card,
    .about-text,
    .about-image,
    .reel-card
`);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// ===========================
// EmailJS Configuration
// ===========================
// Initialize EmailJS with your public key
// Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
const EMAILJS_PUBLIC_KEY = 'fH-HdEp2hWAitAZ4e';
const EMAILJS_SERVICE_ID = 'service_ke3uhiz';
const EMAILJS_TEMPLATE_ID = 'template_bgeqfi5';

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// ===========================
// Contact Form Handling with EmailJS
// ===========================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            showNotification('Erreur: Service d\'email non disponible. Veuillez nous contacter directement par téléphone ou email.', 'error');
            // Scroll to contact info as fallback
            const contactInfo = document.querySelector('.contact-info');
            if (contactInfo) {
                contactInfo.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        
        // Disable submit button and show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';
        
        // Send email using EmailJS
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
                
                // Show success message
                showNotification('Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.', 'success');
                
                // Reset form
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Email send failed:', error);
                
                // Show error message
                showNotification('Erreur lors de l\'envoi du message. Veuillez réessayer ou nous contacter directement.', 'error');
            })
            .finally(() => {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });
}

// ===========================
// Notification System
// ===========================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Determine icon and color based on type
    let icon = 'fa-info-circle';
    let bgColor = '#0066cc';
    
    if (type === 'success') {
        icon = 'fa-check-circle';
        bgColor = '#00a651';
    } else if (type === 'error') {
        icon = 'fa-exclamation-circle';
        bgColor = '#dc3545';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.5s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .notification-content i {
        font-size: 1.5rem;
    }
`;
document.head.appendChild(style);

// ===========================
// Smooth Scroll Polyfill
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Handle empty hash or just # 
        if (targetId === '#' || targetId === '') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 90;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        } else {
            console.warn('Target element not found:', targetId);
        }
    });
});

// ===========================
// Loading Animation
// ===========================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===========================
// Prevent Horizontal Scroll
// ===========================
document.body.style.overflowX = 'hidden';

// ===========================
// Console Welcome Message
// ===========================
console.log(`
%c IFESSP - Institut de Formation d'Excellence aux Sciences de la Santé Paramédicale
%c Façonner l'avenir des soins de santé
`, 
'color: #0066cc; font-size: 18px; font-weight: bold;',
'color: #00a651; font-size: 14px;'
);

console.log('%c Contactez-nous: institutifessp@gmail.com | +212 528 89 33 22', 
'color: #666; font-size: 12px;');

// ===========================
// Welcome Ad Popup
// ===========================
const registrationNotification = document.getElementById('registrationNotification');
const notificationBackdrop = document.getElementById('notificationBackdrop');
const notificationClose = document.getElementById('notificationClose');
const notificationWhatsappBtn = document.getElementById('notificationWhatsappBtn');

function showWelcomePopup() {
    if (!notificationBackdrop || !registrationNotification) return;

    registrationNotification.classList.remove('closing');
    registrationNotification.classList.remove('show');
    void registrationNotification.offsetWidth;

    notificationBackdrop.classList.add('show');
    registrationNotification.classList.add('show');
}

function closeNotification() {
    if (registrationNotification && !registrationNotification.classList.contains('closing')) {
        registrationNotification.classList.add('closing');
        setTimeout(() => {
            registrationNotification.classList.remove('show', 'closing');
        }, 350);
    }
    if (notificationBackdrop) {
        notificationBackdrop.classList.remove('show');
    }
}

window.addEventListener('load', () => {
    // Delay welcome popup to show after splash screen finishes (2200ms splash + 800ms fade/delay)
    setTimeout(showWelcomePopup, 3000);
});

if (notificationClose) {
    notificationClose.addEventListener('click', closeNotification);
}

if (notificationBackdrop) {
    notificationBackdrop.addEventListener('click', closeNotification);
}

if (notificationWhatsappBtn) {
    notificationWhatsappBtn.addEventListener('click', closeNotification);
}

// ===========================
// Instagram Reels Player Logic
// ===========================
function toggleReelPlay(videoId) {
    const video = document.getElementById(videoId);
    if (!video) return;
    
    const wrapper = video.closest('.reel-video-wrapper');
    
    if (video.paused) {
        // Pause all other reels first
        document.querySelectorAll('.reel-video').forEach(otherVideo => {
            if (otherVideo.id !== videoId) {
                otherVideo.pause();
                const otherWrapper = otherVideo.closest('.reel-video-wrapper');
                if (otherWrapper) {
                    otherWrapper.classList.remove('playing');
                }
            }
        });
        
        video.play().then(() => {
            if (wrapper) wrapper.classList.add('playing');
        }).catch(err => {
            console.error("Video play failed:", err);
        });
    } else {
        video.pause();
        if (wrapper) wrapper.classList.remove('playing');
    }
}

function toggleReelMute(videoId, event) {
    if (event) event.stopPropagation();
    
    const video = document.getElementById(videoId);
    if (!video) return;
    
    const muteIcon = document.getElementById(`muteIcon_${videoId}`);
    
    if (video.muted) {
        video.muted = false;
        if (muteIcon) {
            muteIcon.className = 'fas fa-volume-up';
        }
    } else {
        video.muted = true;
        if (muteIcon) {
            muteIcon.className = 'fas fa-volume-mute';
        }
    }
}

// Set all reel videos as muted by default to allow autoplay or easy playing
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reel-video').forEach(video => {
        video.muted = true;
    });
});

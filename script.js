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
            // Highlight desktop navbar links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
            // Highlight mobile bottom navigation links
            document.querySelectorAll('.bottom-nav-link').forEach(link => {
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

// ===========================
// 3D Photo Stack Gallery Logic
// ===========================
const galleryImages = [
    { src: 'videos/images/720456937_17883095601597182_5062034245418421480_n.jpg', alt: 'Visite Allemagne - Laboratoire' },
    { src: 'videos/images/720486687_17883095733597182_3732460027811022017_n.jpg', alt: 'Visite Allemagne - Présentation' },
    { src: 'videos/images/720805135_17883095571597182_5343849750003792129_n.jpg', alt: 'Visite Allemagne - Rencontre' },
    { src: 'videos/images/720823151_17883095742597182_2212436952485131571_n.jpg', alt: 'Visite Allemagne - Échange' },
    { src: 'videos/images/720830635_17883095712597182_1000638403616514695_n.jpg', alt: 'Visite Allemagne - Visite Guidée' },
    { src: 'videos/images/721169607_17883095637597182_1877000477003121134_n.jpg', alt: 'Visite Allemagne - Infrastructures' },
    { src: 'videos/images/721382777_17883095682597182_6999787463856852087_n.jpg', alt: 'Visite Allemagne - Partenariat' },
    { src: 'videos/images/721463173_17883095619597182_7574078543037162009_n.jpg', alt: 'Visite Allemagne - Salles de Cours' },
    { src: 'videos/images/721466286_17883095589597182_8185118053405775284_n.jpg', alt: 'Visite Allemagne - Simulation' },
    { src: 'videos/images/721575594_17883095769597182_8546935717746890893_n.jpg', alt: 'Visite Allemagne - Discussion' },
    { src: 'videos/images/721842334_17883095691597182_8453519243650751662_n.jpg', alt: 'Visite Allemagne - Accueil' },
    { src: 'videos/images/722302692_17883095610597182_6629151459788624687_n.jpg', alt: 'Visite Allemagne - Coopération' },
    { src: 'videos/images/722562607_17883095628597182_976794544203117280_n.jpg', alt: 'Visite Allemagne - Groupe' },
    { src: 'videos/images/722605280_17883095751597182_2092857483779904543_n.jpg', alt: 'Visite Allemagne - Travail' },
    { src: 'videos/images/722637784_17883095724597182_7831050442840457253_n.jpg', alt: 'Visite Allemagne - Clinique' },
    { src: 'videos/images/722769073_17883095655597182_7760427336094645200_n.jpg', alt: 'Visite Allemagne - Clôture' },
    { src: 'videos/images/722934624_17883095673597182_2128884313880529188_n.jpg', alt: 'Visite Allemagne - Souvenir' },
    { src: 'videos/images/722974132_17883095664597182_5576268441183853085_n.jpg', alt: 'Visite Allemagne - Photos' },
    { src: 'videos/images/723066862_17883095580597182_5890015136713447145_n.jpg', alt: 'Visite Allemagne - Signature' }
];

document.addEventListener('DOMContentLoaded', () => {
    const photoStack = document.getElementById('photoStack');
    const prevBtn = document.getElementById('stackPrevBtn');
    const nextBtn = document.getElementById('stackNextBtn');
    
    if (!photoStack) return;
    
    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayInterval;
    
    // Create card elements
    const cards = [];
    galleryImages.forEach((imgData, index) => {
        const card = document.createElement('div');
        card.className = 'stack-card';
        
        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.loading = index < 4 ? 'eager' : 'lazy'; // Optimize loading for first few images
        
        const overlay = document.createElement('div');
        overlay.className = 'stack-card-overlay';
        overlay.textContent = `${index + 1} / ${galleryImages.length} — ${imgData.alt}`;
        
        card.appendChild(img);
        card.appendChild(overlay);
        photoStack.appendChild(card);
        cards.push(card);
    });
    
    // Function to update card visual positions based on currentIndex
    function updateStack() {
        const total = cards.length;
        
        cards.forEach((card, idx) => {
            // Calculate relative offset from current active card index
            let relativeIndex = (idx - currentIndex + total) % total;
            
            // Remove previous position classes
            card.className = 'stack-card';
            
            if (relativeIndex === 0) {
                card.classList.add('pos-0');
            } else if (relativeIndex === 1) {
                card.classList.add('pos-1');
            } else if (relativeIndex === 2) {
                card.classList.add('pos-2');
            } else if (relativeIndex === 3) {
                card.classList.add('pos-3');
            } else {
                card.classList.add('pos-hidden');
            }
        });
    }
    
    // Next photo transition
    function showNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Grab the top card (the current active one)
        const topCard = cards[currentIndex];
        
        // Apply throwing animation class
        topCard.classList.add('exit-next');
        
        // Move current index to next
        currentIndex = (currentIndex + 1) % cards.length;
        
        // Update positions of remaining cards after a tiny delay to let exit animation start
        setTimeout(() => {
            updateStack();
        }, 150);
        
        // Reset transitioning flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    // Previous photo transition
    function showPrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Previous card index becomes the active one
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        
        // The newly active card needs to slide back from the side
        const newTopCard = cards[currentIndex];
        
        // Set it up as exit-prev first (invisible on the left side)
        newTopCard.className = 'stack-card exit-prev';
        
        // Force reflow/layout so browser registers the starting position
        void newTopCard.offsetWidth;
        
        // Update the rest of the stack
        updateStack();
        
        // Reset transitioning flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    // Autoplay controls
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(showNext, 4000);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showNext();
            startAutoplay(); // Reset interval on user interaction
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showPrev();
            startAutoplay(); // Reset interval on user interaction
        });
    }
    
    // Support clicking on the top card itself to go next
    photoStack.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.stack-card');
        if (clickedCard && clickedCard.classList.contains('pos-0')) {
            showNext();
            startAutoplay();
        }
    });
    
    // Pause autoplay on mouse enter / resume on leave
    photoStack.addEventListener('mouseenter', stopAutoplay);
    photoStack.addEventListener('mouseleave', startAutoplay);
    
    // Support touchscreen swipe gestures
    let startX = 0;
    photoStack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoplay();
    }, { passive: true });
    
    photoStack.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        let diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) { // Threshold for swipe
            if (diffX > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
        startAutoplay();
    }, { passive: true });
    
    // Initialize Stack
    updateStack();
    startAutoplay();
});

// ===========================
// Campus Gallery & Lightbox Logic
// ===========================
const campusImages = [
    { src: 'videos/images_institute/573049894_17849305194597182_7692205241958361619_n.jpg', category: 'equipements', title: 'Laboratoire de Simulation', desc: 'Notre matériel médical haut de gamme pour des travaux pratiques immersifs.' },
    { src: 'videos/images_institute/573109364_17849305176597182_6946799640321513106_n.jpg', category: 'salles', title: 'Salle Clinique Pratique', desc: 'Un environnement d\'apprentissage réaliste simulant les conditions hospitalières.' },
    { src: 'videos/images_institute/574205939_17849305149597182_4340458481747411429_n.jpg', category: 'salles', title: 'Salle Pédagogique Moderne', desc: 'Des espaces spacieux propices à l\'assimilation des concepts théoriques.' },
    { src: 'videos/images_institute/581130109_17849305203597182_4462049097758053895_n.jpg', category: 'equipements', title: 'Matériel Diagnostic', desc: 'Équipements et chariots de soins réels pour manipuler en toute confiance.' },
    { src: 'videos/images_institute/581953768_17849305191597182_3216126014856054074_n.jpg', category: 'vie', title: 'Espaces d\'Échange', desc: 'Zones aménagées pour encourager le partage d\'idées et le travail de groupe.' },
    { src: 'videos/images_institute/582271988_17849305167597182_2382250900302926906_n.jpg', category: 'salles', title: 'Salle de Soins Pratiques', desc: 'Ateliers et lits d\'apprentissage clinique avec équipements de pointe.' },
    { src: 'videos/images_institute/582664094_17849305230597182_3218552260552464603_n.jpg', category: 'equipements', title: 'Mannequins de Soins', desc: 'Modèles de simulation anatomique complets pour la pratique infirmière.' },
    { src: 'videos/images_institute/582717823_17849305221597182_2802665168997147044_n.jpg', category: 'salles', title: 'Salle de Classe Interactive', desc: 'Salles équipées de projecteurs interactifs pour un enseignement moderne.' },
    { src: 'videos/images_institute/583424757_17849305158597182_7537686407611852159_n.jpg', category: 'equipements', title: 'Urgences & Soins Intensifs', desc: 'Apprentissage des gestes de premier secours et du monitorage critique.' },
    { src: 'videos/images_institute/583637153_17849305212597182_8942113472534172553_n.jpg', category: 'vie', title: 'Espace Accueil & Orientation', desc: 'Hall d\'entrée de l\'institut pour accueillir nos futurs lauréats.' }
];

document.addEventListener('DOMContentLoaded', () => {
    const campusPhotoStack = document.getElementById('campusPhotoStack');
    const campusPrevBtn = document.getElementById('campusPrevBtn');
    const campusNextBtn = document.getElementById('campusNextBtn');
    const filterBtns = document.querySelectorAll('.campus-info .gallery-filters .filter-btn');
    
    // Lightbox selectors
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!campusPhotoStack) return;
    
    let activeImages = [...campusImages];
    let currentCampusIndex = 0;
    let currentLightboxIndex = 0;
    let isCampusTransitioning = false;
    let campusAutoplayInterval;
    let campusCards = [];
    
    // Update transforms on resize to recalculate responsive Coverflow parameters
    window.addEventListener('resize', () => {
        if (campusCards.length > 0) {
            updateCampusStack();
        }
    });
    
    // 1. Populate/Render Stack Cards for 3D Coverflow Slider
    function renderCampusStack(filteredImages) {
        campusPhotoStack.innerHTML = '';
        campusCards = [];
        currentCampusIndex = 0;
        
        filteredImages.forEach((imgData, index) => {
            const card = document.createElement('div');
            card.className = 'campus-stack-card';
            
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.title;
            img.loading = index < 4 ? 'eager' : 'lazy';
            
            const overlay = document.createElement('div');
            overlay.className = 'campus-stack-card-overlay';
            
            const title = document.createElement('h4');
            title.textContent = imgData.title;
            
            const desc = document.createElement('p');
            desc.textContent = imgData.desc;
            
            overlay.appendChild(title);
            overlay.appendChild(desc);
            card.appendChild(img);
            card.appendChild(overlay);
            campusPhotoStack.appendChild(card);
            campusCards.push(card);
            
            // Clicking card logic: active card opens Lightbox, inactive card slides into center
            card.addEventListener('click', () => {
                if (index === currentCampusIndex) {
                    openLightbox(index);
                } else {
                    stopCampusAutoplay();
                    currentCampusIndex = index;
                    updateCampusStack();
                    startCampusAutoplay();
                }
            });
        });
        
        updateCampusStack();
    }
    
    // 2. Update Card Transforms (3D Coverflow positioning)
    function updateCampusStack() {
        const total = campusCards.length;
        if (total === 0) return;
        
        const width = window.innerWidth;
        let stepX, overlapX, baseZ;
        
        // Define Swiper-like coverflow offsets responsively
        if (width <= 480) {
            stepX = 40;     // horizontal gap between stacked cards
            overlapX = 65;  // separation offset of first card from center
            baseZ = -90;    // perspective depth push back
        } else if (width <= 768) {
            stepX = 60;
            overlapX = 85;
            baseZ = -120;
        } else if (width <= 992) {
            stepX = 80;
            overlapX = 110;
            baseZ = -150;
        } else {
            stepX = 100;
            overlapX = 140;
            baseZ = -180;
        }
        
        campusCards.forEach((card, idx) => {
            let offset = idx - currentCampusIndex;
            // Shortest circular path offset calculation
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            
            const absOffset = Math.abs(offset);
            
            if (offset === 0) {
                // Active Center Card: flat, centered, fully visible
                card.style.transform = `translate3d(0, 0, 0) rotateY(0deg) scale(1)`;
                card.style.opacity = '1';
                card.style.zIndex = '10';
                card.style.pointerEvents = 'auto';
                card.style.visibility = 'visible';
                card.classList.add('active-card');
            } else {
                const dir = offset > 0 ? 1 : -1;
                // Coverflow math calculations:
                const translateX = dir * (overlapX + (absOffset - 1) * stepX);
                const translateZ = baseZ * absOffset;
                const rotateY = -dir * 45; // angle cards inwards to face the active center card
                
                card.style.transform = `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(0.92)`;
                
                // Hide cards that are far off center to keep view clean and prevent overlapping clicks
                if (absOffset > 2) {
                    card.style.opacity = '0';
                    card.style.pointerEvents = 'none';
                    card.style.visibility = 'hidden';
                } else {
                    card.style.opacity = '0.65';
                    card.style.pointerEvents = 'auto';
                    card.style.visibility = 'visible';
                }
                card.style.zIndex = 10 - absOffset;
                card.classList.remove('active-card');
            }
        });
    }
    
    // 3. Coverflow transition sliders
    function showCampusNext() {
        const total = campusCards.length;
        if (total <= 1 || isCampusTransitioning) return;
        isCampusTransitioning = true;
        
        currentCampusIndex = (currentCampusIndex + 1) % total;
        updateCampusStack();
        
        setTimeout(() => {
            isCampusTransitioning = false;
        }, 850);
    }
    
    function showCampusPrev() {
        const total = campusCards.length;
        if (total <= 1 || isCampusTransitioning) return;
        isCampusTransitioning = true;
        
        currentCampusIndex = (currentCampusIndex - 1 + total) % total;
        updateCampusStack();
        
        setTimeout(() => {
            isCampusTransitioning = false;
        }, 850);
    }
    
    // Autoplay controllers
    function startCampusAutoplay() {
        stopCampusAutoplay();
        if (activeImages.length > 1) {
            campusAutoplayInterval = setInterval(showCampusNext, 4000);
        }
    }
    
    function stopCampusAutoplay() {
        if (campusAutoplayInterval) {
            clearInterval(campusAutoplayInterval);
        }
    }
    
    // 4. Tab filtering logic
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                // Animate stack container fade-out
                campusPhotoStack.style.opacity = '0';
                campusPhotoStack.style.transition = 'opacity 0.25s ease';
                
                setTimeout(() => {
                    if (filterValue === 'all') {
                        activeImages = [...campusImages];
                    } else {
                        activeImages = campusImages.filter(img => img.category === filterValue);
                    }
                    
                    renderCampusStack(activeImages);
                    startCampusAutoplay();
                    
                    campusPhotoStack.style.opacity = '1';
                }, 250);
            });
        });
    }
    
    // 5. Lightbox Functions
    function openLightbox(index) {
        if (!lightbox) return;
        currentLightboxIndex = index;
        updateLightboxContent();
        
        // Show lightbox and lock body scroll
        lightbox.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    function updateLightboxContent() {
        const imgData = activeImages[currentLightboxIndex];
        if (!imgData || !lightboxImg || !lightboxTitle || !lightboxDesc) return;
        
        lightboxImg.style.transform = 'scale(0.95)';
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.title;
            lightboxTitle.textContent = imgData.title;
            lightboxDesc.textContent = imgData.desc;
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
        }, 150);
    }
    
    function navigateLightbox(direction) {
        const total = activeImages.length;
        if (total === 0) return;
        
        if (direction === 'next') {
            currentLightboxIndex = (currentLightboxIndex + 1) % total;
        } else {
            currentLightboxIndex = (currentLightboxIndex - 1 + total) % total;
        }
        updateLightboxContent();
    }
    
    // Lightbox events
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    
    // Lightbox keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const isLightboxOpen = lightbox && !lightbox.hasAttribute('aria-hidden') && lightbox.getAttribute('aria-hidden') !== 'true';
        if (!isLightboxOpen) return;
        
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowRight') navigateLightbox('next');
        else if (e.key === 'ArrowLeft') navigateLightbox('prev');
    });
    
    // Lightbox swipe gestures
    let lightstartX = 0;
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            lightstartX = e.touches[0].clientX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].clientX;
            let diffX = lightstartX - endX;
            
            if (Math.abs(diffX) > 60) {
                if (diffX > 0) navigateLightbox('next');
                else navigateLightbox('prev');
            }
        }, { passive: true });
    }
    
    // 6. Hook up stack triggers
    if (campusNextBtn) {
        campusNextBtn.addEventListener('click', () => {
            showCampusNext();
            startCampusAutoplay();
        });
    }
    
    if (campusPrevBtn) {
        campusPrevBtn.addEventListener('click', () => {
            showCampusPrev();
            startCampusAutoplay();
        });
    }
    
    // Pause autoplay on mouse enter / resume on leave
    campusPhotoStack.addEventListener('mouseenter', stopCampusAutoplay);
    campusPhotoStack.addEventListener('mouseleave', startCampusAutoplay);
    
    // Swipe gestures for the campus photo deck
    let stackstartX = 0;
    let stackstartY = 0;
    campusPhotoStack.addEventListener('touchstart', (e) => {
        stackstartX = e.touches[0].clientX;
        stackstartY = e.touches[0].clientY;
        stopCampusAutoplay();
    }, { passive: true });
    
    campusPhotoStack.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;
        
        let diffX = stackstartX - endX;
        let diffY = stackstartY - endY;
        
        // Check if swipe is mostly vertical since the exit animations are vertical
        if (Math.abs(diffY) > 50 && Math.abs(diffY) > Math.abs(diffX)) {
            if (diffY > 0) {
                showCampusNext(); // swipe up
            } else {
                showCampusPrev(); // swipe down
            }
        } else if (Math.abs(diffX) > 50) {
            // Fallback to horizontal swipe as well
            if (diffX > 0) {
                showCampusNext();
            } else {
                showCampusPrev();
            }
        }
        
        startCampusAutoplay();
    }, { passive: true });
    
    // Initial Render and autoplay start
    renderCampusStack(campusImages);
    startCampusAutoplay();
});

// ===========================
// Mobile Bottom Sheet Navigation Drawer Logic
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    const bottomSheet = document.getElementById('bottomSheetMenu');
    const bottomNavMoreBtn = document.getElementById('bottomNavMoreBtn');
    const bottomSheetClose = document.getElementById('bottomSheetClose');
    const bottomSheetBackdrop = document.getElementById('bottomSheetBackdrop');
    const bottomSheetLinks = document.querySelectorAll('.bottom-sheet-link');
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
    
    if (!bottomSheet || !bottomNavMoreBtn) return;
    
    function showMenu() {
        bottomSheet.classList.add('show');
        bottomSheet.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden'; // Lock scrolling when menu is open
    }
    
    function hideMenu() {
        bottomSheet.classList.remove('show');
        bottomSheet.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Toggle opening
    bottomNavMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (bottomSheet.classList.contains('show')) {
            hideMenu();
        } else {
            showMenu();
        }
    });
    
    // Close events
    if (bottomSheetClose) bottomSheetClose.addEventListener('click', hideMenu);
    if (bottomSheetBackdrop) bottomSheetBackdrop.addEventListener('click', hideMenu);
    
    // Close sheet when a link inside it is clicked
    bottomSheetLinks.forEach(link => {
        link.addEventListener('click', () => {
            hideMenu();
        });
    });
    
    // Smooth scrolling for bottom nav links (Accueil, Campus, Programmes, Contact)
    bottomNavLinks.forEach(link => {
        if (link.id === 'bottomNavMoreBtn') return;
        
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 70; // Adjusted for mobile header height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});


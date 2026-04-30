// Initialize Lucide
lucide.createIcons();

// GSAP Setup
gsap.registerPlugin(ScrollTrigger);

// Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    gsap.to(loader, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
            loader.style.display = 'none';
            initHeroAnim();
        }
    });
});

// Navbar Scroll Effect
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Hero Animation
function initHeroAnim() {
    const tl = gsap.timeline();
    
    tl.from('.hero-text h1', {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    })
    .from('.hero-text .subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8
    }, '-=0.6')
    .from('.hero-visual', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
    }, '-=1');
}

// Reveal Animations
const reveals = document.querySelectorAll('[data-reveal]');
reveals.forEach((el) => {
    const delay = el.dataset.delay || 0;
    const isFadeLeft = el.dataset.reveal === 'fade-left';
    
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 0,
        x: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 1,
        delay: delay,
        ease: 'power3.out'
    });
});

// Scroll Active State for About Cards
gsap.utils.toArray('.about-card').forEach((card) => {
    ScrollTrigger.create({
        trigger: card,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => card.classList.add('active'),
        onLeave: () => card.classList.remove('active'),
        onEnterBack: () => card.classList.add('active'),
        onLeaveBack: () => card.classList.remove('active')
    });
});

// Scroll Active State for Bento Items
gsap.utils.toArray('.bento-item').forEach((item) => {
    ScrollTrigger.create({
        trigger: item,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => item.classList.add('active'),
        onLeave: () => item.classList.remove('active'),
        onEnterBack: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active')
    });
});

// Scroll Active State for Form
ScrollTrigger.create({
    trigger: '.form-card',
    start: 'top 70%',
    onEnter: () => document.querySelector('.form-card').classList.add('active'),
    onLeaveBack: () => document.querySelector('.form-card').classList.remove('active')
});

// Stats Cinematic Parallax
gsap.to('.stats-large-num', {
    scrollTrigger: {
        trigger: '.stats-cinematic',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
    },
    y: 150,
    ease: 'none'
});

gsap.to('.stats-bg-img', {
    scrollTrigger: {
        trigger: '.stats-cinematic',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
    },
    scale: 1.3,
    y: 30,
    ease: 'none'
});

// Mobile Menu Logic
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.nav-links');
const menuIcon = menuBtn.querySelector('i');

function closeMenu() {
    navLinks.classList.remove('active');
    menuIcon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
    document.body.style.overflow = 'auto';
}

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');
    
    menuIcon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
    lucide.createIcons();
    
    if (isActive) {
        gsap.from('.nav-links a', {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.out'
        });
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on scroll
window.addEventListener('scroll', () => {
    if (navLinks.classList.contains('active')) {
        closeMenu();
    }
}, { passive: true });

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        // Toggle current item
        if (!isActive) item.classList.add('active');
    });
});

// Form Validation & Feedback
const form = document.getElementById('contact-form');
const phoneInput = form.querySelector('input[type="tel"]');

// Only allow numbers in phone input
phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;

    // Reset styles
    inputs.forEach(input => input.classList.remove('error-state'));

    // 1. Check Full Name (At least two words)
    const nameInput = form.querySelector('input[placeholder="الأسم بالكامل"]');
    if (nameInput.value.trim().split(' ').length < 2) {
        nameInput.classList.add('error-state');
        isValid = false;
    }

    // 2. Check Phone (At least 11 digits)
    if (phoneInput.value.length < 11) {
        phoneInput.classList.add('error-state');
        isValid = false;
    }

    // 3. Check other required fields
    inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            input.classList.add('error-state');
            isValid = false;
        }
    });

    if (!isValid) {
        // Play shake animation (CSS class)
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        return;
    }

    // Success Flow
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'جاري الإرسال...';
    
    setTimeout(() => {
        btn.textContent = 'تم الإرسال بنجاح! ✓';
        btn.style.background = '#10b981';
        form.reset();
        
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    }, 1500);
});

// Parallax Blobs (Desktop Only)
if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        gsap.to('.blob-1', {
            x: x * 50,
            y: y * 50,
            duration: 2,
            ease: 'power2.out'
        });
        
        gsap.to('.blob-2', {
            x: -x * 50,
            y: -y * 50,
            duration: 2,
            ease: 'power2.out'
        });
    });
}

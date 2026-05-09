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

// =============================================
// PROFESSIONAL FORM VALIDATION SYSTEM
// =============================================

const form = document.getElementById('contact-form');
const phoneInput = form.querySelector('input[name="Phone"]');

// --- Helper Functions ---

function getFieldError(input) {
    return input.closest('.form-group').querySelector('.field-error');
}

function showError(input, message) {
    input.classList.remove('valid-state');
    input.classList.add('error-state');
    // Remove existing error if any
    const existing = getFieldError(input);
    if (existing) existing.remove();
    // Create new error message
    const err = document.createElement('div');
    err.className = 'field-error';
    err.textContent = message;
    input.closest('.form-group').appendChild(err);
    // Scroll to the first error field smoothly
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showSuccess(input) {
    input.classList.remove('error-state');
    input.classList.add('valid-state');
    const existing = getFieldError(input);
    if (existing) existing.remove();
}

function clearFieldState(input) {
    input.classList.remove('error-state', 'valid-state');
    const existing = getFieldError(input);
    if (existing) existing.remove();
}

// --- Validation Rules ---

function validateName(input) {
    const val = input.value.trim();
    if (!val) {
        showError(input, 'من فضلك أدخل اسمك بالكامل');
        return false;
    }
    // At least two words
    const words = val.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) {
        showError(input, 'يجب أن يحتوي الاسم على كلمتين على الأقل (الاسم الأول والأخير)');
        return false;
    }
    showSuccess(input);
    return true;
}

function validatePhone(input) {
    const val = input.value.trim();
    const validPrefixes = ['010', '011', '012', '015'];

    if (!val) {
        showError(input, 'من فضلك أدخل رقم هاتفك');
        return false;
    }
    if (!/^\d+$/.test(val)) {
        showError(input, 'رقم الهاتف يجب أن يحتوي على أرقام فقط');
        return false;
    }
    if (val.length !== 11) {
        showError(input, `رقم الهاتف يجب أن يكون 11 رقماً بالضبط (أدخلت ${val.length} رقم)`);
        return false;
    }
    if (!validPrefixes.some(prefix => val.startsWith(prefix))) {
        showError(input, 'رقم الهاتف يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015');
        return false;
    }
    showSuccess(input);
    return true;
}

function validateAge(input) {
    const val = input.value.trim();
    if (!val) {
        showError(input, 'من فضلك أدخل عمرك');
        return false;
    }
    const age = parseInt(val, 10);
    if (isNaN(age) || age < 10) {
        showError(input, 'العمر يجب أن يكون 10 سنوات على الأقل');
        return false;
    }
    if (age > 60) {
        showError(input, 'العمر يجب ألا يتجاوز 60 سنة');
        return false;
    }
    showSuccess(input);
    return true;
}

function validateRequired(input, label) {
    const val = input.value.trim();
    if (!val || val === '') {
        showError(input, `من فضلك ${label}`);
        return false;
    }
    showSuccess(input);
    return true;
}

// --- Only allow numbers in phone ---
phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value.length > 11) {
        e.target.value = e.target.value.slice(0, 11);
    }
});

// --- Real-time validation on blur (when user leaves a field) ---
const nameInput    = form.querySelector('input[name="Name"]');
const ageInput     = form.querySelector('input[name="Age"]');
const govInput     = form.querySelector('input[name="Governorate"]');
const qualInput    = form.querySelector('input[name="Qualification"]');
const expInput     = form.querySelector('textarea[name="Experience"]');
const maritalInput = form.querySelector('select[name="MaritalStatus"]');
const jobInput     = form.querySelector('input[name="JobType"]');
const refInput     = form.querySelector('input[name="Referral"]');

nameInput.addEventListener('blur',    () => validateName(nameInput));
phoneInput.addEventListener('blur',   () => validatePhone(phoneInput));
ageInput.addEventListener('blur',     () => validateAge(ageInput));
govInput.addEventListener('blur',     () => validateRequired(govInput, 'أدخل المحافظة التي تقيم بها'));
qualInput.addEventListener('blur',    () => validateRequired(qualInput, 'أدخل مؤهلك الدراسي'));
expInput.addEventListener('blur',     () => validateRequired(expInput, 'اكتب عن خبراتك السابقة'));
maritalInput.addEventListener('change', () => validateRequired(maritalInput, 'اختر حالتك الاجتماعية'));
jobInput.addEventListener('blur',     () => validateRequired(jobInput, 'أدخل نوع الوظيفة'));
refInput.addEventListener('blur',     () => validateRequired(refInput, 'أجب عن هذا السؤال'));

// Clear error on focus
[nameInput, phoneInput, ageInput, govInput, qualInput, expInput, maritalInput, jobInput, refInput].forEach(input => {
    if (!input) return;
    const evt = (input.tagName === 'SELECT') ? 'focus' : 'focus';
    input.addEventListener(evt, () => {
        if (!input.classList.contains('valid-state')) clearFieldState(input);
    });
});

// --- Success Popup ---
function showSuccessPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'success-popup-overlay';
    overlay.innerHTML = `
        <div class="success-popup">
            <div class="success-popup-icon">✓</div>
            <h3>تم الإرسال بنجاح! 🎉</h3>
            <p>شكراً لك على تقديم طلبك.<br>سيقوم فريقنا بمراجعة بياناتك والتواصل معك قريباً.</p>
            <button class="success-popup-btn" id="close-popup">حسناً، شكراً!</button>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closePopup() {
        overlay.classList.add('hide');
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }

    overlay.querySelector('#close-popup').addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });
}

// --- Form Submit ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');

    // Run all validations
    const results = [
        validateName(nameInput),
        validatePhone(phoneInput),
        validateAge(ageInput),
        validateRequired(govInput, 'أدخل المحافظة التي تقيم بها'),
        validateRequired(qualInput, 'أدخل مؤهلك الدراسي'),
        validateRequired(expInput, 'اكتب عن خبراتك السابقة'),
        validateRequired(maritalInput, 'اختر حالتك الاجتماعية'),
        validateRequired(jobInput, 'أدخل نوع الوظيفة'),
        validateRequired(refInput, 'أجب عن هذا السؤال'),
    ];

    const isValid = results.every(r => r === true);

    if (!isValid) {
        // Shake the button
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        // Scroll to first error
        const firstError = form.querySelector('.error-state');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // --- Submit to Sheet Monkey ---
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'جاري الإرسال...';

    const formData = new FormData(form);

    fetch('https://api.sheetmonkey.io/form/vcU1BPuuF19nbqCf5WVu9G', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            btn.textContent = originalText;
            btn.disabled = false;
            form.reset();
            // Clear all valid states
            form.querySelectorAll('.form-input').forEach(i => clearFieldState(i));
            showSuccessPopup();
        } else {
            throw new Error('Server error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        btn.textContent = 'حدث خطأ، حاول مرة أخرى';
        btn.style.background = '#ef4444';
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    });
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


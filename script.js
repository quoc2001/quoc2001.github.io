// Prvent browser to remember history
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Scroll to top when page loads
window.addEventListener('load', function () {
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 0);
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.1)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 1s ease-out';
        }
    });
}, observerOptions);

// Text slide up animation on scroll
const textSlideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            console.log('Text slide animation triggered for:', entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Observe text-slide-up elements
document.querySelectorAll('.text-slide-up').forEach(el => {
    textSlideObserver.observe(el);
});

// Wheel scroll transition from about to work section
const aboutSection = document.getElementById('about');
const workSection = document.getElementById('work');

let isScrollTransitioning = false;

// Detect wheel scroll on about section
aboutSection.addEventListener('wheel', (e) => {
    // Check if scrolling down and not already transitioning
    if (e.deltaY > 0 && !isScrollTransitioning && window.scrollY < window.innerHeight * 0.8) {
        e.preventDefault();
        isScrollTransitioning = true;

        // Smooth scroll to work section
        workSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Reset transition flag after animation
        setTimeout(() => {
            isScrollTransitioning = false;
        }, 1000);
    }
});

// Initialize animations for elements already in view
window.addEventListener('load', () => {
    document.querySelectorAll('.text-slide-up').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('animated');
        }
    });
});

// Set Language in page
let currentLanguage = 'en';

const translations = {
    en: {
        'logo-text': 'Quoc Duong',
        'name': 'QUOC',
        'nav-about': 'About Me',
        'nav-work': 'Work',
        'nav-blog': 'Blog',
        'nav-contact': 'Contact me',
        'hero-title': 'Hardware Engineer',
        'hero-description': 'Hi guys, welcome to my portfolio.',
        'hero-cta': 'Get in touch',
        'event-title': 'My Journey',
        'event-subtitle': 'Education & Career Timeline',
        'education': 'Education',
        'event-name': 'HCMC University of Technology and Education',
        'event-major': 'Electronics and Telecommunications',
        'worker': 'Work',
        'event-company-name': 'Semiconductor company',
        'work-text': 'My work',
        'content-1': 'What is a Physical Design Engineer? <br/>A physical design engineer is a specialized engineer who focuses on the physical implementation of electronic circuits, particularly within integrated circuits (ICs) or microchips',
        'content-2': 'Creating optimized floorplans and macro placements to ensure efficient routing, minimal congestion, and balanced timing paths.',
        'content-3': 'Working with STA tools to fix timing violations, reduce hold/slack issues, and meet setup constraints under process variations.',
        'content-4': 'Ensuring clean layouts that pass Design Rule Checks (DRC) and Layout vs Schematic (LVS) verification for tapeout readiness.',
        'blog-description': 'Some newspapers about semiconductor field',
        'read-more': 'Read more',
        'aff-link1': 'Click here',
        'aff-link2': 'Click here',
        'aff-link3': 'Click here',
        'aff-link4': 'Click here',
        'contact-title': 'Get In Touch',
        'contact-description': 'Please contact me via Email/LinkedIn or Facebook',
        'affiliate-title': 'Affiliate',
        'affiliate-description': 'You can buy something at here 🍻',
    },
    vi: {
        'logo-text': 'Quốc Dương',
        'name': 'QUỐC',
        'nav-about': 'Về Tôi',
        'nav-work': 'Công Việc',
        'nav-blog': 'Blog',
        'nav-contact': 'Liên Hệ',
        'hero-title': 'Kỹ sư Phần cứng',
        'hero-description': 'Xin chào mọi người, chào mừng đến với trang cá nhân của tôi.',
        'hero-cta': 'Liên hệ',
        'event-title': 'Sơ Lược Về Bản Thân',
        'event-subtitle': 'Học Vấn & Nghề Nghiệp',
        'education': 'Học vấn',
        'event-name': 'Trường Đại học Sư phạm Kỹ thuật TP. HCM',
        'event-major': 'Điện tử - Viễn thông',
        'worker': 'Công Việc',
        'event-company-name': 'Công ty Thiết kế Vi mạch',
        'work-text': 'Công việc hiện tại',
        'content-1': 'What is a Physical Design Engineer? <br/>A physical design engineer is a specialized engineer who focuses on the physical implementation of electronic circuits, particularly within integrated circuits (ICs) or microchips',
        'content-2': 'Creating optimized floorplans and macro placements to ensure efficient routing, minimal congestion, and balanced timing paths.',
        'content-3': 'Working with STA tools to fix timing violations, reduce hold/slack issues, and meet setup constraints under process variations.',
        'content-4': 'Ensuring clean layouts that pass Design Rule Checks (DRC) and Layout vs Schematic (LVS) verification for tapeout readiness.',
        'blog-description': 'Một số bài báo về mảng bán dẫn',
        'read-more': 'Đọc thêm',
        'contact-title': 'Liên Hệ',
        'aff-link1': 'Nhấn vào đây',
        'aff-link2': 'Nhấn vào đây',
        'aff-link3': 'Nhấn vào đây',
        'aff-link4': 'Nhấn vào đây',
        'contact-description': 'Vui lòng liên hệ qua Email/LinkedIn hoặc Facebook',
        'affiliate-title': 'Tiếp Thị Liên Kết',
        'affiliate-description': 'Bạn có thể mua gì đó tại đây 🍻',
    }
};

function toggleLanguage() {
    const dropdown = document.getElementById('languageDropdown');
    dropdown.classList.toggle('show');
}

function setLanguage(lang) {
    currentLanguage = lang;

    // Update all text elements
    Object.keys(translations[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (key === 'hero-description') {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update current language display
    const currentLang = document.getElementById('current-lang');
    const currentFlag = document.getElementById('current-flag');

    if (lang === 'en') {
        currentLang.textContent = 'EN';
        currentFlag.src = 'https://flagcdn.com/w40/gb.png';
        currentFlag.alt = 'United Kingdom';
    } else {
        currentLang.textContent = 'VI';
        currentFlag.src = 'https://flagcdn.com/w40/vn.png';
        currentFlag.alt = 'Việt Nam';
    }

    // Update active state in dropdown
    const options = document.querySelectorAll('.language-option');
    options.forEach(option => {
        option.classList.remove('active');
    });

    if (lang === 'en') {
        options[0].classList.add('active');
    } else {
        options[1].classList.add('active');
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Close dropdown
    document.getElementById('languageDropdown').classList.remove('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const selector = document.querySelector('.language-selector');
    if (!selector.contains(event.target)) {
        document.getElementById('languageDropdown').classList.remove('show');
    }
});

// Initialize with English
setLanguage('en');

//Back to TOP//
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
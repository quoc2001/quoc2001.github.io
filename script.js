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
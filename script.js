document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const serviceItems = document.querySelectorAll('.service-item'); // Voor de fade-in animatie

    // Toggle Nav (Mobiel menu)
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close nav when a link is clicked (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(item => {
                item.style.animation = ''; // Reset animation to allow re-animation on next click
            });
        });
    });

    // Dynamiek: Observer voor fade-in animatie van diensten
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Zodra 10% van het element zichtbaar is
    };

    const serviceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing zodra het geanimeerd is
            }
        });
    }, observerOptions);

    serviceItems.forEach(item => {
        serviceObserver.observe(item);
    });

    // Let op: De code voor het afhandelen van het contactformulier via JavaScript is verwijderd.
    // Formspree regelt nu de verzending en het succesbericht.
});
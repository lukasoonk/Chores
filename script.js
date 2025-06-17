document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const serviceItems = document.querySelectorAll('.service-item');
    const contactFormServiceSelect = document.getElementById('service'); // Select-element van het contactformulier

    // Toggle Nav (Mobiel menu)
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        burger.classList.toggle('toggle');
    });

    // Close nav when a link is clicked (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(item => {
                item.style.animation = '';
            });
        });
    });

    // Dynamiek: Observer voor fade-in animatie van diensten
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const serviceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    serviceItems.forEach(item => {
        serviceObserver.observe(item);
    });

    // NIEUWE FUNCTIONALITEIT: Klik op dienst om naar contactformulier te springen en dienst te selecteren
    serviceItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Voorkom standaard ankergedrag als de browser traag is
            event.preventDefault();

            const serviceName = item.dataset.service; // Haal de dienstnaam op uit data-service attribuut

            // Scroll naar het contactformulier
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth'
            });

            // Wacht even tot het scrollen voorbij is en stel dan de selectie in
            setTimeout(() => {
                if (contactFormServiceSelect) {
                    // Zoek de optie die overeenkomt met de gekozen dienstnaam
                    for (let i = 0; i < contactFormServiceSelect.options.length; i++) {
                        if (contactFormServiceSelect.options[i].value === serviceName) {
                            contactFormServiceSelect.selectedIndex = i;
                            break;
                        }
                    }
                    // Optioneel: focus op het geselecteerde veld
                    contactFormServiceSelect.focus();
                }
            }, 500); // Korte vertraging zodat het scrollen eerst kan plaatsvinden
        });
    });

    // Let op: De code voor het afhandelen van het contactformulier via JavaScript is nog steeds verwijderd,
    // Formspree regelt de verzending.
});
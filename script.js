document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const serviceItems = document.querySelectorAll('.service-item');
    const contactFormServiceSelect = document.getElementById('service');
    const header = document.querySelector('header');
    // Selecteer alle secties BEHALVE de hero sectie voor de fade-in animaties
    const sectionsToAnimate = document.querySelectorAll('section:not(#home)');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const contactForm = document.getElementById('contactForm');
    const formSubmitButton = contactForm ? contactForm.querySelector('.button[type="submit"]') : null;
    const negotiablePricesBanner = document.querySelector('.negotiable-prices');

    // --- Header Dynamiek bij Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) { // Na 80px scrollen wordt de klasse toegevoegd
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // --- 'Terug naar Boven' knop zichtbaarheid ---
        if (window.scrollY > 400) { // Toon knop na 400px scrollen
            backToTopBtn.classList.add('visible'); // Gebruik klasse voor animatie
        } else {
            backToTopBtn.classList.remove('visible'); // Gebruik klasse voor animatie
        }
    });

    // --- 'Terug naar Boven' knop functionaliteit ---
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Toggle Nav (Mobiel menu) ---
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle'); // Transformeert burger icoon

        const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
        burger.setAttribute('aria-expanded', !expanded);

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // --- Sluit navigatie wanneer een link wordt geklikt (voor mobiel) ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            burger.setAttribute('aria-expanded', 'false');

            navLinks.forEach(item => {
                item.style.animation = '';
            });
        });
    });

    // --- Dynamiek: IntersectionObserver voor fade-in animatie van secties en diensten ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Activeer wanneer 10% van het element zichtbaar is
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Voeg 'visible' class toe voor animatie
                observer.unobserve(entry.target); // Stop observatie nadat animatie is uitgevoerd
            }
        });
    }, observerOptions);

    // Observeer ALLE secties behalve de home sectie
    sectionsToAnimate.forEach(sec => {
        sectionObserver.observe(sec);
    });

    // Observeer service-items apart, ze kunnen een andere timing/trigger nodig hebben
    serviceItems.forEach(item => {
        sectionObserver.observe(item); // Ze krijgen dezelfde observer als secties voor consistentie
    });


    // --- Sticky Banner Animatie (Prijzen onderhandelbaar) ---
    if (negotiablePricesBanner) {
        const stickyBannerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const bannerRect = entry.boundingClientRect;
                const headerHeight = header.offsetHeight; // Dynamisch de hoogte van de header ophalen

                // Controleer of de banner de 'sticky' positie bereikt heeft
                // Hiervoor kijken we of de bovenkant van de banner de hoogte van de header benadert
                // en of het element in beeld is.
                if (bannerRect.top <= headerHeight + 10 && entry.isIntersecting) { // +10px marge
                    negotiablePricesBanner.classList.add('sticky-active');
                } else {
                    negotiablePricesBanner.classList.remove('sticky-active');
                }
            });
        }, {
            root: null,
            rootMargin: `-${header.offsetHeight}px 0px 0px 0px`, // De margin wordt negatief ingesteld op de hoogte van de header
            threshold: [0, 0.5, 1.0] // Observer trigger wanneer 0%, 50% of 100% zichtbaar is
        });

        stickyBannerObserver.observe(negotiablePricesBanner);
    }


    // --- Klik op dienst om naar contactformulier te springen en dienst te selecteren ---
    serviceItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();

            const serviceName = item.dataset.service;

            // Scroll soepel naar de contact sectie
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth'
            });

            // Wacht tot het scrollen is voltooid en selecteer dan de dienst
            setTimeout(() => {
                if (contactFormServiceSelect) {
                    // Zoek de juiste optie op basis van de 'value'
                    const optionToSelect = Array.from(contactFormServiceSelect.options).find(
                        option => option.value === serviceName
                    );
                    if (optionToSelect) {
                        contactFormServiceSelect.value = serviceName; // Stel de waarde in
                        contactFormServiceSelect.focus(); // Optioneel: focus op het geselecteerde veld
                    }
                }
            }, 700); // Iets langere vertraging (bijv. 700ms) om scrollen te voltooien
        });
    });

    // --- Formulier Feedback na verzending (Formspree) ---
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            if (formSubmitButton) {
                formSubmitButton.disabled = true;
                formSubmitButton.textContent = 'Verzenden...';
                // Hier zou je eventueel een visuele indicator/spinner kunnen toevoegen
            }
        });
    }
const firebaseConfig = {
  apiKey: "AIzaSyCs_yXbCmSRgDEoh1CRYlJPAV_xPgMMdrs",
  authDomain: "chores-website-auth.firebaseapp.com",
  projectId: "chores-website-auth",
  storageBucket: "chores-website-auth.firebasestorage.app",
  messagingSenderId: "544106397725",
  appId: "1:544106397725:web:22b62f59096f7d0da286f4"
};      
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
});
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById('login-message').textContent = "Succesvol ingelogd!";
    })
    .catch((error) => {
      document.getElementById('login-message').textContent = error.message;
    });
});

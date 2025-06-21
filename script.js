document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Navigatie (Burger Menu) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
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

    // Sluit nav menu wanneer een link wordt geklikt (op mobiel)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(item => item.style.animation = ''); // Reset animatie om opnieuw af te spelen
            }
        });
    });

    // --- 2. Header Scroll Effect ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Na 50px scroll
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Toon knop na 300px scroll
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Soepel scrollen
        });
    });

    // --- 4. Sectie Scroll Animaties (Intersection Observer) ---
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // De viewport is de root
        rootMargin: '0px',
        threshold: 0.2 // Trigger wanneer 20% van de sectie zichtbaar is
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop met observeren zodra zichtbaar
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id !== 'home') { // De home sectie is al zichtbaar
            sectionObserver.observe(section);
        }
    });

    // --- 5. "Onderhandelbare Prijzen" Sticky Banner ---
    const negotiablePricesBanner = document.querySelector('.negotiable-prices');
    if (negotiablePricesBanner) {
        const bannerObserverOptions = {
            root: null,
            rootMargin: '-100px 0px 0px 0px', // Trigger wanneer de banner 100px van de top is
            threshold: 1.0 // Trigger wanneer 100% van de banner zichtbaar is
        };

        const bannerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    negotiablePricesBanner.classList.remove('sticky-active');
                } else {
                    negotiablePricesBanner.classList.add('sticky-active');
                }
            });
        }, bannerObserverOptions);

        bannerObserver.observe(negotiablePricesBanner);
    }


    // --- 6. Dienstkeuze in Contactformulier ---
    const serviceItems = document.querySelectorAll('.service-item');
    const contactServiceSelect = document.getElementById('service');

    serviceItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Voorkom de standaard anker-navigatie zodat we de waarde kunnen instellen voordat de pagina springt
            e.preventDefault(); 
            const serviceName = item.dataset.service;
            contactServiceSelect.value = serviceName;
            
            // Scroll daarna naar het contactformulier
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });


    // --- 7. Login/Registratie Formulieren ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginFeedback = document.getElementById('login-feedback');
    const registerFeedback = document.getElementById('register-feedback');

    // Functies om formulieren te togglen
    window.showRegister = (event) => { // 'window.' maakt de functie globaal toegankelijk vanuit HTML onclick
        if (event) event.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginFeedback.textContent = ''; // Wis feedback bij wisselen
        registerFeedback.textContent = '';
    };

    window.showLogin = (event) => { // 'window.' maakt de functie globaal toegankelijk vanuit HTML onclick
        if (event) event.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginFeedback.textContent = ''; // Wis feedback bij wisselen
        registerFeedback.textContent = '';
    };

    // Firebase Inloggen
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('#login-email').value;
        const password = loginForm.querySelector('#login-password').value;
        loginFeedback.textContent = 'Inloggen...';
        loginFeedback.classList.remove('error');

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            loginFeedback.textContent = 'Succesvol ingelogd!';
            // Hier kun je doorsturen naar een dashboard of de UI updaten
            console.log('Gebruiker succesvol ingelogd:', firebase.auth().currentUser);
            setTimeout(() => {
                // Eventueel doorsturen of elementen verbergen/tonen
                // window.location.href = '/dashboard.html'; 
                alert('Welkom terug!'); // Tijdelijke melding
                loginForm.reset(); // Reset het formulier
                loginForm.classList.add('hidden'); // Verberg login form na succes
            }, 1500);

        } catch (error) {
            console.error('Fout bij inloggen:', error);
            loginFeedback.textContent = `Fout: ${error.message}`;
            loginFeedback.classList.add('error');
        }
    });

    // Firebase Registreren
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = registerForm.querySelector('#register-email').value;
        const password = registerForm.querySelector('#register-password').value;
        registerFeedback.textContent = 'Registreren...';
        registerFeedback.classList.remove('error');

        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            registerFeedback.textContent = 'Account succesvol aangemaakt! Log nu in.';
            // Hier kun je direct inloggen, of de gebruiker vragen in te loggen
            console.log('Gebruiker succesvol geregistreerd:', firebase.auth().currentUser);
            setTimeout(() => {
                registerForm.reset(); // Reset het formulier
                showLogin(); // Toon het login formulier na succesvolle registratie
            }, 2000);

        } catch (error) {
            console.error('Fout bij registratie:', error);
            registerFeedback.textContent = `Fout: ${error.message}`;
            registerFeedback.classList.add('error');
        }
    });

    // --- Optioneel: Huidige inlogstatus controleren bij laden pagina ---
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('Gebruiker is al ingelogd:', user.email);
            // Optioneel: verberg login/registratie formulieren als gebruiker is ingelogd
            // document.getElementById('auth-section').classList.add('hidden');
        } else {
            console.log('Geen gebruiker ingelogd.');
            // Optioneel: zorg dat login/registratie formulieren zichtbaar zijn
            // (Dit wordt al standaard getoond, tenzij je het elders hidden maakt)
        }
    });

});

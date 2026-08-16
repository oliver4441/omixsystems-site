(function() {
    'use strict';

    var navbar = document.getElementById('navbar');
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuIconOpen = document.getElementById('menu-icon-open');
    var menuIconClose = document.getElementById('menu-icon-close');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var blogUrl = 'https://blog.omixsystems.store/';

    function getInitialTheme() {
        var saved = localStorage.getItem('omix-theme');
        if (saved === 'dark' || saved === 'light') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('omix-theme', theme);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0d0f' : '#f4f0e6');
        var toggle = document.getElementById('theme-toggle');
        if (toggle) {
            var dark = theme === 'dark';
            toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
            toggle.setAttribute('aria-pressed', String(dark));
            toggle.innerHTML = dark ? '☀' : '◐';
        }
    }

    function injectThemeToggle() {
        if (document.getElementById('theme-toggle')) return;
        if (!navbar) return;
        var button = document.createElement('button');
        button.id = 'theme-toggle';
        button.type = 'button';
        button.className = 'theme-toggle';
        button.title = 'Toggle dark mode';
        button.addEventListener('click', function() {
            applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
        var desktop = navbar.querySelector('.nav-links');
        if (desktop) desktop.insertBefore(button, desktop.querySelector('.nav-cta'));
        var mobile = navbar.querySelector('.nav-mobile-menu');
        if (mobile) {
            var mobileButton = button.cloneNode(true);
            mobileButton.id = 'theme-toggle-mobile';
            mobileButton.addEventListener('click', function() {
                applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
            });
            mobile.appendChild(mobileButton);
        }
        applyTheme(getInitialTheme());
    }

    function injectCompanyDescriptor() {
        var hero = document.querySelector('#home .eyebrow');
        if (hero && !document.querySelector('.omix-descriptor')) {
            var descriptor = document.createElement('div');
            descriptor.className = 'omix-descriptor mono';
            descriptor.textContent = 'OPTIMAL MODULAR INTEGRATION EXPERTS';
            hero.insertAdjacentElement('afterend', descriptor);
        }
    }

    function injectBlogGateway() {
        if (document.getElementById('omix-blog-gateway')) return;
        var apps = document.getElementById('apps');
        var pricing = document.getElementById('pricing');
        if (!apps) return;
        var section = document.createElement('section');
        section.id = 'blog';
        section.innerHTML = '<div class="wrap"><div class="section-head"><div><span class="number">06</span><h2 class="section-title">READ OUR<br>JOURNAL.</h2></div><p class="section-intro">Engineering notes, product thinking, business technology guides and lessons from building digital systems in Kenya and beyond.</p></div><div id="omix-blog-gateway" class="blog-gateway"><div><span class="blog-kicker mono">OMIX KNOWLEDGE BASE</span><h3>The OMIX Journal</h3><p>A wiki-style knowledge base covering software, SaaS, APIs, product engineering, business systems and the work behind our products.</p></div><a class="btn btn-primary" href="' + blogUrl + '" target="_blank" rel="noopener noreferrer">Read Our Blog →</a></div></div>';
        if (pricing) pricing.parentNode.insertBefore(section, pricing); else apps.insertAdjacentElement('afterend', section);
    }

    function injectBlogNavLink() {
        var lists = document.querySelectorAll('.nav-links, .nav-mobile-menu');
        lists.forEach(function(list) {
            if (list.querySelector('a[data-blog-link]')) return;
            var link = document.createElement('a');
            link.href = blogUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Blog';
            link.setAttribute('data-blog-link', 'true');
            var contact = list.querySelector('a[href="#contact"]');
            if (contact) list.insertBefore(link, contact); else list.appendChild(link);
        });
    }

    function onScroll() {
        if (navbar) {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    }

    function updateActiveNav() {
        var sections = ['home', 'about', 'services', 'apps', 'blog', 'pricing', 'contact'];
        var links = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
        var current = 'home';
        for (var i = sections.length - 1; i >= 0; i--) {
            var el = document.getElementById(sections[i]);
            if (el && window.scrollY >= el.offsetTop - 120) { current = sections[i]; break; }
        }
        links.forEach(function(link) {
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
            else link.classList.remove('active');
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            var open = mobileMenu.classList.contains('open');
            mobileMenuBtn.setAttribute('aria-expanded', String(open));
            if (menuIconOpen && menuIconClose) {
                menuIconOpen.style.display = open ? 'none' : 'block';
                menuIconClose.style.display = open ? 'block' : 'none';
            }
        });
    }

    if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            if (menuIconOpen && menuIconClose) { menuIconOpen.style.display = 'block'; menuIconClose.style.display = 'none'; }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }); }
        });
    });

    function setupRevealAnimations() {
        if (reducedMotion || !('IntersectionObserver' in window)) return;
        var items = document.querySelectorAll('.service-card, .manifesto-item, .step, .app-card, .pricing-card, .faq-item, .contact-info-card, .blog-gateway');
        items.forEach(function(el, index) { el.classList.add('motion-reveal'); el.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 70 + 'ms'); });
        var observer = new IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); obs.unobserve(entry.target); } });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach(function(el) { observer.observe(el); });
    }

    function setupHeroMotion() {
        if (reducedMotion) return;
        var elements = [document.querySelector('#home h1'), document.querySelector('#home .hero-copy'), document.querySelector('#home .actions'), document.querySelector('#home .hero-aside')];
        elements.forEach(function(el, index) { if (!el) return; el.classList.add('hero-reveal'); el.style.setProperty('--hero-delay', index * 90 + 'ms'); });
        requestAnimationFrame(function() { elements.forEach(function(el) { if (el) el.classList.add('hero-visible'); }); });
    }

    function setupAppInteraction() {
        document.querySelectorAll('.app-card').forEach(function(card) {
            card.setAttribute('tabindex', '0');
            card.addEventListener('focus', function() { card.classList.add('is-focused'); });
            card.addEventListener('blur', function() { card.classList.remove('is-focused'); });
        });
    }

    function setupStickyMobileCTA() {
        if (window.innerWidth > 899 || document.querySelector('.mobile-project-cta')) return;
        var bar = document.createElement('a'); bar.href = '#contact'; bar.className = 'mobile-project-cta'; bar.innerHTML = '<span>START A PROJECT</span><span aria-hidden="true">→</span>'; document.body.appendChild(bar);
        var hero = document.getElementById('home'); var contact = document.getElementById('contact');
        function updateBar() { if (!hero || !contact) return; var pastHero = window.scrollY > hero.offsetHeight * 0.72; var nearContact = window.scrollY + window.innerHeight > contact.offsetTop - 120; bar.classList.toggle('mobile-project-cta-visible', pastHero && !nearContact); }
        window.addEventListener('scroll', updateBar, { passive: true }); updateBar();
    }

    function setupResponsiveTouchTargets() { document.querySelectorAll('.btn, .nav-mobile-menu a, .nav-links a').forEach(function(el) { el.style.minHeight = '44px'; }); }

    var formStep = 1;
    var formData = { name: '', email: '', business: '', service: '', message: '' };
    var formSubmitted = false;
    function showFormStep(step) { var container = document.getElementById('contact-form-container'); if (!container) return; container.innerHTML = buildFormHTML(step); attachFormListeners(); }
    function buildFormHTML(step) {
        var html = '<div class="form-steps"><div class="form-step-bar' + (step >= 1 ? ' active' : '') + '"></div><div class="form-step-bar' + (step >= 2 ? ' active' : '') + '"></div><div class="form-step-bar' + (step >= 3 ? ' active' : '') + '"></div></div>';
        if (formSubmitted) { html += '<div class="form-success"><div class="form-success-icon">✓</div><h2>Message Ready</h2><p>Your email client will open with the project brief.</p><button class="btn btn-primary" onclick="window.resetContactForm()">Send Another Message</button></div>'; return html; }
        if (step === 1) html += '<div class="form-step-title">Tell us about yourself</div><div class="form-step-subtitle">Step 1 of 3</div><div class="form-group"><input type="text" id="form-name" class="form-input" placeholder="Your Name *" value="' + formData.name + '" required></div><div class="form-group" id="name-error"></div><div class="form-group"><input type="email" id="form-email" class="form-input" placeholder="Your Email *" value="' + formData.email + '" required></div><div class="form-group" id="email-error"></div><button type="button" class="btn btn-acid" style="width:100%" onclick="window.nextFormStep()">Next →</button>';
        else if (step === 2) { html += '<div class="form-step-title">Project details</div><div class="form-step-subtitle">Step 2 of 3</div><div class="form-group"><input type="text" id="form-business" class="form-input" placeholder="Business Name (optional)" value="' + formData.business + '"></div><div class="form-group"><select id="form-service" class="form-input"><option value="">Select Service *</option><option value="saas">SaaS Platform Development</option><option value="web">Website Development</option><option value="app">Mobile App Development</option><option value="api">API Development</option><option value="consultation">Strategy Consultation</option></select></div><div class="form-group" id="service-error"></div><div class="form-row"><button type="button" class="btn btn-outline" onclick="window.prevFormStep()">← Back</button><button type="button" class="btn btn-acid" onclick="window.nextFormStep()">Next →</button></div>'; setTimeout(function() { var s = document.getElementById('form-service'); if (s) s.value = formData.service; }, 0); }
        else if (step === 3) html += '<div class="form-step-title">Your message</div><div class="form-step-subtitle">Step 3 of 3</div><div class="form-group"><textarea id="form-message" class="form-input" rows="6" placeholder="Tell us about your project...">' + formData.message + '</textarea></div><div class="form-row"><button type="button" class="btn btn-outline" onclick="window.prevFormStep()">← Back</button><button type="button" class="btn btn-acid" onclick="window.submitForm()">Send Brief →</button></div>';
        return html;
    }
    function attachFormListeners() {
        var nameInput = document.getElementById('form-name'), emailInput = document.getElementById('form-email'), businessInput = document.getElementById('form-business'), serviceInput = document.getElementById('form-service'), messageInput = document.getElementById('form-message');
        if (nameInput) nameInput.addEventListener('input', function() { formData.name = this.value; });
        if (emailInput) emailInput.addEventListener('input', function() { formData.email = this.value; });
        if (businessInput) businessInput.addEventListener('input', function() { formData.business = this.value; });
        if (serviceInput) serviceInput.addEventListener('change', function() { formData.service = this.value; });
        if (messageInput) messageInput.addEventListener('input', function() { formData.message = this.value; });
    }
    function validateStep(step) { var errors = {}; if (step === 1) { if (!formData.name.trim()) errors.name = 'Name is required'; if (!formData.email.trim()) errors.email = 'Email is required'; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email'; } if (step === 2 && !formData.service) errors.service = 'Please select a service'; return errors; }
    window.nextFormStep = function() { var errors = validateStep(formStep); Object.keys(errors).forEach(function(key) { var el = document.getElementById(key + '-error'), input = document.getElementById('form-' + key); if (el) el.innerHTML = '<span class="form-error">' + errors[key] + '</span>'; if (input) input.classList.add('error'); }); if (Object.keys(errors).length) return; ['name', 'email', 'service'].forEach(function(key) { var el = document.getElementById(key + '-error'), input = document.getElementById('form-' + key); if (el) el.innerHTML = ''; if (input) input.classList.remove('error'); }); if (formStep < 3) { formStep++; showFormStep(formStep); } };
    window.prevFormStep = function() { if (formStep > 1) { formStep--; showFormStep(formStep); } };
    window.submitForm = function() { formSubmitted = true; showFormStep(formStep); var subject = 'New Project Inquiry from ' + formData.name; var body = 'Name: ' + formData.name + '\nEmail: ' + formData.email + '\n'; if (formData.business) body += 'Business: ' + formData.business + '\n'; if (formData.service) body += 'Service: ' + formData.service + '\n'; if (formData.message) body += '\nMessage:\n' + formData.message; window.location.href = 'mailto:omixsystems@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); };
    window.resetContactForm = function() { formStep = 1; formData = { name: '', email: '', business: '', service: '', message: '' }; formSubmitted = false; showFormStep(1); };

    function injectStyles() {
        if (document.getElementById('omix-interaction-styles')) return;
        var style = document.createElement('style'); style.id = 'omix-interaction-styles';
        style.textContent = '.omix-descriptor{margin:-12px 0 18px;font-size:.72rem;letter-spacing:.12em;font-weight:700;color:var(--muted)}.theme-toggle{min-width:44px;min-height:44px;padding:8px 11px;margin:0 5px;background:var(--surface);color:var(--ink);border:2px solid var(--ink);font-size:1.1rem;font-weight:700;cursor:pointer;line-height:1}.theme-toggle:hover{background:var(--acid);color:#111}.blog-gateway{border:3px solid var(--ink);background:var(--ink);color:var(--paper);padding:30px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px}.blog-kicker{color:var(--acid);font-size:.72rem;letter-spacing:.12em}.blog-gateway h3{font-size:clamp(2rem,5vw,4rem);line-height:.95;margin:10px 0}.blog-gateway p{max-width:700px;color:#aaa}.motion-reveal{opacity:0;transform:translateY(20px);transition:opacity .55s ease var(--reveal-delay),transform .55s cubic-bezier(.2,.7,.2,1) var(--reveal-delay)}.motion-visible{opacity:1;transform:none}.hero-reveal{opacity:0;transform:translateY(18px);transition:opacity .55s ease var(--hero-delay),transform .55s cubic-bezier(.2,.7,.2,1) var(--hero-delay)}.hero-visible{opacity:1;transform:none}.app-card.is-focused{transform:translate(-3px,-3px);box-shadow:6px 6px 0 var(--ink)}.mobile-project-cta{position:fixed;left:12px;right:12px;bottom:12px;z-index:120;display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:var(--ink);color:var(--paper);border:3px solid var(--ink);box-shadow:5px 5px 0 var(--acid);text-decoration:none;font-family:\'DM Mono\',monospace;font-weight:700;letter-spacing:.04em;transform:translateY(calc(100% + 24px));transition:transform .25s ease}.mobile-project-cta-visible{transform:none}.form-input{background:var(--form-bg)!important;color:var(--form-text)!important;border-color:var(--form-border)!important}.form-input::placeholder{color:var(--form-placeholder)!important}.form-input:focus{border-color:var(--acid)!important}@media(max-width:899px){section{padding:68px 0}.section-head{display:block;margin-bottom:30px}.section-intro{margin-top:20px}.hero-grid{gap:28px}h1{font-size:clamp(3rem,15vw,6rem)}.actions{display:grid;grid-template-columns:1fr}.actions .btn{width:100%}.service-card,.app-card,.pricing-card,.contact-info-card{min-height:0}.app-card-top{min-height:125px}.step{grid-template-columns:56px 1fr;gap:12px}.step h3{font-size:1.35rem}.form-row{flex-direction:column}.form-row .btn{width:100%;min-height:48px}.form-input,.btn{min-height:48px}.whatsapp-btn{bottom:78px}.blog-gateway{display:block;padding:22px}.blog-gateway .btn{margin-top:20px;width:100%}.footer-grid{grid-template-columns:1fr 1fr}.footer-brand{grid-column:1/-1}.theme-toggle{margin:6px 0;width:100%;display:flex;align-items:center;justify-content:center}}@media(prefers-reduced-motion:reduce){.motion-reveal,.hero-reveal{opacity:1;transform:none;transition:none}.mobile-project-cta{transition:none}.blog-gateway{scroll-behavior:auto}}:root{--surface:#fff;--form-bg:#222;--form-text:#fff;--form-border:#777;--form-placeholder:#888;--paper:#f4f0e6;--ink:#111;--muted:#585858;--acid:#d7ff00}html[data-theme="dark"]{--paper:#0b0d0f;--ink:#f1f3f4;--muted:#a8adb2;--surface:#15181c;--acid:#d7ff00;--line:3px solid var(--ink);--form-bg:#111317;--form-text:#f1f3f4;--form-border:#4d535a;--form-placeholder:#858b92;color-scheme:dark}html[data-theme="dark"] body{background:var(--paper);color:var(--ink)}html[data-theme="dark"] nav{background:rgba(11,13,15,.92);border-color:var(--ink)}html[data-theme="dark"] .nav-logo span{background:var(--ink);color:#0b0d0f}html[data-theme="dark"] .nav-links a:hover,html[data-theme="dark"] .nav-links a.active,html[data-theme="dark"] .nav-mobile-menu a:hover{background:var(--acid);color:#0b0d0f}html[data-theme="dark"] .nav-cta{background:var(--ink);color:var(--paper)!important}html[data-theme="dark"] .hero-aside,html[data-theme="dark"] .service-card,html[data-theme="dark"] .app-card,html[data-theme="dark"] .pricing-card,html[data-theme="dark"] .contact-info-card{background:var(--surface);color:var(--ink)}html[data-theme="dark"] .service-card:nth-child(2),html[data-theme="dark"] .pricing-card.popular{background:#b9df00;color:#0b0d0f}html[data-theme="dark"] .service-card:nth-child(4),html[data-theme="dark"] .addons{background:#1b2025}html[data-theme="dark"] .btn-light{background:var(--surface);color:var(--ink)}html[data-theme="dark"] .terminal-head,html[data-theme="dark"] .app-card-top{background:#050607;color:var(--ink)}html[data-theme="dark"] .blog-gateway{background:#050607;border-color:var(--ink)}html[data-theme="dark"] footer{background:#050607}html[data-theme="dark"] .footer-brand h3 span{background:var(--acid);color:#0b0d0f}html[data-theme="dark"] .theme-toggle{background:#15181c;color:var(--ink);border-color:var(--ink)}html[data-theme="dark"] .mobile-project-cta{background:#050607;color:var(--ink);border-color:var(--ink)}html[data-theme="dark"] .whatsapp-btn{background:var(--acid);color:#0b0d0f}html[data-theme="dark"] .eyebrow{box-shadow:5px 5px 0 #000}html[data-theme="dark"] h1 em{color:var(--paper);background:var(--ink)}html[data-theme="dark"] .number{background:var(--ink);color:var(--acid)}html[data-theme="dark"] .app-tag{border-color:var(--ink)}html[data-theme="dark"] .footer-col a:hover{color:var(--acid)}html[data-theme="dark"] .blog-kicker{color:var(--acid)}html[data-theme="dark"] ::selection{background:var(--acid);color:#0b0d0f}html{transition:background-color .3s,color .3s}body,nav,.hero-aside,.service-card,.app-card,.pricing-card,.contact-info-card,.addons,.btn-light,.theme-toggle{transition:background-color .3s,color .3s,border-color .3s}';
        document.head.appendChild(style);
    }

    injectStyles();
    injectThemeToggle();
    injectCompanyDescriptor();
    injectBlogGateway();
    injectBlogNavLink();
    setupHeroMotion();
    setupRevealAnimations();
    setupAppInteraction();
    setupStickyMobileCTA();
    setupResponsiveTouchTargets();
    showFormStep(1);
    onScroll();
})();

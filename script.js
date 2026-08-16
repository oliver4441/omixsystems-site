(function() {
    'use strict';

    var navbar = document.getElementById('navbar');
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuIconOpen = document.getElementById('menu-icon-open');
    var menuIconClose = document.getElementById('menu-icon-close');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- POSITIONING / CONTENT ---- */
    function injectCompanyDescriptor() {
        var hero = document.querySelector('#home .eyebrow');
        if (hero && !document.querySelector('.omix-descriptor')) {
            var descriptor = document.createElement('div');
            descriptor.className = 'omix-descriptor mono';
            descriptor.textContent = 'OPTIMAL MODULAR INTEGRATION EXPERTS';
            hero.insertAdjacentElement('afterend', descriptor);
        }
    }

    /* ---- NAVIGATION ---- */
    function onScroll() {
        if (navbar) {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    }

    function updateActiveNav() {
        var sections = ['home', 'about', 'services', 'apps', 'pricing', 'contact'];
        var links = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
        var current = 'home';
        for (var i = sections.length - 1; i >= 0; i--) {
            var el = document.getElementById(sections[i]);
            if (el && window.scrollY >= el.offsetTop - 120) {
                current = sections[i];
                break;
            }
        }
        links.forEach(function(link) {
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
            else link.classList.remove('active');
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

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
            if (menuIconOpen && menuIconClose) {
                menuIconOpen.style.display = 'block';
                menuIconClose.style.display = 'none';
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });

    /* ---- LIGHTWEIGHT MOTION ---- */
    function setupRevealAnimations() {
        if (reducedMotion || !('IntersectionObserver' in window)) return;
        var items = document.querySelectorAll('.service-card, .manifesto-item, .step, .app-card, .pricing-card, .faq-item, .contact-info-card');
        items.forEach(function(el, index) {
            el.classList.add('motion-reveal');
            el.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 70 + 'ms');
        });

        var observer = new IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('motion-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        items.forEach(function(el) { observer.observe(el); });
    }

    function setupHeroMotion() {
        if (reducedMotion) return;
        var heroTitle = document.querySelector('#home h1');
        var heroCopy = document.querySelector('#home .hero-copy');
        var heroActions = document.querySelector('#home .actions');
        var terminal = document.querySelector('#home .hero-aside');
        [heroTitle, heroCopy, heroActions, terminal].forEach(function(el, index) {
            if (!el) return;
            el.classList.add('hero-reveal');
            el.style.setProperty('--hero-delay', (index * 90) + 'ms');
        });
        requestAnimationFrame(function() {
            [heroTitle, heroCopy, heroActions, terminal].forEach(function(el) {
                if (el) el.classList.add('hero-visible');
            });
        });
    }

    function setupAppInteraction() {
        var cards = document.querySelectorAll('.app-card');
        cards.forEach(function(card) {
            card.setAttribute('tabindex', '0');
            card.addEventListener('focus', function() { card.classList.add('is-focused'); });
            card.addEventListener('blur', function() { card.classList.remove('is-focused'); });
        });
    }

    function setupStickyMobileCTA() {
        if (window.innerWidth > 899 || document.querySelector('.mobile-project-cta')) return;
        var bar = document.createElement('a');
        bar.href = '#contact';
        bar.className = 'mobile-project-cta';
        bar.innerHTML = '<span>START A PROJECT</span><span aria-hidden="true">→</span>';
        document.body.appendChild(bar);

        var hero = document.getElementById('home');
        var contact = document.getElementById('contact');
        function updateBar() {
            if (!hero || !contact) return;
            var pastHero = window.scrollY > hero.offsetHeight * 0.72;
            var nearContact = window.scrollY + window.innerHeight > contact.offsetTop - 120;
            bar.classList.toggle('mobile-project-cta-visible', pastHero && !nearContact);
        }
        window.addEventListener('scroll', updateBar, { passive: true });
        updateBar();
    }

    function setupResponsiveTouchTargets() {
        document.querySelectorAll('.btn, .nav-mobile-menu a, .nav-links a').forEach(function(el) {
            el.style.minHeight = '44px';
        });
    }

    /* ---- CONTACT FORM ---- */
    var formStep = 1;
    var formData = { name: '', email: '', business: '', service: '', message: '' };
    var formSubmitted = false;

    function showFormStep(step) {
        var container = document.getElementById('contact-form-container');
        if (!container) return;
        var html = buildFormHTML(step);
        container.innerHTML = html;
        attachFormListeners(step);
    }

    function buildFormHTML(step) {
        var html = '<div class="form-steps"><div class="form-step-bar' + (step >= 1 ? ' active' : '') + '"></div><div class="form-step-bar' + (step >= 2 ? ' active' : '') + '"></div><div class="form-step-bar' + (step >= 3 ? ' active' : '') + '"></div></div>';
        if (formSubmitted) {
            html += '<div class="form-success"><div class="form-success-icon">✓</div><h2>Message Ready</h2><p>Your email client will open with the project brief.</p><button class="btn btn-primary" onclick="window.resetContactForm()">Send Another Message</button></div>';
            return html;
        }
        if (step === 1) {
            html += '<div class="form-step-title">Tell us about yourself</div><div class="form-step-subtitle">Step 1 of 3</div><div class="form-group"><input type="text" id="form-name" class="form-input" placeholder="Your Name *" value="' + formData.name + '" required></div><div class="form-group" id="name-error"></div><div class="form-group"><input type="email" id="form-email" class="form-input" placeholder="Your Email *" value="' + formData.email + '" required></div><div class="form-group" id="email-error"></div><button type="button" class="btn btn-acid" style="width:100%" onclick="window.nextFormStep()">Next →</button>';
        } else if (step === 2) {
            html += '<div class="form-step-title">Project details</div><div class="form-step-subtitle">Step 2 of 3</div><div class="form-group"><input type="text" id="form-business" class="form-input" placeholder="Business Name (optional)" value="' + formData.business + '"></div><div class="form-group"><select id="form-service" class="form-input"><option value="">Select Service *</option><option value="saas">SaaS Platform Development</option><option value="web">Website Development</option><option value="app">Mobile App Development</option><option value="api">API Development</option><option value="consultation">Strategy Consultation</option></select></div><div class="form-group" id="service-error"></div><div class="form-row"><button type="button" class="btn btn-outline" onclick="window.prevFormStep()">← Back</button><button type="button" class="btn btn-acid" onclick="window.nextFormStep()">Next →</button></div>';
            setTimeout(function(){ var s=document.getElementById('form-service'); if(s) s.value=formData.service; },0);
        } else if (step === 3) {
            html += '<div class="form-step-title">Your message</div><div class="form-step-subtitle">Step 3 of 3</div><div class="form-group"><textarea id="form-message" class="form-input" rows="6" placeholder="Tell us about your project...">' + formData.message + '</textarea></div><div class="form-row"><button type="button" class="btn btn-outline" onclick="window.prevFormStep()">← Back</button><button type="button" class="btn btn-acid" onclick="window.submitForm()">Send Brief →</button></div>';
        }
        return html;
    }

    function attachFormListeners() {
        var nameInput = document.getElementById('form-name');
        var emailInput = document.getElementById('form-email');
        var businessInput = document.getElementById('form-business');
        var serviceInput = document.getElementById('form-service');
        var messageInput = document.getElementById('form-message');
        if (nameInput) nameInput.addEventListener('input', function(){ formData.name=this.value; });
        if (emailInput) emailInput.addEventListener('input', function(){ formData.email=this.value; });
        if (businessInput) businessInput.addEventListener('input', function(){ formData.business=this.value; });
        if (serviceInput) serviceInput.addEventListener('change', function(){ formData.service=this.value; });
        if (messageInput) messageInput.addEventListener('input', function(){ formData.message=this.value; });
    }

    function validateStep(step) {
        var errors = {};
        if (step === 1) {
            if (!formData.name.trim()) errors.name='Name is required';
            if (!formData.email.trim()) errors.email='Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email='Enter a valid email';
        }
        if (step === 2 && !formData.service) errors.service='Please select a service';
        return errors;
    }

    window.nextFormStep = function() {
        var errors=validateStep(formStep);
        Object.keys(errors).forEach(function(key){
            var el=document.getElementById(key+'-error');
            var input=document.getElementById('form-'+key);
            if(el) el.innerHTML='<span class="form-error">'+errors[key]+'</span>';
            if(input) input.classList.add('error');
        });
        if(Object.keys(errors).length) return;
        ['name','email','service'].forEach(function(key){
            var el=document.getElementById(key+'-error');
            var input=document.getElementById('form-'+key);
            if(el) el.innerHTML='';
            if(input) input.classList.remove('error');
        });
        if(formStep<3){ formStep++; showFormStep(formStep); }
    };

    window.prevFormStep = function(){ if(formStep>1){ formStep--; showFormStep(formStep); } };

    window.submitForm = function(){
        formSubmitted=true;
        showFormStep(formStep);
        var subject='New Project Inquiry from '+formData.name;
        var body='Name: '+formData.name+'\nEmail: '+formData.email+'\n';
        if(formData.business) body+='Business: '+formData.business+'\n';
        if(formData.service) body+='Service: '+formData.service+'\n';
        if(formData.message) body+='\nMessage:\n'+formData.message;
        window.location.href='mailto:omixsystems@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    };

    window.resetContactForm = function(){ formStep=1; formData={name:'',email:'',business:'',service:'',message:''}; formSubmitted=false; showFormStep(1); };

    /* ---- STYLE INJECTION ---- */
    function injectMotionStyles() {
        if (document.getElementById('omix-motion-styles')) return;
        var style = document.createElement('style');
        style.id = 'omix-motion-styles';
        style.textContent = '\n'
            + '.omix-descriptor{margin:-12px 0 18px;font-size:.72rem;letter-spacing:.12em;font-weight:700;color:#4b4b4b}\n'
            + '.motion-reveal{opacity:0;transform:translateY(20px);transition:opacity .55s ease var(--reveal-delay),transform .55s cubic-bezier(.2,.7,.2,1) var(--reveal-delay);will-change:opacity,transform}\n'
            + '.motion-visible{opacity:1;transform:none}\n'
            + '.hero-reveal{opacity:0;transform:translateY(18px);transition:opacity .55s ease var(--hero-delay),transform .55s cubic-bezier(.2,.7,.2,1) var(--hero-delay)}\n'
            + '.hero-visible{opacity:1;transform:none}\n'
            + '.app-card.is-focused{transform:translate(-3px,-3px);box-shadow:6px 6px 0 var(--ink)}\n'
            + '.mobile-project-cta{position:fixed;left:12px;right:12px;bottom:12px;z-index:120;display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#111;color:#f4f0e6;border:3px solid #111;box-shadow:5px 5px 0 #d7ff00;text-decoration:none;font-family:\'DM Mono\',monospace;font-weight:700;letter-spacing:.04em;transform:translateY(calc(100% + 24px));transition:transform .25s ease}\n'
            + '.mobile-project-cta-visible{transform:none}\n'
            + '@media(max-width:899px){.wrap{width:min(100% - 24px,1240px)}section{padding:68px 0}.section-head{display:block;margin-bottom:30px}.section-intro{margin-top:20px}.hero-grid{gap:28px}.hero-aside{box-shadow:6px 6px 0 var(--ink)}h1{font-size:clamp(3rem,15vw,6rem)}.actions{display:grid;grid-template-columns:1fr}.actions .btn{width:100%}.service-card,.app-card,.pricing-card,.contact-info-card{min-height:0}.app-card-top{min-height:125px}.step{grid-template-columns:56px 1fr;gap:12px}.step h3{font-size:1.35rem}.form-row{flex-direction:column}.form-row .btn{width:100%;min-height:48px}.form-input,.btn{min-height:48px}.whatsapp-btn{bottom:78px}.footer-grid{grid-template-columns:1fr 1fr}.footer-brand{grid-column:1/-1}}\n'
            + '@media(min-width:900px){.omix-descriptor{margin-top:-10px}.app-card:hover{transform:translate(-5px,-5px);box-shadow:8px 8px 0 var(--ink)}}\n'
            + '@media(prefers-reduced-motion:reduce){.motion-reveal,.hero-reveal{opacity:1;transform:none;transition:none}.mobile-project-cta{transition:none}}\n';
        document.head.appendChild(style);
    }

    injectCompanyDescriptor();
    injectMotionStyles();
    setupHeroMotion();
    setupRevealAnimations();
    setupAppInteraction();
    setupStickyMobileCTA();
    setupResponsiveTouchTargets();
    showFormStep(1);
})();

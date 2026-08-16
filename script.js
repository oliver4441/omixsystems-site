(function() {
    'use strict';
    var navbar = document.getElementById('navbar');
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuIconOpen = document.getElementById('menu-icon-open');
    var menuIconClose = document.getElementById('menu-icon-close');
    function onScroll() {
        if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
        updateActiveNav();
    }
    function updateActiveNav() {
        var sections = ['home', 'about', 'services', 'pricing', 'contact'];
        var links = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
        var current = 'home';
        for (var i = sections.length - 1; i >= 0; i--) {
            var el = document.getElementById(sections[i]);
            if (el && window.scrollY >= el.offsetTop - 100) { current = sections[i]; break; }
        }
        links.forEach(function(link) {
            if (link.getAttribute('href') === '#' + current) link.classList.add('active'); else link.classList.remove('active');
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            if (menuIconOpen && menuIconClose) {
                var open = mobileMenu.classList.contains('open');
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
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
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
        Object.keys(errors).forEach(function(key){ var el=document.getElementById(key+'-error'); var input=document.getElementById('form-'+key); if(el) el.innerHTML='<span class="form-error">'+errors[key]+'</span>'; if(input) input.classList.add('error'); });
        if(Object.keys(errors).length) return;
        ['name','email','service'].forEach(function(key){ var el=document.getElementById(key+'-error'); var input=document.getElementById('form-'+key); if(el) el.innerHTML=''; if(input) input.classList.remove('error'); });
        if(formStep<3){ formStep++; showFormStep(formStep); }
    };
    window.prevFormStep = function(){ if(formStep>1){ formStep--; showFormStep(formStep); } };
    window.submitForm = function(){
        formSubmitted=true; showFormStep(formStep);
        var subject='New Project Inquiry from '+formData.name;
        var body='Name: '+formData.name+'\nEmail: '+formData.email+'\n';
        if(formData.business) body+='Business: '+formData.business+'\n';
        if(formData.service) body+='Service: '+formData.service+'\n';
        if(formData.message) body+='\nMessage:\n'+formData.message;
        window.location.href='mailto:omixsystems@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    };
    window.resetContactForm = function(){ formStep=1; formData={name:'',email:'',business:'',service:'',message:''}; formSubmitted=false; showFormStep(1); };
    showFormStep(1);
})();

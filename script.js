(function() {
    'use strict';

    // ---- NAVIGATION ----
    var navbar = document.getElementById('navbar');
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuIconOpen = document.getElementById('menu-icon-open');
    var menuIconClose = document.getElementById('menu-icon-close');

    // Scroll effect
    function onScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    }

    // Update active nav link
    function updateActiveNav() {
        var sections = ['home', 'about', 'services', 'pricing', 'contact'];
        var links = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
        var current = 'home';

        for (var i = sections.length - 1; i >= 0; i--) {
            var el = document.getElementById(sections[i]);
            if (el && window.scrollY >= el.offsetTop - 100) {
                current = sections[i];
                break;
            }
        }

        links.forEach(function(link) {
            var href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            if (menuIconOpen && menuIconClose) {
                if (mobileMenu.classList.contains('open')) {
                    menuIconOpen.style.display = 'none';
                    menuIconClose.style.display = 'block';
                } else {
                    menuIconOpen.style.display = 'block';
                    menuIconClose.style.display = 'none';
                }
            }
        });
    }

    // Close mobile menu on link click
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
                if (menuIconOpen && menuIconClose) {
                    menuIconOpen.style.display = 'block';
                    menuIconClose.style.display = 'none';
                }
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- CONTACT FORM ----
    var formStep = 1;
    var formData = { name: '', email: '', business: '', service: '', message: '' };
    var formSubmitted = false;

    function showFormStep(step) {
        var container = document.getElementById('contact-form-container');
        if (!container) return;

        html = buildFormHTML(step);
        container.innerHTML = html;
        attachFormListeners(step);
    }

    function buildFormHTML(step) {
        var html = '';

        html += '<div class="form-steps">';
        html += '<div class="form-step-bar' + (step >= 1 ? ' active' : '') + '"></div>';
        html += '<div class="form-step-bar' + (step >= 2 ? ' active' : '') + '"></div>';
        html += '<div class="form-step-bar' + (step >= 3 ? ' active' : '') + '"></div>';
        html += '</div>';

        if (formSubmitted) {
            html += '<div class="form-success">';
            html += '<div class="form-success-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>';
            html += '<h2>Message Sent</h2>';
            html += '<p>Thanks for reaching out. We will get back to you within 24 hours.</p>';
            html += '<button class="btn btn-primary" onclick="window.resetContactForm()">Send Another Message</button>';
            html += '</div>';
            return html;
        }

        if (step === 1) {
            html += '<div class="form-step-title">Tell us about yourself</div>';
            html += '<div class="form-step-subtitle">Step 1 of 3</div>';
            html += '<div class="form-group"><input type="text" id="form-name" class="form-input" placeholder="Your Name *" value="' + formData.name + '" required></div>';
            html += '<div class="form-group" id="name-error"></div>';
            html += '<div class="form-group"><input type="email" id="form-email" class="form-input" placeholder="Your Email *" value="' + formData.email + '" required></div>';
            html += '<div class="form-group" id="email-error"></div>';
            html += '<button type="button" class="btn btn-primary" style="width:100%" onclick="window.nextFormStep()">Next</button>';
        } else if (step === 2) {
            html += '<div class="form-step-title">Project details</div>';
            html += '<div class="form-step-subtitle">Step 2 of 3</div>';
            html += '<div class="form-group"><input type="text" id="form-business" class="form-input" placeholder="Business Name (optional)" value="' + formData.business + '"></div>';
            html += '<div class="form-group"><select id="form-service" class="form-input"><option value="">Select Service *</option><option value="saas"' + (formData.service === 'saas' ? ' selected' : '') + '>SaaS Platform Development</option><option value="web"' + (formData.service === 'web' ? ' selected' : '') + '>Website Development</option><option value="app"' + (formData.service === 'app' ? ' selected' : '') + '>Mobile App Development</option><option value="api"' + (formData.service === 'api' ? ' selected' : '') + '>API Development</option><option value="consultation"' + (formData.service === 'consultation' ? ' selected' : '') + '>Free Strategy Consultation</option></select></div>';
            html += '<div class="form-group" id="service-error"></div>';
            html += '<div class="form-row"><button type="button" class="btn btn-outline" onclick="window.prevFormStep()">Back</button><button type="button" class="btn btn-primary" onclick="window.nextFormStep()">Next</button></div>';
        } else if (step === 3) {
            html += '<div class="form-step-title">Your message</div>';
            html += '<div class="form-step-subtitle">Step 3 of 3</div>';
            html += '<div class="form-group"><textarea id="form-message" class="form-input" rows="5" placeholder="Tell us about your project...">' + formData.message + '</textarea></div>';
            html += '<div class="form-row"><button type="button" class="btn btn-outline" onclick="window.prevFormStep()">Back</button><button type="button" class="btn btn-primary" onclick="window.submitForm()">Send Message</button></div>';
        }

        return html;
    }

    function attachFormListeners(step) {
        // Input listeners to update formData
        var nameInput = document.getElementById('form-name');
        var emailInput = document.getElementById('form-email');
        var businessInput = document.getElementById('form-business');
        var serviceInput = document.getElementById('form-service');
        var messageInput = document.getElementById('form-message');

        if (nameInput) nameInput.addEventListener('input', function() { formData.name = this.value; });
        if (emailInput) emailInput.addEventListener('input', function() { formData.email = this.value; });
        if (businessInput) businessInput.addEventListener('input', function() { formData.business = this.value; });
        if (serviceInput) serviceInput.addEventListener('change', function() { formData.service = this.value; });
        if (messageInput) messageInput.addEventListener('input', function() { formData.message = this.value; });
    }

    function validateStep(step) {
        var errors = {};

        if (step === 1) {
            if (!formData.name.trim()) errors.name = 'Name is required';
            if (!formData.email.trim()) errors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email';
        }
        if (step === 2 && !formData.service) errors.service = 'Please select a service';

        return errors;
    }

    window.nextFormStep = function() {
        var errors = validateStep(formStep);
        var errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            // Show errors
            errorKeys.forEach(function(key) {
                var el = document.getElementById(key + '-error');
                var input = document.getElementById('form-' + key);
                if (el) {
                    el.innerHTML = '<span class="form-error">' + errors[key] + '</span>';
                }
                if (input) input.classList.add('error');
            });
            return;
        }

        // Clear errors
        ['name', 'email', 'service'].forEach(function(key) {
            var el = document.getElementById(key + '-error');
            var input = document.getElementById('form-' + key);
            if (el) el.innerHTML = '';
            if (input) input.classList.remove('error');
        });

        if (formStep < 3) {
            formStep++;
            showFormStep(formStep);
        }
    };

    window.prevFormStep = function() {
        if (formStep > 1) {
            formStep--;
            showFormStep(formStep);
        }
    };

    window.submitForm = function() {
        formSubmitted = true;
        showFormStep(formStep);

        // Build mailto link as fallback
        var subject = 'New Project Inquiry from ' + formData.name;
        var body = 'Name: ' + formData.name + '\n';
        body += 'Email: ' + formData.email + '\n';
        if (formData.business) body += 'Business: ' + formData.business + '\n';
        if (formData.service) body += 'Service: ' + formData.service + '\n';
        if (formData.message) body += '\nMessage:\n' + formData.message;

        var mailtoLink = 'mailto:omixsystems@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        window.open(mailtoLink, '_self');
    };

    window.resetContactForm = function() {
        formStep = 1;
        formData = { name: '', email: '', business: '', service: '', message: '' };
        formSubmitted = false;
        showFormStep(formStep);
    };

    // Initialize form
    showFormStep(1);

    // ---- SCROLL ANIMATIONS ----
    var observer = null;
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe glass cards for fade-in
        setTimeout(function() {
            document.querySelectorAll('.glass-card, .how-step, .tech-tag').forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(el);
            });
        }, 300);
    }

})();

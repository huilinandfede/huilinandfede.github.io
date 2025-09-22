// Language Switcher
document.getElementById('language-switcher').addEventListener('change', function() {
    const lang = this.value;
    document.querySelectorAll('[data-en][data-es][data-de]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    // Update page title
    document.title = document.querySelector('title').getAttribute(`data-${lang}`);
});

// Form submission feedback (optional, as Formspree handles submission)
document.getElementById('contact-form').addEventListener('submit', function(e) {
    // Formspree handles the submission, but you can add client-side feedback
    alert('Form submitted! You will receive a confirmation soon.');
});

// Persist the Language choice
document.getElementById('language-switcher').value = localStorage.getItem('language') || 'en';
document.getElementById('language-switcher').dispatchEvent(new Event('change'));
document.getElementById('language-switcher').addEventListener('change', function() {
    localStorage.setItem('language', this.value);
    const lang = this.value;
    document.querySelectorAll('[data-en][data-es]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    document.title = document.querySelector('title').getAttribute(`data-${lang}`);
});
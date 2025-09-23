// Language Switcher
document.getElementById('language-switcher').addEventListener('change', function() {
    const lang = this.value;
    document.querySelectorAll('[data-en][data-es][data-de]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    // Update page title
    document.title = document.querySelector('title').getAttribute(`data-${lang}`);
});

// Persist the Language choice
document.getElementById('language-switcher').value = localStorage.getItem('language') || 'en';
document.getElementById('language-switcher').dispatchEvent(new Event('change'));
document.getElementById('language-switcher').addEventListener('change', function() {
    localStorage.setItem('language', this.value);
    const lang = this.value;
    document.querySelectorAll('[data-en][data-es][data-de]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    document.title = document.querySelector('title').getAttribute(`data-${lang}`);
});


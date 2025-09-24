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

// Simple Carousel Navigation (working version from commit 0acbf880b042da87b28b4a03e9969657f6acbd04)
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('videoCarousel');
    const indicators = carousel.querySelectorAll('.carousel-indicators button');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-control-prev');
    const nextBtn = carousel.querySelector('.carousel-control-next');
    
    let currentIndex = 0;
    
    function showSlide(index) {
        // Hide all items
        items.forEach(item => {
            item.classList.remove('active');
        });
        
        // Remove active from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current item and activate indicator
        items[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    function nextSlide() {
        const maxIndex = window.innerWidth >= 768 ? 2 : 5; // Desktop: 3 slides (0,1,2), Mobile: 6 slides (0,1,2,3,4,5)
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        showSlide(currentIndex);
    }
    
    function prevSlide() {
        const maxIndex = window.innerWidth >= 768 ? 2 : 5;
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        showSlide(currentIndex);
    }
    
    // Add event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const maxIndex = window.innerWidth >= 768 ? 2 : 5;
            if (index <= maxIndex) {
                currentIndex = index;
                showSlide(currentIndex);
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const maxIndex = window.innerWidth >= 768 ? 2 : 5;
        if (currentIndex > maxIndex) {
            currentIndex = 0;
            showSlide(currentIndex);
        }
    });
    
    // Initialize
    showSlide(currentIndex);
});
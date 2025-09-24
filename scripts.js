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

// Enhanced Carousel Touch/Swipe Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('videoCarousel');
    const videoSection = document.getElementById('videos');
    
    if (carousel && videoSection) {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        
        // Touch start
        videoSection.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        // Touch move - determine if we're scrolling vertically or swiping horizontally
        videoSection.addEventListener('touchmove', function(e) {
            if (isScrolling === false) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const diffX = Math.abs(currentX - startX);
                const diffY = Math.abs(currentY - startY);
                
                // If more horizontal movement than vertical, it's a swipe
                if (diffX > diffY && diffX > 30) {
                    isScrolling = 'horizontal';
                    e.preventDefault(); // Prevent vertical scroll during horizontal swipe
                } else if (diffY > diffX) {
                    isScrolling = 'vertical';
                }
            } else if (isScrolling === 'horizontal') {
                e.preventDefault(); // Continue preventing scroll during horizontal swipe
            }
        }, { passive: false });
        
        // Touch end - execute swipe if it was horizontal
        videoSection.addEventListener('touchend', function(e) {
            if (isScrolling === 'horizontal') {
                const endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                // Minimum swipe distance
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swiped left - next slide
                        const nextButton = carousel.querySelector('.carousel-control-next');
                        nextButton.click();
                    } else {
                        // Swiped right - previous slide
                        const prevButton = carousel.querySelector('.carousel-control-prev');
                        prevButton.click();
                    }
                }
            }
            isScrolling = false;
        }, { passive: true });
        
        // Mouse events for desktop
        let mouseStartX = 0;
        let isMouseDown = false;
        
        videoSection.addEventListener('mousedown', function(e) {
            mouseStartX = e.clientX;
            isMouseDown = true;
            e.preventDefault();
        });
        
        videoSection.addEventListener('mousemove', function(e) {
            if (!isMouseDown) return;
            e.preventDefault();
        });
        
        videoSection.addEventListener('mouseup', function(e) {
            if (!isMouseDown) return;
            isMouseDown = false;
            
            const diffX = mouseStartX - e.clientX;
            
            // Minimum drag distance
            if (Math.abs(diffX) > 100) {
                if (diffX > 0) {
                    // Dragged left - next slide
                    const nextButton = carousel.querySelector('.carousel-control-next');
                    nextButton.click();
                } else {
                    // Dragged right - previous slide
                    const prevButton = carousel.querySelector('.carousel-control-prev');
                    prevButton.click();
                }
            }
        });
        
        // Prevent text selection during drag
        videoSection.addEventListener('selectstart', function(e) {
            if (isMouseDown) e.preventDefault();
        });
    }
});

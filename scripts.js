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
        let currentSlide = 0;
        
        // Function to check if we're on desktop
        function isDesktop() {
            return window.innerWidth >= 768; // md breakpoint
        }
        
        // Function to get all carousel items
        function getCarouselItems() {
            return carousel.querySelectorAll('.carousel-item');
        }
        
        // Function to get visible slides based on screen size
        function getVisibleSlides() {
            const items = getCarouselItems();
            if (isDesktop()) {
                // On desktop, only slides 0, 1, 2 are visible
                return Array.from(items).slice(0, 3);
            } else {
                // On mobile, all 6 slides are potentially visible
                return Array.from(items);
            }
        }
        
        // Function to navigate to a specific slide
        function goToSlide(slideIndex) {
            const visibleSlides = getVisibleSlides();
            const items = getCarouselItems();
            
            // Remove active class from all items
            items.forEach(item => item.classList.remove('active'));
            
            // Add active class to target slide
            if (visibleSlides[slideIndex]) {
                visibleSlides[slideIndex].classList.add('active');
                currentSlide = slideIndex;
            }
        }
        
        // Function to navigate carousel with proper boundary handling
        function navigateCarousel(direction) {
            const visibleSlides = getVisibleSlides();
            const maxSlideIndex = visibleSlides.length - 1;
            
            if (direction === 'next') {
                const nextSlide = currentSlide >= maxSlideIndex ? 0 : currentSlide + 1;
                goToSlide(nextSlide);
            } else {
                const prevSlide = currentSlide <= 0 ? maxSlideIndex : currentSlide - 1;
                goToSlide(prevSlide);
            }
        }
        
        // Initialize current slide
        function initCurrentSlide() {
            const items = getCarouselItems();
            const activeSlide = Array.from(items).findIndex(item => item.classList.contains('active'));
            currentSlide = Math.max(0, activeSlide);
            
            // Ensure we're on a valid slide for current screen size
            const visibleSlides = getVisibleSlides();
            if (currentSlide >= visibleSlides.length) {
                goToSlide(0);
            }
        }
        
        // Initialize on load
        initCurrentSlide();
        
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
                        navigateCarousel('next');
                    } else {
                        // Swiped right - previous slide
                        navigateCarousel('prev');
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
                    navigateCarousel('next');
                } else {
                    // Dragged right - previous slide
                    navigateCarousel('prev');
                }
            }
        });
        
        // Prevent text selection during drag
        videoSection.addEventListener('selectstart', function(e) {
            if (isMouseDown) e.preventDefault();
        });
        
        // Handle window resize to ensure proper navigation
        window.addEventListener('resize', function() {
            setTimeout(() => {
                initCurrentSlide();
            }, 100);
        });
        
        // Override the default carousel navigation buttons
        const prevButton = carousel.querySelector('.carousel-control-prev');
        const nextButton = carousel.querySelector('.carousel-control-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigateCarousel('prev');
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigateCarousel('next');
            });
        }
        
        // Override indicator clicks
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const visibleSlides = getVisibleSlides();
                if (index < visibleSlides.length) {
                    goToSlide(index);
                }
            });
        });
    }
});

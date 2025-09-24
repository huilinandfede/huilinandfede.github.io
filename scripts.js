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
        // Custom carousel implementation
        let isTransitioning = false;
        
        // Disable any Bootstrap carousel initialization
        if (carousel.classList.contains('carousel')) {
            carousel.classList.remove('carousel', 'slide');
        }
        carousel.classList.add('custom-carousel');
        
        function getCarouselItems() {
            return carousel.querySelectorAll('.carousel-item');
        }
        
        // Function to get visible slides based on screen size
        function getVisibleSlides() {
            const items = Array.from(getCarouselItems());
            if (isDesktop()) {
                // On desktop, only first 3 slides are visible (slides 3,4,5 are hidden with d-md-none)
                return items.filter((item, index) => {
                    return index < 3 || !item.classList.contains('d-md-none');
                });
            } else {
                // On mobile, all 6 slides are visible
                return items;
            }
        }
        
        // Function to navigate to a specific slide
        function goToSlide(slideIndex) {
            if (isTransitioning) {
                console.log('Transition in progress, ignoring navigation');
                return;
            }
            
            const visibleSlides = getVisibleSlides();
            console.log(`Attempting to go to slide ${slideIndex} of ${visibleSlides.length} visible slides`);
            
            if (slideIndex < 0 || slideIndex >= visibleSlides.length) {
                console.error(`Invalid slide index: ${slideIndex}, valid range: 0-${visibleSlides.length - 1}`);
                return;
            }
            
            isTransitioning = true;
            const allItems = getCarouselItems();
            const targetSlide = visibleSlides[slideIndex];
            
            // Hide all slides
            allItems.forEach((item, i) => {
                item.classList.remove('active');
                console.log(`Removed active from slide ${i}`);
            });
            
            // Show target slide
            targetSlide.classList.add('active');
            currentSlide = slideIndex;
            
            console.log(`Set slide ${slideIndex} as active, currentSlide updated to ${currentSlide}`);
            
            // Update indicators
            updateIndicators(slideIndex);
            
            // Reset transition flag
            setTimeout(() => {
                isTransitioning = false;
                console.log('Transition completed');
            }, 600); // Wait for CSS transition
        }
        
        // Function to update carousel indicators
        function updateIndicators(slideIndex) {
            const indicators = carousel.querySelectorAll('.carousel-indicators button');
            const visibleSlides = getVisibleSlides();
            
            console.log(`Updating indicators for slide ${slideIndex}`);
            
            indicators.forEach((indicator, index) => {
                if (index < visibleSlides.length) {
                    indicator.classList.toggle('active', index === slideIndex);
                    indicator.style.display = 'inline-block';
                } else {
                    indicator.classList.remove('active');
                    indicator.style.display = 'none';
                }
            });
        }
        
        // Function to navigate carousel with proper boundary handling
        function navigateCarousel(direction) {
            if (isTransitioning) {
                console.log('Navigation blocked - transition in progress');
                return;
            }
            
            const visibleSlides = getVisibleSlides();
            const maxSlideIndex = visibleSlides.length - 1;
            
            console.log(`Current slide: ${currentSlide}, Direction: ${direction}, Max slide index: ${maxSlideIndex}`);
            
            let nextSlideIndex;
            if (direction === 'next') {
                nextSlideIndex = currentSlide >= maxSlideIndex ? 0 : currentSlide + 1;
            } else {
                nextSlideIndex = currentSlide <= 0 ? maxSlideIndex : currentSlide - 1;
            }
            
            console.log(`Navigating from slide ${currentSlide} to slide ${nextSlideIndex}`);
            goToSlide(nextSlideIndex);
        }
        
        // Initialize current slide
        function initCurrentSlide() {
            const allItems = getCarouselItems();
            const visibleSlides = getVisibleSlides();
            
            console.log(`Initializing carousel - Total items: ${allItems.length}, Visible slides: ${visibleSlides.length}`);
            console.log(`Desktop mode: ${isDesktop()}`);
            
            // Find currently active slide among visible slides
            let activeIndex = -1;
            visibleSlides.forEach((slide, index) => {
                if (slide.classList.contains('active')) {
                    activeIndex = index;
                }
            });
            
            // If no active slide found or active slide is not visible, set first visible slide as active
            if (activeIndex === -1) {
                console.log('No active visible slide found, setting first visible slide as active');
                activeIndex = 0;
                
                // Remove active from all slides
                allItems.forEach(item => item.classList.remove('active'));
                
                // Set first visible slide as active
                if (visibleSlides[0]) {
                    visibleSlides[0].classList.add('active');
                }
            }
            
            currentSlide = activeIndex;
            updateIndicators(currentSlide);
            console.log(`Carousel initialized with slide ${currentSlide} active`);
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

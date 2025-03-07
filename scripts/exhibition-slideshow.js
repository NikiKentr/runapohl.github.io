document.addEventListener('DOMContentLoaded', function() {
    // Get all slideshow elements
    const slideshows = document.querySelectorAll('.slideshow-container');
    const popupImage = document.getElementById('popupImage');
    const imagePopup = document.getElementById('imagePopup');

    // Get the close button
    const popupClose = document.querySelector('.popup-close');

    // Add click event to close button
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            document.getElementById('imagePopup').style.display = 'none';
        });
    }
    
    // Helper function to get the base URL for GitHub Pages
    const getBaseUrl = () => {
        const pathSegments = window.location.pathname.split('/');
        // If it's a project site (username.github.io/repo-name)
        if (window.location.hostname.endsWith('github.io') && pathSegments.length > 1 && pathSegments[1] !== '') {
            return '/' + pathSegments[1];
        }
        // If it's a user/org site (username.github.io)
        return '';
    };
    
    const baseUrl = getBaseUrl();
    
    // Check for WebP support
    const supportsWebP = (function() {
        const elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    })();
    
    // Get appropriate image size suffix based on screen width
    function getSizeSuffix() {
        const width = window.innerWidth;
        if (width <= 480) return '-sm';  // Small screens
        if (width <= 1024) return '-md'; // Medium screens
        return '-lg';                     // Large screens
    }
    
    // Prepare for lazy loading
    slideshows.forEach(function(slideshow) {
        const slides = slideshow.querySelectorAll('.slide');
        const prevBtn = slideshow.querySelector('.prev');
        const nextBtn = slideshow.querySelector('.next');
        
        let currentSlide = 0;
        
        // Set up lazy loading for slide images
        slides.forEach(function(slide, index) {
            const img = slide.querySelector('img');
            
            // If this is an image to be lazy loaded
            if (img && !img.src.startsWith('data:')) {
                // Store original src in data-src
                img.dataset.src = img.src;
                
                // Use a placeholder
                img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                
                // Add loading class
                img.classList.add('lazy-slide-image');
            }
        });
        
        // Function to show a specific slide
        function showSlide(n) {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            
            // Normalize slide index
            currentSlide = (n + slides.length) % slides.length;
            
            // Show the current slide
            slides[currentSlide].classList.add('active');
            
            // Load the current slide image if it hasn't been loaded yet
            const currentImg = slides[currentSlide].querySelector('img.lazy-slide-image');
            if (currentImg && currentImg.dataset.src) {
                loadOptimizedImage(currentImg);
            }
            
            // Preload next and previous slide images
            const nextIndex = (currentSlide + 1) % slides.length;
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            
            // Preload next slide
            const nextImg = slides[nextIndex].querySelector('img.lazy-slide-image');
            if (nextImg && nextImg.dataset.src) {
                setTimeout(() => {
                    loadOptimizedImage(nextImg);
                }, 300);
            }
            
            // Preload previous slide
            const prevImg = slides[prevIndex].querySelector('img.lazy-slide-image');
            if (prevImg && prevImg.dataset.src) {
                setTimeout(() => {
                    loadOptimizedImage(prevImg);
                }, 600);
            }
        }
        
        // Function to load an optimized image
        function loadOptimizedImage(img) {
            if (!img || !img.dataset.src) return;
            
            const originalPath = img.dataset.src;
            const lastSlash = originalPath.lastIndexOf('/');
            const directory = originalPath.substring(0, lastSlash);
            const filename = originalPath.substring(lastSlash + 1);
            
            // Extract base name and extension
            const lastDot = filename.lastIndexOf('.');
            const baseName = filename.substring(0, lastDot);
            const ext = filename.substring(lastDot);
            
            // Get size suffix and determine format
            const sizeSuffix = getSizeSuffix();
            const newExt = supportsWebP ? '.webp' : ext;
            
            // Try to load from optimized folder
            const optimizedPath = `${directory}/optimized/${baseName}${sizeSuffix}${newExt}`;
            
            // Create a temporary image to test if optimized version exists
            const tempImg = new Image();
            tempImg.onload = function() {
                // Optimized version exists, use it
                img.src = optimizedPath;
                img.classList.add('loaded');
            };
            tempImg.onerror = function() {
                // Optimized version doesn't exist, fall back to original
                img.src = originalPath;
                img.classList.add('loaded');
            };
            tempImg.src = optimizedPath;
            
            // Remove data-src to prevent loading again
            img.removeAttribute('data-src');
        }
        
        // Add click events for navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                showSlide(currentSlide - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                showSlide(currentSlide + 1);
            });
        }
        
        // Initialize with the first slide
        showSlide(0);
        
        // Image popup functionality
        const clickableImages = slideshow.querySelectorAll('.clickable-image');
        clickableImages.forEach(function(img, index) {
            img.addEventListener('click', function() {
                // Get the loaded image URL (optimized or original)
                let imgSrc = this.src;
                if (imgSrc.startsWith('data:')) {
                    // If image hasn't loaded yet, use the original source
                    imgSrc = this.dataset.src;
                }
                
                if (popupImage && imagePopup) {
                    popupImage.src = imgSrc;
                    imagePopup.classList.add('active');
                    
                    // Store current index for popup navigation
                    popupImage.dataset.index = index;
                }
            });
        });
    });
    
    // Popup navigation
    if (imagePopup) {
        const closeBtn = imagePopup.querySelector('.popup-close');
        const prevBtn = imagePopup.querySelector('.popup-prev');
        const nextBtn = imagePopup.querySelector('.popup-next');
        const popupContent = imagePopup.querySelector('.popup-content');

        

        // Close popup on click outside the image content
imagePopup.addEventListener('click', function(e) {
    if (!popupContent.contains(e.target)) {
        imagePopup.classList.remove('active');
    }
});

        // Close popup on background click or clicking outside the image
        imagePopup.addEventListener('click', function(e) {
            if (e.target === imagePopup || !e.target.closest('.popup-content')) {
                imagePopup.classList.remove('active');
            }
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                imagePopup.classList.remove('active');
            });
        }
        
        if (prevBtn && nextBtn && popupImage) {
            prevBtn.addEventListener('click', function() {
                navigatePopup(-1);
            });
            
            nextBtn.addEventListener('click', function() {
                navigatePopup(1);
            });
            
            function navigatePopup(direction) {
                const currentIndex = parseInt(popupImage.dataset.index || 0);
                const slideshow = document.querySelector('.slideshow-container');
                const images = slideshow.querySelectorAll('.clickable-image');
                
                // Calculate new index
                let newIndex = (currentIndex + direction + images.length) % images.length;
                
                // Update popup image
                const newImg = images[newIndex];
                if (newImg) {
                    let imgSrc = newImg.src;
                    if (imgSrc.startsWith('data:')) {
                        // If image hasn't loaded yet, use the original source
                        imgSrc = newImg.dataset.src;
                    }
                    
                    popupImage.src = imgSrc;
                    popupImage.dataset.index = newIndex;
                }
            }
        }
        
        // Close popup on background click
        imagePopup.addEventListener('click', function(e) {
            if (e.target === imagePopup || !e.target.closest('.popup-content')) {
                imagePopup.classList.remove('active');
            }
        });
        
        // Close popup with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imagePopup.classList.contains('active')) {
                imagePopup.classList.remove('active');
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        // Update images to use appropriate size
        document.querySelectorAll('img.loaded').forEach(function(img) {
            const src = img.src;
            if (src && src.includes('/optimized/')) {
                // Extract the base path without size suffix
                const basePath = src.replace(/(-sm|-md|-lg)\.(jpg|jpeg|png|webp)$/, '');
                const sizeSuffix = getSizeSuffix();
                const ext = supportsWebP ? '.webp' : (src.endsWith('.webp') ? '.jpg' : src.substring(src.lastIndexOf('.')));
                
                // Update the source with new size
                img.src = `${basePath}${sizeSuffix}${ext}`;
            }
        });
    }, 250));
    
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
});
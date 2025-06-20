document.addEventListener('DOMContentLoaded', function() {
    // Get all exhibition items
    const ausstellungItems = document.querySelectorAll('.ausstellung-item');
    
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
    
    // Create intersection observer for lazy loading preview images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    // Extract file information for optimized path
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
                    
                    // Stop observing this image
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '200px 0px', // Start loading before the image is in viewport
        threshold: 0.01
    });
    
    // Find all preview images and set up for lazy loading
    document.querySelectorAll('.ausstellung-preview-img').forEach(img => {
        // Observe the image for lazy loading
        imageObserver.observe(img);
    });
    
    // Process each exhibition item
    ausstellungItems.forEach(item => {
        // Get the title element
        const title = item.querySelector('.ausstellung-title');
        
        // Get the preview element
        const preview = item.querySelector('.ausstellung-preview');
        
        // Check if this is an upcoming/non-clickable exhibition
        if (title.textContent.trim().includes("Upcoming:")) {
            // Add non-clickable class if it doesn't have it already
            title.classList.add('non-clickable');
            
            // Set default cursor for both title and preview
            title.style.cursor = 'default';
            preview.style.cursor = 'default';
            
            // Also add a class to the preview for easier CSS targeting
            preview.classList.add('non-clickable-preview');
            
            // Do not add click events for upcoming exhibitions
            return; 
        }
        
        // Set cursor to pointer for clickable items
        title.style.cursor = 'pointer';
        preview.style.cursor = 'pointer';
        
        // Define the URLs manually to ensure they match your file naming convention
        let detailUrl;
        const titleText = title.textContent.trim();
        
        // Map each exhibition title to its correct detail page URL
        if (titleText === "85 Wochen Leckerwurst, Ars-Connectit-Festival 2024") {
            detailUrl = "ausstellung-85-wochen-leckerwurst-ars-connectit-festival-2024.html";
        } else if (titleText === "Ars-Conectit-Festival 2023") {
            detailUrl = "ausstellung-ars-conectit-festival-2023.html";
        } else if (titleText === "Utopia Kiosk 2024") {
            detailUrl = "ausstellung-utopia-kiosk-2024.html";
        } else if (titleText === "2,2km 2013") {
            detailUrl = "ausstellung-2-2km-2013.html";
        } else if (titleText === "Fanzineist Vienna Art Book & Zine Fair 2025") {
            detailUrl = "ausstellung-fanzineist-vienna-art-book-zine-fair-2025.html";
        
        } else {
            // Fallback URL generation in case there's an exhibition not in the mapping
            detailUrl = "ausstellung-" + titleText.toLowerCase()
                .replace(/[äöüß]/g, function(match) {
                    return match === 'ä' ? 'ae' : 
                           match === 'ö' ? 'oe' : 
                           match === 'ü' ? 'ue' : 
                           match === 'ß' ? 'ss' : match;
                })
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-') + ".html";
        }
        
        // Log the mapping for debugging
        console.log(`Exhibition: "${titleText}" → URL: "${detailUrl}"`);
        
        // Add click event to title only for non-upcoming exhibitions
        title.addEventListener('click', function() {
            window.location.href = detailUrl;
        });
        
        // Add click event to the entire preview
        preview.addEventListener('click', function() {
            window.location.href = detailUrl;
        });
    });
    
    // Optional: Keyboard navigation accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // If user presses Enter while focusing an exhibition title
            if (document.activeElement.classList.contains('ausstellung-title')) {
                // Skip if it includes "Upcoming:"
                if (document.activeElement.textContent.trim().includes("Upcoming:")) {
                    return;
                }
                
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                document.activeElement.dispatchEvent(clickEvent);
            }
            
            // If user presses Enter while focusing a preview
            if (document.activeElement.classList.contains('ausstellung-preview')) {
                // Skip if the parent item has an upcoming title
                const title = document.activeElement.closest('.ausstellung-item').querySelector('.ausstellung-title');
                if (title && title.textContent.trim().includes("Upcoming:")) {
                    return;
                }
                
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                document.activeElement.dispatchEvent(clickEvent);
            }
        }
    });
    
    // Handle window resize to update image sizes
    window.addEventListener('resize', debounce(function() {
        // Find all loaded images and update their sizes if needed
        document.querySelectorAll('.ausstellung-preview-img.loaded').forEach(img => {
            // Get the original path from src
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
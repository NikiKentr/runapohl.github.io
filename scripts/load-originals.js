document.addEventListener('DOMContentLoaded', function() {
    function debugLog(message) {
        console.log(`[Originale Debug] ${message}`);
    }

    debugLog('Script started');

    const grid = document.getElementById('illustrationsGrid');
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    const popupClose = document.getElementById('popup-close');
    const popupTitle = document.getElementById('popup-title');

    debugLog(`Grid element: ${grid ? 'Found' : 'NOT FOUND'}`);

    if (!grid) {
        debugLog('ERROR: Cannot find illustrations grid.');
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '20px';
        errorDiv.style.textAlign = 'center';
        errorDiv.innerHTML = 'Error: Could not find illustrations grid. Check your HTML and JavaScript.';
        document.body.appendChild(errorDiv);
        return;
    }

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

    const imageFiles = [
        'Betonwerk, Acryl auf Leinwand, 2016.jpg',
        'Die Badenden_Acryl auf Malpappe, 2016.jpg',
        'Eisberg_Diptychon_Acryl auf Leinwand, 2016.jpg',
        'Malen Nach Zahlen auf See, 2016.jpg',
        'Ohne Titel (Fabrik), Acryl auf Leinwand, 2016.jpg',
        'Ohne Titel, Acryl auf Leinwand, 2016.jpg',
        'Radium, Acryl auf Leinwand, 2016.jpg',
        'Keramikruna_Frontansicht_Glasierter Ton Kaffee, 2015.jpg',
        'Raumhafen, Acyrl auf Leinwand, 2016.jpg',
        'Die Invasionsflotte Terangos! (Bereit das All zu erobern), Acryl auf Leinwand, 2016.jpg',
        'RocketLove_2018.jpg',
        'Verachter werden verachten, Stickbild, 2017.jpg',
    ];

    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const originalFilename = img.dataset.src;
                
                if (originalFilename) {
                    // Extract file information for optimized path
                    const lastSlash = originalFilename.lastIndexOf('/');
                    const directory = originalFilename.substring(0, lastSlash);
                    const filename = originalFilename.substring(lastSlash + 1);
                    
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
                        img.src = originalFilename;
                        img.classList.add('loaded');
                    };
                    tempImg.src = optimizedPath;
                    
                    // Stop observing this image
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '200px 0px', // Start loading before the image is in viewport
        threshold: 0.01
    });

    imageFiles.forEach((file) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const img = document.createElement('img');
        img.alt = file;
        const originalSrc = `images/originals/${file}`;
        img.dataset.src = originalSrc;

        // Use a placeholder or transparent image initially
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        
        // Observe the image for lazy loading
        imageObserver.observe(img);

        img.onload = function() {
            gridItem.appendChild(img);
            grid.appendChild(gridItem);

            setTimeout(() => {
                gridItem.classList.add('fade-in');
            }, 100);
        };

        img.onerror = function() {
            gridItem.innerHTML = `<p style="color:red;">Error loading: ${file}</p>`;
            grid.appendChild(gridItem);
        };

        // Image click event for popup
        img.addEventListener('click', () => {
            // Use the loaded source for the popup
            popupImg.src = img.src;
            popupTitle.textContent = file
                .replace(/\.[^/.]+$/, '')  // Remove file extension
                .replace(/_/g, ' ')         // Replace underscores with spaces
                .replace(/(\d{4})/, '$1 '); // Add space after year if present
            popup.classList.add('active');  // Show popup
        });
    });

    // Close popup on background or close button click
    popup.addEventListener('click', (e) => {
        if (e.target === popup || e.target === popupClose) {
            popup.classList.remove('active');  // Hide popup
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            popup.classList.remove('active');  // Hide popup
        }
    });

    // Handle window resize to update image sizes
    window.addEventListener('resize', debounce(function() {
        // Find all loaded images and update their sizes if needed
        document.querySelectorAll('.grid-item img.loaded').forEach(img => {
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
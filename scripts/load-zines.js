document.addEventListener('DOMContentLoaded', function() {
    function debugLog(message) {
        console.log(`[Zines Debug] ${message}`);
    }

    debugLog('Script started');

    const grid = document.getElementById('zinesGrid');
    const modal = document.getElementById('flipBookModal');
    const flipBook = document.getElementById('flipBook');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const closeButton = document.getElementById('closeFlipBook');
    const pageNumber = document.getElementById('pageNumber');

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

    // Define zines with their pages
    const zines = [
        {
            title: "EINS VON ALLEM",
            folder: "EINS_VON_ALLEM_1",
            preview: "Untitled(3).gif",
            pages: Array.from({length: 6}, (_, i) => `page${i + 1}.jpg`)
        },
        {
            title: "EINS VON ALLEM 2",
            folder: "EINS_VON_ALLEM_2",
            preview: "PREVIEW_1.gif",
            pages: Array.from({length: 5}, (_, i) => `page${i + 1}.jpg`)
        },
        {
            title: "Abflug, 2020",
            folder: "Abglug",
            preview: "preview1.jpg",
            pages: Array.from({length: 1}, (_, i) => `page${i + 1}.jpg`)
        },
        {
            title: "Rufus die Weihnachtsmaus",
            folder: "Rufus die Weihnachtsmaus",
            preview: "page1.jpg",
            pages: Array.from({length: 17}, (_, i) => `page${i + 1}.jpg`)
        },
        {
            title: "Coronacomic, 2020",
            folder: "Coronacomic",
            preview: "preview1.jpg",
            pages: Array.from({length: 1}, (_, i) => `page${i + 1}.png`)
        },
        {
            title: "Hasi & Ute",
            folder: "Hasi & Ute",
            preview: "preview1.jpg",
            pages: Array.from({length: 7}, (_, i) => `page${i + 1}.jpg`)
        }
    ];

    let currentZine = null;
    let currentPage = 0;

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

    // Create zine previews
    zines.forEach(zine => {
        const preview = document.createElement('div');
        preview.className = 'zine-preview';
        
        const img = document.createElement('img');
        const previewPath = encodeURI(`images/zines/${zine.folder}/${zine.preview}`);
        debugLog(`Loading preview from: ${previewPath}`);
        
        // Use data-src and placeholder
        img.dataset.src = previewPath;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        img.alt = zine.title;
        
        // Observe for lazy loading
        imageObserver.observe(img);
        
        img.onerror = function() {
            debugLog(`Error loading image: ${previewPath}`);
            preview.innerHTML = `
                <div style="padding: 20px; text-align: center; color: red;">
                    Error loading preview
                </div>`;
        };
        
        const title = document.createElement('div');
        title.className = 'zine-title';
        title.textContent = zine.title;
        
        preview.appendChild(img);
        preview.appendChild(title);
        
        preview.addEventListener('click', () => openFlipBook(zine));
        
        grid.appendChild(preview);
    });

    function openFlipBook(zine) {
        currentZine = zine;
        currentPage = 0;
        updateFlipBook();
        modal.classList.add('active');
    }

    function updateFlipBook() {
        flipBook.innerHTML = '';
        const img = document.createElement('img');
        const pagePath = encodeURI(`images/zines/${currentZine.folder}/${currentZine.pages[currentPage]}`);
        
        // Use data-src and placeholder
        img.dataset.src = pagePath;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        img.alt = `${currentZine.title} - Page ${currentPage + 1}`;
        
        // Create a temporary image to test if optimized version exists
        const tempImg = new Image();
        tempImg.onload = function() {
            // Extract file information for optimized path
            const lastSlash = pagePath.lastIndexOf('/');
            const directory = pagePath.substring(0, lastSlash);
            const filename = pagePath.substring(lastSlash + 1);
            
            // Extract base name and extension
            const lastDot = filename.lastIndexOf('.');
            const baseName = filename.substring(0, lastDot);
            const ext = filename.substring(lastDot);
            
            // Get size suffix and determine format
            const sizeSuffix = getSizeSuffix();
            const newExt = supportsWebP ? '.webp' : ext;
            
            // Try to load from optimized folder
            const optimizedPath = `${directory}/optimized/${baseName}${sizeSuffix}${newExt}`;
            
            // Create another temporary image to test optimized version
            const optimizedTempImg = new Image();
            optimizedTempImg.onload = function() {
                // Optimized version exists, use it
                img.src = optimizedPath;
            };
            optimizedTempImg.onerror = function() {
                // Optimized version doesn't exist, use original
                img.src = pagePath;
            };
            optimizedTempImg.src = optimizedPath;
        };
        tempImg.onerror = function() {
            debugLog(`Error loading page: ${pagePath}`);
            flipBook.innerHTML = `
                <div style="padding: 20px; text-align: center; color: red;">
                    Error loading page ${currentPage + 1}
                </div>`;
        };
        tempImg.src = pagePath;
        
        flipBook.appendChild(img);
        
        pageNumber.textContent = `${currentPage + 1} / ${currentZine.pages.length}`;
        
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === currentZine.pages.length - 1;
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateFlipBook();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < currentZine.pages.length - 1) {
            currentPage++;
            updateFlipBook();
        }
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            } else if (e.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
                updateFlipBook();
            } else if (e.key === 'ArrowRight' && currentPage < currentZine.pages.length - 1) {
                currentPage++;
                updateFlipBook();
            }
        }
    });

    // Handle window resize to update image sizes
    window.addEventListener('resize', debounce(function() {
        // Find all loaded images and update their sizes if needed
        document.querySelectorAll('.zine-preview img.loaded, #flipBook img.loaded').forEach(img => {
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
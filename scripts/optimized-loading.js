// optimized-loading.js - Use optimized images with lazy loading
document.addEventListener('DOMContentLoaded', function() {
    // Check for WebP support
    const supportsWebP = (function() {
        const elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    })();
    
    // Helper to get optimized image path
    function getOptimizedPath(originalPath, sizeSuffix = '') {
        // Extract directory and filename
        const lastSlash = originalPath.lastIndexOf('/');
        const directory = originalPath.substring(0, lastSlash);
        const filename = originalPath.substring(lastSlash + 1);
        
        // Extract base name and extension
        const lastDot = filename.lastIndexOf('.');
        const baseName = filename.substring(0, lastDot);
        const ext = filename.substring(lastDot);
        
        // Use WebP if supported, otherwise use original extension
        const newExt = supportsWebP ? '.webp' : ext;
        
        // Create path to optimized version
        return `${directory}/optimized/${baseName}${sizeSuffix}${newExt}`;
    }
    
    // Get size suffix based on viewport width
    function getSizeSuffix() {
        const width = window.innerWidth;
        if (width <= 480) return '-sm';  // Small screens
        if (width <= 1024) return '-md'; // Medium screens
        return '-lg';                     // Large screens
    }
    
    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    // Get optimized path
                    const sizeSuffix = getSizeSuffix();
                    const optimizedPath = getOptimizedPath(img.dataset.src, sizeSuffix);
                    
                    // Load the image
                    img.src = optimizedPath;
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
    
    // Find all images to lazy load
    document.querySelectorAll('img[data-src]').forEach(img => {
        // Use a placeholder image initially
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        
        // Observe the image for lazy loading
        imageObserver.observe(img);
    });
});
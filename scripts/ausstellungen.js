document.addEventListener('DOMContentLoaded', function() {
    // Get all exhibition items
    const ausstellungItems = document.querySelectorAll('.ausstellung-item');
    
    ausstellungItems.forEach(item => {
        // Get the title element
        const title = item.querySelector('.ausstellung-title');
        
        // Get the preview element
        const preview = item.querySelector('.ausstellung-preview');
        
        // Define the URLs manually to ensure they match your file naming convention
        let detailUrl;
        const titleText = title.textContent.trim();
        
        // Map each exhibition title to its correct detail page URL
        if (titleText === "Ars-Connectit-Festival 2024") {
            detailUrl = "ausstellung-ars-connectit-2024.html";
        } else if (titleText === "Ars-Connectit-Festival 2023") {
            detailUrl = "ausstellung-ars-connectit-2023.html";
        } else if (titleText === "Montagsmaler-Ausstellung 2019") {
            detailUrl = "ausstellung-montagsmaler-2019.html";
        } else if (titleText === "2,2km 2013") {
            detailUrl = "ausstellung-2-2km-2013.html";
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
        
        // Add click event to title
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
                const item = document.activeElement.closest('.ausstellung-item');
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                document.activeElement.dispatchEvent(clickEvent);
            }
            
            // If user presses Enter while focusing a preview
            if (document.activeElement.classList.contains('ausstellung-preview')) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                document.activeElement.dispatchEvent(clickEvent);
            }
        }
    });
});
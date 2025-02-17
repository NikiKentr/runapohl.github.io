// scripts/load-illustrations.js
document.addEventListener('DOMContentLoaded', function() {
    // Logging function to help with debugging
    function debugLog(message) {
        console.log(`[Illustrations Debug] ${message}`);
    }

    debugLog('Script started');

    const grid = document.getElementById('illustrationsGrid');
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');

    // Detailed element checking
    debugLog(`Grid element: ${grid ? 'Found' : 'NOT FOUND'}`);
    debugLog(`Popup element: ${popup ? 'Found' : 'NOT FOUND'}`);
    debugLog(`Popup Image element: ${popupImg ? 'Found' : 'NOT FOUND'}`);

    if (!grid) {
        debugLog('ERROR: Cannot find illustrations grid. Check your HTML.');
        // Create a visible error message on the page
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '20px';
        errorDiv.style.textAlign = 'center';
        errorDiv.innerHTML = 'Error: Could not find illustrations grid. Check your HTML and JavaScript.';
        document.body.appendChild(errorDiv);
        return;
    }

    // Hardcoded list of images to test
    const imageFiles = [
        '2017SpaceSofa.JPG',
        '2018LudwigundIchAcyrlaufMalpappe.jpg',
        '2019DiePrinzessin.jpg',
        '2019ZitronenT.jpg',
        '2019Abflug1.jpeg',
        '2019SaturdayNightschabeltier.jpeg',
        '2022DieVerwandelung.JPG',
        '2021HundiimSchnee.jpeg',
        '2021DalliDalli.jpg',
        '2019NellyDix.jpg',
        'received_10201527586789453.jpg',
        '2022RuhevordemBOF.JPG',
        '2021DerFleck.jpeg',
        '2019Rakete.jpeg',
        '2019ImHohenGrass.jpeg'
    ];

    debugLog(`Total images to process: ${imageFiles.length}`);

    // Counter for successfully loaded images
    let loadedImagesCount = 0;

    imageFiles.forEach((file, index) => {
        debugLog(`Processing image: ${file}`);

        // Create grid item and image
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const img = document.createElement('img');
        img.alt = file;

        // Full path logging for debugging
        const imagePath = `images/illustrations/${file}`;
        debugLog(`Attempting to load image from: ${imagePath}`);
        img.src = imagePath;

        // Enhanced error and load handling
        img.onerror = function() {
            debugLog(`ERROR: Failed to load image ${file}`);
            // Create a visible error for this specific image
            gridItem.innerHTML = `<p style="color:red;">Error loading: ${file}</p>`;
            grid.appendChild(gridItem);
        };

        img.onload = function() {
            loadedImagesCount++;
            debugLog(`Successfully loaded image: ${file}`);
            gridItem.appendChild(img);
            grid.appendChild(gridItem);

            // Fade-in effect
            setTimeout(() => {
                gridItem.classList.add('fade-in');
            }, 100 * index);

            // Log progress
            debugLog(`Loaded ${loadedImagesCount}/${imageFiles.length} images`);
        };

        // Image click event for popup
        img.addEventListener('click', () => {
            debugLog(`Image clicked: ${file}`);
            popupImg.src = img.src;
            popup.classList.add('active');
        });
    });

    // Popup close events
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            debugLog('Popup background clicked');
            popup.classList.remove('active');
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            debugLog('Popup closed with Escape key');
            popup.classList.remove('active');
        }
    });

    debugLog('Script processing completed');
});

// Immediate logging to verify script is being loaded
console.log('Illustrations loading script parsed and ready');
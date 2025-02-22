document.addEventListener('DOMContentLoaded', function() {
    function debugLog(message) {
        console.log(`[Originale Debug] ${message}`);
    }

    debugLog('Script started');

    const grid = document.getElementById('illustrationsGrid');
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    const popupClose = document.getElementById('popup-close');
    const popupTitle = document.getElementById('popup-title');  // Title element in the popup

    debugLog(`Grid element: ${grid ? 'Found' : 'NOT FOUND'}`);
    debugLog(`Popup element: ${popup ? 'Found' : 'NOT FOUND'}`);
    debugLog(`Popup Image element: ${popupImg ? 'Found' : 'NOT FOUND'}`);
    debugLog(`Popup Title element: ${popupTitle ? 'Found' : 'NOT FOUND'}`);

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

    imageFiles.forEach((file) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const img = document.createElement('img');
        img.alt = file;
        img.src = `images/originals/${file}`;

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
});
document.addEventListener('DOMContentLoaded', function() {
    function debugLog(message) {
        console.log(`[Illustrations Debug] ${message}`);
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
        'Armknospen Beinknospen, 2019.jpg',
        'Dalli Dalli, 2021.jpg',
        'dam Dam Dam DAM, 2021.jpg',
        'Der Fleck, 2021.jpg',
        'Der Lenz, 2020.jpg',
        'Die Prinzessin, 2019.jpg',
        'Die Verwandelung, 2022.jpg',
        'Diving Dumbo, 2019.jpg',
        'Eleganza Extravaganza, 2019.jpeg',
        'Hundi im Schnee, 2021.jpg',
        'Ich Wünsch Mirne Kleine Miezekatze, 2019.jpg',
        'Im Hohen Grass, 2019.jpg',
        'Kalter aus Oberohrn, 2023.jpg',
        'Käshof, 2023.jpg',
        'Lemberg im Frühling, Winter, 2020.jpg',
        'Ludwig und Ich, 2018.jpg',
        'Miss Chilifee, 2019.jpg',
        'Nelly Dix, 2019.jpg',
        'Pommes Schranke, 2020.jpg',
        'Prinzesschen auf dem Gürkchen, 2019.jpg',
        'Prinzessin, 2019.jpg',
        'Rakete, 2019.jpg',
        'received_10201527586789453.jpg',
        'Ruhe vor dem BOF, 2022.jpg',
        'Saturday Nightschabeltier, 2019.jpg',
        'scan0139.jpg',
        'scan0140.jpg',
        'Space Sofa 2017.jpg',
        'Sucht, 2019.jpg',
        'Wunder, 2019.jpg',
        'Zitronen T, 2019.jpg'
    ];

    imageFiles.forEach((file) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const img = document.createElement('img');
        img.alt = file;
        img.src = `images/illustrations/${file}`;

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

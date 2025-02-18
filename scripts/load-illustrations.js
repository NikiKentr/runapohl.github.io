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
            popupTitle.textContent = file;  // Set the image name as the title
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

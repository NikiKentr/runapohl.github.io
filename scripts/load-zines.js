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

    // Define zines with their pages
    const zines = [
        {
            title: "Abflug, 2020",
            folder: "Abglug",
            preview: "preview1.jpg",  // Using first page as preview
            pages: Array.from({length: 1}, (_, i) => `page${i + 1}.jpg`) // Generates array of 24 pages
        },


        {
            title: "Rufus die Weihnachtsmaus",
            folder: "Rufus die Weihnachtsmaus",
            preview: "page1.jpg",  // Using first page as preview
            pages: Array.from({length: 17}, (_, i) => `page${i + 1}.jpg`) // Generates array of 24 pages
        },

        {
            title: "Coronacomic, 2020",
            folder: "Coronacomic",
            preview: "preview1.jpg",  // Using first page as preview
            pages: Array.from({length: 1}, (_, i) => `page${i + 1}.png`) // Generates array of 24 pages
        },

        {
            title: "Hasi & Ute",
            folder: "Hasi & Ute",
            preview: "preview1.jpg",  // Using first page as preview
            pages: Array.from({length: 7}, (_, i) => `page${i + 1}.jpg`) // Generates array of 24 pages
        }

        
        // Add more zines here as needed
    ];

    let currentZine = null;
    let currentPage = 0;

    // Create zine previews
    zines.forEach(zine => {
        const preview = document.createElement('div');
        preview.className = 'zine-preview';
        
        const img = document.createElement('img');
        const previewPath = encodeURI(`images/zines/${zine.folder}/${zine.preview}`);
        debugLog(`Loading preview from: ${previewPath}`);
        
        img.src = previewPath;
        img.alt = zine.title;
        
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
        
        img.src = pagePath;
        img.alt = `${currentZine.title} - Page ${currentPage + 1}`;
        
        img.onerror = function() {
            debugLog(`Error loading page: ${pagePath}`);
            flipBook.innerHTML = `
                <div style="padding: 20px; text-align: center; color: red;">
                    Error loading page ${currentPage + 1}
                </div>`;
        };
        
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
});
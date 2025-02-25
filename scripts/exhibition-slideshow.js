/**
 * Exhibition slideshow and popup image functionality
 * Handles both regular slideshow navigation and fullscreen image popup with navigation
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    
    // Initialize popup if it doesn't exist
    if (!document.getElementById('imagePopup')) {
        createImagePopup();
    }
    
    const imagePopup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const popupCloseBtn = document.querySelector('.popup-close');
    const popupPrevBtn = document.querySelector('.popup-prev');
    const popupNextBtn = document.querySelector('.popup-next');
    
    // Add clickable class to all slideshow images
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img && !img.classList.contains('clickable-image')) {
            img.classList.add('clickable-image');
        }
    });
    
    // Slideshow functionality
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Navigation buttons for slideshow
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    // Image popup functionality
    let currentPopupIndex = 0;
    
    // Attach click events to all slideshow images
    const clickableImages = document.querySelectorAll('.clickable-image');
    clickableImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            openPopup(this.src, currentSlide);
        });
    });
    
    // Open popup with specific image
    function openPopup(imageSrc, slideIndex) {
        popupImage.src = imageSrc;
        imagePopup.classList.add('active');
        currentPopupIndex = slideIndex;
    }
    
    // Popup navigation functions
    function showPopupSlide(n) {
        currentPopupIndex = (n + slides.length) % slides.length;
        const img = slides[currentPopupIndex].querySelector('img');
        popupImage.src = img.src;
    }
    
    // Attach event listeners to popup elements
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', function() {
            imagePopup.classList.remove('active');
        });
    }
    
    if (imagePopup) {
        imagePopup.addEventListener('click', function(e) {
            if (e.target === imagePopup) {
                imagePopup.classList.remove('active');
            }
        });
    }
    
    if (popupPrevBtn) {
        popupPrevBtn.addEventListener('click', function() {
            showPopupSlide(currentPopupIndex - 1);
        });
    }
    
    if (popupNextBtn) {
        popupNextBtn.addEventListener('click', function() {
            showPopupSlide(currentPopupIndex + 1);
        });
    }
    
    // Keyboard navigation for both slideshow and popup
    document.addEventListener('keydown', function(e) {
        if (imagePopup.classList.contains('active')) {
            // Popup keyboard navigation
            if (e.key === 'Escape') {
                imagePopup.classList.remove('active');
            } else if (e.key === 'ArrowLeft') {
                showPopupSlide(currentPopupIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showPopupSlide(currentPopupIndex + 1);
            }
        } else {
            // Slideshow keyboard navigation
            if (e.key === 'ArrowLeft') {
                showSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                showSlide(currentSlide + 1);
            }
        }
    });
    
    // Create image popup if not in the HTML
    function createImagePopup() {
        const popup = document.createElement('div');
        popup.id = 'imagePopup';
        popup.className = 'image-popup';
        
        popup.innerHTML = `
            <div class="popup-content">
                <img id="popupImage" src="" alt="Vergrößerte Ansicht">
                <button class="popup-prev">&#10094;</button>
                <button class="popup-next">&#10095;</button>
                <button class="popup-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(popup);
    }
});
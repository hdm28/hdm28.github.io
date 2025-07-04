// Clean portfolio interactions - no movement, just overlay effects
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[src*="picsum"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
});

// Hero banner scroll effect for project pages
document.addEventListener('DOMContentLoaded', function() {
    const heroOverlay = document.querySelector('.hero-overlay');
    
    if (heroOverlay) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollProgress = Math.min(scrollY / windowHeight, 1);
            const opacity = scrollProgress * 0.75;
            
            heroOverlay.style.background = `rgba(0, 0, 0, ${opacity})`;
        });
    }
});

// Gallery Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox HTML structure
    const lightboxHTML = `
        <div class="lightbox" id="lightbox">
            <button class="lightbox-close" id="lightbox-close">&times;</button>
            <div class="lightbox-main">
                <button class="lightbox-nav lightbox-prev" id="lightbox-prev">‹</button>
                <img class="lightbox-image" id="lightbox-image" src="" alt="">
                <button class="lightbox-nav lightbox-next" id="lightbox-next">›</button>
            </div>
            <div class="lightbox-thumbnails" id="lightbox-thumbnails"></div>
        </div>
    `;
    
    // Add lightbox to body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.project-gallery img');
    let currentIndex = 0;
    
    if (galleryImages.length > 0) {
        // Add click listeners to gallery images
        galleryImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(index));
        });
        
        // Create thumbnails
        function createThumbnails() {
            lightboxThumbnails.innerHTML = '';
            galleryImages.forEach((img, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = img.src;
                thumbnail.alt = img.alt;
                thumbnail.className = 'lightbox-thumbnail';
                thumbnail.addEventListener('click', () => showImage(index));
                lightboxThumbnails.appendChild(thumbnail);
            });
        }
        
        // Open lightbox
        function openLightbox(index) {
            createThumbnails();
            currentIndex = index;
            showImage(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateNavButtons();
        }
        
        // Show specific image
        function showImage(index) {
            currentIndex = index;
            const img = galleryImages[index];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            
            // Update thumbnail active state
            const thumbnails = lightboxThumbnails.querySelectorAll('.lightbox-thumbnail');
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
            
            updateNavButtons();
        }
        
        // Update navigation button visibility
        function updateNavButtons() {
            lightboxPrev.style.display = currentIndex === 0 ? 'none' : 'block';
            lightboxNext.style.display = currentIndex === galleryImages.length - 1 ? 'none' : 'block';
        }
        
        // Navigate to previous image
        function prevImage() {
            if (currentIndex > 0) {
                showImage(currentIndex - 1);
            }
        }
        
        // Navigate to next image
        function nextImage() {
            if (currentIndex < galleryImages.length - 1) {
                showImage(currentIndex + 1);
            }
        }
        
        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Event listeners
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', prevImage);
        lightboxNext.addEventListener('click', nextImage);
        
        // Close lightbox when clicking on background (overlay)
        lightbox.addEventListener('click', (e) => {
            // Close if clicking directly on the lightbox container or lightbox-main
            if (e.target === lightbox || e.target.classList.contains('lightbox-main')) {
                closeLightbox();
            }
        });
        
        // Also add click listener to lightbox-main for better background detection
        const lightboxMain = document.getElementById('lightbox').querySelector('.lightbox-main');
        lightboxMain.addEventListener('click', (e) => {
            // Only close if clicking on the lightbox-main itself, not its children
            if (e.target === lightboxMain) {
                closeLightbox();
            }
        });
        
        // Prevent lightbox from closing when clicking on the image, thumbnails, or nav buttons
        lightboxImage.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        lightboxThumbnails.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Prevent nav buttons from closing lightbox
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        });
    }
});
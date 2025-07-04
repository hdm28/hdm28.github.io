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
            <img class="lightbox-image" id="lightbox-image" src="" alt="">
            <div class="lightbox-thumbnails" id="lightbox-thumbnails"></div>
        </div>
    `;
    
    // Add lightbox to body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
    const lightboxClose = document.getElementById('lightbox-close');
    
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.project-gallery img');
    
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
            showImage(index);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Show specific image
        function showImage(index) {
            const img = galleryImages[index];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            
            // Update thumbnail active state
            const thumbnails = lightboxThumbnails.querySelectorAll('.lightbox-thumbnail');
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }
        
        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Event listeners
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
});
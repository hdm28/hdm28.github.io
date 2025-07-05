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
        // Set initial overlay opacity on page load
        function updateOverlay() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollProgress = Math.min(scrollY / windowHeight, 1);
            const opacity = 0.6 + (scrollProgress *0.7); // 25% base + up to 50% more = 25% to 75% range
            
            heroOverlay.style.background = `rgba(0, 0, 0, ${opacity})`;
        }
        
        // Set initial state
        updateOverlay();
        
        // Update on scroll
        window.addEventListener('scroll', updateOverlay);
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
                <img class="lightbox-image" id="lightbox-image" src="" alt="" style="display: none;">
                <video class="lightbox-video" id="lightbox-video" controls style="display: none;">
                    <source src="" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <button class="lightbox-nav lightbox-next" id="lightbox-next">›</button>
            </div>
            <div class="lightbox-thumbnails" id="lightbox-thumbnails"></div>
        </div>
    `;
    
    // Add lightbox to body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Get all gallery images and videos from both project-gallery and content-gallery
    const galleryItems = document.querySelectorAll('.project-gallery img, .project-gallery video, .content-gallery img, .content-gallery video');
    let currentIndex = 0;
    
    if (galleryItems.length > 0) {
        // Add click listeners to gallery items
        galleryItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => openLightbox(index));
        });
        
        // Create thumbnails
        function createThumbnails() {
            lightboxThumbnails.innerHTML = '';
            galleryItems.forEach((item, index) => {
                const thumbnail = document.createElement('img');
                if (item.tagName === 'VIDEO') {
                    // For videos, create a canvas thumbnail from the first frame
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 100;
                    canvas.height = 60;
                    
                    // Draw a video icon as placeholder
                    ctx.fillStyle = '#333';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'white';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('▶', canvas.width/2, canvas.height/2 + 7);
                    
                    thumbnail.src = canvas.toDataURL();
                    thumbnail.alt = 'Video thumbnail';
                } else {
                    thumbnail.src = item.src;
                    thumbnail.alt = item.alt;
                }
                thumbnail.className = 'lightbox-thumbnail';
                thumbnail.addEventListener('click', () => showItem(index));
                lightboxThumbnails.appendChild(thumbnail);
            });
        }
        
        // Open lightbox
        function openLightbox(index) {
            createThumbnails();
            currentIndex = index;
            showItem(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateNavButtons();
        }
        
        // Show specific item (image or video)
        function showItem(index) {
            currentIndex = index;
            const item = galleryItems[index];
            
            if (item.tagName === 'VIDEO') {
                // Show video
                lightboxImage.style.display = 'none';
                lightboxVideo.style.display = 'block';
                const source = lightboxVideo.querySelector('source');
                source.src = item.querySelector('source').src;
                lightboxVideo.load();
            } else {
                // Show image
                lightboxVideo.style.display = 'none';
                lightboxImage.style.display = 'block';
                lightboxImage.src = item.src;
                lightboxImage.alt = item.alt;
            }
            
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
            lightboxNext.style.display = currentIndex === galleryItems.length - 1 ? 'none' : 'block';
        }
        
        // Navigate to previous item
        function prevItem() {
            if (currentIndex > 0) {
                showItem(currentIndex - 1);
            }
        }
        
        // Navigate to next item
        function nextItem() {
            if (currentIndex < galleryItems.length - 1) {
                showItem(currentIndex + 1);
            }
        }
        
        // Close lightbox
        function closeLightbox() {
            // Pause any playing lightbox video
            if (lightboxVideo.style.display === 'block') {
                lightboxVideo.pause();
            }
            
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Event listeners
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', prevItem);
        lightboxNext.addEventListener('click', nextItem);
        
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
        
        // Prevent lightbox from closing when clicking on the image/video, thumbnails, or nav buttons
        lightboxImage.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        lightboxVideo.addEventListener('click', (e) => {
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
                prevItem();
            } else if (e.key === 'ArrowRight') {
                nextItem();
            }
        });
    }
});

// Video Controls functionality
document.addEventListener('DOMContentLoaded', function() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('.gallery-video-with-controls');
        const volumeSlider = container.querySelector('.volume-slider');
        const muteButton = container.querySelector('.mute-button');
        
        if (!video || !volumeSlider || !muteButton) return;
        
        // Initialize volume - start paused
        video.volume = 0;
        volumeSlider.value = 0;
        video.pause(); // Start paused instead of autoplaying
        
        // Play on hover, pause when not hovering
        container.addEventListener('mouseenter', function() {
            video.play();
        });
        
        container.addEventListener('mouseleave', function() {
            video.pause();
        });
        
        // Volume slider control
        volumeSlider.addEventListener('input', function() {
            video.volume = this.value;
            video.muted = this.value === '0';
            updateMuteButton();
        });
        
        // Mute button control
        muteButton.addEventListener('click', function() {
            if (video.muted || video.volume === 0) {
                video.muted = false;
                video.volume = 0.5;
                volumeSlider.value = 0.5;
            } else {
                video.muted = true;
                volumeSlider.value = 0;
            }
            updateMuteButton();
        });
        
        // Update mute button icon
        function updateMuteButton() {
            // Using CSS background images instead of emoji
            muteButton.className = 'mute-button ' + (video.muted || video.volume === 0 ? 'muted' : 'unmuted');
        }
        
        // Initialize button state
        updateMuteButton();
        
        // Prevent video controls from triggering lightbox
        container.addEventListener('click', function(e) {
            if (e.target.closest('.video-controls')) {
                e.stopPropagation();
            } else {
                // Pause video when entering lightbox
                video.pause();
            }
        });
    });
});
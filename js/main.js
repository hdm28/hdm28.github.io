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
        // Get custom opacity values or use defaults
        const baseOpacity = parseFloat(getComputedStyle(heroOverlay).getPropertyValue('--base-opacity')) || 0.6;
        const scrollOpacity = parseFloat(getComputedStyle(heroOverlay).getPropertyValue('--scroll-opacity')) || 1.3;
        
        // Set initial overlay opacity on page load
        function updateOverlay() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollProgress = Math.min(scrollY / windowHeight, 1);
            const opacity = baseOpacity + (scrollProgress * (scrollOpacity - baseOpacity));
            
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
                
                // Preserve playback state from gallery video
                const wasPlaying = !item.paused;
                const currentTime = item.currentTime;
                
                lightboxVideo.load();
                lightboxVideo.addEventListener('loadeddata', function onLoaded() {
                    // Always open videos muted in lightbox with volume at 0 and force controls update
                    lightboxVideo.muted = true;
                    lightboxVideo.volume = 0;
                    
                    // Force the browser to update the controls by triggering events
                    lightboxVideo.dispatchEvent(new Event('volumechange'));
                    
                    lightboxVideo.currentTime = currentTime;
                    if (wasPlaying) {
                        lightboxVideo.play();
                    }
                    lightboxVideo.removeEventListener('loadeddata', onLoaded);
                }, { once: true });
            } else {
                // Show image
                lightboxVideo.style.display = 'none';
                lightboxImage.style.display = 'block';
                lightboxImage.src = item.src;
                lightboxImage.alt = item.alt;
                
                // Reset zoom state
                lightboxImage.classList.remove('zoomed');
                
                // Add simple zoom functionality
                lightboxImage.onclick = function(e) {
                    e.stopPropagation();
                    lightboxImage.classList.toggle('zoomed');
                };
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
            // Close if clicking anywhere except navigation arrows or thumbnails
            if (!e.target.closest('.lightbox-nav') && 
                !e.target.closest('.lightbox-thumbnails')) {
                closeLightbox();
            }
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

// Page preloading on hover for gallery items
document.addEventListener('DOMContentLoaded', function() {
    const galleryLinks = document.querySelectorAll('.gallery .grid-item');
    const prefetchedPages = new Set(); // Track already prefetched pages
    
    if (galleryLinks.length > 0) {
        galleryLinks.forEach(link => {
            // Add hover event to preload the page
            link.addEventListener('mouseenter', function() {
                const href = this.getAttribute('href');
                
                // Only prefetch if we haven't already and it's a relative link
                if (href && !prefetchedPages.has(href) && !href.startsWith('http')) {
                    prefetchPage(href);
                    prefetchedPages.add(href);
                }
            });
        });
    }
    
    function prefetchPage(url) {
        // Create a link element for prefetching
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = url;
        prefetchLink.as = 'document';
        
        // Add to head to start prefetching
        document.head.appendChild(prefetchLink);
        
        // Optional: Also fetch and cache the page content for even faster loading
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
            })
            .then(html => {
                // Page is now cached by the browser
                console.log(`Prefetched: ${url}`);
            })
            .catch(error => {
                // Silent fail - prefetching is an enhancement, not critical
                console.log(`Prefetch failed for ${url}:`, error);
            });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const openBtn = document.getElementById('open-btn');
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');
    const heartsContainer = document.getElementById('hearts-container');
    const themeToggle = document.getElementById('theme-toggle');
    const fadeElements = document.querySelectorAll('#main-content .fade-in-text');
    const replayBtn = document.getElementById('replay-btn');

    // 4. Replay functionality
    replayBtn.addEventListener('click', () => {
        location.reload();
    });

    // 1. Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', 'dark');
        }
    });

    // 2. Envelope Opening Animation
    openBtn.addEventListener('click', openEnvelope);
    envelope.addEventListener('click', openEnvelope);

    function openEnvelope() {
        if (envelope.classList.contains('open')) return;

        envelope.classList.add('open');

        // Hide button to prevent double clicks
        openBtn.style.opacity = '0';
        openBtn.style.pointerEvents = 'none';

        // Wait for envelope animation (0.6s) + pause (0.2s)
        setTimeout(() => {
            transitionToContent();
        }, 1200);
    }

    function transitionToContent() {
        startScreen.classList.remove('active');
        startScreen.classList.add('hidden');

        mainContent.classList.remove('hidden');
        mainContent.classList.add('active');
        mainContent.setAttribute('aria-hidden', 'false');

        // Trigger stagger animation for text
        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 800 + 500); // Stagger by 800ms, start after 500ms
        });

        startFloatingHearts();
    }

    // 3. Floating Hearts Generator
    function startFloatingHearts() {
        setInterval(() => {
            createHeart();
        }, 800); // New element every 800ms
    }

    function createHeart() {
        const element = document.createElement('div');
        element.classList.add('heart');

        const items = ['🌸', 'ชมพู่', 'น่ารักจัง'];
        const randomItem = items[Math.floor(Math.random() * items.length)];

        element.innerText = randomItem;

        // If it's text, ensure it doesn't rotate too crazily and has readable font
        if (randomItem === 'ชมพู่' || randomItem === 'น่ารักจัง') {
            element.style.fontFamily = "'Itim', cursive";
            element.style.fontWeight = "bold";
            element.style.textShadow = "none"; // Remove shadow for cleaner look if requested

            // "Opposite" color logic
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                // Theme is Dark -> Text should be Light (Pastel/White)
                element.style.color = '#fff0f5';
            } else {
                // Theme is Light -> Text should be Dark (Dark Brown)
                element.style.color = '#2b1d22';
            }
        } else {
            // For the flower emoji, let it use default or specific color
            element.style.color = 'var(--primary-color)';
        }

        // Random Position & Speed
        element.style.left = Math.random() * 100 + 'vw';
        element.style.animationDuration = Math.random() * 3 + 5 + 's'; // 5s to 8s
        element.style.fontSize = Math.random() * 1 + 1 + 'rem';

        heartsContainer.appendChild(element);

        // Remove after animation finishes
        setTimeout(() => {
            element.remove();
        }, 8000);
    }

    // 5. Page Navigation
    const nextBtn = document.getElementById('next-btn');
    const heartPage = document.getElementById('heart-page');
    const scratchPage = document.getElementById('scratch-page');

    nextBtn.addEventListener('click', () => {
        mainContent.classList.add('fade-out');
        
        setTimeout(() => {
            mainContent.classList.add('hidden');
            mainContent.classList.remove('fade-out');
            
            heartPage.classList.remove('hidden');
            heartPage.classList.add('fade-in');
            heartPage.setAttribute('aria-hidden', 'false');
            
            setTimeout(() => {
                heartPage.classList.remove('fade-in');
                heartPage.classList.add('active');
            }, 50);
        }, 600);
    });

    // 6. Heart Filling Logic (Hold to Fill)
    const heartSvg = document.querySelector('.heart-svg');
    const heartFill = document.getElementById('heart-fill');
    const heartProgress = document.querySelector('.heart-progress');
    let fillPercentage = 0;
    let fillInterval = null;

    function startFilling() {
        if (fillPercentage >= 100) return;

        fillInterval = setInterval(() => {
            if (fillPercentage >= 100) {
                stopFilling();
                // When full, transition to scratch page with fade effect
                heartPage.classList.add('fade-out');
                
                setTimeout(() => {
                    heartPage.classList.add('hidden');
                    heartPage.classList.remove('fade-out');
                    
                    scratchPage.classList.remove('hidden');
                    scratchPage.classList.add('fade-in');
                    scratchPage.setAttribute('aria-hidden', 'false');
                    
                    setTimeout(() => {
                        scratchPage.classList.remove('fade-in');
                        scratchPage.classList.add('active');
                    }, 50);
                    
                    initScratchCard();
                }, 600);
                return;
            }

            fillPercentage += 2; // Increase by 2% every interval
            if (fillPercentage > 100) fillPercentage = 100;

            // Update fill (SVG rect grows from bottom)
            const newY = 100 - fillPercentage;
            heartFill.setAttribute('y', newY);
            heartFill.setAttribute('height', fillPercentage);

            // Update progress text
            heartProgress.textContent = fillPercentage + '%';
        }, 100); // Every 100ms
    }

    function stopFilling() {
        if (fillInterval) {
            clearInterval(fillInterval);
            fillInterval = null;
        }
    }

    // Mouse events
    heartSvg.addEventListener('mousedown', startFilling);
    heartSvg.addEventListener('mouseup', stopFilling);
    heartSvg.addEventListener('mouseleave', stopFilling);

    // Touch events
    heartSvg.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startFilling();
    });
    heartSvg.addEventListener('touchend', stopFilling);
    heartSvg.addEventListener('touchcancel', stopFilling);

    // 7. Scratch Card Logic
    function initScratchCard() {
        const canvas = document.getElementById('scratch-canvas');
        const ctx = canvas.getContext('2d');
        const image = document.getElementById('scratch-image');
        const instruction = document.getElementById('scratch-instruction');
        const finalMessage = document.getElementById('final-message');

        // Use the actual image
        image.src = 'image.png';

        // Set canvas size
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        // Draw scratch overlay (blurred/gray)
        ctx.fillStyle = '#d3d3d3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text on overlay
        ctx.fillStyle = '#888';
        ctx.font = 'bold 20px Itim, cursive';
        ctx.textAlign = 'center';
        ctx.fillText('ขูดที่นี่', canvas.width / 2, canvas.height / 2);

        let isScratching = false;
        let hasStartedScratching = false;

        // Mouse/Touch events
        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', stopScratch);
        canvas.addEventListener('touchstart', startScratch);
        canvas.addEventListener('touchmove', scratch);
        canvas.addEventListener('touchend', stopScratch);

        function startScratch(e) {
            isScratching = true;
            if (!hasStartedScratching) {
                hasStartedScratching = true;
                instruction.classList.add('hidden');
            }
            scratch(e);
        }

        function scratch(e) {
            if (!isScratching) return;

            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;

            // Erase circular area
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            // Check scratch percentage
            checkScratchPercentage();
        }

        function stopScratch() {
            isScratching = false;
        }

        function checkScratchPercentage() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;

            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] < 128) transparentPixels++;
            }

            const percentage = (transparentPixels / (pixels.length / 4)) * 100;

            if (percentage > 60) {
                // Clear canvas completely
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.pointerEvents = 'none';

                // Show final message with stagger effect
                setTimeout(() => {
                    finalMessage.classList.remove('hidden');

                    // Trigger stagger animation for each paragraph
                    const messageParagraphs = finalMessage.querySelectorAll('.fade-in-text');
                    messageParagraphs.forEach((p, index) => {
                        setTimeout(() => {
                            p.classList.add('visible');
                        }, index * 1800 + 500); // Stagger by 1800ms, start after 500ms
                    });
                }, 300);
            }
        }
    }
});

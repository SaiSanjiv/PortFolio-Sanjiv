document.addEventListener('DOMContentLoaded', () => {

    // --- Cinematic Terminal Intro ---
    const preloader = document.getElementById('preloader');
    const terminalLinesEl = document.getElementById('terminal-lines');
    const finalNameContainer = document.getElementById('final-name-container');
    const typedNameEl = document.getElementById('typed-name');

    const terminalText = [
        "> Initializing Portfolio...",
        "> Loading Developer Profile...",
        "> Authenticating User...",

        
        "> Access Granted"
    ];
    const finalName = "SAI SANJIV";

    let lineIndex = 0;
    let charIndex = 0;
    const terminalSpeed = 30; // fast typing for terminal
    const terminalLineDelay = 400; // delay between lines
    const finalTypingSpeed = 100; // slower typing for final name
    const pauseBeforeFade = 1000;

    function typeTerminal() {
        if (!terminalLinesEl) return;
        
        if (lineIndex < terminalText.length) {
            if (charIndex === 0) {
                // Create a new line element
                const lineEl = document.createElement('div');
                lineEl.className = 'terminal-line';
                lineEl.innerHTML = '<span class="term-text"></span><span class="typing-cursor" style="height: 1.2rem; background-color: var(--secondary); width: 0.6em; margin-left: 4px;"></span>';
                terminalLinesEl.appendChild(lineEl);
            }
            
            const currentLineText = terminalText[lineIndex];
            const currentLineEls = terminalLinesEl.querySelectorAll('.terminal-line');
            const activeLineEl = currentLineEls[currentLineEls.length - 1];
            const textSpan = activeLineEl.querySelector('.term-text');
            
            if (charIndex < currentLineText.length) {
                textSpan.textContent += currentLineText.charAt(charIndex);
                charIndex++;
                setTimeout(typeTerminal, terminalSpeed);
            } else {
                // Line complete
                const cursorSpan = activeLineEl.querySelector('.typing-cursor');
                if (cursorSpan) cursorSpan.remove(); // remove cursor from old line
                
                lineIndex++;
                charIndex = 0;
                
                setTimeout(() => {
                    if (lineIndex < terminalText.length) {
                        typeTerminal();
                    } else {
                        // All terminal lines done.
                        setTimeout(() => {
                            terminalLinesEl.style.opacity = '0';
                            setTimeout(() => {
                                terminalLinesEl.style.display = 'none';
                                finalNameContainer.style.display = 'block';
                                // tiny reflow to ensure transition works
                                void finalNameContainer.offsetWidth; 
                                finalNameContainer.style.opacity = '1';
                                typeFinalName();
                            }, 300);
                        }, 500);
                    }
                }, terminalLineDelay);
            }
        }
    }

    function typeFinalName() {
        if (!typedNameEl) return;
        if (charIndex < finalName.length) {
            typedNameEl.textContent += finalName.charAt(charIndex);
            charIndex++;
            setTimeout(typeFinalName, finalTypingSpeed);
        } else {
            setTimeout(hidePreloader, pauseBeforeFade);
        }
    }

    function hidePreloader() {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000); 
        }
    }

    // Start typing effect shortly after JS parses
    if (terminalLinesEl) {
        setTimeout(typeTerminal, 400); // initial delay before starting terminal
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const bgGlow = document.querySelector('.bg-glow');
    
    // Check if it's a touch device, disable custom cursor if so
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            // Update cursor element positions
            if(cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
            
            // Add a slight delay to the follower
            if(cursorFollower) {
                setTimeout(() => {
                    cursorFollower.style.left = e.clientX + 'px';
                    cursorFollower.style.top = e.clientY + 'px';
                }, 50);
            }

            // Update background glow to follow mouse somewhat
            if(bgGlow) {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                bgGlow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(138, 43, 226, 0.15), transparent 50%)`;
            }
        });

        // Hover effects on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .project-card, .btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(cursor) cursor.classList.add('hovering');
                if(cursorFollower) cursorFollower.style.display = 'none';
            });
            el.addEventListener('mouseleave', () => {
                if(cursor) cursor.classList.remove('hovering');
                if(cursorFollower) cursorFollower.style.display = 'block';
            });
        });
    } else {
        // cleanup dom if touch
        if(cursor) cursor.style.display = 'none';
        if(cursorFollower) cursorFollower.style.display = 'none';
    }

    // --- Particle Background Effect ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const numberOfParticles = window.innerWidth < 768 ? 40 : 80;
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 0.5; 
            }
            draw() {
                ctx.fillStyle = 'rgba(138, 43, 226, 0.4)'; 
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        // slightly repel elements to create organic movement
                        this.x -= dx * 0.01;
                        this.y -= dy * 0.01;
                    }
                }
            }
        }

        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        opacityValue = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(138, 43, 226, ${opacityValue * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
                
                if (mouse.x != null && mouse.y != null) {
                    let mdx = particlesArray[a].x - mouse.x;
                    let mdy = particlesArray[a].y - mouse.y;
                    let mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mDist < 150) {
                         opacityValue = 1 - (mDist / 150);
                         ctx.strokeStyle = `rgba(0, 255, 255, ${opacityValue * 0.3})`;
                         ctx.lineWidth = 1;
                         ctx.beginPath();
                         ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                         ctx.lineTo(mouse.x, mouse.y);
                         ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connect();
            requestAnimationFrame(animate);
        }

        setTimeout(() => {
            initCanvas();
            animate();
        }, 100);

        window.addEventListener('resize', () => {
            initCanvas();
        });
    }

    // --- Navbar Scroll Effect ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if(nav) nav.classList.add('scrolled');
        } else {
            if(nav) nav.classList.remove('scrolled');
        }
    });

    // --- ScrollSpy for Navigation ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        if (current) {
            navLinks.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href').includes(current)) {
                    a.classList.add('active');
                }
            });
        }
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        let delayCounter = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for elements appearing at the same time
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delayCounter * 150);
                delayCounter++;
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Magnetic Button Effect ---
    const btns = document.querySelectorAll('.btn-magnetic');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button slightly towards cursor
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Reset position
            btn.style.transform = `translate(0px, 0px)`;
            // Add a transition back
            btn.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                btn.style.transition = '';
            }, 300);
        });
    });

});

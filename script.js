document.addEventListener('DOMContentLoaded', () => {

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

    // --- Navbar Scroll Effect ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if(nav) nav.classList.add('scrolled');
        } else {
            if(nav) nav.classList.remove('scrolled');
        }
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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

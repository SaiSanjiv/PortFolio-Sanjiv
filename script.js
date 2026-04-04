document.addEventListener('DOMContentLoaded', () => {

    /* ---------------- INTRO ANIMATION ---------------- */

    const preloader = document.getElementById("preloader");
    const typedRest = document.getElementById("typed-rest");

    const text = "AI SANJIV";
    let i = 0;

    function typeName(){
        if(i < text.length){
            typedRest.textContent += text.charAt(i);
            i++;
            setTimeout(typeName,120);
        }else{
            setTimeout(()=>{
                preloader.classList.add("hidden");
                setTimeout(()=>{
                    preloader.style.display="none";
                },800);
            },800);
        }
    }

    window.addEventListener("load", ()=>{
        setTimeout(typeName,500);
    });


    /* ---------------- CUSTOM CURSOR ---------------- */

    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const bgGlow = document.querySelector('.bg-glow');

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if(!isTouchDevice){

        document.addEventListener('mousemove', e => {

            if(cursor){
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }

            if(cursorFollower){
                setTimeout(()=>{
                    cursorFollower.style.left = e.clientX + 'px';
                    cursorFollower.style.top = e.clientY + 'px';
                },50);
            }

            if(bgGlow){
                const x = (e.clientX/window.innerWidth)*100;
                const y = (e.clientY/window.innerHeight)*100;

                bgGlow.style.background =
                `radial-gradient(circle at ${x}% ${y}%, rgba(138,43,226,0.15), transparent 50%)`;
            }

        });

        const hoverElements = document.querySelectorAll('a,button,.project-card,.btn');

        hoverElements.forEach(el=>{
            el.addEventListener('mouseenter',()=>{
                cursor.classList.add('hovering');
                cursorFollower.style.display='none';
            });

            el.addEventListener('mouseleave',()=>{
                cursor.classList.remove('hovering');
                cursorFollower.style.display='block';
            });
        });

    }else{
        if(cursor) cursor.style.display='none';
        if(cursorFollower) cursorFollower.style.display='none';
    }


    /* ---------------- PARTICLE BACKGROUND ---------------- */

    const canvas = document.getElementById('particle-canvas');

    if(canvas){

        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const numberOfParticles = window.innerWidth < 768 ? 40 : 80;

        let mouse = {x:null,y:null,radius:150};

        window.addEventListener('mousemove',e=>{
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout',()=>{
            mouse.x = null;
            mouse.y = null;
        });

        class Particle{

            constructor(){
                this.x = Math.random()*canvas.width;
                this.y = Math.random()*canvas.height;
                this.vx = (Math.random()-0.5)*0.5;
                this.vy = (Math.random()-0.5)*0.5;
                this.size = Math.random()*2+0.5;
            }

            draw(){
                ctx.fillStyle='rgba(138,43,226,0.4)';
                ctx.shadowBlur=5;
                ctx.shadowColor='rgba(0,255,255,0.5)';

                ctx.beginPath();
                ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
                ctx.closePath();
                ctx.fill();
            }

            update(){

                this.x += this.vx;
                this.y += this.vy;

                if(this.x<0||this.x>canvas.width) this.vx*=-1;
                if(this.y<0||this.y>canvas.height) this.vy*=-1;

                if(mouse.x!=null){

                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;

                    let distance = Math.sqrt(dx*dx+dy*dy);

                    if(distance<mouse.radius){
                        this.x -= dx*0.01;
                        this.y -= dy*0.01;
                    }
                }
            }

        }

        function initCanvas(){

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            particlesArray=[];

            for(let i=0;i<numberOfParticles;i++){
                particlesArray.push(new Particle());
            }
        }

        function connect(){

            for(let a=0;a<particlesArray.length;a++){

                for(let b=a;b<particlesArray.length;b++){

                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;

                    let distance = Math.sqrt(dx*dx+dy*dy);

                    if(distance<120){

                        let opacity = 1-distance/120;

                        ctx.strokeStyle=`rgba(138,43,226,${opacity*0.15})`;
                        ctx.lineWidth=1;

                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate(){

            ctx.clearRect(0,0,canvas.width,canvas.height);

            for(let i=0;i<particlesArray.length;i++){
                particlesArray[i].update();
                particlesArray[i].draw();
            }

            connect();

            requestAnimationFrame(animate);
        }

        setTimeout(()=>{
            initCanvas();
            animate();
        },100);

        window.addEventListener('resize',initCanvas);
    }


    /* ---------------- NAVBAR SCROLL EFFECT ---------------- */

    const nav = document.querySelector('nav');

    window.addEventListener('scroll',()=>{

        if(window.scrollY>50){
            nav.classList.add('scrolled');
        }else{
            nav.classList.remove('scrolled');
        }

    });


    /* ---------------- SCROLL REVEAL ---------------- */

    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries,obs)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }

        });

    },{threshold:0.15});

    revealElements.forEach(el=>observer.observe(el));


    /* ---------------- MAGNETIC BUTTON ---------------- */

    const btns = document.querySelectorAll('.btn-magnetic');

    btns.forEach(btn=>{

        btn.addEventListener('mousemove',e=>{

            const rect = btn.getBoundingClientRect();

            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;

            btn.style.transform=`translate(${x*0.3}px,${y*0.3}px)`;
        });

        btn.addEventListener('mouseleave',()=>{

            btn.style.transform='translate(0,0)';
            btn.style.transition='transform 0.3s ease';

            setTimeout(()=>{
                btn.style.transition='';
            },300);

        });

    });

});
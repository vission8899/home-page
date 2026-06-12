document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    initParticles();
    initTyping();
    initScrollAnimations();
    initNavbar();
    initThemeToggle();
    initCountUp();
    initSkillBars();
    initSmoothScroll();
    initHeartBurst();
});

function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

function initTyping() {
    const texts = ['Java Developer', 'Spring Boot 玩家', 'Bug终结者', '咖啡续命师'];
    const element = document.querySelector('.typing-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = texts[textIndex];
        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }
    type();
}

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 30);
    }
}

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>发送成功！✓</span>';
    btn.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        e.target.reset();
    }, 3000);
}

function initHeartBurst() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    var settings = {
        particles: {
            length: 500,
            duration: 2,
            velocity: 100,
            effect: 0.8,
            size: 20,
        },
    };

    var Point = (function () {
        function Point(x, y) {
            this.x = typeof x !== "undefined" ? x : 0;
            this.y = typeof y !== "undefined" ? y : 0;
        }
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.length = function (length) {
            if (typeof length == "undefined")
                return Math.sqrt(this.x * this.x + this.y * this.y);
            this.normalize();
            this.x *= length;
            this.y *= length;
            return this;
        };
        Point.prototype.normalize = function () {
            var length = this.length();
            this.x /= length;
            this.y /= length;
            return this;
        };
        return Point;
    })();

    var Particle = (function () {
        function Particle() {
            this.position = new Point();
            this.velocity = new Point();
            this.acceleration = new Point();
            this.age = 0;
        }
        Particle.prototype.initialize = function (x, y, dx, dy) {
            this.position.x = x;
            this.position.y = y;
            this.velocity.x = dx;
            this.velocity.y = dy;
            this.acceleration.x = dx * settings.particles.effect;
            this.acceleration.y = dy * settings.particles.effect;
            this.age = 0;
        };
        Particle.prototype.update = function (deltaTime) {
            this.position.x += this.velocity.x * deltaTime;
            this.position.y += this.velocity.y * deltaTime;
            this.velocity.x += this.acceleration.x * deltaTime;
            this.velocity.y += this.acceleration.y * deltaTime;
            this.age += deltaTime;
        };
        Particle.prototype.draw = function (context, image) {
            function ease(t) {
                return --t * t * t + 1;
            }
            var size = image.width * ease(this.age / settings.particles.duration);
            context.globalAlpha = 1 - this.age / settings.particles.duration;
            context.drawImage(
                image,
                this.position.x - size / 2,
                this.position.y - size / 2,
                size,
                size
            );
        };
        return Particle;
    })();

    var ParticlePool = (function () {
        var particles,
            firstActive = 0,
            firstFree = 0,
            duration = settings.particles.duration;

        function ParticlePool(length) {
            particles = new Array(length);
            for (var i = 0; i < particles.length; i++)
                particles[i] = new Particle();
        }
        ParticlePool.prototype.add = function (x, y, dx, dy) {
            particles[firstFree].initialize(x, y, dx, dy);
            firstFree++;
            if (firstFree == particles.length) firstFree = 0;
            if (firstActive == firstFree) firstActive++;
            if (firstActive == particles.length) firstActive = 0;
        };
        ParticlePool.prototype.update = function (deltaTime) {
            var i;
            if (firstActive < firstFree) {
                for (i = firstActive; i < firstFree; i++)
                    particles[i].update(deltaTime);
            }
            if (firstFree < firstActive) {
                for (i = firstActive; i < particles.length; i++)
                    particles[i].update(deltaTime);
                for (i = 0; i < firstFree; i++) particles[i].update(deltaTime);
            }
            while (particles[firstActive].age >= duration && firstActive != firstFree) {
                firstActive++;
                if (firstActive == particles.length) firstActive = 0;
            }
        };
        ParticlePool.prototype.draw = function (context, image) {
            if (firstActive < firstFree) {
                for (var i = firstActive; i < firstFree; i++)
                    particles[i].draw(context, image);
            }
            if (firstFree < firstActive) {
                for (var i = firstActive; i < particles.length; i++)
                    particles[i].draw(context, image);
                for (var i = 0; i < firstFree; i++) particles[i].draw(context, image);
            }
        };
        return ParticlePool;
    })();

    function pointOnHeart(t) {
        return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
        );
    }

    var particleImage = (function () {
        var c = document.createElement("canvas"),
            cx = c.getContext("2d");
        c.width = settings.particles.size;
        c.height = settings.particles.size;
        function to(t) {
            var p = pointOnHeart(t);
            p.x = settings.particles.size / 2 + (p.x * settings.particles.size) / 350;
            p.y = settings.particles.size / 2 - (p.y * settings.particles.size) / 350;
            return p;
        }
        cx.beginPath();
        var t = -Math.PI;
        var p = to(t);
        cx.moveTo(p.x, p.y);
        while (t < Math.PI) {
            t += 0.01;
            p = to(t);
            cx.lineTo(p.x, p.y);
        }
        cx.closePath();
        cx.fillStyle = "#ea80b0";
        cx.fill();
        var img = new Image();
        img.src = c.toDataURL();
        return img;
    })();

    var pools = [];
    var particleRate = settings.particles.length / settings.particles.duration;

    document.addEventListener('click', (e) => {
        var pool = new ParticlePool(settings.particles.length);
        pools.push({ pool: pool, time: 0, x: e.clientX, y: e.clientY });

        setTimeout(() => {
            pools = pools.filter(p => p.pool !== pool);
        }, settings.particles.duration * 1000 + 100);
    });

    var time = 0;
    function animate() {
        requestAnimationFrame(animate);
        var newTime = new Date().getTime() / 1000;
        var deltaTime = newTime - (time || newTime);
        time = newTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pools.forEach(function (item) {
            item.time += deltaTime;
            var amount = particleRate * deltaTime;
            for (var i = 0; i < amount; i++) {
                var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
                var dir = pos.clone().length(settings.particles.velocity);
                item.pool.add(
                    item.x + pos.x,
                    item.y - pos.y,
                    dir.x,
                    -dir.y
                );
            }
            item.pool.update(deltaTime);
            item.pool.draw(ctx, particleImage);
        });
    }

    function onResize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    window.onresize = onResize;
    setTimeout(function () {
        onResize();
        animate();
    }, 10);
}

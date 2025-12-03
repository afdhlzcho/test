document.addEventListener('DOMContentLoaded', function() {
    console.log("Script siap!");

    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const restartBtn = document.getElementById('restartBtn');
    const progressBar = document.querySelector('.progress-bar');
    const typewriterElement = document.getElementById('typewriter');
    const flowersCanvas = document.getElementById('flowers-canvas');

    let currentSlide = 0;
    const totalSlides = slides.length; // Akan otomatis menjadi 9
    let flowers = [];
    let typewriterInterval;
    let countdownInterval;
    let ctx = null;
    let isCountdownRunning = false;

    const finalMessage = "Aku berharap kita bisa terus tertawa bersama, melewati badai bersama, dan mencintai satu sama lain lebih kuat setiap harinya. Selamat anniversary kita sayangku. I love you to the moon and back.";
    let charIndex = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');

        const progress = ((index + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;

        // --- LOGIKA UNTUK MENAMPILKAN/MENYEMBUNYIKAN TOMBOL ---
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'none';

        if (index === 0) {
            nextBtn.style.display = 'inline-block';
        } else if (index === 7) { // Slide 8 (hitungan mundur) memiliki index 7
            // Di slide countdown, tidak ada tombol navigasi
        } else if (index === totalSlides - 1) { // Slide terakhir
            restartBtn.style.display = 'inline-block';
        } else {
            prevBtn.style.display = 'inline-block';
            nextBtn.style.display = 'inline-block';
        }

        prevBtn.disabled = (index === 0);
        nextBtn.disabled = (index === totalSlides - 1);

        handleSpecialAnimations(index);
    }

    function handleSpecialAnimations(index) {
        clearInterval(typewriterInterval);
        clearInterval(countdownInterval);
        charIndex = 0;
        typewriterElement.innerHTML = '';
        flowers = [];
        if(ctx) {
            ctx.clearRect(0, 0, flowersCanvas.width, flowersCanvas.height);
        }

        if (index !== 7 && isCountdownRunning) {
            clearInterval(countdownInterval);
            isCountdownRunning = false;
            document.getElementById('countdown-number').textContent = '3';
        }

        if (index === totalSlides - 1) { // Slide Grand Finale (index 8)
            startTypewriter();
            startFlowerAnimation();
        }

        // --- PERBAIKAN: Index countdown berubah dari 6 menjadi 7 ---
        if (index === 7) { // Slide Hitungan Mundur (index 7)
            startCountdown();
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    }

    function restart() {
        currentSlide = 0;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    restartBtn.addEventListener('click', restart);

    function startTypewriter() {
        typewriterInterval = setInterval(() => {
            if (charIndex < finalMessage.length) {
                typewriterElement.innerHTML += finalMessage.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typewriterInterval);
                typewriterElement.style.borderRight = 'none';
            }
        }, 70);
    }

    function startCountdown() {
        if (isCountdownRunning) return;
        isCountdownRunning = true;
        const countdownNumber = document.getElementById('countdown-number');
        let count = 3;
        countdownNumber.textContent = count;
        countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownNumber.textContent = count;
            } else {
                clearInterval(countdownInterval);
                countdownNumber.textContent = "❤️";
                isCountdownRunning = false;
                setTimeout(() => {
                    nextSlide();
                }, 1000);
            }
        }, 800);
    }

    const flowerSymbols = ['🌸', '🌺', '🌼', '🌷'];
    class Flower {
        constructor() {
            this.x = Math.random() * flowersCanvas.width;
            this.y = Math.random() * flowersCanvas.height - flowersCanvas.height;
            this.size = Math.random() * 20 + 15;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.symbol = flowerSymbols[Math.floor(Math.random() * flowerSymbols.length)];
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y > flowersCanvas.height) {
                this.y = -this.size;
                this.x = Math.random() * flowersCanvas.width;
            }
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px Arial`;
            ctx.fillText(this.symbol, this.x, this.y);
            ctx.globalAlpha = 1;
        }
    }

    function startFlowerAnimation() {
        if (!flowersCanvas) return;
        ctx = flowersCanvas.getContext('2d');
        if (!ctx) return;
        flowersCanvas.width = flowersCanvas.offsetWidth;
        flowersCanvas.height = flowersCanvas.offsetHeight;
        for (let i = 0; i < 15; i++) flowers.push(new Flower());
        animateFlowers();
    }

    function animateFlowers() {
        if (!ctx || flowers.length === 0) return;
        ctx.clearRect(0, 0, flowersCanvas.width, flowersCanvas.height);
        flowers.forEach(flower => {
            flower.update();
            flower.draw();
        });
        requestAnimationFrame(animateFlowers);
    }

    showSlide(currentSlide);
});
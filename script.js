// ============================================
// ROMANTIC BIRTHDAY - FULL-PAGE SLIDE EDITION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  createHeroParticles();
  initOpeningScreen();
  initMusicPlayer();
  initSlideNavigation();
  initCursorTrail();
  initClickBurst();
  initFlipCards();
  initBirthdayCake();
  initLoveTimer();
  initFloatingHearts();
  initRosePetals();
  initGalleryCarousel();
});

// ============================================
// STARS
// ============================================

function createStars() {
  const container = document.getElementById('starsBg');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = (Math.random() * 2 + 1) + 'px';
    star.style.height = star.style.width;
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    star.style.animationDelay = (Math.random() * 3) + 's';
    container.appendChild(star);
  }
}

// ============================================
// HERO PARTICLES
// ============================================

function createHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 3;
    p.style.width = size + 'px'; p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%'; p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 4 + 4) + 's';
    p.style.animationDelay = (Math.random() * 4) + 's';
    p.style.background = Math.random() > 0.5 ? 'rgba(219,39,119,0.3)' : 'rgba(244,114,182,0.3)';
    container.appendChild(p);
  }
}

// ============================================
// OPENING SCREEN
// ============================================

function initOpeningScreen() {
  const opening = document.getElementById('opening');
  const openBtn = document.getElementById('openBtn');
  const envelope = document.getElementById('envelope');
  const mainContent = document.getElementById('mainContent');
  const bgMusic = document.getElementById('bgMusic');
  if (!openBtn) return;

  openBtn.addEventListener('click', () => {
    envelope.classList.add('opened');
    if (bgMusic) {
      bgMusic.volume = 0;
      bgMusic.play().then(() => fadeAudioIn(bgMusic, 0.6, 2000)).catch(() => {});
    }
    setTimeout(() => {
      opening.classList.add('fade-out');
      mainContent.classList.remove('hidden');
    }, 1200);
    setTimeout(() => { opening.style.display = 'none'; }, 2200);
  });
}

function fadeAudioIn(audio, target, dur) {
  const steps = 30, stepTime = dur / steps, volStep = target / steps;
  let s = 0;
  const iv = setInterval(() => { s++; audio.volume = Math.min(volStep * s, target); if (s >= steps) clearInterval(iv); }, stepTime);
}

// ============================================
// MUSIC PLAYER
// ============================================

function initMusicPlayer() {
  const btn = document.getElementById('musicBtn');
  const player = document.getElementById('musicPlayer');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;
  btn.addEventListener('click', () => {
    if (audio.paused) audio.play().then(() => player.classList.remove('paused')).catch(() => {});
    else { audio.pause(); player.classList.add('paused'); }
  });
  audio.addEventListener('pause', () => player.classList.add('paused'));
  audio.addEventListener('play', () => player.classList.remove('paused'));
}

// ============================================
// FULL-PAGE SLIDE NAVIGATION
// ============================================

function initSlideNavigation() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.getElementById('prevArrow');
  const nextBtn = document.getElementById('nextArrow');
  let current = 0;
  let isAnimating = false;
  const total = slides.length;

  function goToSlide(index, direction) {
    if (isAnimating || index === current || index < 0 || index >= total) return;
    isAnimating = true;

    const prev = slides[current];
    const next = slides[index];

    // Exit current slide
    prev.classList.remove('active');
    prev.classList.add(direction === 'up' ? 'exit-up' : 'exit-down');

    // Reset animations on new slide
    next.querySelectorAll('.slide-anim').forEach(el => {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });

    // Enter new slide
    next.classList.remove('exit-up', 'exit-down');
    next.classList.add('active');

    // After a brief delay, remove inline styles so CSS transitions animate in
    const targetSlide = next;
    setTimeout(() => {
      targetSlide.querySelectorAll('.slide-anim').forEach(el => {
        el.style.transition = '';
        el.style.opacity = '';
        el.style.transform = '';
      });
    }, 50);

    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');

    // Update arrows
    prevBtn.classList.toggle('hidden', index === 0);
    nextBtn.classList.toggle('hidden', index === total - 1);

    // Trigger slide-specific effects
    onSlideEnter(index);

    current = index;

    setTimeout(() => {
      prev.classList.remove('exit-up', 'exit-down');
      isAnimating = false;
    }, 700);
  }

  // Helper: check if slide itself can scroll
  function getScrollable(slideEl) {
    return slideEl.scrollHeight > slideEl.clientHeight ? slideEl : null;
  }

  function isAtTop(el) { return el.scrollTop <= 1; }
  function isAtBottom(el) { return el.scrollTop + el.clientHeight >= el.scrollHeight - 1; }

  // Wheel navigation
  let wheelTimeout;
  document.addEventListener('wheel', (e) => {
    if (isAnimating) return;
    if (e.target.closest('.carousel-controls')) return;

    const scrollable = getScrollable(slides[current]);
    if (scrollable) {
      // Allow natural scroll within the slide content
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;
      // Only navigate slides when at the boundary
      if (goingDown && isAtBottom(scrollable)) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => goToSlide(current + 1, 'up'), 50);
      } else if (goingUp && isAtTop(scrollable)) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => goToSlide(current - 1, 'down'), 50);
      }
      // Otherwise let natural scroll happen
      return;
    }

    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 30) goToSlide(current + 1, 'up');
      else if (e.deltaY < -30) goToSlide(current - 1, 'down');
    }, 50);
  }, { passive: true });

  // Touch/swipe navigation
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartScroll = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    const scrollable = getScrollable(slides[current]);
    touchStartScroll = scrollable ? scrollable.scrollTop : 0;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (isAnimating) return;
    if (e.target.closest('.carousel-track, .carousel-controls')) return;

    const dy = touchStartY - e.changedTouches[0].clientY;
    const dx = touchStartX - e.changedTouches[0].clientX;

    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
      const scrollable = getScrollable(slides[current]);
      if (scrollable) {
        // Only navigate if at scroll boundary
        if (dy > 0 && isAtBottom(scrollable)) goToSlide(current + 1, 'up');
        else if (dy < 0 && isAtTop(scrollable)) goToSlide(current - 1, 'down');
        return;
      }
      if (dy > 0) goToSlide(current + 1, 'up');
      else goToSlide(current - 1, 'down');
    }
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goToSlide(current + 1, 'up'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); goToSlide(current - 1, 'down'); }
  });

  // Dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slide);
      goToSlide(idx, idx > current ? 'up' : 'down');
    });
  });

  // Arrow click
  prevBtn.addEventListener('click', () => goToSlide(current - 1, 'down'));
  nextBtn.addEventListener('click', () => goToSlide(current + 1, 'up'));

  // Initial state
  prevBtn.classList.add('hidden');
  onSlideEnter(0);
}

// ============================================
// SLIDE ENTER EFFECTS
// ============================================

let typewriterStarted = false;

function onSlideEnter(index) {
  // Typewriter on letter slide (index 1)
  if (index === 1 && !typewriterStarted) {
    typewriterStarted = true;
    setTimeout(() => {
      startTyping(document.querySelectorAll('.typewriter-line'));
    }, 800);
  }
}

// ============================================
// TYPEWRITER
// ============================================

function startTyping(lines) {
  let lineIndex = 0;
  function typeLine() {
    if (lineIndex >= lines.length) return;
    const line = lines[lineIndex];
    const text = line.dataset.text;
    let charIndex = 0;
    line.classList.add('typing');
    line.textContent = '';
    const iv = setInterval(() => {
      line.textContent = text.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex >= text.length) {
        clearInterval(iv);
        line.classList.remove('typing');
        line.classList.add('typed');
        lineIndex++;
        setTimeout(typeLine, 300);
      }
    }, 25);
  }
  typeLine();
}

// ============================================
// CURSOR TRAIL
// ============================================

function initCursorTrail() {
  const container = document.getElementById('cursorTrail');
  if (!container) return;
  let lastX = 0, lastY = 0, throttle = false;
  document.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (Math.sqrt(dx*dx + dy*dy) > 30) {
      const h = document.createElement('div');
      h.className = 'trail-heart';
      const s = Math.random() * 8 + 8;
      h.style.left = e.clientX + 'px'; h.style.top = e.clientY + 'px';
      h.innerHTML = `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      container.appendChild(h);
      setTimeout(() => h.remove(), 800);
      lastX = e.clientX; lastY = e.clientY;
    }
    setTimeout(() => { throttle = false; }, 50);
  });
}

// ============================================
// CLICK BURST
// ============================================

function initClickBurst() {
  const container = document.getElementById('clickBurst');
  if (!container) return;
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .candle, .flip-card, a, .carousel-btn')) return;
    const colors = ['#DB2777','#F472B6','#F9A8D4','#FBCFE8','#EC4899'];
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'burst-particle';
      const angle = (Math.PI * 2 / 10) * i;
      const dist = Math.random() * 50 + 25;
      p.style.left = e.clientX + 'px'; p.style.top = e.clientY + 'px';
      p.style.width = (Math.random() * 5 + 3) + 'px'; p.style.height = p.style.width;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      container.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
    for (let i = 0; i < 4; i++) {
      const h = document.createElement('div');
      h.className = 'burst-heart';
      const angle = (Math.PI * 2 / 4) * i;
      const dist = Math.random() * 60 + 30;
      h.style.left = e.clientX + 'px'; h.style.top = e.clientY + 'px';
      h.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      h.style.setProperty('--by', (Math.sin(angle) * dist - 20) + 'px');
      h.style.setProperty('--br', ((Math.random()-0.5)*90) + 'deg');
      const s = Math.random() * 10 + 10;
      h.innerHTML = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${colors[i]}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      container.appendChild(h);
      setTimeout(() => h.remove(), 1000);
    }
  });
}

// ============================================
// FLIP CARDS
// ============================================

function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); } });
  });
}

// ============================================
// BIRTHDAY CAKE
// ============================================

function initBirthdayCake() {
  const candles = document.querySelectorAll('.candle');
  const msg = document.getElementById('cakeMessage');
  const instr = document.getElementById('cakeInstruction');
  let blown = 0;
  candles.forEach(c => {
    c.addEventListener('click', () => {
      if (c.classList.contains('blown')) return;
      c.classList.add('blown');
      blown++;
      if (blown === candles.length) {
        setTimeout(() => {
          if (instr) instr.style.display = 'none';
          if (msg) { msg.classList.remove('hidden'); launchConfetti(); }
        }, 600);
      }
    });
  });
}

function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;
  const colors = ['#DB2777','#F472B6','#F9A8D4','#FBCFE8','#FDE68A','#CA8A04','#EC4899'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + '%';
      const s = Math.random() * 10 + 5;
      p.style.width = s + 'px'; p.style.height = s * (Math.random() * 0.5 + 0.5) + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      p.style.setProperty('--conf-rotate', (Math.random() * 720) + 'deg');
      p.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(p);
      setTimeout(() => p.remove(), 4500);
    }, i * 30);
  }
}

// ============================================
// LOVE TIMER
// ============================================

function initLoveTimer() {
  const startDate = new Date(2024, 0, 1);
  function update() {
    const diff = Date.now() - startDate;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setTimer('timerDays', d); setTimer('timerHours', h);
    setTimer('timerMinutes', m); setTimer('timerSeconds', s);
  }
  function setTimer(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const str = String(val);
    if (el.textContent !== str) {
      el.textContent = str;
      el.classList.add('tick');
      setTimeout(() => el.classList.remove('tick'), 300);
    }
  }
  update();
  setInterval(update, 1000);
}

// ============================================
// FLOATING HEARTS
// ============================================

function initFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;
  function create() {
    const h = document.createElement('div');
    h.className = 'float-heart';
    const size = Math.random() * 14 + 8;
    h.style.left = Math.random() * 100 + '%';
    h.style.setProperty('--drift', (Math.random()-0.5)*200 + 'px');
    h.style.setProperty('--rotate', (Math.random()-0.5)*360 + 'deg');
    h.style.animationDuration = (Math.random() * 6 + 6) + 's';
    h.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="opacity:${Math.random()*0.4+0.2}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    container.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
  setInterval(create, 3000);
  for (let i = 0; i < 2; i++) setTimeout(create, i * 600);
}

// ============================================
// ROSE PETALS
// ============================================

function initRosePetals() {
  const container = document.getElementById('rosePetals');
  if (!container) return;
  function create() {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + '%';
    const dur = Math.random() * 6 + 8;
    p.style.setProperty('--petal-drift', (Math.random()-0.5)*150 + 'px');
    p.style.setProperty('--petal-rotate', Math.random()*720 + 'deg');
    p.style.animationDuration = dur + 's';
    const hue = Math.random() > 0.5 ? '330' : '340';
    const l = Math.random() * 20 + 70;
    p.style.background = `radial-gradient(ellipse at 30% 30%, hsl(${hue},80%,${l}%), hsl(${hue},60%,${l-15}%))`;
    container.appendChild(p);
    setTimeout(() => p.remove(), (dur+1)*1000);
  }
  setInterval(create, 3500);
  for (let i = 0; i < 2; i++) setTimeout(create, i * 800);
}

// ============================================
// GALLERY CAROUSEL
// ============================================

function initGalleryCarousel() {
  const items = document.querySelectorAll('.carousel-item');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (items.length === 0 || !dotsContainer) return;

  let currentImg = 0;

  // Create dots
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => showImage(i));
    dotsContainer.appendChild(dot);
  });

  // Show first image
  items[0].classList.add('active');

  function showImage(index) {
    items[currentImg].classList.remove('active');
    dotsContainer.children[currentImg].classList.remove('active');
    currentImg = index;
    items[currentImg].classList.add('active');
    dotsContainer.children[currentImg].classList.add('active');
  }

  prevBtn.addEventListener('click', () => showImage((currentImg - 1 + items.length) % items.length));
  nextBtn.addEventListener('click', () => showImage((currentImg + 1) % items.length));

  // Auto-advance
  setInterval(() => {
    const gallerySlide = document.querySelector('.slide-gallery');
    if (gallerySlide && gallerySlide.classList.contains('active')) {
      showImage((currentImg + 1) % items.length);
    }
  }, 4000);

  // Touch swipe on carousel
  const track = document.getElementById('carouselTrack');
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = startX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) showImage((currentImg + 1) % items.length);
      else showImage((currentImg - 1 + items.length) % items.length);
    }
  }, { passive: true });
}

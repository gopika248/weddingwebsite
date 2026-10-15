/* ==========================================================================
   WEDDING INVITATION SCRIPT - ABHINAND WEDS VAIDOORYA
   Cover Arch Page -> Unveil Full Invitation -> Real Soundtrack -> Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Wedding Muhurtham: 28 January 2023, 11:45 AM IST (UTC+05:30)
  const WEDDING_TIMESTAMP = new Date('2023-01-28T11:45:00+05:30').getTime();

  // Page Views
  const coverPageView = document.getElementById('coverPageView');
  const invitationPageView = document.getElementById('invitationPageView');
  const btnViewInvitationCover = document.getElementById('btnViewInvitationCover');
  const btnBackToCover = document.getElementById('btnBackToCover');
  const brandCoverToggle = document.getElementById('brandCoverToggle');

  // Audio Elements
  const weddingAudio = document.getElementById('weddingAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');
  const btnSongMenu = document.getElementById('btnSongMenu');
  const musicModal = document.getElementById('musicModal');
  const closeMusicModalBtn = document.getElementById('closeMusicModalBtn');
  const songOptionCards = document.querySelectorAll('.song-option-card');
  const btnUploadOwnSong = document.getElementById('btnUploadOwnSong');
  const customAudioInput = document.getElementById('customAudioInput');
  const tickerText = document.getElementById('tickerText');

  // Hero Controls in Unveiled Invitation
  const centralPlayBtn = document.getElementById('centralPlayBtn');
  const centralPlayIcon = document.getElementById('centralPlayIcon');
  const centralPauseIcon = document.getElementById('centralPauseIcon');
  const heroTimePill = document.getElementById('heroTimePill');

  // Photo Modal Elements
  const openPhotoModalBtn = document.getElementById('openPhotoModalBtn');
  const photoModal = document.getElementById('photoModal');
  const closePhotoModalBtn = document.getElementById('closePhotoModalBtn');
  const heroCoupleImg = document.getElementById('heroCoupleImg');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const uploadZone = document.getElementById('uploadZone');
  const heroFileInput = document.getElementById('heroFileInput');
  const uploadPreviewArea = document.getElementById('uploadPreviewArea');
  const uploadPreviewImg = document.getElementById('uploadPreviewImg');
  const btnApplyCustomPhoto = document.getElementById('btnApplyCustomPhoto');
  const btnCancelCustomPhoto = document.getElementById('btnCancelCustomPhoto');

  // Action Buttons
  const btnShareInvite = document.getElementById('btnShareInvite');
  const btnCalendarExport = document.getElementById('btnCalendarExport');
  const btnShowerPetals = document.getElementById('btnShowerPetals');
  const toastPopup = document.getElementById('toastPopup');

  // Countdown Elements
  const valDays = document.getElementById('valDays');
  const valHours = document.getElementById('valHours');
  const valMinutes = document.getElementById('valMinutes');
  const valSeconds = document.getElementById('valSeconds');
  const countdownCaption = document.getElementById('countdownCaption');
  const btnModeDaysTogether = document.getElementById('btnModeDaysTogether');
  const btnModeNextAnniversary = document.getElementById('btnModeNextAnniversary');
  let countdownMode = 'together';

  let pendingPhotoDataUrl = null;

  // Restore saved hero photo from localStorage if present
  const savedPhoto = localStorage.getItem('abhinand_vaidoorya_hero_photo');
  if (savedPhoto && heroCoupleImg) {
    heroCoupleImg.src = savedPhoto;
  }

  // ------------------------------------------------------------------------
  // TOAST NOTIFICATION
  // ------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    if (!toastPopup) return;
    toastPopup.textContent = message;
    toastPopup.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastPopup.classList.remove('visible');
    }, 3200);
  }

  // ------------------------------------------------------------------------
  // AUDIO CONTROLLER (Authentic Studio Audio: Joel Johns & Vijay Anand)
  // ------------------------------------------------------------------------
  let isAudioPlaying = false;
  weddingAudio.volume = 0.85;

  function updateAudioState(playing) {
    isAudioPlaying = playing;
    if (playing) {
      musicToggleBtn.classList.add('playing');
      musicLabel.textContent = 'Playing';
      if (centralPlayIcon && centralPauseIcon) {
        centralPlayIcon.style.display = 'none';
        centralPauseIcon.style.display = 'block';
      }
    } else {
      musicToggleBtn.classList.remove('playing');
      musicLabel.textContent = 'Music';
      if (centralPlayIcon && centralPauseIcon) {
        centralPlayIcon.style.display = 'block';
        centralPauseIcon.style.display = 'none';
      }
    }
  }

  async function playAudio() {
    try {
      await weddingAudio.play();
      updateAudioState(true);
    } catch (err) {
      console.log('Autoplay waiting for user gesture:', err);
      updateAudioState(false);
    }
  }

  function pauseAudio() {
    weddingAudio.pause();
    updateAudioState(false);
  }

  function toggleAudio() {
    if (weddingAudio.paused) {
      playAudio();
      showToast('🎵 Playing: ' + (tickerText ? tickerText.textContent : 'Wedding Song'));
    } else {
      pauseAudio();
      showToast('⏸️ Audio paused');
    }
  }

  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudio();
  });

  if (centralPlayBtn) {
    centralPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  if (heroTimePill) {
    heroTimePill.addEventListener('click', toggleAudio);
  }

  // ------------------------------------------------------------------------
  // PAGE NAVIGATION (COVER PAGE -> UNVEILED INVITATION PAGE)
  // ------------------------------------------------------------------------
  btnViewInvitationCover.addEventListener('click', () => {
    // 1. Trigger festive rose petal burst
    triggerPetalBurst(45);

    // 2. Start wedding music if not yet playing
    playAudio();

    // 3. Smooth transition to Page 2
    coverPageView.style.display = 'none';
    invitationPageView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast('✨ Welcome to Abhinand & Vaidoorya\'s Wedding Invitation!');
  });

  function returnToCover() {
    invitationPageView.style.display = 'none';
    coverPageView.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnBackToCover) btnBackToCover.addEventListener('click', returnToCover);
  if (brandCoverToggle) brandCoverToggle.addEventListener('click', returnToCover);

  // ------------------------------------------------------------------------
  // MUSIC TRACK SWITCHER (Reel Song vs Seetha Kalyanam vs Aasai Mugam)
  // ------------------------------------------------------------------------
  btnSongMenu.addEventListener('click', () => {
    musicModal.classList.add('active');
  });

  closeMusicModalBtn.addEventListener('click', () => {
    musicModal.classList.remove('active');
  });

  songOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      songOptionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const src = card.getAttribute('data-src');
      const title = card.getAttribute('data-title');
      const artist = card.getAttribute('data-artist');

      weddingAudio.src = src;
      weddingAudio.load();
      playAudio();

      if (tickerText) {
        tickerText.textContent = `${title} • ${artist}`;
      }
      musicModal.classList.remove('active');
      showToast(`🎶 Playing: ${title}`);
    });
  });

  btnUploadOwnSong.addEventListener('click', () => customAudioInput.click());

  customAudioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      weddingAudio.src = fileUrl;
      weddingAudio.load();
      playAudio();
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      if (tickerText) tickerText.textContent = `${cleanName} • Custom Audio`;
      musicModal.classList.remove('active');
      showToast(`🎶 Custom audio: ${cleanName}`);
    }
  });

  // ------------------------------------------------------------------------
  // PHOTO MODAL & CUSTOMIZATION
  // ------------------------------------------------------------------------
  if (openPhotoModalBtn) {
    openPhotoModalBtn.addEventListener('click', () => {
      photoModal.classList.add('active');
      uploadPreviewArea.style.display = 'none';
      pendingPhotoDataUrl = null;
    });
  }

  closePhotoModalBtn.addEventListener('click', () => {
    photoModal.classList.remove('active');
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const src = btn.getAttribute('data-src');
      if (src && heroCoupleImg) {
        heroCoupleImg.src = src;
        localStorage.setItem('abhinand_vaidoorya_hero_photo', src);
        photoModal.classList.remove('active');
        showToast('✨ Couple photo updated!');
      }
    });
  });

  uploadZone.addEventListener('click', () => heroFileInput.click());

  heroFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        pendingPhotoDataUrl = ev.target.result;
        uploadPreviewImg.src = pendingPhotoDataUrl;
        uploadPreviewArea.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  btnApplyCustomPhoto.addEventListener('click', () => {
    if (pendingPhotoDataUrl && heroCoupleImg) {
      heroCoupleImg.src = pendingPhotoDataUrl;
      localStorage.setItem('abhinand_vaidoorya_hero_photo', pendingPhotoDataUrl);
      photoModal.classList.remove('active');
      showToast('🎉 Photo successfully updated!');
    }
  });

  btnCancelCustomPhoto.addEventListener('click', () => {
    uploadPreviewArea.style.display = 'none';
    pendingPhotoDataUrl = null;
  });

  [musicModal, photoModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // ------------------------------------------------------------------------
  // COUNTDOWN ENGINE
  // ------------------------------------------------------------------------
  function updateCountdown() {
    const now = Date.now();

    if (countdownMode === 'together') {
      const diff = Math.max(0, now - WEDDING_TIMESTAMP);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (valDays) valDays.textContent = days;
      if (valHours) valHours.textContent = hours;
      if (valMinutes) valMinutes.textContent = minutes;
      if (valSeconds) valSeconds.textContent = seconds;

      if (countdownCaption) {
        countdownCaption.textContent = 'Celebrating the sacred bond of Abhinand & Vaidoorya since 28 January 2023';
      }
    } else {
      const currentYear = new Date().getFullYear();
      let nextTarget = new Date(currentYear, 0, 28, 11, 45, 0).getTime();
      if (now > nextTarget) {
        nextTarget = new Date(currentYear + 1, 0, 28, 11, 45, 0).getTime();
      }

      const diff = Math.max(0, nextTarget - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (valDays) valDays.textContent = days;
      if (valHours) valHours.textContent = hours;
      if (valMinutes) valMinutes.textContent = minutes;
      if (valSeconds) valSeconds.textContent = seconds;

      if (countdownCaption) {
        countdownCaption.textContent = 'Counting down to their next Wedding Anniversary celebration!';
      }
    }
  }

  if (btnModeDaysTogether) {
    btnModeDaysTogether.addEventListener('click', () => {
      countdownMode = 'together';
      btnModeDaysTogether.classList.add('active');
      btnModeNextAnniversary.classList.remove('active');
      updateCountdown();
    });
  }

  if (btnModeNextAnniversary) {
    btnModeNextAnniversary.addEventListener('click', () => {
      countdownMode = 'anniversary';
      btnModeNextAnniversary.classList.add('active');
      btnModeDaysTogether.classList.remove('active');
      updateCountdown();
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ------------------------------------------------------------------------
  // SHARING & CALENDAR EXPORT (NO SEND WISHES)
  // ------------------------------------------------------------------------
  btnShareInvite.addEventListener('click', async () => {
    const shareData = {
      title: 'Abhinand Weds Vaidoorya - Wedding Invitation',
      text: 'Wedding Invitation of Abhinand & Vaidoorya on 28 January 2023 at Mottemmal House, Thuvakkunnu.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('📋 Invitation link copied to clipboard!');
    }
  });

  if (btnCalendarExport) {
    btnCalendarExport.addEventListener('click', () => {
      const title = encodeURIComponent('Abhinand weds Vaidoorya - Wedding Muhurtham');
      const details = encodeURIComponent('Auspicious Wedding Muhurtham of Abhinand & Vaidoorya (11:45 AM - 12:15 PM) at Mottemmal House, Thuvakkunnu.');
      const location = encodeURIComponent('Mottemmal House, Thuvakkunnu, Kerala');
      const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20230128T061500Z/20230128T064500Z&details=${details}&location=${location}`;

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Abhinand Weds Vaidoorya//Invitation//EN',
        'BEGIN:VEVENT',
        'SUMMARY:Abhinand Weds Vaidoorya - Wedding Muhurtham',
        'DESCRIPTION:Auspicious Wedding Ceremony of Abhinand & Vaidoorya',
        'LOCATION:Mottemmal House\\, Thuvakkunnu\\, Kerala',
        'DTSTART:20230128T061500Z',
        'DTEND:20230128T064500Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'abhinand_vaidoorya_wedding.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.open(gCalUrl, '_blank');
      showToast('📅 Added to Calendar!');
    });
  }

  // ------------------------------------------------------------------------
  // FALLING ROSE PETALS ENGINE (CANVAS 2D)
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('petalsCanvas');
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  class Petal {
    constructor(isBurst = false) {
      this.reset(isBurst);
    }

    reset(isBurst = false) {
      if (isBurst) {
        this.x = w * (0.35 + Math.random() * 0.3);
        this.y = h * (0.35 + Math.random() * 0.3);
        this.vx = (Math.random() - 0.5) * 14;
        this.vy = -Math.random() * 12 - 3;
      } else {
        this.x = Math.random() * w;
        this.y = -20 - Math.random() * 60;
        this.vx = (Math.random() - 0.5) * 1.6;
        this.vy = Math.random() * 1.8 + 1.2;
      }

      this.size = Math.random() * 12 + 10;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.04;
      this.flip = Math.random() * Math.PI * 2;
      this.flipSpeed = Math.random() * 0.03 + 0.02;
      this.swingOffset = Math.random() * Math.PI * 2;
      this.swingSpeed = Math.random() * 0.03 + 0.015;

      const colors = [
        { r: 218, g: 42, b: 84 },
        { r: 236, g: 90, b: 125 },
        { r: 188, g: 27, b: 62 },
        { r: 247, g: 146, b: 170 },
        { r: 230, g: 108, b: 136 }
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.4 + 0.6;
      this.gravity = 0.14;
      this.isBurst = isBurst;
    }

    update() {
      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        if (this.vy > 3) this.isBurst = false;
      } else {
        this.swingOffset += this.swingSpeed;
        this.x += this.vx + Math.sin(this.swingOffset) * 1.1;
        this.y += this.vy;
      }

      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      if (this.y > h + 30 || this.x < -30 || this.x > w + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(1, Math.cos(this.flip));

      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.6);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.6, this.size * 0.8, this.size * 0.4, 0, this.size * 0.8);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.4, -this.size * 0.6, -this.size * 0.6, 0, -this.size * 0.6);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
      grad.addColorStop(0, `rgba(${this.color.r + 30}, ${this.color.g + 30}, ${this.color.b + 30}, ${this.opacity})`);
      grad.addColorStop(0.8, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
      grad.addColorStop(1, `rgba(${this.color.r - 30}, ${this.color.g - 30}, ${this.color.b - 30}, ${this.opacity * 0.8})`);

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 3;
      ctx.fill();

      ctx.restore();
    }
  }

  const petals = [];
  const petalCount = 26;
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function triggerPetalBurst(count = 40) {
    for (let i = 0; i < count; i++) {
      petals.push(new Petal(true));
    }
    setTimeout(() => {
      while (petals.length > petalCount) {
        petals.pop();
      }
    }, 5500);
  }

  if (btnShowerPetals) {
    btnShowerPetals.addEventListener('click', () => {
      triggerPetalBurst(50);
      showToast('🌸 Wishing Abhinand & Vaidoorya endless blessings!');
      if (weddingAudio.paused) {
        playAudio();
      }
    });
  }

  function animLoop() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animLoop);
  }
  requestAnimationFrame(animLoop);

});

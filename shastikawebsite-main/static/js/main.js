/* ================= GLOBAL HELPERS ================= */

window.moveCert = function (d) { console.log('[CERT] not yet initialized'); };
window.moveGallery = function (d) { console.log('[GALLERY] not yet initialized'); };
window.moveAwards = function (d) { console.log('[AWARDS] not yet initialized'); };

/* ---- Lightbox State Manager ---- */
window.lightboxState = {
  gallery: { currentIndex: 0, total: 0, items: [] },
  cert: { currentIndex: 0, total: 0, items: [] }
};

/* ---- Image Modal ---- */
window.openImageModal = function (src) {
  const modal = document.getElementById('imageModal');
  const img = document.getElementById('modalImage');
  if (!modal || !img) return;
  img.src = src;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};
window.closeImageModal = function () {
  const modal = document.getElementById('imageModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
};

/* ---- Cert Modal with Navigation ---- */
window.openCertModal = function (card) {
  if (!card) return;
  const img = card.querySelector('img');
  const modalImg = document.getElementById('certModalImg');
  const modal = document.getElementById('certModal');
  if (!img || !modal || !modalImg) return;

  // Find index of clicked card in all cert cards
  const allCards = document.querySelectorAll('.cert-card');
  window.lightboxState.cert.items = Array.from(allCards);
  window.lightboxState.cert.total = allCards.length;
  window.lightboxState.cert.currentIndex = Array.from(allCards).indexOf(card);

  modalImg.src = img.src;
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeCertModal = function () {
  const modal = document.getElementById('certModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

window.navigateCert = function (direction) {
  const state = window.lightboxState.cert;
  if (state.total === 0) return;

  state.currentIndex = (state.currentIndex + direction + state.total) % state.total;

  const card = state.items[state.currentIndex];
  if (card) {
    const img = card.querySelector('img');
    const modalImg = document.getElementById('certModalImg');
    if (img && modalImg) {
      modalImg.src = img.src;
    }
  }
};

/* ---- Gallery Modal with Navigation ---- */
window.openGalleryModal = function (img) {
  if (!img) return;
  const modalImg = document.getElementById('galleryModalImg');
  const modal = document.getElementById('galleryModal');
  if (!modal || !modalImg) return;

  // Find index of clicked image in all gallery images
  const allImages = document.querySelectorAll('.gallery-slider img');
  window.lightboxState.gallery.items = Array.from(allImages);
  window.lightboxState.gallery.total = allImages.length;
  window.lightboxState.gallery.currentIndex = Array.from(allImages).indexOf(img);

  modalImg.src = img.src;
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeGallery = function (e) {
  // Handle both direct calls and event handlers
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
    e.stopPropagation();
  }

  const modal = document.getElementById('galleryModal');
  if (!modal) return;

  // Remove active class - this triggers CSS hide
  modal.classList.remove('active');

  // Force hide with display: none for extra safety
  modal.style.display = 'none';

  // Restore body scroll
  document.body.style.overflow = '';

  console.log('Gallery modal closed');

  return false;
};

window.navigateGallery = function (direction) {
  const state = window.lightboxState.gallery;
  if (state.total === 0) return;

  state.currentIndex = (state.currentIndex + direction + state.total) % state.total;

  const img = state.items[state.currentIndex];
  if (img) {
    const modalImg = document.getElementById('galleryModalImg');
    if (modalImg) {
      modalImg.src = img.src;
    }
  }
};

/* Setup gallery close button - improved version */
document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('galleryCloseBtn');
  const modal = document.getElementById('galleryModal');

  if (closeBtn) {
    // Direct click handler - most reliable
    closeBtn.onclick = function (e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      window.closeGallery();
      return false;
    };

    // Also add event listener for redundancy
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.closeGallery();
      return false;
    }, true);
  }

  // Close modal when clicking on background (dark overlay)
  if (modal) {
    modal.addEventListener('click', function (e) {
      // Only close if clicking directly on the modal, not on its children
      if (e.target === modal || e.target.id === 'galleryModal') {
        e.preventDefault();
        e.stopPropagation();
        window.closeGallery();
      }
    });
  }
});

/* ---- Contact Form ---- */
window.submitContactForm = function (e) {
  e.preventDefault();
  fetch('/submit_contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.countryCode.value + ' ' + e.target.phone.value,
      subject: e.target.subject.value,
      message: e.target.message.value
    })
  })
    .then(r => r.json())
    .then(d => {
      alert(d.status === 'success' ? 'Message sent!' : 'Error!');
      if (d.status === 'success') e.target.reset();
    })
    .catch(() => alert('Server error'));
};

/* ---- Chatbot ---- */
window.openChatbot = function () {
  window.open('https://chatbot-e99e.onrender.com', 'chatbot', 'width=450,height=650');
};

/* ================= GLOBAL KEYBOARD HANDLER ================= */
document.addEventListener('keydown', function (e) {
  // Escape key - close all modals
  if (e.key === 'Escape') {
    window.closeImageModal?.();
    window.closeGallery?.();
    window.closeCertModal?.();
    return;
  }

  // Arrow key navigation for lightbox
  const galleryModal = document.getElementById('galleryModal');
  const certModal = document.getElementById('certModal');

  if (galleryModal?.classList.contains('active')) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      window.navigateGallery(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      window.navigateGallery(1);
    }
  }

  if (certModal?.classList.contains('active')) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      window.navigateCert(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      window.navigateCert(1);
    }
  }
});

/* ================= DOM READY ================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ===== LIGHTBOX TOUCH/SWIPE SUPPORT ===== */
  let touchStartX = 0;
  let touchEndX = 0;

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    const galleryModal = document.getElementById('galleryModal');
    const certModal = document.getElementById('certModal');

    if (galleryModal?.classList.contains('active')) {
      if (diff > swipeThreshold) {
        window.navigateGallery(1); // Swipe left -> next
      } else if (diff < -swipeThreshold) {
        window.navigateGallery(-1); // Swipe right -> prev
      }
    }

    if (certModal?.classList.contains('active')) {
      if (diff > swipeThreshold) {
        window.navigateCert(1);
      } else if (diff < -swipeThreshold) {
        window.navigateCert(-1);
      }
    }
  }

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  /* ----- NAV DROPDOWN (MOBILE) ----- */
  const dropBtn = document.querySelector('.dropbtn');
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropBtn && dropdown) {
    dropBtn.addEventListener('click', (e) => {
      if (window.innerWidth < 768) {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  }

  /* ----- BACKGROUND DRIFT ----- */
  window.addEventListener('scroll', () => {
    document.body.style.backgroundPosition = `center ${-(window.scrollY * 0.04)}px`;
  });

  /* ----- NAVBAR HIDE ON SCROLL DOWN ----- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      navbar.classList.toggle('nav-hidden', y > lastY && y > 140);
      lastY = y;
    }, { passive: true });
  }

  /* ----- HERO VIDEO AUTOPLAY ----- */
  const heroVideo = document.querySelector('.hero video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(() => { });
  }

  /* ----- MOBILE MENU TOGGLE ----- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  /* ----- PRODUCT SLIDER + FLIP ----- */
  const productSlider = document.querySelector('.products-wrapper');
  if (productSlider) {
    const cards = productSlider.querySelectorAll('.product-card');

    /* Flip cards */
    const flipCards = productSlider.querySelectorAll('.has-flip');
    flipCards.forEach(card => {
      ['click', 'touchend'].forEach(evt => {
        card.addEventListener(evt, e => {
          if (e.target.closest('a')) return;
          e.stopPropagation();
          flipCards.forEach(c => { if (c !== card) c.classList.remove('flipped'); });
          card.classList.toggle('flipped');
        });
      });
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.has-flip'))
        flipCards.forEach(c => c.classList.remove('flipped'));
    });
  }

  /* ----- GSAP ANIMATIONS ----- */
  const HAS_GSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);
  const IS_HOME = document.body.classList.contains('home-page');

  if (HAS_GSAP && IS_HOME) {
    gsap.to('.navbar', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.to('.logo-container img, .logo-container span', {
      opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.3, ease: 'power3.out'
    });
    gsap.fromTo('.nav-links a',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, delay: 0.6, ease: 'power2.out' }
    );
    gsap.fromTo('.team-card',
      { opacity: 0, y: 40 },
      {
        scrollTrigger: { trigger: '#team', start: 'top 80%', once: true },
        opacity: 1, y: 0, stagger: 0.2, duration: 0.9, ease: 'power3.out'
      }
    );
    ScrollTrigger.create({
      trigger: '#why-us', start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo('#why-us .video-mask',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' }
      )
    });
  }

  if (HAS_GSAP && document.querySelector('.location-page')) {
    gsap.to('.loc-title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
    gsap.to('.loc-sub', { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
    gsap.fromTo('.map-box',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.3, delay: 0.35, ease: 'power3.out' }
    );
  }

  if (HAS_GSAP && document.querySelector('.contact-details-block')) {
    gsap.fromTo('.detail-item',
      { opacity: 0, y: 30 },
      {
        scrollTrigger: { trigger: '.contact-details-block', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.8, stagger: 0.25, ease: 'power3.out'
      }
    );
  }

  /* ================= SLIDERS (init after full page load) ================= */
  function initClickHandlers() {
    // Cert cards
    document.querySelectorAll('.cert-card').forEach(card => {
      card.addEventListener('click', function (e) {
        e.stopPropagation();
        window.openCertModal(this);
      }, true);
    });

    // Gallery images
    document.querySelectorAll('.gallery-slider img').forEach(img => {
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        window.openGalleryModal(this);
      }, true);
    });

    // Modal backdrop close
    ['certModal', 'galleryModal'].forEach(id => {
      const m = document.getElementById(id);
      if (m) m.addEventListener('click', e => {
        if (e.target === m) id === 'certModal' ? window.closeCertModal() : window.closeGallery();
      });
    });
  }

  function initCertSlider() {
    const wrap = document.querySelector('.slider-wrap');
    const leftBtn = document.querySelector('.cert-side-btn.left');
    const rightBtn = document.querySelector('.cert-side-btn.right');
    if (!wrap || !leftBtn || !rightBtn) return;

    const cards = wrap.querySelectorAll('.cert-card');
    if (!cards.length) return;

    function getScrollAmount() {
      const card = cards[0];
      return card.offsetWidth + 24;
    }

    window.moveCert = function (dir) {
      const current = wrap.scrollLeft;
      const step = getScrollAmount();
      const maxScroll = wrap.scrollWidth - wrap.offsetWidth;

      if (dir > 0 && current >= maxScroll - 5) return;
      if (dir < 0 && current <= 5) return;

      const target = dir > 0
        ? Math.min(current + step, maxScroll)
        : Math.max(current - step, 0);
      wrap.scrollTo({ left: target, behavior: 'smooth' });
    };

    function updateButtons() {
      const tolerance = 10;
      leftBtn.disabled = wrap.scrollLeft <= tolerance;
      rightBtn.disabled = wrap.scrollLeft + wrap.offsetWidth >= wrap.scrollWidth - tolerance;
    }

    wrap.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    setTimeout(updateButtons, 500);
  }

  function initAwardsSlider() {
    const wrap = document.querySelector('.awards-viewport');
    const leftBtn = document.querySelector('.awards-btn.left');
    const rightBtn = document.querySelector('.awards-btn.right');
    if (!wrap || !leftBtn || !rightBtn) return;

    const images = wrap.querySelectorAll('img');
    if (!images.length) return;

    function getScrollAmount() {
      return images[0].offsetWidth + 20;
    }

    window.moveAwards = function (dir) {
      const current = wrap.scrollLeft;
      const step = getScrollAmount() + 4; // Sync to 24px gap
      const maxScroll = wrap.scrollWidth - wrap.offsetWidth;

      if (dir > 0 && current >= maxScroll - 5) return;
      if (dir < 0 && current <= 5) return;

      const target = dir > 0
        ? Math.min(current + step, maxScroll)
        : Math.max(current - step, 0);
      wrap.scrollTo({ left: target, behavior: 'smooth' });
    };

    function updateButtons() {
      const tolerance = 10;
      leftBtn.disabled = wrap.scrollLeft <= tolerance;
      rightBtn.disabled = wrap.scrollLeft + wrap.offsetWidth >= wrap.scrollWidth - tolerance;
    }

    wrap.addEventListener('scroll', updateButtons);
    leftBtn.addEventListener('click', () => window.moveAwards(-1));
    rightBtn.addEventListener('click', () => window.moveAwards(1));

    updateButtons();
  }

  function initGallerySlider() {
    const wrap = document.querySelector('.gallery-viewport');
    const leftBtn = document.querySelector('.gallery-btn.left');
    const rightBtn = document.querySelector('.gallery-btn.right');
    if (!wrap || !leftBtn || !rightBtn) return;

    const images = wrap.querySelectorAll('img');
    if (!images.length) return;

    function getScrollAmount() {
      return images[0].offsetWidth + 18;
    }

    window.moveGallery = function (dir) {
      const current = wrap.scrollLeft;
      const step = getScrollAmount() + 6; // Sync to 24px gap
      const maxScroll = wrap.scrollWidth - wrap.offsetWidth;

      if (dir > 0 && current >= maxScroll - 5) return;
      if (dir < 0 && current <= 5) return;

      const target = dir > 0
        ? Math.min(current + step, maxScroll)
        : Math.max(current - step, 0);
      wrap.scrollTo({ left: target, behavior: 'smooth' });
    };

    function updateButtons() {
      const tolerance = 10;
      leftBtn.disabled = wrap.scrollLeft <= tolerance;
      rightBtn.disabled = wrap.scrollLeft + wrap.offsetWidth >= wrap.scrollWidth - tolerance;
    }

    wrap.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    setTimeout(updateButtons, 500);
  }

  // Use 'load' event to guarantee images are sized before reading offsetWidth
  if (document.readyState === 'complete') {
    // 'load' already fired (e.g. script is deferred) — run immediately
    initCertSlider();
    initAwardsSlider();
    initGallerySlider();
    initClickHandlers();
  } else {
    window.addEventListener('load', () => {
      initCertSlider();
      initAwardsSlider();
      initGallerySlider();
      initClickHandlers();
    });
  }

}); // END DOMContentLoaded 

// Main page script: menu, scroll bar, back-to-top, lightbox, and carousels.

// -- DOM references and shared state
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const body = document.body;
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const accessibilityToggle = document.getElementById('accessibilityToggle');
const accessibilityMenu = document.querySelector('.accessibility-menu');
const reducedMotionToggle = document.getElementById('reducedMotionToggle');
const themeToggle = document.getElementById('themeToggle');
const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const lightboxOverlay = document.getElementById('galleryLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
const desktopLinks = Array.from(document.querySelectorAll('.nav-links a'));
let sectionPositions = [];
let isTicking = false;
let currentActive = '';

function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  body.classList.add('menu-open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  body.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

function closeAccessibilityMenu() {
  accessibilityMenu?.classList.remove('open');
  accessibilityToggle?.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

mobileClose?.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
    closeAccessibilityMenu();
  }
});

accessibilityToggle?.addEventListener('click', event => {
  event.stopPropagation();
  const isOpen = accessibilityMenu?.classList.contains('open');
  if (isOpen) {
    closeAccessibilityMenu();
  } else {
    accessibilityMenu?.classList.add('open');
    accessibilityToggle?.setAttribute('aria-expanded', 'true');
  }
});

document.addEventListener('click', event => {
  if (!accessibilityMenu?.contains(event.target)) {
    closeAccessibilityMenu();
  }
});

// Save section positions so the nav link can update while scrolling.
function updateSectionPositions() {
  sectionPositions = sections.map(section => ({
    id: section.id,
    top: section.getBoundingClientRect().top + window.scrollY - 100,
  }));
}

// Update the top progress bar.
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function updateBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

function setReducedMotion(enabled, persist = true) {
  body.classList.toggle('reduced-motion', enabled);
  document.documentElement.classList.toggle('reduced-motion', enabled);
  reducedMotionToggle?.classList.toggle('active', enabled);
  reducedMotionToggle?.setAttribute('aria-pressed', String(enabled));
  if (persist) {
    localStorage.setItem('reducedMotion', String(enabled));
  }
}

function setTheme(mode, persist = true) {
  const isDark = mode === 'dark';
  body.classList.toggle('dark', isDark);
  themeToggle?.classList.toggle('active', isDark);
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  if (persist) {
    localStorage.setItem('theme', mode);
  }
}

function initSettings() {
  const savedReducedMotion = localStorage.getItem('reducedMotion');
  const savedTheme = localStorage.getItem('theme');
  const reducedMotionEnabled = savedReducedMotion !== null ? savedReducedMotion === 'true' : prefersReducedMotionQuery.matches;
  const themeMode = savedTheme || 'light';

  setReducedMotion(reducedMotionEnabled, false);
  setTheme(themeMode, false);
}

reducedMotionToggle?.addEventListener('click', () => {
  const shouldEnableReducedMotion = !body.classList.contains('reduced-motion');
  setReducedMotion(shouldEnableReducedMotion);
});

themeToggle?.addEventListener('click', () => {
  const nextMode = body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(nextMode);
});

prefersReducedMotionQuery.addEventListener?.('change', event => {
  if (localStorage.getItem('reducedMotion') === null) {
    setReducedMotion(event.matches, false);
  }
});

initSettings();

// Open the lightbox with the clicked image.
function openLightbox(src, alt) {
  if (!lightboxOverlay || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxOverlay.classList.add('visible');
  lightboxOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

// Close the lightbox and restore scrolling.
function closeLightbox() {
  if (!lightboxOverlay || !lightboxImage) return;
  lightboxOverlay.classList.remove('visible');
  lightboxOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (lightboxImage) lightboxImage.src = '';
  }, 250);
}

if (lightboxOverlay) {
  lightboxOverlay.addEventListener('click', event => {
    if (event.target === lightboxOverlay) {
      closeLightbox();
    }
  });
  const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightboxOverlay && lightboxOverlay.classList.contains('visible')) {
    closeLightbox();
  }
});

backToTop.addEventListener('click', () => {
  const scrollBehavior = document.documentElement.classList.contains('reduced-motion') ? 'auto' : 'smooth';
  window.scrollTo({ top: 0, behavior: scrollBehavior });
});

function updateActiveLink() {
  const scrollY = window.scrollY;
  let activeSection = currentActive;

  for (let i = sectionPositions.length - 1; i >= 0; i -= 1) {
    if (scrollY >= sectionPositions[i].top) {
      activeSection = sectionPositions[i].id;
      break;
    }
  }

  if (activeSection !== currentActive) {
    currentActive = activeSection;
    desktopLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentActive}`);
    });
  }
}

const galleryImageNames = [
  'gal (44).jpg',
  'gal (43).jpg',
  'gal (42).jpg',
  'gal (40).jpg',
  'gal (39).jpg',
  'gal (38).jpg',
  'gal (37).jpg',
  'gal (36).jpg',
  'gal (35).jpg',
  'gal (34).jpg',
  'gal (33).jpg',
  'gal (32).jpg',
  'gal (31).jpg',
  'gal (30).jpg',
  'gal (29).jpg',
  'gal (28).jpg',
  'gal (27).jpg',
  'gal (26).jpg',
  'gal (25).jpg',
  'gal (24).jpg',
  'gal (23).jpg',
  'gal (22).jpg',
  'gal (21).jpg',
  'gal (20).jpg',
  'gal (19).jpg',
  'gal (18).jpg',
  'gal (17).jpg',
  'gal (16).jpg',
  'gal (15).jpg',
  'gal (14).jpg',
  'gal (13).jpg',
  'gal (12).jpg',
  'gal (11).jpg',
  'gal (10).jpg',
  'gal (9).jpg',
  'gal (8).jpg',
  'gal (7).jpg',
  'gal (6).jpg',
  'gal (4).jpg',
  'gal (3).jpg',
  'gal (2).jpg',
  'gal (1).jpg',
  'gal.jpg',
];

// Build gallery slides from the image list.
function populateGallerySlides(container) {
  const track = container.querySelector('.carousel-track');
  if (!track) return;

  galleryImageNames.forEach((filename, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const img = document.createElement('img');
    img.src = `assets/${filename}`;
    img.alt = `Gallery image ${index + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.setAttribute('fetchpriority', 'low');
    img.onerror = () => {
      img.style.display = 'none';
    };
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });

    slide.appendChild(img);
    track.appendChild(slide);
  });
}

const carouselContainers = Array.from(document.querySelectorAll('.gallery-carousel, .carousel-container'));

// Setup one carousel, either gallery or about.
function initCarousel(container) {
  const isGallery = container.classList.contains('gallery-carousel');
  const carouselTrack = container.querySelector('.carousel-track');
  const carouselSlides = carouselTrack ? Array.from(carouselTrack.children) : [];
  const carouselPrev = container.querySelector('.carousel-button.prev');
  const carouselNext = container.querySelector('.carousel-button.next');
  const carouselDots = container.querySelector('.carousel-dots');
  let carouselIndex = 0;
  let carouselAutoPlayId = null;
  let autoDirection = 1;
  let isCarouselVisible = true;

  function getGalleryDotIndex(index) {
    if (!isGallery || carouselSlides.length === 0) return index;
    const groupSize = Math.ceil(carouselSlides.length / 3);
    return Math.min(Math.floor(index / groupSize), 2);
  }

  function updateCarousel() {
    if (!carouselTrack || carouselSlides.length === 0) return;

    const trackContainer = container.querySelector('.carousel-track-container');
    const slideGap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
    const slideWidth = carouselSlides[0].offsetWidth;
    const containerWidth = trackContainer ? trackContainer.offsetWidth : 0;
    const centerShift = containerWidth ? (containerWidth - slideWidth) / 2 : 0;
    const offset = (slideWidth + slideGap) * carouselIndex;
    carouselTrack.style.transform = `translateX(${centerShift - offset}px)`;

    carouselSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === carouselIndex);
    });

    if (!carouselDots) return;
    Array.from(carouselDots.children).forEach((dot, dotIndex) => {
      if (isGallery) {
        dot.classList.toggle('active', dotIndex === getGalleryDotIndex(carouselIndex));
      } else {
        dot.classList.toggle('active', dotIndex === carouselIndex);
      }
    });
  }

  function advanceCarousel(direction = 1) {
    if (carouselSlides.length === 0) return;
    carouselIndex = (carouselIndex + direction + carouselSlides.length) % carouselSlides.length;
    updateCarousel();
  }

  function pauseCarouselAutoplay() {
    if (carouselAutoPlayId) {
      clearInterval(carouselAutoPlayId);
      carouselAutoPlayId = null;
    }
  }

  function resetCarouselAutoplay() {
    pauseCarouselAutoplay();
    if (!isCarouselVisible) return;
    const delay = isGallery ? 3000 : 4000;
    carouselAutoPlayId = setInterval(() => advanceCarousel(autoDirection), delay);
  }

  function handleCarouselVisibilityChange(visible) {
    isCarouselVisible = visible;
    if (visible) {
      updateCarousel();
      resetCarouselAutoplay();
    } else {
      pauseCarouselAutoplay();
    }
  }

  if (window.IntersectionObserver) {
    const carouselObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === container) {
          handleCarouselVisibilityChange(entry.isIntersecting && entry.intersectionRatio >= 0.2);
        }
      });
    }, { threshold: [0, 0.2] });
    carouselObserver.observe(container);
  }

  if (!carouselTrack || carouselSlides.length === 0) return;

  if (isGallery && carouselDots) {
    const groupSize = Math.ceil(carouselSlides.length / 3);
    for (let dotIndex = 0; dotIndex < 3; dotIndex += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show gallery page ${dotIndex + 1}`);
      if (dotIndex === getGalleryDotIndex(carouselIndex)) dot.classList.add('active');
      dot.addEventListener('click', () => {
        carouselIndex = Math.min(dotIndex * groupSize, carouselSlides.length - 1);
        updateCarousel();
        resetCarouselAutoplay();
      });
      carouselDots.appendChild(dot);
    }
  } else if (!isGallery && carouselDots) {
    carouselSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show slide ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        carouselIndex = index;
        updateCarousel();
        resetCarouselAutoplay();
      });
      carouselDots.appendChild(dot);
    });
  }

  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      advanceCarousel(-1);
      resetCarouselAutoplay();
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      advanceCarousel(1);
      resetCarouselAutoplay();
    });
  }

  if (isGallery) {
    const galleryTrack = carouselTrack;
    if (galleryTrack) {
      galleryTrack.addEventListener('mouseover', (event) => {
        if (event.target.matches('img')) {
          pauseCarouselAutoplay();
        }
      });
      galleryTrack.addEventListener('mouseout', (event) => {
        if (event.target.matches('img') && !event.relatedTarget?.closest?.('img')) {
          advanceCarousel(1);
          resetCarouselAutoplay();
        }
      });
    }
  } else {
    container.addEventListener('mouseenter', () => {
      pauseCarouselAutoplay();
    });
    container.addEventListener('mouseleave', () => {
      advanceCarousel(1);
      resetCarouselAutoplay();
    });
  }

  updateCarousel();
  resetCarouselAutoplay();
}

carouselContainers.forEach(container => {
  if (container.classList.contains('gallery-carousel')) {
    populateGallerySlides(container);
  }
  initCarousel(container);
});

const highlightVideos = Array.from(document.querySelectorAll('.hcard-video'));
function pauseOffscreenVideos() {
  if (!window.IntersectionObserver) return;

  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, 0.3] });

  highlightVideos.forEach(video => videoObserver.observe(video));
}

pauseOffscreenVideos();

function onScroll() {
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      updateProgress();
      updateBackToTop();
      updateActiveLink();
      isTicking = false;
    });
    isTicking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateSectionPositions);

updateSectionPositions();
updateProgress();
updateBackToTop();
updateActiveLink();

'use strict';

// DOM Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');
const loadingScreen = document.querySelector('.loading-screen');

// Performance optimizations
let isScrolling = false;
let currentSlide = 0;
const maxSlide = slides.length;

///////////////////////////////////////
// Loading Screen
const hideLoadingScreen = () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500);
};

// Hide loading screen when page is fully loaded
window.addEventListener('load', hideLoadingScreen);

///////////////////////////////////////
// Modal window with improved accessibility
const openModal = function (e) {
  e?.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scroll

  // Focus management for accessibility
  const firstInput = modal.querySelector('input');
  if (firstInput) firstInput.focus();
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scroll
};

// Event listeners for modal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Enhanced keyboard navigation
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }

  // Slider keyboard navigation
  if (e.key === 'ArrowLeft') nextSlide();
  if (e.key === 'ArrowRight') prevSlide();
});

///////////////////////////////////////
// Smooth scrolling with performance optimization
const smoothScrollTo = target => {
  if (isScrolling) return;

  isScrolling = true;
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  setTimeout(() => {
    isScrolling = false;
  }, 1000);
};

btnScrollTo.addEventListener('click', e => {
  e.preventDefault();
  smoothScrollTo(section1);
});

///////////////////////////////////////
// Page navigation with event delegation
nav.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    e.target.classList.contains('nav__link') &&
    e.target.getAttribute('href') &&
    e.target.getAttribute('href').startsWith('#')
  ) {
    const id = e.target.getAttribute('href');
    const targetSection = document.querySelector(id);

    if (targetSection) {
      smoothScrollTo(targetSection);
    }
  }
});

///////////////////////////////////////
// Tabbed component with improved UX
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Remove active classes with animation
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
    tab.setAttribute('aria-selected', 'false');
  });

  tabsContent.forEach(content => {
    content.classList.remove('operations__content--active');
  });

  // Add active class to clicked tab
  clicked.classList.add('operations__tab--active');
  clicked.setAttribute('aria-selected', 'true');

  // Activate content area
  const activeContent = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );

  if (activeContent) {
    activeContent.classList.add('operations__content--active');
  }
});

///////////////////////////////////////
// Menu fade animation with throttling
let fadeTimeout;

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    const opacity = this;

    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      siblings.forEach(el => {
        if (el !== link) el.style.opacity = opacity;
      });
      logo.style.opacity = opacity;
    }, 50);
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation with Intersection Observer
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections with stagger effect
const revealSection = function (entries, observer) {
  entries.forEach((entry, index) => {
    if (!entry.isIntersecting) return;

    // Add stagger delay for visual appeal
    setTimeout(() => {
      entry.target.classList.remove('section--hidden');
    }, index * 100);

    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images with better UX
const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Enhanced Slider functionality
const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });

  // Update active dot
  updateDots(slide);
};

const nextSlide = function () {
  currentSlide = currentSlide === maxSlide - 1 ? 0 : currentSlide + 1;
  goToSlide(currentSlide);
};

const prevSlide = function () {
  currentSlide = currentSlide === 0 ? maxSlide - 1 : currentSlide - 1;
  goToSlide(currentSlide);
};

// Create dots dynamically
const createDots = function () {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dots__dot');
    dot.setAttribute('data-slide', i);
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotContainer.appendChild(dot);
  });
};

const updateDots = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  const activeDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`);
  if (activeDot) {
    activeDot.classList.add('dots__dot--active');
  }
};

// Initialize slider
const initSlider = function () {
  createDots();
  goToSlide(0);
};

initSlider();

// Slider event listeners
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Dot navigation
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    currentSlide = Number(slide);
    goToSlide(currentSlide);
  }
});

// Auto-play slider (optional)
let sliderInterval;
const startAutoSlide = () => {
  sliderInterval = setInterval(nextSlide, 5000);
};

const stopAutoSlide = () => {
  clearInterval(sliderInterval);
};

// Start auto-slide and pause on hover
const slider = document.querySelector('.slider');
if (slider) {
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);
  startAutoSlide();
}

///////////////////////////////////////
// Form handling with validation
const modalForm = document.querySelector('.modal__form');
if (modalForm) {
  modalForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(modalForm);
    const firstName = modalForm.querySelector('#firstName').value;
    const lastName = modalForm.querySelector('#lastName').value;
    const email = modalForm.querySelector('#email').value;

    // Basic validation
    if (!firstName || !lastName || !email) {
      alert('Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Simulate form submission
    console.log('Form submitted:', { firstName, lastName, email });
    alert('Thank you! Your account request has been submitted.');
    closeModal();
    modalForm.reset();
  });
}

// Email validation helper
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

///////////////////////////////////////
// Performance optimizations

// Debounce function for performance
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Optimized scroll handler
const handleScroll = throttle(() => {
  // Add any scroll-based animations or effects here
}, 100);

window.addEventListener('scroll', handleScroll);

///////////////////////////////////////
// Accessibility improvements

// Skip to main content link
const createSkipLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#section--1';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    transition: top 0.2s;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
};

// Add skip link for accessibility
createSkipLink();

// Reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

if (prefersReducedMotion.matches) {
  // Disable auto-slide for users who prefer reduced motion
  stopAutoSlide();

  // Reduce animation duration
  document.documentElement.style.setProperty('--animation-duration', '0.1s');
}

///////////////////////////////////////
// Error handling and fallbacks

window.addEventListener('error', e => {
  console.error('JavaScript error:', e.error);
  // Fallback behavior for critical functionality
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

///////////////////////////////////////
// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  console.log('Bankist app initialized');

  // Add any initialization code here

  // Remove loading screen if it hasn't been removed already
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      hideLoadingScreen();
    }
  }, 1000);
});
/////////////////////////////////////////////////////
///////////////////////////////////////////////////////

//    SELECTING, CREATING & DELETING ELEMENTS

// SELECTING ELEMENTS
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// CREATING AND INSERTING ELEMENTS
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies to improve performance
& functionality <button class =" btn btn--close--cookie">OK</button>`;

// const header = document.querySelector('.header');

header.append(message);

document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
  });
// const header2 =
//  Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';
// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);

// EVENT PROPAGATION IN PRACTICE
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)},
//  ${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK:', e.target);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK:', e.target);
// });

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK:', e.target);

//   e.stopPropagation();
// });

//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// tabsContainer.addEventListener('click', e => {
//   e.preventDefault();
//   const clicked = e.target.closest('.operations__tab');
//   console.log(clicked);

//   //  Active tab
//   tabs.forEach(t => t.classList.remove('operations__tab--active'));
//   if (!clicked) return;
//   clicked.classList.add('operations__tab--active');

//   //  Activate content area
//   console.log(clicked.dataset.tab);
//   tabsContent.forEach(t => t.classList.remove('operations__content--active'));
//   document
//     .querySelector(`.operations__content--${clicked.dataset.tab}`)
//     .classList.add('operations__content--active');
// });

//////////////////////////////////////////////////
//////////////////////////////////////////////////

//  IMPLEMENTING SMOOTH SCROOLING
// btnScrollTo.addEventListener('click', e => {
//   e.preventDefault();
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// //  PAGE NAVIGATION
// nav.addEventListener('click', e => {
//   e.preventDefault();
//   if (e.target.classList.contains('nav__link')) {
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   }
// });

// //  IMPLEMENTING TABBED COMPONENT
// tabsContainer.addEventListener('click', e => {
//   e.preventDefault();
//   const clicked = e.target.closest('.operations__tab');
//   if (!clicked) return;
//   tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
//   clicked.classList.add('operations__tab--active');

//   tabsContent.forEach(content =>
//     content.classList.remove('operations__content--active')
//   );
//   document
//     .querySelector(`.operations__content--${clicked.dataset.tab}`)
//     .classList.add('operations__content--active');
// });

// //  IMPLEMENTING MENU FADE ANIMATION
// const mouseH = (eventt, opacity) => {
//   if (eventt.target.classList.contains('nav__link')) {
//     const link = eventt.target;
//     const siblings = link.closest('nav').querySelectorAll('.nav__link');
//     const logo = link.closest('nav').querySelector('img');

//     siblings.forEach(sibling => {
//       if (link !== sibling) sibling.style.opacity = opacity;
//     });
//     logo.style.opacity = opacity;
//   }
// };

// nav.addEventListener('mouseover', e => {
//   mouseH(e, 0.5);
// });

// nav.addEventListener('mouseout', e => {
//   mouseH(e, 1);
// });

// //  IMPLEMENTING STICKY NAVIGATION
// // const initialCoords = section1.getBoundingClientRect();

// // window.addEventListener('scroll', e => {
// //   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
// //   else nav.classList.remove('sticky');
// // });

// // A BETTER WAY OF IMPLIMENTING THE STICKY NAVIGATION
// const headerC = document.querySelector('.header');
// const navHeight = nav.getBoundingClientRect().height;

// const stickyNav = entries => {
//   const [entry] = entries;
//   if (!entry.isIntersecting) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// };

// const observer = new IntersectionObserver(stickyNav, {
//   root: null,
//   threshold: 0,
//   rootMargin: `${-navHeight}px`,
// });

// observer.observe(headerC);

// // REVEALING ELEMENTS
// const allSections = document.querySelectorAll('.section');

// const sect = entries => {
//   const [entry] = entries;
//   if (!entry.isIntersecting) return;
//   entry.target.classList.remove('section--hidden');
// };

// const sectionsObserver = new IntersectionObserver(sect, {
//   root: null,
//   threshold: 0.15,
//   // rootMargin: `-200px`,
// });

// allSections.forEach(section => {
//   sectionsObserver.observe(section);
//   section.classList.remove('section--hidden');
// });

// // LAZY LOADING IMAGES
// const imgTargets = document.querySelectorAll('img[data-src]');

// const loadImg = entries => {
//   const [entry] = entries;
//   if (!entry.isIntersecting) return;
//   entry.target.src = entry.target.dataset.src;

//   entry.target.addEventListener('load', () => {
//     entry.target.classList.remove('lazy-img');
//   });
// };

// const imgObserver = new IntersectionObserver(loadImg, {
//   root: null,
//   threshold: 0,
// });

// imgTargets.forEach(img => {
//   imgObserver.observe(img);
// });

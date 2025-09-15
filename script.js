'use strict';

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

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////////

//  IMPLEMENTING SMOOTH SCROOLING
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//  PAGE NAVIGATION
nav.addEventListener('click', e => {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

//  IMPLEMENTING TABBED COMPONENT
tabsContainer.addEventListener('click', e => {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//  IMPLEMENTING MENU FADE ANIMATION
const mouseHandler = (eventt, opacity) => {
  if (eventt.target.classList.contains('nav__link')) {
    const link = eventt.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (link !== sibling) sibling.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', e => {
  mouseHandler(e, 0.5);
});

nav.addEventListener('mouseout', e => {
  mouseHandler(e, 1);
});

//  IMPLEMENTING STICKY NAVIGATION
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', e => {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// A BETTER WAY OF IMPLIMENTING THE STICKY NAVIGATION
const headerC = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const stickyNavObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

stickyNavObserver.observe(headerC);

// REVEALING ELEMENTS
// const allSections = document.querySelectorAll('.section');

// const sectionObCall = entries => {
//   const [entry] = entries;
//   if (!entry.isIntersecting) return;
//   entry.target.classList.remove('section--hidden');
// };

// const sectionsObserver = new IntersectionObserver(sectionObCall, {
//   root: null,
//   threshold: 0.15,
// });

// allSections.forEach(section => {
//   sectionsObserver.observe(section);
//   section.classList.add('section--hidden');
// });

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

const imgObCall = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(imgObCall, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

// Building the slider
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnleft = document.querySelector('.slider__btn--left');

let curSlide = 0;
const maxSlide = slides.length;

const goToSlide = slide => {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);

const nextSlide = () => {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
};

const prevSlide = () => {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnleft.addEventListener('click', prevSlide);
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

const header = document.querySelector('.header');

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

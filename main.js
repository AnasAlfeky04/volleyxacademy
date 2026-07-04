const container = document.querySelector(".scroll-container");
const ball = document.querySelector(".scroll-ball");
const track = document.querySelector(".scroll-track");

let isDragging = false;
let startY;
let ballStartY;
let maxBallY;

function updateLimits() {
  maxBallY = track.clientHeight - ball.clientHeight;
}
updateLimits();
window.addEventListener("resize", updateLimits);

/* --- سحب الكرة --- */
ball.addEventListener("mousedown", (e) => {
  isDragging = true;
  startY = e.clientY;
  ballStartY = ball.offsetTop;
  ball.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  ball.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  let newY = ballStartY + (e.clientY - startY);
  newY = Math.max(0, Math.min(newY, maxBallY));
  ball.style.top = newY + "px";

  const scrollPercent = newY / maxBallY;
  container.scrollTop =
    scrollPercent * (container.scrollHeight - container.clientHeight);
});

/* --- عند تحريك الصفحة → الكرة تتحرك تلقائيًا --- */
container.addEventListener("scroll", () => {
  const scrollPercent =
    container.scrollTop /
    (container.scrollHeight - container.clientHeight);

  const ballY = scrollPercent * maxBallY;
  ball.style.top = ballY + "px";
});

// Basic UI interactions: mobile menu, smooth scroll, tabs, form validation, gallery lightbox, year
document.addEventListener('DOMContentLoaded', () => {

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     MOBILE MENU (UPDATED)
  ----------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  // Open / Close mobile menu
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('open');

    mainNav.classList.toggle('open');
    menuToggle.classList.toggle('active');

    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close menu when clicking any nav link
  document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -----------------------------------------------------------
     SMOOTH SCROLL
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({behavior:'smooth', block:'start'});
          mainNav.classList.remove('open');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  /* -----------------------------------------------------------
    TABS
  ----------------------------------------------------------- */
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(p => p.classList.add('hidden'));
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.remove('hidden');

      tabs.forEach(t => t.setAttribute('aria-selected', String(t === btn)));
    });
  });

  // Videos
  const vidThumbs = document.querySelectorAll('.video-thumb');
  vidThumbs.forEach(t => {
    const video = t.querySelector('video');

    // Play on hover
    t.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play();
    });

    // Stop + reset to thumbnail
    t.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      video.load(); // restores poster
    });

    // Open full video in lightbox
    t.addEventListener('click', () => {
      const src = video.getAttribute('src');
      lbMedia.innerHTML = `<video src="${src}" autoplay muted controls playsinline></video>`;
      lightbox.classList.remove('hidden');
      lightbox.setAttribute('aria-hidden','false');
      lbClose.focus();
    });
  });
});
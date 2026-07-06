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
window.addEventListener("resize", () => {
  updateLimits();
  checkScrollVisibility();
});

function checkScrollVisibility() {
  const hasScroll = container.scrollHeight - container.clientHeight > 5;

  track.style.display = hasScroll ? "flex" : "none";
}

container.addEventListener("scroll", checkScrollVisibility);

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

fetch('photos.html')
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const images = doc.querySelectorAll('.gallery-grid img');

    const container = document.getElementById('home-photos');

    images.forEach((img, index) => {
      if (index < 3) {
        const btn = document.createElement('button');
        btn.className = 'img-thumb';

        btn.innerHTML = `<img src="${img.src}" alt="">`;
        container.appendChild(btn);
      }
    });
  });

  fetch('videos.html')
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const videos = doc.querySelectorAll('.gallery-grid video');
    const container = document.getElementById('home-videos');

    container.innerHTML = "";

    videos.forEach((video, index) => {
      if (index < 3) {

        const src = video.getAttribute("src");
        const poster = video.getAttribute("poster");

        const btn = document.createElement('button');
        btn.className = 'video-thumb';

        // 🔥 نفس العنصر بالظبط
        btn.innerHTML = `
          <video 
            src="${src}" 
            poster="${poster}" 
            muted 
            playsinline
          ></video>
        `;

        container.appendChild(btn);
      }
    });
  });

// Basic UI interactions
document.addEventListener('DOMContentLoaded', () => {

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     MOBILE MENU
  ----------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('open');

    mainNav.classList.toggle('open');
    menuToggle.classList.toggle('active');

    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

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

  /* -----------------------------------------------------------
     VIDEOS
  ----------------------------------------------------------- */
document.addEventListener("mouseover", (e) => {
  const thumb = e.target.closest(".video-thumb");
  if (!thumb) return;

  const video = thumb.querySelector("video");
  if (!video) return;

  video.currentTime = 0;
  video.muted = false; // تشغيل الصوت
  video.play();
});

document.addEventListener("mouseout", (e) => {
  const thumb = e.target.closest(".video-thumb");
  if (!thumb) return;

  const video = thumb.querySelector("video");
  if (!video) return;

  video.pause();
  video.currentTime = 0;
  video.load(); // 🔥 يرجّع الـ thumbnail
});



  /* ===========================================================
     🌍 LANGUAGE DROPDOWN (UPDATED WITH TRANSLATION)
  =========================================================== */

  window.toggleLangMenu = function () {
    const menu = document.getElementById("lang-menu");
    const btn = document.querySelector(".lang-btn");

    menu.classList.toggle("hidden");
    btn.classList.toggle("active");
  };

  window.changeLang = function (lang) {

    // 🔥 ترجمة النصوص
    document.querySelectorAll("[data-en]").forEach(el => {
      el.innerText = (lang === "ar")
        ? el.getAttribute("data-ar")
        : el.getAttribute("data-en");
    });

    // علامة الصح
    document.querySelectorAll(".lang-item").forEach(item => {
      item.classList.remove("active");
      item.querySelector(".check").classList.add("hidden");
    });

    const selected = document.querySelector(`[onclick="changeLang('${lang}')"]`);
    selected.classList.add("active");
    selected.querySelector(".check").classList.remove("hidden");

    // تغيير العلم
    const flag = document.querySelector(".lang-btn img");
    const text = document.querySelector(".lang-btn span");

    if (lang === "ar") {
      flag.src = "/images/flags/egypt.png";
      text.innerText = "EG";
      document.documentElement.dir = "rtl"; // 🔥 اتجاه عربي
    } else {
      flag.src = "/images/flags/usa.png";
      text.innerText = "EN";
      document.documentElement.dir = "ltr";
    }

    // قفل القائمة
    document.getElementById("lang-menu").classList.add("hidden");
    document.querySelector(".lang-btn").classList.remove("active");

    // حفظ اللغة
    localStorage.setItem("lang", lang);
  };

  // قفل القائمة لو ضغطت برا
  document.addEventListener("click", function(e) {
    const dropdown = document.querySelector(".lang-dropdown");
    const menu = document.getElementById("lang-menu");
    const btn = document.querySelector(".lang-btn");

    if (!dropdown.contains(e.target)) {
      menu.classList.add("hidden");
      btn.classList.remove("active");
    }
  });

  // تحميل اللغة المحفوظة
  const savedLang = localStorage.getItem("lang") || "ar";
  changeLang(savedLang);

});
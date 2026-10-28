/**
 * VÉLOIR — animations.js
 * Integrates 7 animation libraries via CDN into the vanilla-JS SPA:
 *   A. Lenis smooth scroll (synced with GSAP ticker)
 *   B. GSAP + ScrollTrigger (hero reveal, header parallax, pinned PDP)
 *   C. AOS (product-card entrance)
 *   D. Anime.js (staggered grid re-organisation on filter/sort)
 *   E. Lottie-web (cart success, wishlist heart pulse, add-to-cart checkmark)
 *   F. Three.js (interactive 3-D floating geometry hero overlay)
 *   G. Motion One (cart drawer slide, modal fade+scale, page morph)
 *
 * Exports:  window.VeloirAnimations
 * Usage:    loaded as <script type="module"> — last script in index.html
 */

/* ── helpers ─────────────────────────────────────────────── */
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Inject a <script src="…"> and resolve when it loads. */
function loadScript(src, isModule = false) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    if (isModule) s.type = "module";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/** Inject a <link rel="stylesheet"> */
function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
}

/* ── CDN URLs ────────────────────────────────────────────── */
const CDN = {
  lenis:       "https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js",
  scrollTrig:  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
  aosJs:       "https://unpkg.com/aos@2.3.4/dist/aos.js",
  aosCss:      "https://unpkg.com/aos@2.3.4/dist/aos.css",
  anime:       "https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js",
  lottie:      "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js",
  // Three.js via ESM – loaded with dynamic import() below
  threeESM:    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js",
  motionOne:   "https://cdn.jsdelivr.net/npm/motion@10.18.0/dist/motion.js",
};

/* ── Module-level refs ───────────────────────────────────── */
let _lenis = null;
let _three = null;          // three.js namespace
let _threeRenderer = null;
let _threeRAF = null;
let _lottieCartAnim = null;
let _lottieHeartAnim = null;
let _lottieAddcartAnim = null;
let _scrollTriggers = [];   // for cleanup

/* ════════════════════════════════════════════════════════════
   A. LENIS SMOOTH SCROLL
   ════════════════════════════════════════════════════════════ */
async function initLenis() {
  if (prefersReducedMotion()) return;

  await loadScript(CDN.lenis);
  if (!window.Lenis) return;

  _lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis RAF with GSAP ticker so ScrollTrigger works correctly
  if (window.gsap) {
    window.gsap.ticker.add((time) => {
      _lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: manual RAF loop
    function lenisRaf(time) {
      _lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
  }
}

/* ════════════════════════════════════════════════════════════
   B. GSAP + SCROLL TRIGGER
   ════════════════════════════════════════════════════════════ */
async function initScrollTrigger() {
  if (prefersReducedMotion()) return;
  if (!window.gsap) return;

  await loadScript(CDN.scrollTrig);
  if (!window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ST = window.ScrollTrigger;

  gsap.registerPlugin(ST);

  /* ── B1. Hero text stagger reveal ── */
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .from("#hero-dynamic-badge", { opacity: 0, y: -18, duration: 0.7 }, 0)
    .from(
      "#hero-dynamic-title",
      { opacity: 0, y: 40, duration: 0.85, skewY: 3 },
      0.15
    )
    .from(
      "#hero-dynamic-subtitle",
      { opacity: 0, y: 24, duration: 0.75 },
      0.45
    )
    .from(
      "#hero-dynamic-img",
      { opacity: 0, scale: 0.94, duration: 0.85 },
      0.3
    );

  /* ── B2. Header scroll parallax (header shrinks on scroll) ── */
  const header = document.querySelector("header");
  if (header) {
    ST.create({
      start: "top top",
      end: "100px top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        header.style.boxShadow = `0 ${2 + progress * 6}px ${
          8 + progress * 16
        }px rgba(0,0,0,${0.04 + progress * 0.08})`;
      },
    });
  }

  /* ── B3. Pinned PDP feature reveal (only when PDP is visible) ── */
  const pdpSection = document.getElementById("product-page-view");
  const pdpMain = document.getElementById("pdp-main-image");
  if (pdpSection && pdpMain) {
    _scrollTriggers.push(
      ST.create({
        trigger: pdpSection,
        start: "top 85%",
        onEnter: () => {
          gsap.from(pdpMain, {
            opacity: 0,
            scale: 0.93,
            duration: 0.65,
            ease: "power2.out",
          });
          const title = document.getElementById("pdp-title");
          if (title) {
            gsap.from(title, {
              opacity: 0,
              x: -30,
              duration: 0.55,
              ease: "power2.out",
              delay: 0.1,
            });
          }
        },
        once: true,
      })
    );
  }

  /* ── B4. Catalog section fade-in ── */
  const catalog = document.getElementById("catalog");
  if (catalog) {
    _scrollTriggers.push(
      ST.create({
        trigger: catalog,
        start: "top 80%",
        onEnter: () => {
          gsap.from(catalog, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out",
          });
        },
        once: true,
      })
    );
  }
}

/* ════════════════════════════════════════════════════════════
   C. AOS  (add data-aos programmatically to product cards)
   ════════════════════════════════════════════════════════════ */
async function initAOS() {
  if (prefersReducedMotion()) return;

  loadCSS(CDN.aosCss);
  await loadScript(CDN.aosJs);
  if (!window.AOS) return;

  window.AOS.init({
    duration: 550,
    easing: "ease-out-quad",
    once: true,
    offset: 60,
    delay: 0,
  });
}

/**
 * Called after renderProducts() — adds AOS attributes to each
 * product card so they animate in as the user scrolls.
 */
function patchProductCardsWithAOS() {
  if (prefersReducedMotion()) return;

  const aosVariants = [
    "veloir-fade-up",
    "veloir-scale",
    "veloir-fade-in",
    "veloir-slide-left",
  ];

  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card, i) => {
    if (!card.dataset.aos) {
      card.dataset.aos = aosVariants[i % aosVariants.length];
      card.dataset.aosDelay = String(Math.min(i * 55, 400));
      card.dataset.aosDuration = "520";
    }
  });

  if (window.AOS) window.AOS.refresh();
}

/* ════════════════════════════════════════════════════════════
   D. ANIME.JS  (staggered grid re-organisation on filter/sort)
   ════════════════════════════════════════════════════════════ */
async function initAnime() {
  if (prefersReducedMotion()) return;
  await loadScript(CDN.anime);
}

/**
 * Stagger-animate product cards after a filter / sort change.
 * Designed to be called right after renderProducts() mutates the DOM.
 */
function animateGridFilter() {
  if (prefersReducedMotion()) return;
  if (!window.anime) return;

  const cards = document.querySelectorAll(".product-card");
  if (!cards.length) return;

  window.anime({
    targets: cards,
    opacity: [0, 1],
    translateY: [22, 0],
    scale: [0.95, 1],
    easing: "easeOutCubic",
    duration: 420,
    delay: window.anime.stagger(48, { start: 0 }),
  });
}

/* ════════════════════════════════════════════════════════════
   E. LOTTIE  (micro-animations)
   ════════════════════════════════════════════════════════════ */

/**
 * Minimal inline Lottie JSON animations (compact, self-contained).
 * These are tiny 24-frame loops — no external .json files needed.
 */
const LOTTIE_DATA = {
  /** Animated checkmark / success pulse — cart order complete */
  cartSuccess: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "CartSuccess",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Circle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [0, 0, 100], e: [110, 110, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
              { t: 20, s: [110, 110, 100], e: [100, 100, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
              { t: 30, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "el",
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [120, 120] },
            nm: "Ellipse",
          },
          {
            ty: "fl",
            c: { a: 0, k: [0.067, 0.733, 0.357, 1] },
            o: { a: 0, k: 100 },
            nm: "Fill",
          },
        ],
        ip: 0,
        op: 60,
        st: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Check",
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 10, s: [0], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } }, { t: 25, s: [100] }] },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "sh",
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0]],
                v: [[-28, 0], [-8, 22], [32, -20]],
                c: false,
              },
            },
            nm: "Check Path",
          },
          {
            ty: "st",
            c: { a: 0, k: [1, 1, 1, 1] },
            o: { a: 0, k: 100 },
            w: { a: 0, k: 8 },
            lc: 2,
            lj: 2,
            nm: "Stroke",
          },
        ],
        ip: 0,
        op: 60,
        st: 0,
      },
    ],
  },

  /** Heart pulse — wishlist toggle */
  heart: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 30,
    w: 60,
    h: 60,
    nm: "Heart",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Heart",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [30, 30, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [80, 80, 100], e: [120, 120, 100], i: { x: [0.3], y: [1] }, o: { x: [0.7], y: [0] } },
              { t: 12, s: [120, 120, 100], e: [100, 100, 100], i: { x: [0.3], y: [1] }, o: { x: [0.7], y: [0] } },
              { t: 25, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "sh",
            ks: {
              a: 0,
              k: {
                i: [[-6.6, 0], [0, -6.6], [6.6, 0], [0, 6.6]],
                o: [[6.6, 0], [0, 6.6], [-6.6, 0], [0, -6.6]],
                v: [[0, -10], [12, 2], [0, 16], [-12, 2]],
                c: true,
              },
            },
            nm: "Heart Path",
          },
          {
            ty: "fl",
            c: { a: 0, k: [0.937, 0.267, 0.267, 1] },
            o: { a: 0, k: 100 },
            nm: "Fill",
          },
        ],
        ip: 0,
        op: 30,
        st: 0,
      },
    ],
  },

  /** Checkmark — add-to-cart confirmation */
  addcart: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 30,
    w: 60,
    h: 60,
    nm: "AddCart",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Check",
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 0, s: [0], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } }, { t: 10, s: [100] }] },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [30, 30, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "sh",
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0]],
                v: [[-12, 0], [-4, 9], [14, -9]],
                c: false,
              },
            },
            nm: "Check Path",
          },
          {
            ty: "st",
            c: { a: 0, k: [0.067, 0.733, 0.357, 1] },
            o: { a: 0, k: 100 },
            w: { a: 0, k: 5 },
            lc: 2,
            lj: 2,
            nm: "Stroke",
          },
        ],
        ip: 0,
        op: 30,
        st: 0,
      },
    ],
  },
};

async function initLottie() {
  if (prefersReducedMotion()) return;

  await loadScript(CDN.lottie);
  const lottie = window.lottie;
  if (!lottie) return;

  /* Cart success overlay */
  const cartEl = document.getElementById("lottie-cart-success");
  if (cartEl) {
    _lottieCartAnim = lottie.loadAnimation({
      container: cartEl,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: LOTTIE_DATA.cartSuccess,
    });
  }

  /* Wishlist heart */
  const heartEl = document.getElementById("lottie-heart");
  if (heartEl) {
    _lottieHeartAnim = lottie.loadAnimation({
      container: heartEl,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: LOTTIE_DATA.heart,
    });
  }

  /* Add-to-cart checkmark */
  const addCartEl = document.getElementById("lottie-addcart");
  if (addCartEl) {
    _lottieAddcartAnim = lottie.loadAnimation({
      container: addCartEl,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: LOTTIE_DATA.addcart,
    });
  }
}

/** Called when an order is successfully placed. */
function playCartSuccess() {
  if (prefersReducedMotion()) return;

  const el = document.getElementById("lottie-cart-success");
  if (!el) return;

  el.style.display = "block";

  if (_lottieCartAnim) {
    _lottieCartAnim.stop();
    _lottieCartAnim.play();
    _lottieCartAnim.onComplete = () => {
      setTimeout(() => {
        if (window.gsap) {
          window.gsap.to(el, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              el.style.display = "none";
              el.style.opacity = "1";
            },
          });
        } else {
          el.style.display = "none";
        }
      }, 600);
    };
  }
}

/** Called when wishlist heart is toggled. */
function playWishlistHeart(buttonElement) {
  if (prefersReducedMotion()) return;

  const el = document.getElementById("lottie-heart");
  if (!el) return;

  /* Position the overlay near the button */
  if (buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    el.style.position = "fixed";
    el.style.top = `${rect.top + rect.height / 2 - 14}px`;
    el.style.left = `${rect.left + rect.width / 2 - 14}px`;
    el.style.zIndex = "9999";
    el.style.display = "inline-block";
  }

  if (_lottieHeartAnim) {
    _lottieHeartAnim.stop();
    _lottieHeartAnim.play();
    _lottieHeartAnim.onComplete = () => {
      setTimeout(() => {
        el.style.display = "none";
        el.style.position = "";
      }, 200);
    };
  }
}

/** Called after add-to-cart action. */
function playAddCartCheck(buttonElement) {
  if (prefersReducedMotion()) return;

  const el = document.getElementById("lottie-addcart");
  if (!el) return;

  if (buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    el.style.position = "fixed";
    el.style.top = `${rect.top + rect.height / 2 - 14}px`;
    el.style.left = `${rect.left + rect.width / 2 - 14}px`;
    el.style.zIndex = "9999";
    el.style.display = "inline-block";
  }

  if (_lottieAddcartAnim) {
    _lottieAddcartAnim.stop();
    _lottieAddcartAnim.play();
    _lottieAddcartAnim.onComplete = () => {
      setTimeout(() => {
        el.style.display = "none";
        el.style.position = "";
      }, 200);
    };
  }
}

/* ════════════════════════════════════════════════════════════
   F. THREE.JS  (interactive 3-D floating geometry — hero)
   ════════════════════════════════════════════════════════════ */
async function initThreeHero() {
  if (prefersReducedMotion()) return;

  const canvas = document.getElementById("hero-three-canvas");
  if (!canvas) return;

  /* Dynamic ESM import (Three.js is ESM-only via this CDN) */
  let THREE;
  try {
    THREE = await import(CDN.threeESM);
    _three = THREE;
  } catch (err) {
    console.warn("[VeloirAnimations] Three.js failed to load:", err);
    return;
  }

  const hero = document.getElementById("home");
  if (!hero) return;

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  _threeRenderer = renderer;

  /* ── Scene / Camera ── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  /* ── Resize handler ── */
  function resize() {
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const resizeObs = new ResizeObserver(resize);
  resizeObs.observe(hero);

  /* ── Geometry collection ── */
  const group = new THREE.Group();
  scene.add(group);

  const geometries = [
    new THREE.TorusKnotGeometry(0.5, 0.18, 80, 16),
    new THREE.OctahedronGeometry(0.45),
    new THREE.IcosahedronGeometry(0.42),
    new THREE.TorusGeometry(0.38, 0.14, 14, 40),
    new THREE.TetrahedronGeometry(0.5),
  ];

  const mat = new THREE.MeshPhongMaterial({
    color: 0x111827,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });

  const meshes = [];
  geometries.forEach((geo, i) => {
    const mesh = new THREE.Mesh(geo, mat.clone());
    const angle = (i / geometries.length) * Math.PI * 2;
    const radius = 1.8 + (i % 2) * 0.4;
    mesh.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.55,
      (Math.random() - 0.5) * 1.5
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      0
    );
    group.add(mesh);
    meshes.push(mesh);
  });

  /* ── Lighting ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 5, 3);
  scene.add(dirLight);

  /* ── Mouse parallax ── */
  let mouseX = 0, mouseY = 0;
  function onMouseMove(e) {
    const heroRect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - heroRect.left) / heroRect.width - 0.5) * 2;
    mouseY = -((e.clientY - heroRect.top) / heroRect.height - 0.5) * 2;
  }
  hero.addEventListener("mousemove", onMouseMove);

  /* ── Animate loop ── */
  let elapsed = 0;
  function animate() {
    _threeRAF = requestAnimationFrame(animate);
    elapsed += 0.008;

    meshes.forEach((mesh, i) => {
      mesh.rotation.x += 0.003 + i * 0.0008;
      mesh.rotation.y += 0.005 + i * 0.0006;
    });

    // Parallax tilt
    group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.05;
    group.rotation.x += (mouseY * 0.18 - group.rotation.x) * 0.05;

    // Slow orbit
    group.rotation.z = Math.sin(elapsed * 0.4) * 0.06;

    renderer.render(scene, camera);
  }
  animate();

  /* ── Adapt wireframe colour to dark mode changes ── */
  function syncThemeColour() {
    const isDark = document.body.classList.contains("dark-mode");
    meshes.forEach((m) => {
      m.material.color.set(isDark ? 0xffffff : 0x111827);
      m.material.opacity = isDark ? 0.22 : 0.35;
    });
  }
  syncThemeColour();

  // Observe body class changes (dark-mode toggle)
  const bodyObs = new MutationObserver(syncThemeColour);
  bodyObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  /* store cleanup fn */
  _threeRenderer._cleanup = () => {
    cancelAnimationFrame(_threeRAF);
    resizeObs.disconnect();
    bodyObs.disconnect();
    hero.removeEventListener("mousemove", onMouseMove);
    renderer.dispose();
    geometries.forEach((g) => g.dispose());
    meshes.forEach((m) => m.material.dispose());
  };
}

/* ════════════════════════════════════════════════════════════
   G. MOTION ONE  (cart drawer, modal, page transitions)
   ════════════════════════════════════════════════════════════ */
let _motionAnimate = null;   // the animate() function from Motion One

async function initMotionOne() {
  if (prefersReducedMotion()) return;

  await loadScript(CDN.motionOne);

  // Motion One exposes via window.Motion (UMD build)
  if (window.Motion && window.Motion.animate) {
    _motionAnimate = window.Motion.animate;
  } else if (window.motion && window.motion.animate) {
    _motionAnimate = window.motion.animate;
  } else {
    // Try the named export from the global object
    for (const key of Object.keys(window)) {
      if (window[key] && typeof window[key].animate === "function" && typeof window[key].timeline === "function") {
        _motionAnimate = window[key].animate;
        break;
      }
    }
  }
}

/** Animate the cart drawer sliding in from the right */
function animateCartOpen() {
  if (prefersReducedMotion()) return;

  const panel = document.querySelector("#cart-drawer .drawer-panel");
  if (!panel) return;

  if (_motionAnimate) {
    _motionAnimate(
      panel,
      { x: ["100%", "0%"], opacity: [0, 1] },
      { duration: 0.38, easing: [0.25, 0.1, 0.25, 1] }
    );
  } else if (window.gsap) {
    window.gsap.fromTo(
      panel,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.38, ease: "power2.out" }
    );
  }
}

/** Animate the cart drawer sliding out to the right */
function animateCartClose() {
  if (prefersReducedMotion()) return;

  const panel = document.querySelector("#cart-drawer .drawer-panel");
  if (!panel) return;

  if (_motionAnimate) {
    _motionAnimate(
      panel,
      { x: ["0%", "100%"], opacity: [1, 0] },
      { duration: 0.3, easing: [0.4, 0, 1, 1] }
    );
  } else if (window.gsap) {
    window.gsap.to(panel, {
      x: "100%",
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => window.gsap.set(panel, { clearProps: "all" }),
    });
  }
}

/** Animate modal fade+scale entrance */
function animateModalOpen(modalId = "checkout-modal") {
  if (prefersReducedMotion()) return;

  const content = document.querySelector(`#${modalId} .modal-content`);
  if (!content) return;

  if (_motionAnimate) {
    _motionAnimate(
      content,
      { opacity: [0, 1], scale: [0.9, 1] },
      { duration: 0.35, easing: [0.25, 0.1, 0.25, 1] }
    );
  } else if (window.gsap) {
    window.gsap.fromTo(
      content,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }
}

/** Page transition morph (called from onPageChange) */
function animatePageTransition(pageId) {
  if (prefersReducedMotion()) return;

  const el = document.getElementById(pageId);
  if (!el) return;

  if (_motionAnimate) {
    _motionAnimate(
      el,
      { opacity: [0, 1], y: [16, 0] },
      { duration: 0.38, easing: [0.25, 0.1, 0.25, 1] }
    );
  } else if (window.gsap) {
    window.gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" }
    );
  }
}

/* ════════════════════════════════════════════════════════════
   CLEANUP — called on page/view change by onPageChange()
   ════════════════════════════════════════════════════════════ */
function cleanup() {
  // Kill all ScrollTriggers we registered
  if (window.ScrollTrigger && _scrollTriggers.length) {
    _scrollTriggers.forEach((st) => st.kill());
    _scrollTriggers = [];
  }
  // Three.js cleanup (only on full destruction, not every page change)
  // We leave Three.js running in hero across page changes because it is
  // always mounted in the persistent DOM.
}

/* ════════════════════════════════════════════════════════════
   PUBLIC API  — window.VeloirAnimations
   ════════════════════════════════════════════════════════════ */
const VeloirAnimations = {
  /** Called by app.js showPage() */
  onPageChange(pageId) {
    animatePageTransition(pageId);
    // Refresh ScrollTrigger positions after layout shift
    if (window.ScrollTrigger) {
      setTimeout(() => window.ScrollTrigger.refresh(), 100);
    }
    // Refresh AOS for newly visible elements
    if (window.AOS) {
      setTimeout(() => window.AOS.refresh(), 150);
    }
  },

  /** Called by app.js openCartDrawer() */
  animateCartOpen() {
    animateCartOpen();
  },

  /** Called by app.js closeCartDrawer() */
  animateCartClose() {
    animateCartClose();
  },

  /** Called by app.js openCheckoutModal() */
  animateModalOpen(modalId) {
    animateModalOpen(modalId);
  },

  /** Called after renderProducts() by app.js */
  refreshAOS() {
    patchProductCardsWithAOS();
  },

  /** Called after renderProducts() by app.js — Anime.js stagger */
  animateGridFilter() {
    animateGridFilter();
  },

  /** Called by app.js processOrderPlacement() success */
  playCartSuccess() {
    playCartSuccess();
  },

  /** Called by app.js toggleWishlist() */
  playWishlistHeart(el) {
    playWishlistHeart(el);
  },

  /** Called by app.js addToCart buttons */
  playAddCartCheck(el) {
    playAddCartCheck(el);
  },

  /** Internal cleanup (exposed for debugging) */
  cleanup,
};

window.VeloirAnimations = VeloirAnimations;

/* ════════════════════════════════════════════════════════════
   BOOT SEQUENCE
   ════════════════════════════════════════════════════════════ */
async function boot() {
  try {
    // Run non-dependent inits in parallel for speed
    await Promise.allSettled([
      initLenis(),
      initAOS(),
      initAnime(),
      initLottie(),
      initMotionOne(),
    ]);

    // ScrollTrigger needs GSAP (already global) + DOM ready
    await initScrollTrigger();

    // Three.js is heaviest — init after everything else
    await initThreeHero();

    // Initial product card AOS patch (for cards already in DOM)
    patchProductCardsWithAOS();

    console.info(
      "%c[VÉLOIR Animations] All 7 libraries initialised.",
      "color:#c59b27;font-weight:bold"
    );
  } catch (err) {
    console.warn("[VeloirAnimations] Boot error:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  // DOM already ready (deferred/module script loads after parse)
  boot();
}

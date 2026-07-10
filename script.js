/* ═══ SOLÍS ATELIER DENTAL — efectos ═══ */

const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ─── Scroll suave (Lenis) ─── */
let lenis = null;
if (window.Lenis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // anclas internas pasan por Lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    });
  });
}
const lockScroll = () => lenis ? lenis.stop() : (document.body.style.overflow = 'hidden');
const unlockScroll = () => lenis ? lenis.start() : (document.body.style.overflow = '');

/* ─── Preloader con progreso ─── */
(() => {
  const pre = document.querySelector('[data-preloader]');
  const ring = document.querySelector('[data-ring]');
  const pct = document.querySelector('[data-pct]');
  if (!pre) return;
  lockScroll();
  const CIRC = 276.5;
  let val = 0;
  const tick = setInterval(() => {
    val = Math.min(100, val + Math.random() * 16 + 5);
    pct.textContent = Math.floor(val);
    ring.style.strokeDashoffset = CIRC * (1 - val / 100);
    if (val >= 100) {
      clearInterval(tick);
      setTimeout(() => { pre.classList.add('is-done'); unlockScroll(); }, 420);
    }
  }, 130);
})();

/* ─── Cursor personalizado ─── */
const cursor = document.querySelector('[data-cursor]');
const cursorTxt = document.querySelector('[data-cursor-txt]');
(() => {
  if (!cursor || !window.matchMedia('(hover: hover)').matches) return;
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();
  const hoverables = 'a, button, .proc, .g, .svcmenu__card';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
  });
})();

/* ─── Header: ocultar al bajar, fondo al subir ─── */
const header = document.querySelector('[data-header]');
let lastY = 0;
function headerOnScroll(y) {
  if (y > 120 && y > lastY + 2) header.classList.add('is-hidden');
  else if (y < lastY - 2 || y <= 120) header.classList.remove('is-hidden');
  header.classList.toggle('is-bg', y > 120 && y < lastY);
  lastY = y;
}

/* ─── Dropdown de servicios (desktop) ─── */
(() => {
  const menu = document.querySelector('[data-svcmenu]');
  const btn = document.querySelector('[data-svcmenu-btn]');
  if (!menu || !btn) return;
  const open = () => menu.classList.add('is-open');
  const close = () => menu.classList.remove('is-open');
  btn.addEventListener('mouseenter', open);
  btn.addEventListener('click', () => menu.classList.toggle('is-open'));
  menu.querySelector('[data-svcmenu-close]').addEventListener('click', close);
  menu.querySelector('[data-svcmenu-overlay]').addEventListener('click', close);
  menu.addEventListener('mouseleave', close);
  menu.querySelectorAll('[data-svc-go]').forEach(card => {
    card.addEventListener('click', () => {
      close();
      setService(+card.dataset.svcGo);
    });
  });
})();

/* ─── Menú móvil overlay ─── */
(() => {
  const menu = document.querySelector('[data-menu]');
  const burger = document.querySelector('[data-burger]');
  if (!menu || !burger) return;
  burger.addEventListener('click', () => { menu.classList.add('is-open'); lockScroll(); });
  const close = () => { menu.classList.remove('is-open'); unlockScroll(); };
  menu.querySelector('[data-menu-close]').addEventListener('click', close);
  menu.querySelectorAll('[data-menu-link]').forEach(a => a.addEventListener('click', close));
})();

/* ─── Hero: el panel derecho se expande con clip-path ─── */
const heroWrap = document.querySelector('[data-hero]');
const hero = heroWrap?.querySelector('.hero');
const heroPanel = document.querySelector('[data-hero-panel]');
const heroTitle2 = document.querySelector('[data-hero-title2]');
function heroOnScroll(y) {
  if (!heroWrap || !isDesktop()) return;
  const range = window.innerHeight * 0.9;
  const p = clamp(y / range, 0, 1);
  const ease = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  heroPanel.style.clipPath = `inset(0 0 0 ${50 - 50 * ease}%)`;
  hero.classList.toggle('is-expanded', p > 0.55);
  const tx = 62 - 135 * ease;
  heroTitle2.style.transform = `translate(${tx}vw, -50%)`;
  heroTitle2.style.opacity = clamp(p * 2.6 - 0.12, 0, 1);
}

/* ─── Texto que se rellena con el scroll ─── */
const fillEl = document.querySelector('[data-fill]');
function fillOnScroll() {
  if (!fillEl) return;
  const r = fillEl.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
  fillEl.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
}

/* ─── Servicios: slider controlado por scroll ─── */
const svcSection = document.querySelector('[data-services]');
const svcImgs = document.querySelectorAll('[data-svc-images] .services__img');
const svcLists = document.querySelectorAll('[data-svc-lists] ul');
const svcDescs = document.querySelectorAll('[data-svc-descs] p');
const svcThumbs = document.querySelectorAll('[data-svc-thumbs] img');
const svcTitles = document.querySelectorAll('[data-svc-titles] p');
const svcNavBtns = document.querySelectorAll('[data-svc-nav] button');
let svcIdx = -1;

function setService(i) {
  if (i === svcIdx || i < 0 || i > 3) return;
  svcIdx = i;
  [svcImgs, svcLists, svcDescs, svcThumbs, svcTitles, svcNavBtns].forEach(group =>
    group.forEach((el, j) => el.classList.toggle('is-active', j === i)));
}
function servicesOnScroll() {
  if (!svcSection || !isDesktop()) return;
  const r = svcSection.getBoundingClientRect();
  if (r.top > 0 || r.bottom < window.innerHeight) return;
  const total = r.height - window.innerHeight;
  const p = clamp(-r.top / total, 0, 0.999);
  setService(Math.floor(p * 4));
}
svcNavBtns.forEach((btn, i) => btn.addEventListener('click', () => setService(i)));
setService(0);

/* ─── Tecnología: lista sticky con contador ─── */
const techSection = document.querySelector('[data-tech]');
const techImgs = document.querySelectorAll('[data-tech-images] img');
const techItems = document.querySelectorAll('[data-tech-list] .tech__item');
const techNum = document.querySelector('[data-tech-num]');
let techIdx = -1;
function setTech(i) {
  if (i === techIdx || i < 0 || i >= techItems.length) return;
  techIdx = i;
  techImgs.forEach((el, j) => el.classList.toggle('is-active', j === i));
  techItems.forEach((el, j) => el.classList.toggle('is-active', j === i));
  techNum.textContent = String(i + 1).padStart(2, '0');
}
function techOnScroll() {
  if (!techSection || !isDesktop()) return;
  const r = techSection.getBoundingClientRect();
  const total = r.height - window.innerHeight;
  if (total <= 0) return;
  const p = clamp(-r.top / total, 0, 0.999);
  setTech(Math.floor(p * techItems.length));
}
setTech(0);

/* ─── Parallax (banner + pre-footer) ─── */
function makeParallax(selector, amount) {
  const el = document.querySelector(selector);
  if (!el) return () => {};
  return () => {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
    el.style.transform = `translateY(${(p - 0.5) * amount}%)`;
  };
}
const bannerParallax = makeParallax('[data-parallax]', 14);
const prefooterParallax = makeParallax('[data-parallax2]', 10);

/* ─── Scroll maestro ─── */
function onScroll() {
  const y = window.scrollY;
  headerOnScroll(y);
  heroOnScroll(y);
  fillOnScroll();
  servicesOnScroll();
  techOnScroll();
  bannerParallax();
  prefooterParallax();
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ─── Reveals (IntersectionObserver) ─── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal, .reveal-img').forEach(el => io.observe(el));

/* ─── Contadores animados ─── */
const ioCount = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    ioCount.unobserve(e.target);
    const el = e.target, target = +el.dataset.count, dur = 1600, t0 = performance.now();
    (function step(t) {
      const p = clamp((t - t0) / dur, 0, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString('es-MX');
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => ioCount.observe(el));

/* ─── Typewriter (doctor) ─── */
(() => {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  const words = ['resultados excepcionales', 'un trato honesto', 'atención sin dolor', 'sonrisas memorables'];
  let wi = 0, ci = 0, deleting = false;
  (function type() {
    const word = words[wi];
    el.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) { ci++; setTimeout(type, 65); }
    else if (!deleting) { deleting = true; setTimeout(type, 2200); }
    else if (ci > 0) { ci--; setTimeout(type, 30); }
    else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 350); }
  })();
})();

/* ─── Testimonios: tabs, contador, flechas y zonas de clic ─── */
(() => {
  const nav = document.querySelectorAll('[data-tst-nav] button');
  const slides = document.querySelectorAll('[data-tst-slides] .tst');
  const counter = document.querySelector('[data-tst-counter]');
  const zone = document.querySelector('[data-tst-zone]');
  if (!nav.length) return;
  let idx = 0, timer;

  function restartRing(btn) {
    const fg = btn.querySelector('[data-ring-fg]');
    fg.style.animation = 'none';
    void fg.offsetWidth;
    fg.style.animation = '';
  }
  function go(i) {
    idx = (i + nav.length) % nav.length;
    nav.forEach((b, j) => b.classList.toggle('is-active', j === idx));
    slides.forEach((s, j) => s.classList.toggle('is-active', j === idx));
    counter.textContent = String(idx + 1).padStart(2, '0');
    restartRing(nav[idx]);
    clearInterval(timer);
    timer = setInterval(() => go(idx + 1), 6000);
  }
  nav.forEach((btn, i) => btn.addEventListener('click', () => go(i)));
  document.querySelector('[data-tst-prev]')?.addEventListener('click', () => go(idx - 1));
  document.querySelector('[data-tst-next]')?.addEventListener('click', () => go(idx + 1));

  // zonas de clic con cursor-flecha (desktop)
  if (zone && cursor && window.matchMedia('(hover: hover)').matches) {
    zone.addEventListener('mousemove', e => {
      if (!isDesktop()) return;
      const r = zone.getBoundingClientRect();
      const left = e.clientX < r.left + r.width / 2;
      cursor.classList.add('is-arrow');
      cursorTxt.textContent = left ? '←' : '→';
    });
    zone.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-arrow');
      cursorTxt.textContent = '';
    });
    zone.addEventListener('click', e => {
      if (!isDesktop()) return;
      const r = zone.getBoundingClientRect();
      e.clientX < r.left + r.width / 2 ? go(idx - 1) : go(idx + 1);
    });
  }
  go(0);
})();

/* ─── Inputs pill: flotar etiqueta si hay valor ─── */
document.querySelectorAll('.pill-input input').forEach(input => {
  input.addEventListener('input', () =>
    input.classList.toggle('has-value', input.value.trim() !== ''));
});

/* ─── Formulario → modal de éxito ─── */
(() => {
  const form = document.querySelector('[data-form]');
  const modal = document.querySelector('[data-success]');
  if (!form || !modal) return;
  const nameEl = document.querySelector('[data-success-name]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    nameEl.textContent = nombre
      ? `${nombre}, te contactaremos muy pronto para confirmar tu valoración.`
      : 'Te contactaremos muy pronto para confirmar tu valoración.';
    modal.classList.add('is-open');
    lockScroll();
    form.reset();
    form.querySelectorAll('input').forEach(i => i.classList.remove('has-value'));
  });
  modal.querySelector('[data-success-close]').addEventListener('click', () => {
    modal.classList.remove('is-open');
    unlockScroll();
  });
})();

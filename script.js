/* ═══ SOLÍS ATELIER DENTAL — efectos ═══ */

const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ─── Preloader con progreso ─── */
(() => {
  const pre = document.querySelector('[data-preloader]');
  const ring = document.querySelector('[data-ring]');
  const pct = document.querySelector('[data-pct]');
  if (!pre) return;
  document.body.style.overflow = 'hidden';
  const CIRC = 276.5;
  let val = 0;
  const tick = setInterval(() => {
    val = Math.min(100, val + Math.random() * 14 + 4);
    pct.textContent = Math.floor(val);
    ring.style.strokeDashoffset = CIRC * (1 - val / 100);
    if (val >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        pre.classList.add('is-done');
        document.body.style.overflow = '';
      }, 450);
    }
  }, 140);
})();

/* ─── Cursor personalizado ─── */
(() => {
  const cursor = document.querySelector('[data-cursor]');
  if (!cursor || !window.matchMedia('(hover: hover)').matches) return;
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .proc, .g').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
  });
})();

/* ─── Header: ocultar al bajar, fondo al subir ─── */
const header = document.querySelector('[data-header]');
let lastY = 0;
function headerOnScroll(y) {
  if (y > 120 && y > lastY) header.classList.add('is-hidden');
  else header.classList.remove('is-hidden');
  header.classList.toggle('is-bg', y > 120 && y <= lastY);
  lastY = y;
}

/* ─── Menú móvil overlay ─── */
(() => {
  const menu = document.querySelector('[data-menu]');
  const burger = document.querySelector('[data-burger]');
  if (!menu || !burger) return;
  burger.addEventListener('click', () => menu.classList.add('is-open'));
  menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.classList.remove('is-open'));
  menu.querySelectorAll('[data-menu-link]').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('is-open')));
})();

/* ─── Hero: panel derecho se expande con el scroll ─── */
const heroWrap = document.querySelector('[data-hero]');
const hero = heroWrap?.querySelector('.hero');
const heroPanel = document.querySelector('[data-hero-panel]');
const heroTitle2 = document.querySelector('[data-hero-title2]');
function heroOnScroll(y) {
  if (!heroWrap || !isDesktop()) return;
  const range = window.innerHeight * 0.9;               // altura del plash
  const p = clamp(y / range, 0, 1);                     // 0 → 1
  const ease = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  // el panel crece de 50vw a 100vw desplazándose a la izquierda
  heroPanel.style.left = (50 - 50 * ease) + 'vw';
  heroPanel.style.width = (50 + 50 * ease) + 'vw';
  hero.classList.toggle('is-expanded', p > 0.6);
  // título del panel: entra desde la derecha y sale a la izquierda
  const tx = 60 - 130 * ease;
  heroTitle2.style.transform = `translate(${tx}vw, -50%)`;
  heroTitle2.style.opacity = clamp(p * 2.4 - 0.15, 0, 1);
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
const svcTitles = document.querySelectorAll('[data-svc-titles] p');
const svcNavBtns = document.querySelectorAll('[data-svc-nav] button');
let svcIdx = -1;

function setService(i) {
  if (i === svcIdx) return;
  svcIdx = i;
  [svcImgs, svcLists, svcDescs, svcTitles, svcNavBtns].forEach(group =>
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

/* ─── Banner parallax ─── */
const parallax = document.querySelector('[data-parallax]');
function parallaxOnScroll() {
  if (!parallax) return;
  const r = parallax.parentElement.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) return;
  const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
  parallax.style.transform = `translateY(${(p - 0.5) * 14}%)`;
}

/* ─── Scroll maestro ─── */
const progress = document.querySelector('[data-progress]');
function onScroll() {
  const y = window.scrollY;
  headerOnScroll(y);
  heroOnScroll(y);
  fillOnScroll();
  servicesOnScroll();
  parallaxOnScroll();
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
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

/* ─── Testimonios: tabs con auto-avance ─── */
(() => {
  const nav = document.querySelectorAll('[data-tst-nav] button');
  const slides = document.querySelectorAll('[data-tst-slides] .tst');
  if (!nav.length) return;
  let idx = 0, timer;

  function restartRing(btn) {
    const fg = btn.querySelector('[data-ring-fg]');
    fg.style.animation = 'none';
    void fg.offsetWidth;            // reinicia la animación del anillo
    fg.style.animation = '';
  }
  function go(i) {
    idx = i % nav.length;
    nav.forEach((b, j) => b.classList.toggle('is-active', j === idx));
    slides.forEach((s, j) => s.classList.toggle('is-active', j === idx));
    restartRing(nav[idx]);
    clearInterval(timer);
    timer = setInterval(() => go(idx + 1), 6000);
  }
  nav.forEach((btn, i) => btn.addEventListener('click', () => go(i)));
  go(0);
})();

/* ─── Inputs pill: flotar etiqueta si hay valor ─── */
document.querySelectorAll('.pill-input input').forEach(input => {
  input.addEventListener('input', () =>
    input.classList.toggle('has-value', input.value.trim() !== ''));
});

/* ─── Formulario (demo) ─── */
(() => {
  const form = document.querySelector('[data-form]');
  const note = document.querySelector('[data-form-note]');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.nombre.value.trim() || 'Gracias';
    note.textContent = `${nombre}, recibimos tu solicitud. Te contactaremos muy pronto ✦`;
    form.reset();
    form.querySelectorAll('input').forEach(i => i.classList.remove('has-value'));
  });
})();

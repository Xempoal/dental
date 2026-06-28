// ===== Nav + progress =====
const nav = document.querySelector('[data-nav]');
const progress = document.querySelector('[data-progress]');
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 30);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const burger = document.querySelector('[data-burger]');
const links = document.querySelector('.nav__links');
burger?.addEventListener('click', () => links.classList.toggle('is-open'));
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('is-open')));

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal, .reveal-img, .reveal-up').forEach(el => io.observe(el));

// ===== Counters =====
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, dur = 1700, start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('es-MX');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(c => cio.observe(c));

// ===== Custom cursor =====
const cursor = document.querySelector('[data-cursor]');
let cx = 0, cy = 0, x = 0, y = 0;
const canHover = window.matchMedia('(hover: hover)').matches;
if (cursor && canHover) {
  window.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
  (function render() {
    x += (cx - x) * 0.2; y += (cy - y) * 0.2;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    requestAnimationFrame(render);
  })();
  document.querySelectorAll('a, button, .quote, .g').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

// ===== Service list floating preview =====
const preview = document.querySelector('[data-preview]');
const previewImg = document.querySelector('[data-preview-img]');
const svcList = document.querySelector('[data-svc]');
if (preview && svcList && canHover) {
  let px = 0, py = 0, tx = 0, ty = 0, active = false;
  svcList.querySelectorAll('.svc').forEach(li => {
    li.addEventListener('mouseenter', () => {
      previewImg.src = li.dataset.img;
      preview.classList.add('show');
      active = true;
      if (cursor) cursor.style.opacity = '0';
    });
    li.addEventListener('mouseleave', () => {
      preview.classList.remove('show');
      active = false;
      if (cursor) cursor.style.opacity = '1';
    });
  });
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function follow() {
    px += (tx - px) * 0.12; py += (ty - py) * 0.12;
    preview.style.left = px + 'px';
    preview.style.top = py + 'px';
    if (previewImg) previewImg.style.transform = `translate(${(tx - px) * 0.05}px, ${(ty - py) * 0.05}px) scale(1.05)`;
    requestAnimationFrame(follow);
  })();
}

// ===== Form (demo) =====
const form = document.querySelector('[data-form]');
const note = document.querySelector('[data-form-note]');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.querySelector('[name="nombre"]').value.trim() || 'paciente';
  note.textContent = `¡Gracias, ${name}! Te contactaremos muy pronto. (Demo — sin envío real)`;
  form.reset();
});

// ===== Anchor offset =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});

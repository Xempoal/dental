// ===== Nav scroll state + progress bar =====
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
links?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => links.classList.remove('is-open'))
);

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal, .reveal-img').forEach(el => io.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('es-MX');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => cio.observe(c));

// ===== Custom cursor =====
const cursor = document.querySelector('[data-cursor]');
if (cursor && window.matchMedia('(hover: hover)').matches) {
  let cx = 0, cy = 0, x = 0, y = 0;
  window.addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; });
  function render() {
    x += (cx - x) * 0.18; y += (cy - y) * 0.18;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  render();
  document.querySelectorAll('a, button, .card, .quote').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

// ===== Form (demo, no backend) =====
const form = document.querySelector('[data-form]');
const note = document.querySelector('[data-form-note]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.querySelector('[name="nombre"]').value.trim() || 'paciente';
  note.textContent = `¡Gracias, ${name}! Te contactaremos muy pronto. (Demo — sin envío real)`;
  form.reset();
});

// ===== Smooth anchor offset for fixed nav =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

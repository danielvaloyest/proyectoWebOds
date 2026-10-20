document.documentElement.classList.add('js');

const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting));
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => obs.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

const ruta = document.querySelector('.ruta');

const progreso = () => {
  const r = ruta.getBoundingClientRect();
  const p = (window.innerHeight * 0.6 - r.top) / r.height;
  ruta.style.setProperty('--progress', Math.min(1, Math.max(0, p)));
};

window.addEventListener('scroll', progreso, { passive: true });
window.addEventListener('resize', progreso);
progreso();
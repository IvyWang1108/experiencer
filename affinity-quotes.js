(() => {
  const bundle = document.querySelector('.affinity-bundle');
  if (!bundle) return;
  const slides = [...bundle.querySelectorAll('.affinity-slide')];
  const filters = [...bundle.querySelectorAll('[data-affinity-theme]')];
  const status = bundle.querySelector('[data-affinity-status]');
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    const theme = slides[current].dataset.theme;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.affinityTheme === theme)));
    status.textContent = `${current + 1} / ${slides.length} · ${slides[current].querySelector('.affinity-theme').textContent}`;
  }
  bundle.querySelector('[data-affinity-prev]').addEventListener('click', () => show(current - 1));
  bundle.querySelector('[data-affinity-next]').addEventListener('click', () => show(current + 1));
  filters.forEach(button => button.addEventListener('click', () => show(slides.findIndex(slide => slide.dataset.theme === button.dataset.affinityTheme))));
  // Manual rotation keeps reading time and focus under the visitor's control.
  show(0);
})();

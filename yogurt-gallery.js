(() => {
  const trigger = document.getElementById('yogurt-trigger');
  const gallery = document.getElementById('yogurt-gallery');
  if (!trigger || !gallery) return;
  trigger.addEventListener('click', () => {
    gallery.showModal();
    document.body.classList.add('yogurt-open');
  });
  document.getElementById('yogurt-close').addEventListener('click', () => gallery.close());
  gallery.addEventListener('close', () => {
    document.body.classList.remove('yogurt-open');
    trigger.focus({preventScroll:true});
  });
  gallery.addEventListener('click', event => {
    const rect = gallery.getBoundingClientRect();
    if (event.target === gallery && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) gallery.close();
  });
})();

/* Scroll-driven ocean movement; redraw only while the scroll position settles. */
(() => {
  const atmosphere = document.querySelector('.about-atmosphere');
  if (!atmosphere) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let target = 0;
  let frame = null;
  function paint() {
    atmosphere.style.setProperty('--wave-x', (Math.sin(current * Math.PI * 1.5) * 22).toFixed(2) + 'px');
    atmosphere.style.setProperty('--wave-y', (-current * 95).toFixed(2) + 'px');
    atmosphere.style.setProperty('--ripple-x', (Math.sin(current * Math.PI * 2) * 16).toFixed(2) + 'px');
    atmosphere.style.setProperty('--ocean-shift', (-current * 32).toFixed(2) + 'px');
  }
  function tick() {
    current += (target - current) * .12;
    if (Math.abs(target - current) < .0005) current = target;
    paint();
    frame = current === target ? null : requestAnimationFrame(tick);
  }
  function update() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    target = reduced.matches || distance <= 0 ? 0 : Math.max(0, Math.min(1, window.scrollY / distance));
    if (reduced.matches) {
      cancelAnimationFrame(frame);
      frame = null;
      current = 0;
      paint();
    } else if (frame === null) {
      frame = requestAnimationFrame(tick);
    }
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update, {passive:true});
  window.addEventListener('pageshow', update);
  reduced.addEventListener('change', update);
  update();
})();

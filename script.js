// =========================================================
// IVY WANG PORTFOLIO — shared behaviour
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- shared brand and simplified navigation ---- */
  const brandDescriptor = document.querySelector('.site-nav .mark span');
  if (brandDescriptor) brandDescriptor.textContent = ' — designer and researcher';
  document.querySelectorAll('.nav-links a[href="research.html"]').forEach(link => {
    link.closest('li')?.remove();
  });

  /* ---- mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('is-open'))
    );
  }

  /* ---- mark current nav item ---- */
  const page = document.body.dataset.page;
  const here = page === 'research' ? 'work' : page;
  if (here) {
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
      if (a.dataset.page === here) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---- footer year ---- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---- specimen cards: keyboard access + click-through ---- */
  document.querySelectorAll('.spec').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
    const label = card.querySelector('.spec-label');
    if (label) card.setAttribute('aria-label', `${label.textContent} — open case study`);

    const go = () => {
      const opened = window.open(
        card.dataset.href || 'case-study.html',
        '_blank',
        'noopener,noreferrer'
      );
      if (opened) opened.opener = null;
    };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  /* ---- homepage memory wheel: reveal the selected flashback beside it ---- */
  const memoryPanel = document.querySelector('.memory-panel');
  const memoryCards = [...document.querySelectorAll('.archive-board .spec')];
  if (memoryPanel && memoryCards.length) {
    const count = memoryPanel.querySelector('.memory-count');
    const category = memoryPanel.querySelector('.memory-category');
    const title = memoryPanel.querySelector('.memory-title');
    const description = memoryPanel.querySelector('.memory-description');
    const link = memoryPanel.querySelector('.memory-link');

    const recall = (card, index) => {
      count.textContent = `FLASHBACK ${String(index + 1).padStart(2, '0')} / ${String(memoryCards.length).padStart(2, '0')}`;
      category.textContent = card.querySelector('.spec-meta span:first-child')?.textContent || '';
      title.textContent = card.querySelector('.spec-label')?.textContent || '';
      description.textContent = card.querySelector('.spec-reveal')?.childNodes[0]?.textContent.trim() || card.querySelector('.spec-reveal')?.textContent || '';
      link.href = card.dataset.href || 'case-study.html';
      memoryCards.forEach(item => item.classList.toggle('is-recalled', item === card));
      memoryPanel.classList.remove('is-changing');
      void memoryPanel.offsetWidth;
      memoryPanel.classList.add('is-changing');
    };

    memoryCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => recall(card, index));
      card.addEventListener('focus', () => recall(card, index));
    });
    recall(memoryCards[0], 0);
  }

  /* ---- project links open separately; site navigation stays in place ---- */
  document.querySelectorAll('.entry-row, .case-nav a:first-child').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

});

/* SoftSpace — Ambient Morph × Editorial Reveal, linking Home and Lab. */
(() => {
  'use strict';

  const root = document.documentElement;
  const layer = document.querySelector('[data-page-transition]');
  if (!layer) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'softspace-page-transition';
  // The ambient morph and editorial reveal run together; navigation stays responsive.
  const EXIT_MS = 640;
  const ENTER_MS = 760;
  let navigationTimer = 0;

  const isHomePath = (pathname) => {
    const filename = pathname.split('/').pop().toLowerCase();
    return filename === '' || filename === 'index.html';
  };
  const isLabPath = (pathname) => pathname.split('/').pop().toLowerCase() === 'lab.html';

  const updateEditorialCopy = (direction) => {
    const title = layer.querySelector('.transition-title');
    const caption = layer.querySelector('.transition-caption');
    if (!title || !caption) return;
    if (direction === 'to-lab') {
      title.textContent = 'ENTERING THE LAB';
      caption.textContent = 'A SPACE FOR EXPERIMENTS, MOTION & CODE';
    } else {
      title.textContent = 'BACK TO THE STUDIO';
      caption.textContent = 'IDEAS, INTERFACES & DIGITAL EXPERIENCES';
    }
  };

  const clearTransitionState = () => {
    root.classList.remove(
      'ss-transition-entering',
      'ss-transition-entering-home',
      'ss-transition-entering-lab',
      'ss-transition-to-home',
      'ss-transition-to-lab'
    );
    document.dispatchEvent(new Event('softspace:transition-end'));
  };

  // A destination document begins covered by the ambient layer, then reveals its own page.
  if (root.classList.contains('ss-transition-entering')) {
    const direction = root.classList.contains('ss-transition-entering-lab') ? 'to-lab' : 'to-home';
    root.classList.add(direction === 'to-lab' ? 'ss-transition-to-lab' : 'ss-transition-to-home');
    document.dispatchEvent(new Event('softspace:transition-start'));
    updateEditorialCopy(direction);
    const finishEntry = (event) => {
      if (event && event.target !== layer) return;
      clearTimeout(entryTimer);
      clearTransitionState();
      layer.removeEventListener('animationend', finishEntry);
    };
    layer.addEventListener('animationend', finishEntry);
    const entryTimer = window.setTimeout(() => finishEntry(), ENTER_MS + 160);
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (reducedMotion.matches || root.classList.contains('ss-transition-leaving')) return;

    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self') || link.dataset.noTransition === 'true') return;

    let destination;
    try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
    if (destination.origin !== window.location.origin) return;

    const currentIsHome = isHomePath(window.location.pathname);
    const currentIsLab = isLabPath(window.location.pathname);
    const targetIsHome = isHomePath(destination.pathname);
    const targetIsLab = isLabPath(destination.pathname);
    const isHomeLabNavigation = (currentIsHome && targetIsLab) || (currentIsLab && targetIsHome);
    if (!isHomeLabNavigation || (destination.pathname === window.location.pathname && destination.hash === window.location.hash)) return;

    event.preventDefault();
    const direction = targetIsLab ? 'to-lab' : 'to-home';
    updateEditorialCopy(direction);

    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        path: destination.pathname,
        search: destination.search,
        direction,
        expires: Date.now() + 9000
      }));
    } catch (_) {
      // The outgoing reveal still works; destination navigation remains native if storage is blocked.
    }

    root.classList.remove('ss-transition-to-home', 'ss-transition-to-lab');
    root.classList.add('ss-transition-leaving', direction === 'to-lab' ? 'ss-transition-to-lab' : 'ss-transition-to-home');
    document.dispatchEvent(new Event('softspace:transition-start'));
    window.clearTimeout(navigationTimer);
    navigationTimer = window.setTimeout(() => window.location.assign(destination.href), EXIT_MS + 24);
  });
})();

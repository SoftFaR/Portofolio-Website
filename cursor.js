/* SoftSpace Signal Cursor — stable viewport tracking for links, controls and live canvases. */
(() => {
  'use strict';

  // `any-*` also supports hybrid laptops whose primary pointer is touch but
  // which still have a mouse or trackpad attached.
  const pointerSupport = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const motionSupport = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!pointerSupport.matches || motionSupport.matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'ss-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="ss-cursor-ring"></span>';
  document.body.append(cursor);

  const targetSelector = [
    'a[href]',
    'button:not(:disabled)',
    'summary',
    '[role="button"]',
    '[role="tab"]',
    '.cell',
    '.tile-btn',
    '.signal-canvas canvas',
    '#swarm-canvas',
    '.extra-canvas'
  ].join(',');
  const nativeSelector = 'input, textarea, select, [contenteditable="true"], [data-native-cursor]';
  let active = false;

  const setPosition = (px, py) => {
    cursor.style.left = `${px}px`;
    cursor.style.top = `${py}px`;
  };

  const hide = () => {
    active = false;
    cursor.classList.remove('is-visible', 'is-hover', 'is-canvas', 'is-pressed');
    document.body.classList.remove('ss-cursor-active');
  };

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

    const element = event.target instanceof Element ? event.target : null;
    if (!element || element.closest(nativeSelector)) {
      hide();
      return;
    }

    const target = element.closest(targetSelector);
    if (!target) {
      hide();
      return;
    }

    setPosition(event.clientX, event.clientY);

    const isCanvas = Boolean(target.matches('canvas') || target.closest('.signal-canvas, #swarm-canvas, .extra-canvas'));
    cursor.classList.toggle('is-hover', !isCanvas);
    cursor.classList.toggle('is-canvas', isCanvas);
    document.body.classList.add('ss-cursor-active');

    if (!active) {
      active = true;
      cursor.classList.add('is-visible');
    }
  };

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerdown', (event) => {
    if ((event.pointerType === 'mouse' || event.pointerType === 'pen') && active) {
      cursor.classList.add('is-pressed');
    }
  });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  document.addEventListener('pointercancel', hide);
  document.addEventListener('mouseleave', hide);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });
  window.addEventListener('blur', hide);

  // If a user changes accessibility preferences while the page is open,
  // immediately restore the native cursor rather than keeping a moving effect.
  motionSupport.addEventListener?.('change', (event) => {
    if (event.matches) hide();
  });
})();

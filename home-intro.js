/* SoftSpace — Digital Atmosphere first-entry introduction. */
(() => {
  'use strict';

  const root = document.documentElement;
  const intro = document.querySelector('[data-home-intro]');
  if (!intro || !root.classList.contains('ss-home-intro-active')) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || root.classList.contains('ss-transition-entering')) {
    root.classList.remove('ss-home-intro-active');
    intro.hidden = true;
    return;
  }

  let finished = false;
  let fallbackTimer = 0;
  let quickExitTimer = 0;

  const finishIntro = (resumeBackground = true) => {
    if (finished) return;
    finished = true;
    window.clearTimeout(fallbackTimer);
    window.clearTimeout(quickExitTimer);
    root.classList.remove('ss-home-intro-active', 'ss-home-intro-exiting');
    intro.hidden = true;
    if (resumeBackground) {
      document.dispatchEvent(new CustomEvent('softspace:transition-end', {
        detail: { source: 'home-intro' }
      }));
    }
    document.removeEventListener('softspace:transition-start', onExternalTransitionStart);
  };

  const onAnimationEnd = (event) => {
    if (event.target === intro && event.animationName === 'ss-atmosphere-exit') {
      finishIntro(true);
    }
    if (event.target === intro && event.animationName === 'ss-atmosphere-quick-exit') {
      finishIntro(false);
    }
  };

  const onExternalTransitionStart = (event) => {
    if (event.detail && event.detail.source === 'home-intro') return;
    if (finished) return;
    root.classList.add('ss-home-intro-exiting');
    quickExitTimer = window.setTimeout(() => finishIntro(false), 190);
  };

  intro.addEventListener('animationend', onAnimationEnd);
  document.addEventListener('softspace:transition-start', onExternalTransitionStart);

  // Pause the existing Home Canvas loops while the intro cover is visible.
  // The intro itself is CSS-only: no extra Canvas, WebGL, blur or filter pass.
  document.dispatchEvent(new CustomEvent('softspace:transition-start', {
    detail: { source: 'home-intro' }
  }));

  // Fallback if animation events are suppressed while a background tab is inactive.
  fallbackTimer = window.setTimeout(() => finishIntro(true), 2350);
})();

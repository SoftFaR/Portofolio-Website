/* Shared behaviour: navigation, menu, scroll reveals and the journey timeline. */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const root = document.documentElement;
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  const menu = $('#menu');
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
  const progressBar = $('#scroll-progress span');

  const links = $$('.menu a[href^="#"]');
  const sections = links.map((link) => document.getElementById(link.getAttribute('href').slice(1))).filter(Boolean);
  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => spy.observe(section));
  }

  const onScroll = () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 8);
      nav.classList.toggle('compact', window.scrollY > 44);
    }
    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }
    if (sections.length && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      setActive(sections[sections.length - 1].id);
    }
  };
  onScroll();
  let scrollFrame = 0;
  addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      onScroll();
    });
  }, { passive: true });

  // A restrained pointer light adds depth without following touch input.
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceQuery.matches) {
    let pointerTick = 0;
    addEventListener('pointermove', (event) => {
      if (pointerTick) return;
      pointerTick = requestAnimationFrame(() => {
        document.body.style.setProperty('--pointer-x', `${event.clientX}px`);
        document.body.style.setProperty('--pointer-y', `${event.clientY}px`);
        pointerTick = 0;
      });
    }, { passive: true });
  }

  const setMenu = (open, returnFocus) => {
    if (!menuBtn || !menu) return;
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
    if (!open && returnFocus) menuBtn.focus();
  };
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('open')) setMenu(false, true);
    });
    const desktopMenuQuery = matchMedia('(min-width:1040.01px)');
    const resetMenuOnDesktop = (event) => { if (event.matches) setMenu(false); };
    if (desktopMenuQuery.addEventListener) desktopMenuQuery.addEventListener('change', resetMenuOnDesktop);
    else if (desktopMenuQuery.addListener) desktopMenuQuery.addListener(resetMenuOnDesktop);

    document.addEventListener('pointerdown', (event) => {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(event.target) || menuBtn.contains(event.target)) return;
      setMenu(false);
    });
  }

  // If GSAP is unavailable, show every element that relies on it.
  if (!root.classList.contains('motion')) return;
  if (!gsap || !ScrollTrigger || reduceQuery.matches) {
    root.classList.remove('motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const reveal = (targets, trigger, options = {}) => {
    const elements = typeof targets === 'string' ? gsap.utils.toArray(targets) : targets;
    if (!elements.length) return;
    gsap.fromTo(elements,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: options.duration || 0.7,
        stagger: options.stagger || 0,
        ease: 'power3.out',
        scrollTrigger: { trigger, start: options.start || 'top 86%', once: true }
      }
    );
  };

  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.fromTo(element, { y: 22, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true }
    });
  });
  reveal('.cat', '#skills', { stagger: 0.07, start: 'top 78%' });
  reveal('.approach-steps li', '.approach-block', { stagger: 0.08, start: 'top 82%' });
  reveal('.proj', '#projects', { stagger: 0.07, start: 'top 80%' });

  $$('.j-year').forEach((yearGroup) => {
    const line = yearGroup.querySelector('.j-line');
    const yearNumber = yearGroup.querySelector('.j-year-num');
    const entries = yearGroup.querySelectorAll('.j-entry');
    const dots = yearGroup.querySelectorAll('.j-dot');

    if (line) {
      gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: yearGroup, start: 'top 82%', end: 'bottom 58%', scrub: 0.5 }
      });
    }
    if (yearNumber) {
      gsap.to(yearNumber, {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: yearGroup, start: 'top 84%', once: true }
      });
    }
    if (entries.length) {
      gsap.fromTo(entries, { y: 16, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: yearGroup, start: 'top 80%', once: true }
      });
    }
    if (dots.length) {
      gsap.to(dots, {
        scale: 1,
        duration: 0.42,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: yearGroup, start: 'top 80%', once: true }
      });
    }

    ScrollTrigger.create({
      trigger: yearGroup,
      start: 'top 58%',
      end: 'bottom 48%',
      toggleClass: { targets: yearGroup, className: 'is-active' }
    });
    entries.forEach((entry) => {
      ScrollTrigger.create({
        trigger: entry,
        start: 'top 68%',
        end: 'bottom 46%',
        toggleClass: { targets: entry, className: 'is-active' }
      });
    });
  });

  const refresh = () => ScrollTrigger.refresh();
  addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh).catch(() => {});
})();

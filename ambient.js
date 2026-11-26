/* SoftSpace ambient field — shared pointer-reactive background for Home and Lab.
   Home uses a brighter editorial palette and a scroll-reactive field; the darker Lab
   treatment intentionally keeps its original restrained blue/cyan atmosphere. */
(() => {
  const canvas = document.getElementById('ambient-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkTheme = document.body.classList.contains('lab-page');
  const state = {
    width: 0, height: 0, dpr: 1, raf: 0, lastFrame: 0,
    transitionPaused: document.documentElement.classList.contains('ss-transition-entering'),
    pointerX: .5, pointerY: .5, targetX: .5, targetY: .5,
    scroll: 0, targetScroll: 0, visible: true, ripples: []
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

  const palette = darkTheme ? {
    glowA: 'rgba(53, 102, 204, 0.12)', glowB: 'rgba(56, 182, 214, 0.09)',
    blue: '91, 140, 255', cyan: '64, 216, 230', lineAlpha: .09, dotAlpha: .30
  } : {
    glowA: 'rgba(53, 102, 204, 0.12)', glowB: 'rgba(56, 182, 214, 0.095)',
    blue: '53, 102, 204', cyan: '36, 157, 190', lineAlpha: .092, dotAlpha: .48
  };

  const drawGlow = (x, y, radius, color) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);
  };

  const waveY = (x, lineIndex, now) => {
    const { width, height } = state;
    const normalizedX = x / Math.max(1, width);
    const lineCount = width < 640 ? 15 : 25;
    const spacing = height / lineCount;
    const base = (lineIndex + .5) * spacing;
    const scrollPhase = darkTheme ? 0 : state.scroll * 3.6;
    const amplitude = width < 640 ? 10 : 19;
    const first = Math.sin(normalizedX * Math.PI * 2.1 + now * .00017 + lineIndex * .24 + scrollPhase) * amplitude;
    const second = Math.sin(normalizedX * Math.PI * 4.3 - now * .00011 + lineIndex * .41 - scrollPhase * .35) * amplitude * .38;
    const pointerBias = (state.pointerY - .5) * (darkTheme ? 10 : 18);
    const pointerWave = Math.sin(normalizedX * Math.PI * 2 + state.pointerX * 3.1 + scrollPhase) * pointerBias;
    const dx = normalizedX - state.pointerX;
    const dy = base / Math.max(1, height) - state.pointerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, 1 - distance / .48);
    const rippleBend = Math.sin(distance * 36 - now * .004) * influence * (darkTheme ? 7 : 15);
    return base + first + second + pointerWave + rippleBend;
  };

  const drawRipples = (now) => {
    for (let i = state.ripples.length - 1; i >= 0; i--) {
      const ripple = state.ripples[i];
      const age = now - ripple.start;
      if (age > 1300) { state.ripples.splice(i, 1); continue; }
      const progress = age / 1300;
      const radius = progress * ripple.max;
      ctx.globalAlpha = (1 - progress) * (darkTheme ? .36 : .42);
      ctx.strokeStyle = darkTheme ? 'rgba(64,216,230,1)' : 'rgba(53,102,204,1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = (1 - progress) * .15;
      ctx.beginPath(); ctx.arc(ripple.x, ripple.y, radius * .72, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const draw = (now) => {
    const { width, height } = state;
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);

    const driftX = (state.pointerX - .5) * width * (darkTheme ? .035 : .055);
    const driftY = (state.pointerY - .5) * height * (darkTheme ? .025 : .04);
    const scrollDrift = darkTheme ? 0 : state.scroll * height * .11;
    drawGlow(width * .16 + Math.sin(now * .00008) * width * .035 + driftX, height * .18 + driftY - scrollDrift * .12, Math.max(width, height) * .62, palette.glowA);
    drawGlow(width * .86 - Math.cos(now * .00007) * width * .04 - driftX, height * .78 - driftY + scrollDrift * .12, Math.max(width, height) * .58, palette.glowB);

    const compact = width < 640;
    const lineCount = compact ? 15 : 25;
    const step = compact ? 27 : 20;
    for (let line = 0; line < lineCount; line++) {
      ctx.beginPath();
      for (let x = -step; x <= width + step; x += step) {
        const y = waveY(x, line, now);
        if (x === -step) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const useCyan = line % 5 === 0;
      const waveAlpha = palette.lineAlpha * (useCyan ? .98 : .62 + (line % 4) * .12);
      ctx.strokeStyle = useCyan ? `rgba(${palette.cyan}, ${waveAlpha})` : `rgba(${palette.blue}, ${waveAlpha})`;
      ctx.lineWidth = useCyan ? 1.1 : .85;
      ctx.stroke();
    }

    // Moving nodes sit on the contour field and respond to scroll + pointer position.
    const particleCount = compact ? 22 : 42;
    for (let i = 0; i < particleCount; i++) {
      const line = (i * 7) % lineCount;
      const speed = 5 + (i % 4) * 1.8;
      const x = mod(i * (width / particleCount) + now * .001 * speed, width + 36) - 18;
      const y = waveY(x, line, now);
      const pulse = .62 + Math.sin(now * .0011 + i * 1.7) * .38;
      const radius = i % 6 === 0 ? (darkTheme ? 1.7 : 2) : 1.15;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = i % 4 === 0 ? `rgba(${palette.cyan}, ${palette.dotAlpha * pulse})` : `rgba(${palette.blue}, ${palette.dotAlpha * pulse})`;
      ctx.fill();
    }

    if (!compact) {
      const px = state.pointerX * width;
      const py = state.pointerY * height;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, darkTheme ? 190 : 250);
      glow.addColorStop(0, darkTheme ? 'rgba(64,216,230,.035)' : 'rgba(53,102,204,.085)');
      glow.addColorStop(.42, darkTheme ? 'rgba(91,140,255,.018)' : 'rgba(56,182,214,.032)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      if (!darkTheme) {
        ctx.strokeStyle = 'rgba(53,102,204,.15)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(px, py, 14 + Math.sin(now * .004) * 2, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(53,102,204,.38)'; ctx.fill();
      }
    }
    drawRipples(now);
  };

  const renderStatic = () => draw(0);
  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    if (!width || !height) return;
    if (width === state.width && height === state.height && dpr === state.dpr) return;
    state.width = width; state.height = height; state.dpr = dpr;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reducedMotion.matches) renderStatic();
  };
  const updateScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    state.targetScroll = clamp(window.scrollY / max, 0, 1);
  };
  const stop = () => {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0; state.lastFrame = 0;
  };
  const tick = (now) => {
    state.raf = 0;
    if (!state.visible || state.transitionPaused || document.visibilityState === 'hidden' || reducedMotion.matches) return;
    if (now - state.lastFrame >= 1000 / 30) {
      state.pointerX += (state.targetX - state.pointerX) * .045;
      state.pointerY += (state.targetY - state.pointerY) * .045;
      state.scroll += (state.targetScroll - state.scroll) * .055;
      draw(now);
      state.lastFrame = now;
    }
    state.raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (state.raf || !state.visible || state.transitionPaused || document.visibilityState === 'hidden' || reducedMotion.matches) return;
    state.raf = requestAnimationFrame(tick);
  };

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    state.targetX = clamp(event.clientX / Math.max(1, state.width), 0, 1);
    state.targetY = clamp(event.clientY / Math.max(1, state.height), 0, 1);
  }, { passive: true });
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' || darkTheme || reducedMotion.matches) return;
    state.ripples.push({ x: event.clientX, y: event.clientY, start: performance.now(), max: Math.min(240, Math.max(state.width, state.height) * .28) });
    if (state.ripples.length > 4) state.ripples.shift();
  }, { passive: true });
  window.addEventListener('blur', () => { state.targetX = .5; state.targetY = .5; });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stop(); else start();
  });
  document.addEventListener('softspace:transition-start', () => {
    state.transitionPaused = true;
    stop();
  });
  document.addEventListener('softspace:transition-end', () => {
    state.transitionPaused = false;
    updateScroll();
    start();
  });
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) { stop(); renderStatic(); } else start();
  });

  updateScroll(); resize(); renderStatic(); start();
})();

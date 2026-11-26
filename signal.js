/* SoftSpace Signal — a Canvas 2D field of drifting nodes, links and ripples. */
(() => {
  const canvas = document.getElementById('field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const state = {
    w: 0,
    h: 0,
    dpr: 1,
    nodes: [],
    ripples: [],
    pointer: null,
    progress: 0,
    started: 0,
    raf: 0,
    visible: true,
    transitionPaused: document.documentElement.classList.contains('ss-transition-entering')
  };

  const LINK_BASE = 150;
  const POINTER_BASE = 170;
  const RIPPLE_LIFE = 1100;
  const MAX_RIPPLES = 3;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

  // Build a jittered grid so the field reads as composed, not random confetti.
  const build = () => {
    const area = state.w * state.h;
    const target = state.w < 620 ? 44 : state.w < 1000 ? 66 : area > 380000 ? 104 : 84;
    const cols = Math.max(4, Math.round(Math.sqrt(target * (state.w / Math.max(1, state.h)))));
    const rows = Math.max(4, Math.ceil(target / cols));
    const nodes = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jx = (Math.random() - 0.5) * 0.62;
        const jy = (Math.random() - 0.5) * 0.62;
        const bx = ((c + 0.5 + jx) / cols) * state.w;
        const by = ((r + 0.5 + jy) / rows) * state.h;
        nodes.push({
          bx,
          by,
          x: bx,
          y: by,
          ox: 0,
          oy: 0,
          z: 0.42 + Math.random() * 0.58,
          phase: Math.random() * Math.PI * 2,
          amp: 4 + Math.random() * 9,
          p: 0,
          rp: 0
        });
      }
    }
    state.nodes = nodes;
    if (state.pointer) {
      state.pointer.x = clamp(state.pointer.x, 0, state.w);
      state.pointer.y = clamp(state.pointer.y, 0, state.h);
    }
  };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    if (w === state.w && h === state.h && dpr === state.dpr) return;
    state.w = w;
    state.h = h;
    state.dpr = dpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    if (reduce.matches) drawStatic();
    else if (!state.raf) render(performance.now());
  };

  const pointerFactor = (x, y, radius) => {
    if (!state.pointer) return 0;
    const dx = state.pointer.x - x;
    const dy = state.pointer.y - y;
    const d2 = dx * dx + dy * dy;
    if (d2 > radius * radius) return 0;
    return 1 - Math.sqrt(d2) / radius;
  };

  const updateNodes = (now) => {
    const t = now * 0.00016;
    const p = state.pointer;
    const pointerRadius = state.w < 620 ? 130 : POINTER_BASE;
    for (let i = 0; i < state.nodes.length; i++) {
      const n = state.nodes[i];
      let targetOx = 0;
      let targetOy = 0;

      if (p) {
        const dx = p.x - n.bx;
        const dy = p.y - n.by;
        const d = Math.hypot(dx, dy) || 1;
        if (d < pointerRadius) {
          const f = 1 - d / pointerRadius;
          const push = f * f * 26 * n.z;
          targetOx += (dx / d) * push;
          targetOy += (dy / d) * push;
        }
      }

      for (let k = 0; k < state.ripples.length; k++) {
        const ripple = state.ripples[k];
        const age = now - ripple.start;
        if (age < 0 || age > RIPPLE_LIFE) continue;
        const radius = (age / RIPPLE_LIFE) * ripple.max;
        const dx = n.bx - ripple.x;
        const dy = n.by - ripple.y;
        const d = Math.hypot(dx, dy) || 1;
        const band = Math.abs(d - radius);
        if (band < 46) {
          const f = (1 - band / 46) * (1 - age / RIPPLE_LIFE);
          targetOx += (dx / d) * f * 30;
          targetOy += (dy / d) * f * 30;
        }
      }

      n.ox += (targetOx - n.ox) * 0.1;
      n.oy += (targetOy - n.oy) * 0.1;
      n.x = n.bx + Math.cos(t * 1.35 + n.phase) * n.amp + n.ox;
      n.y = n.by + Math.sin(t * 1.1 + n.phase * 1.7) * n.amp * 0.8 + n.oy;
      n.p = pointerFactor(n.x, n.y, pointerRadius);
      n.rp = 0;
      for (let k = 0; k < state.ripples.length; k++) {
        const ripple = state.ripples[k];
        const age = now - ripple.start;
        if (age < 0 || age > RIPPLE_LIFE) continue;
        const radius = (age / RIPPLE_LIFE) * ripple.max;
        const d = Math.hypot(n.x - ripple.x, n.y - ripple.y);
        if (Math.abs(d - radius) < 46) {
          n.rp = Math.max(n.rp, 1 - Math.abs(d - radius) / 46);
        }
      }
    }
  };

  const drawLinks = (reveal, linkDistance) => {
    const link2 = linkDistance * linkDistance;
    ctx.lineWidth = 1;
    for (let i = 0; i < state.nodes.length; i++) {
      const a = state.nodes[i];
      for (let j = i + 1; j < state.nodes.length; j++) {
        const b = state.nodes[j];
        const dx = a.x - b.x;
        if (dx > linkDistance || dx < -linkDistance) continue;
        const dy = a.y - b.y;
        if (dy > linkDistance || dy < -linkDistance) continue;
        const d2 = dx * dx + dy * dy;
        if (d2 > link2) continue;
        const falloff = 1 - Math.sqrt(d2) / linkDistance;
        const heat = Math.max(a.p, b.p);
        const base = falloff * 0.24 * Math.min(a.z, b.z) * reveal;
        if (heat > 0.08) {
          ctx.globalAlpha = Math.min(0.62, base + heat * 0.5);
          ctx.strokeStyle = 'rgba(53,102,204,1)';
        } else if (Math.max(a.rp, b.rp) > 0.08) {
          ctx.globalAlpha = Math.min(0.5, base + Math.max(a.rp, b.rp) * 0.34);
          ctx.strokeStyle = 'rgba(56,182,214,1)';
        } else {
          ctx.globalAlpha = base;
          ctx.strokeStyle = 'rgba(64,78,104,1)';
        }
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  };

  const drawRipples = (now) => {
    ctx.lineWidth = 1;
    for (let i = state.ripples.length - 1; i >= 0; i--) {
      const ripple = state.ripples[i];
      const age = now - ripple.start;
      if (age < 0) continue;
      if (age > RIPPLE_LIFE) {
        state.ripples.splice(i, 1);
        continue;
      }
      const t = age / RIPPLE_LIFE;
      ctx.globalAlpha = (1 - t) * 0.5;
      ctx.strokeStyle = 'rgba(56,182,214,1)';
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, t * ripple.max, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = (1 - t) * 0.22;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, t * ripple.max * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawNodes = (reveal) => {
    for (let i = 0; i < state.nodes.length; i++) {
      const n = state.nodes[i];
      const radius = (0.85 + n.z * 1.55) * (0.6 + reveal * 0.4);
      if (n.p > 0.12) {
        ctx.fillStyle = 'rgba(53,102,204,1)';
        ctx.globalAlpha = 0.55 + n.p * 0.45;
      } else if (n.rp > 0.12) {
        ctx.fillStyle = 'rgba(56,182,214,1)';
        ctx.globalAlpha = 0.5 + n.rp * 0.45;
      } else {
        ctx.fillStyle = 'rgba(58,72,100,1)';
        ctx.globalAlpha = (0.26 + n.z * 0.46) * reveal;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawPointer = () => {
    if (!state.pointer) return;
    const p = state.pointer;
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = 'rgba(53,102,204,1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = 'rgba(53,102,204,1)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
    ctx.fill();
  };

  const render = (now) => {
    if (!state.w || !state.h) return;
    if (!state.started) state.started = now;
    const elapsed = now - state.started;
    const raw = clamp(elapsed / 1200, 0, 1);
    state.progress = easeOut(raw);
    const reveal = 0.25 + state.progress * 0.75;
    const linkDistance = Math.min(LINK_BASE, Math.max(104, state.w * 0.36));

    updateNodes(now);
    ctx.clearRect(0, 0, state.w, state.h);
    drawLinks(reveal, linkDistance);
    drawRipples(now);
    drawNodes(reveal);
    drawPointer();
    ctx.globalAlpha = 1;
  };

  const drawStatic = () => {
    state.started = 0;
    state.progress = 1;
    updateNodes(0);
    ctx.clearRect(0, 0, state.w, state.h);
    drawLinks(1, Math.min(LINK_BASE, Math.max(104, state.w * 0.36)));
    drawNodes(1);
    ctx.globalAlpha = 1;
  };

  const loop = (now) => {
    state.raf = requestAnimationFrame(loop);
    render(now);
  };

  const sync = () => {
    const go = state.visible && !state.transitionPaused && !document.hidden && !reduce.matches;
    if (go && !state.raf) {
      state.started = 0;
      state.raf = requestAnimationFrame(loop);
    }
    if (!go && state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  };

  const localPoint = (e) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMove = (e) => {
    if (reduce.matches || state.transitionPaused) return;
    state.pointer = localPoint(e);
    if (!state.raf) render(performance.now());
  };

  const onLeave = () => {
    if (state.transitionPaused) return;
    state.pointer = null;
    if (!state.raf) render(performance.now());
  };

  const onDown = (e) => {
    if (reduce.matches || state.transitionPaused) return;
    const point = localPoint(e);
    state.pointer = point;
    state.ripples.push({
      x: point.x,
      y: point.y,
      start: performance.now(),
      max: Math.min(190, Math.max(state.w, state.h) * 0.55)
    });
    if (state.ripples.length > MAX_RIPPLES) state.ripples.shift();
    if (!state.raf) render(performance.now());
  };

  canvas.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerdown', onDown, { passive: true });
  canvas.addEventListener('pointerleave', onLeave, { passive: true });
  canvas.addEventListener('pointercancel', onLeave, { passive: true });

  document.addEventListener('visibilitychange', sync);
  document.addEventListener('softspace:transition-start', () => { state.transitionPaused = true; sync(); });
  document.addEventListener('softspace:transition-end', () => { state.transitionPaused = false; sync(); });
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      if (state.raf) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      }
      drawStatic();
    } else {
      state.started = 0;
      sync();
    }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      sync();
    }, { rootMargin: '80px' }).observe(canvas);
  }
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      const before = state.w;
      resize();
      if (!state.raf && before) {
        if (reduce.matches) drawStatic();
        else render(performance.now());
      }
    }).observe(canvas);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }

  resize();
  if (reduce.matches) drawStatic();
  else sync();
})();

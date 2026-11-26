/* SoftSpace Lab — expressive, pointer-led Canvas studies.
   Extra scenes are instantiated lazily and animate only while their tab is active. */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const isID = () => document.documentElement.lang === 'id';
  const localText = (english, indonesian) => isID() ? indonesian : english;
  const random = (min, max) => min + Math.random() * (max - min);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;
  const hex = (h, s, l) => {
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const create = (key, onState) => {
    const canvas = document.querySelector(`#canvas-${key}`);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return null;

    const toggle = document.querySelector(`#${key}-toggle`);
    const reset = document.querySelector(`#${key}-reset`);
    const readout = document.querySelector(`#readout-${key}`);
    const audioButton = key === 'visualizer' ? document.querySelector('#visualizer-audio') : null;
    const audioNote = key === 'visualizer' ? document.querySelector('#visualizer-note') : null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let active = false;
    let running = !reduceMotion.matches;
    let transitionPaused = document.documentElement.classList.contains('ss-transition-entering');
    let raf = 0;
    let lastFrame = 0;
    let pointer = { x: .5, y: .5, inside: false, down: false };
    let phase = random(0, Math.PI * 2);
    let seed = Math.random() * 10000;
    let particles = [];
    let wells = [];
    let sources = [];
    let audioContext = null;
    let oscillator = null;
    let gain = null;
    let analyser = null;
    let audioData = null;
    let timeData = null;
    let gravityAmount = .42;
    let trails = true;
    let genMode = 'flow';
    let phraseIndex = 0;
    let colorHue = 214;
    let colorSat = 72;
    let selectedSwatch = 2;
    let visualMode = 'radial';
    let lowCanvas = null;
    let lowCtx = null;
    let lowImage = null;
    let lowWidth = 0;
    let lowHeight = 0;

    const phrases = ['SOFTSPACE', 'MAKE IT MOVE', 'STAY CURIOUS', 'FORM / FEEL / FLOW'];
    const idPhrases = ['SOFTSPACE', 'GERAKKAN', 'TETAP PENASARAN', 'BENTUK / RASA / ALIRAN'];
    const say = (value) => { if (onState) onState(value); };
    const updateReadout = (value) => { if (readout) readout.textContent = value; };
    const updateButtons = () => {
      if (toggle) {
        toggle.textContent = running ? localText('Pause', 'Jeda') : localText('Resume', 'Lanjutkan');
        toggle.setAttribute('aria-pressed', String(!running));
      }
    };
    const background = () => {
      ctx.fillStyle = '#070E1B';
      ctx.fillRect(0, 0, width, height);
    };
    const label = (text, x = 22, y = height - 22, color = 'rgba(176,194,222,.58)') => {
      ctx.save();
      ctx.font = '10px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.letterSpacing = '1px';
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.restore();
    };
    const rounded = (x, y, w, h, r) => {
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
    };

    const resetParticles = () => {
      const count = Math.max(68, Math.min(150, Math.round(width * height / 4500)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: random(0, width), y: random(0, height),
        px: 0, py: 0, vx: random(-.65, .65), vy: random(-.4, .7),
        r: random(1.1, 2.8), hue: 184 + (i % 5) * 8, mass: random(.65, 1.45)
      }));
      particles.forEach((p) => { p.px = p.x; p.py = p.y; });
      wells = [{ x: width * .5, y: height * .53, mass: 1.15, pulse: 0 }];
      updateReadout(isID() ? `${particles.length} objek · 01 medan` : `${particles.length} bodies · 01 field`);
    };

    const resetSources = () => {
      sources = [
        { x: width * .28, y: height * .48, phase: 0, hue: 198 },
        { x: width * .69, y: height * .43, phase: 1.8, hue: 218 },
        { x: width * .52, y: height * .72, phase: 3.6, hue: 184 }
      ];
      updateReadout(isID() ? `${sources.length} sumber gelombang` : `${sources.length} wave sources`);
    };

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (key === 'gravity') resetParticles();
      if (key === 'waves') resetSources();
      if (key === 'generative') seed = Math.random() * 10000;
      if (key === 'waves') {
        lowCanvas = document.createElement('canvas');
        lowWidth = Math.max(150, Math.floor(width / 4));
        lowHeight = Math.max(90, Math.floor(height / 4));
        lowCanvas.width = lowWidth;
        lowCanvas.height = lowHeight;
        lowCtx = lowCanvas.getContext('2d');
        lowImage = lowCtx.createImageData(lowWidth, lowHeight);
      }
      draw(performance.now());
    };

    // 04 — Gravity: a particle field with persistent trails and movable attractors.
    const drawGravity = (time) => {
      if (!trails) background();
      else {
        ctx.fillStyle = 'rgba(7,14,27,.19)';
        ctx.fillRect(0, 0, width, height);
      }

      // Subtle coordinate grid.
      ctx.save();
      ctx.strokeStyle = 'rgba(123,151,193,.055)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
      ctx.restore();

      const px = pointer.x * width;
      const py = pointer.y * height;
      particles.forEach((p) => {
        p.px = p.x; p.py = p.y;
        p.vy += .012 + gravityAmount * .055;
        wells.forEach((well) => {
          const dx = well.x - p.x;
          const dy = well.y - p.y;
          const d2 = Math.max(180, dx * dx + dy * dy);
          const force = Math.min(1.35, (well.mass * 1150) / d2);
          p.vx += dx / Math.sqrt(d2) * force * .23;
          p.vy += dy / Math.sqrt(d2) * force * .23;
        });
        if (pointer.inside) {
          const dx = px - p.x;
          const dy = py - p.y;
          const d2 = Math.max(140, dx * dx + dy * dy);
          const force = Math.min(1.1, 900 / d2);
          p.vx += dx / Math.sqrt(d2) * force * .11;
          p.vy += dy / Math.sqrt(d2) * force * .11;
        }
        p.vx *= .995;
        p.vy *= .995;
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 4.2) { p.vx *= 4.2 / speed; p.vy *= 4.2 / speed; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;
        if (p.y > height + 12) { p.y = -12; p.x = random(0, width); }
        if (p.y < -18) p.y = height + 12;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue},82%,70%,${.2 + Math.min(.5, speed * .1)})`;
        ctx.lineWidth = p.r * .72;
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue},88%,76%,.9)`;
        ctx.shadowColor = `hsla(${p.hue},90%,65%,.7)`;
        ctx.shadowBlur = 9;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      wells.forEach((well) => {
        const pulse = 1 + Math.sin(time * .0022 + well.pulse) * .08;
        const radius = 18 * pulse;
        const glow = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, 72);
        glow.addColorStop(0, 'rgba(64,216,230,.2)');
        glow.addColorStop(1, 'rgba(64,216,230,0)');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(well.x, well.y, 72, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(64,216,230,.48)'; ctx.lineWidth = 1;
        for (let ring = 0; ring < 3; ring++) {
          ctx.beginPath(); ctx.arc(well.x, well.y, radius + ring * 13, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = '#A8F4F3'; ctx.beginPath(); ctx.arc(well.x, well.y, 2.6, 0, Math.PI * 2); ctx.fill();
      });
      if (pointer.inside) {
        ctx.beginPath(); ctx.arc(px, py, 30 + Math.sin(time * .004) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(91,140,255,.62)'; ctx.lineWidth = 1; ctx.stroke();
      }
      updateReadout(isID() ? `${particles.length} objek · ${String(wells.length).padStart(2, '0')} pusat gravitasi` : `${particles.length} bodies · ${String(wells.length).padStart(2, '0')} wells`);
      label(localText('FIELD / GRAVITY · CLICK TO ADD A WELL', 'MEDAN / GRAVITASI · KLIK UNTUK MENAMBAH PUSAT'));
    };

    // 05 — Generative art: animated flow ribbons with selectable composition modes.
    const drawGenerative = (time) => {
      ctx.fillStyle = 'rgba(7,14,27,.22)';
      ctx.fillRect(0, 0, width, height);
      const t = time * .00022 + seed * .001;
      const cx = width * (.5 + (pointer.x - .5) * (pointer.inside ? .22 : .04));
      const cy = height * (.5 + (pointer.y - .5) * (pointer.inside ? .22 : .04));
      const count = genMode === 'bloom' ? 210 : 148;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < count; i++) {
        const base = i / count * Math.PI * 2;
        const band = i % 7;
        let x; let y; let length; let strokeHue;
        if (genMode === 'orbit') {
          const radius = 35 + band * 15 + (i % 3) * 4;
          x = cx + Math.cos(base) * radius;
          y = cy + Math.sin(base) * radius * .72;
          length = 92 + band * 5;
          strokeHue = 190 + band * 12;
        } else if (genMode === 'bloom') {
          const radius = 10 + band * 8;
          x = cx + Math.cos(base * 3.2) * radius;
          y = cy + Math.sin(base * 3.2) * radius;
          length = 110;
          strokeHue = 182 + (i % 42) * 2.5;
        } else {
          const radius = 18 + band * 8;
          x = cx + Math.cos(base) * radius;
          y = cy + Math.sin(base) * radius;
          length = 116;
          strokeHue = 188 + band * 13;
        }
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let step = 0; step < length; step++) {
          const nx = x / Math.max(1, width);
          const ny = y / Math.max(1, height);
          const pointerAngle = pointer.inside ? Math.atan2(pointer.y * height - y, pointer.x * width - x) : 0;
          let angle;
          if (genMode === 'orbit') angle = base + Math.sin(step * .045 + t + band) * .68 + Math.cos(nx * 8 + t) * .32;
          else if (genMode === 'bloom') angle = base + Math.sin(step * .052 + t * 1.4 + band) * 1.05 + Math.cos(step * .018 + i) * .42;
          else angle = base + Math.sin(step * .055 + t + seed + band) * .88 + Math.cos(nx * 11 - ny * 7 + t) * .62;
          if (pointer.inside) angle += Math.sin(pointerAngle - angle) * .12;
          x += Math.cos(angle) * (genMode === 'bloom' ? 2.15 : 2.55);
          y += Math.sin(angle) * (genMode === 'bloom' ? 2.15 : 2.55);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${strokeHue + Math.sin(t + i) * 12},88%,${55 + band * 2}%,${.12 + (i % 5) * .045})`;
        ctx.lineWidth = i % 13 === 0 ? 1.6 : .78;
        ctx.stroke();
      }
      ctx.restore();
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 105);
      core.addColorStop(0, 'rgba(64,216,230,.15)');
      core.addColorStop(1, 'rgba(64,216,230,0)');
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, 105, 0, Math.PI * 2); ctx.fill();
      const modeLabel = isID() ? ({ flow: 'ALIRAN', orbit: 'ORBIT', bloom: 'MEKAR' }[genMode]) : genMode.toUpperCase();
      label(`${localText('KOMPOSISI', 'KOMPOSISI')} / ${modeLabel} · SEED ${Math.round(seed).toString(16).toUpperCase()}`);
      updateReadout(isID() ? `${modeLabel} · ${count} jalur` : `${genMode} · ${count} paths`);
    };

    // 06 — Waves: low-resolution interference field plus clickable point sources.
    const drawWaves = (time) => {
      if (!lowCtx || !lowImage) return;
      const t = time * .0022 + phase;
      if (!sources.length) {
        background();
        ctx.strokeStyle = 'rgba(91,140,255,.13)'; ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 34) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
        for (let y = 0; y < height; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
        ctx.fillStyle = 'rgba(195,215,242,.72)'; ctx.textAlign = 'center';
        ctx.font = '500 15px "Space Grotesk", sans-serif'; ctx.fillText(localText('No active wave sources', 'Tidak ada sumber gelombang aktif'), width * .5, height * .48);
        ctx.fillStyle = 'rgba(143,163,196,.65)'; ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(localText('CLICK ANYWHERE TO ADD A SOURCE', 'KLIK DI MANA SAJA UNTUK MENAMBAH SUMBER'), width * .5, height * .48 + 24);
        ctx.textAlign = 'left'; updateReadout(localText('No sources · click to add', 'Belum ada sumber · klik untuk menambahkan')); return;
      }
      const data = lowImage.data;
      const count = sources.length;
      for (let y = 0; y < lowHeight; y++) {
        for (let x = 0; x < lowWidth; x++) {
          const wx = x / lowWidth * width;
          const wy = y / lowHeight * height;
          let field = 0;
          sources.forEach((source) => {
            const distance = Math.hypot(wx - source.x, wy - source.y);
            field += Math.sin(distance * .052 - t * 2.6 + source.phase);
          });
          field = field / count;
          const v = (field + 1) * .5;
          const ridge = Math.pow(Math.max(0, Math.cos(field * Math.PI * 2.2)), 5);
          const i = (y * lowWidth + x) * 4;
          data[i] = Math.round(7 + v * 20 + ridge * 28);
          data[i + 1] = Math.round(14 + v * 56 + ridge * 126);
          data[i + 2] = Math.round(28 + v * 112 + ridge * 190);
          data[i + 3] = 255;
        }
      }
      lowCtx.putImageData(lowImage, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(lowCanvas, 0, 0, width, height);
      // Isolines and source rings make the wave mechanics legible.
      sources.forEach((source, index) => {
        ctx.save();
        ctx.strokeStyle = `hsla(${source.hue},88%,72%,.30)`;
        ctx.fillStyle = `hsla(${source.hue},88%,75%,.95)`;
        ctx.lineWidth = 1;
        for (let ring = 0; ring < 4; ring++) {
          const radius = mod(time * .035 + ring * 54 + source.phase * 20, Math.max(width, height) * .72);
          ctx.globalAlpha = .32 - ring * .055;
          ctx.beginPath(); ctx.arc(source.x, source.y, radius, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(source.x, source.y, 4.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(source.x, source.y, 12 + Math.sin(t + index) * 2, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      });
      if (pointer.inside) {
        ctx.strokeStyle = 'rgba(226,245,255,.42)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(pointer.x * width, pointer.y * height, 18 + Math.sin(t * 2) * 3, 0, Math.PI * 2); ctx.stroke();
      }
      label(localText('INTERFERENCE FIELD / CLICK TO ADD A SOURCE', 'MEDAN INTERFERENSI / KLIK UNTUK MENAMBAH SUMBER'));
      updateReadout(isID() ? `${sources.length} sumber aktif` : `${sources.length} active source${sources.length === 1 ? '' : 's'}`);
    };

    // 07 — Terrain: layered mountain silhouettes, atmospheric sun and drifting cloud lines.
    const drawTerrain = (time) => {
      const t = time * .00013;
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#091326'); sky.addColorStop(.52, '#142B43'); sky.addColorStop(1, '#17243A');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
      const sunX = width * (.72 - (pointer.inside ? (pointer.x - .5) * .035 : 0));
      const sunY = height * .29;
      const sunR = Math.min(width, height) * .105;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3.5);
      sunGlow.addColorStop(0, 'rgba(115,190,224,.2)'); sunGlow.addColorStop(1, 'rgba(115,190,224,0)');
      ctx.fillStyle = sunGlow; ctx.beginPath(); ctx.arc(sunX, sunY, sunR * 3.5, 0, Math.PI * 2); ctx.fill();
      const sun = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
      sun.addColorStop(0, '#F0D9B5'); sun.addColorStop(1, '#A7BDD3');
      ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.fill();
      // Atmospheric cloud traces.
      for (let c = 0; c < 7; c++) {
        const x = mod(c * width * .22 + time * (.006 + c * .00035), width + 180) - 90;
        const y = height * (.14 + (c % 3) * .09);
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + 35, y - 8, x + 78, y + 7, x + 132, y - 2);
        ctx.strokeStyle = `rgba(176,207,228,${.06 + (c % 3) * .018})`; ctx.lineWidth = 1.1; ctx.stroke();
      }
      const layers = [
        { color: '#162B43', base: .56, amp: 36, freq: 1.6, speed: .7, parallax: .02 },
        { color: '#1C3B55', base: .65, amp: 46, freq: 2.5, speed: .95, parallax: .045 },
        { color: '#28536A', base: .77, amp: 58, freq: 3.5, speed: 1.18, parallax: .075 },
        { color: '#3A6878', base: .91, amp: 42, freq: 5.2, speed: 1.45, parallax: .12 }
      ];
      layers.forEach((layer, index) => {
        const shift = pointer.inside ? (pointer.x - .5) * width * layer.parallax : 0;
        ctx.beginPath(); ctx.moveTo(0, height);
        for (let x = 0; x <= width + 8; x += 4) {
          const n = (x + shift) / width;
          const rough = Math.sin(n * layer.freq * 6 + seed + t * layer.speed) * layer.amp * .42
            + Math.sin(n * layer.freq * 15 + seed * .3 - t * .6) * layer.amp * .18
            + Math.cos(n * layer.freq * 2.2 + seed * .6) * layer.amp * .4;
          const y = height * layer.base - rough;
          if (x === 0) ctx.lineTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height); ctx.closePath();
        const fill = ctx.createLinearGradient(0, height * layer.base - layer.amp, 0, height);
        fill.addColorStop(0, layer.color); fill.addColorStop(1, '#091523');
        ctx.fillStyle = fill; ctx.fill();
        if (index === 3) {
          ctx.strokeStyle = 'rgba(160,220,222,.26)'; ctx.lineWidth = 1;
          ctx.beginPath();
          for (let x = 0; x <= width + 8; x += 4) {
            const n = (x + shift) / width;
            const rough = Math.sin(n * layer.freq * 6 + seed + t * layer.speed) * layer.amp * .42
              + Math.sin(n * layer.freq * 15 + seed * .3 - t * .6) * layer.amp * .18
              + Math.cos(n * layer.freq * 2.2 + seed * .6) * layer.amp * .4;
            const y = height * layer.base - rough;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      });
      // Sparse foreground lights.
      for (let i = 0; i < 28; i++) {
        const x = mod(i * 83 + seed, width);
        const y = height * (.79 + (i % 7) * .027) + Math.sin(t * 2 + i) * 2;
        ctx.fillStyle = `rgba(180,229,220,${.12 + (i % 4) * .07})`;
        ctx.fillRect(x, y, i % 6 === 0 ? 2 : 1, i % 6 === 0 ? 2 : 1);
      }
      label(localText('SYNTHETIC LANDSCAPE / MOVE TO SHIFT THE RIDGES', 'BENTANG SINTETIS / GERAKKAN UNTUK MENGGESER PEGUNUNGAN'));
      updateReadout(localText('4 depth layers · live', '4 lapisan kedalaman · aktif'));
    };

    // 08 — Type in Motion: individual glyphs move with a spring-like pointer field.
    const drawType = (time) => {
      background();
      const gridGap = 42;
      ctx.strokeStyle = 'rgba(125,155,202,.055)'; ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridGap) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += gridGap) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
      const phrase = isID() ? idPhrases[phraseIndex] : phrases[phraseIndex];
      const fontSize = Math.min(width / Math.max(phrase.length * .58, 5), height * .27, 112);
      ctx.font = `700 ${fontSize}px "Space Grotesk", Arial, sans-serif`;
      ctx.textBaseline = 'middle';
      const chars = [...phrase];
      const widths = chars.map((char) => ctx.measureText(char).width + fontSize * .015);
      const total = widths.reduce((sum, n) => sum + n, 0);
      let x = (width - total) * .5;
      const centerY = height * .49;
      const px = pointer.x * width;
      const py = pointer.y * height;
      chars.forEach((char, index) => {
        const glyphW = widths[index];
        const baseX = x + glyphW * .5;
        const dx = baseX - px;
        const dy = centerY - py;
        const distance = Math.hypot(dx, dy) || 1;
        const influence = pointer.inside ? Math.max(0, 1 - distance / 240) : 0;
        const force = influence * influence * 48;
        const wave = Math.sin(time * .0015 + index * .58) * 4.5;
        const gx = baseX + (dx / distance) * force;
        const gy = centerY + wave + (dy / distance) * force * .42;
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(Math.sin(time * .001 + index * .3) * .014 + (dx / distance) * influence * .035);
        ctx.textAlign = 'center';
        ctx.shadowColor = `hsla(${190 + index * 5},90%,66%,${.22 + influence * .35})`;
        ctx.shadowBlur = 18 + influence * 16;
        ctx.fillStyle = `hsl(${190 + index * 5},75%,${70 + influence * 12}%)`;
        ctx.fillText(char, 0, 0);
        ctx.restore();
        x += glyphW;
      });
      ctx.textAlign = 'center';
      ctx.font = '10px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = 'rgba(163,183,215,.6)';
      ctx.fillText(`${localText('KINETIC TYPE', 'TIPOGRAFI GERAK')} / 0${phraseIndex + 1}`, width * .5, height * .72);
      if (pointer.inside) {
        ctx.beginPath(); ctx.arc(px, py, 24 + Math.sin(time * .004) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(64,216,230,.35)'; ctx.lineWidth = 1; ctx.stroke();
      }
      label(localText('MOVE TO DISPLACE · CLICK TO CHANGE THE WORD', 'GERAKKAN UNTUK MENGGESER · KLIK UNTUK MENGGANTI KATA'));
      updateReadout(`${localText('phrase', 'frasa')} 0${phraseIndex + 1} / ${phrases.length}`);
    };

    // 09 — Color laboratory: live harmony board with a cursor-selected hue and copyable swatches.
    const colorSwatches = () => {
      const offsets = [0, 18, 36, 180, 204, 216];
      const sats = [Math.max(30, colorSat - 12), colorSat, Math.min(96, colorSat + 8), colorSat, Math.max(34, colorSat - 4), Math.min(96, colorSat + 12)];
      return offsets.map((offset, i) => ({
        hue: mod(colorHue + offset, 360),
        sat: sats[i],
        light: [22, 38, 54, 64, 48, 76][i],
        hex: hex(mod(colorHue + offset, 360), sats[i], [22, 38, 54, 64, 48, 76][i])
      }));
    };
    const drawColor = (time) => {
      const hue = pointer.inside ? Math.round(pointer.x * 360) : colorHue;
      const sat = pointer.inside ? Math.round(42 + (1 - pointer.y) * 48) : colorSat;
      colorHue = mod(hue, 360); colorSat = clamp(sat, 36, 92);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `hsla(${colorHue},${colorSat}%,25%,.32)`);
      gradient.addColorStop(.52, '#0A1424');
      gradient.addColorStop(1, `hsla(${mod(colorHue + 155, 360)},70%,24%,.3)`);
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
      const colors = colorSwatches();
      const gap = 12;
      const margin = Math.max(22, width * .045);
      const y = height * .28;
      const h = height * .36;
      const total = width - margin * 2;
      const w = (total - gap * (colors.length - 1)) / colors.length;
      colors.forEach((color, index) => {
        const x = margin + index * (w + gap);
        const active = index === selectedSwatch;
        const cardY = y + (active ? -10 : 0);
        const cardH = h + (active ? 20 : 0);
        ctx.save();
        ctx.shadowColor = active ? color.hex : 'rgba(0,0,0,.25)';
        ctx.shadowBlur = active ? 24 : 8;
        rounded(x, cardY, w, cardH, 12);
        ctx.fillStyle = `hsl(${color.hue} ${color.sat}% ${color.light}%)`; ctx.fill();
        ctx.restore();
        ctx.strokeStyle = active ? 'rgba(234,244,255,.9)' : 'rgba(180,202,230,.18)';
        ctx.lineWidth = active ? 1.5 : 1;
        rounded(x, cardY, w, cardH, 12); ctx.stroke();
        ctx.fillStyle = 'rgba(219,233,249,.68)';
        ctx.font = '9px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillText(`0${index + 1}`, x + 2, cardY + cardH + 19);
        ctx.fillStyle = active ? '#F3F7FF' : 'rgba(170,190,220,.65)';
        ctx.fillText(color.hex, x + 2, cardY + cardH + 35);
      });
      ctx.fillStyle = '#EAF1FC';
      ctx.font = '500 20px "Space Grotesk", sans-serif';
      ctx.fillText(`${localText('HUE', 'CORAK')} / ${String(colorHue).padStart(3, '0')}°`, margin, height * .16);
      ctx.fillStyle = 'rgba(159,180,212,.7)';
      ctx.font = '10px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'right'; ctx.fillText(`${localText('SATURATION', 'SATURASI')} ${colorSat}%`, width - margin, height * .16); ctx.textAlign = 'left';
      label(localText('MOVE TO TUNE · CLICK A SWATCH TO SELECT / COPY', 'GERAKKAN UNTUK MENGATUR · KLIK SWATCH UNTUK MEMILIH / MENYALIN'));
      updateReadout(colors[selectedSwatch].hex);
    };

    // 10 — Sound visualizer: radial spectrum and a live waveform from Web Audio or a synthetic signal.
    const drawVisualizer = (time) => {
      background();
      const cx = width * .5;
      const cy = height * .49;
      const baseR = Math.min(width, height) * .17;
      const bars = 96;
      const t = time * .001;
      const values = [];
      if (analyser && audioData) analyser.getByteFrequencyData(audioData);
      for (let i = 0; i < bars; i++) {
        let value;
        if (analyser && audioData) value = audioData[Math.floor(i / bars * audioData.length)] / 255;
        else value = .08 + Math.abs(Math.sin(t * 1.7 + i * .21) * Math.cos(i * .12 - t * .6)) * .38;
        values.push(value);
      }
      ctx.save();
      ctx.translate(cx, cy);
      const rotation = t * .08;
      ctx.rotate(rotation);
      if (visualMode === 'radial') {
        values.forEach((value, i) => {
          const angle = i / bars * Math.PI * 2;
          const inner = baseR + 12;
          const outer = inner + 14 + value * Math.min(width, height) * .25;
          const x1 = Math.cos(angle) * inner;
          const y1 = Math.sin(angle) * inner;
          const x2 = Math.cos(angle) * outer;
          const y2 = Math.sin(angle) * outer;
          const hue = 184 + i / bars * 62;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${hue},90%,${62 + value * 18}%,${.42 + value * .52})`;
          ctx.lineWidth = 1.5 + value * 1.4; ctx.stroke();
        });
        ctx.beginPath(); ctx.arc(0, 0, baseR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(91,140,255,.46)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, baseR - 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(64,216,230,.2)'; ctx.stroke();
      }
      ctx.restore();
      if (visualMode === 'waveform') {
        const sampleCount = Math.max(160, Math.floor(width * .7));
        if (analyser && timeData) analyser.getByteTimeDomainData(timeData);
        const waveGradient = ctx.createLinearGradient(0, cy - 90, width, cy + 90);
        waveGradient.addColorStop(0, 'rgba(91,140,255,.95)');
        waveGradient.addColorStop(.52, 'rgba(64,216,230,.98)');
        waveGradient.addColorStop(1, 'rgba(91,140,255,.65)');
        ctx.beginPath();
        for (let i = 0; i < sampleCount; i++) {
          const x = i / (sampleCount - 1) * width;
          let sample;
          if (analyser && timeData) sample = (timeData[Math.floor(i / sampleCount * timeData.length)] - 128) / 128;
          else sample = Math.sin(i * .065 + t * 2.2) * .46 + Math.sin(i * .021 - t * 1.3) * .22;
          const y = cy + sample * Math.min(height * .42, 156);
          if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = waveGradient; ctx.lineWidth = 2.2;
        ctx.shadowColor = 'rgba(64,216,230,.62)'; ctx.shadowBlur = 18; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(143,163,196,.16)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke();
        for (let x = 0; x < width; x += 48) { ctx.beginPath(); ctx.moveTo(x, cy - 4); ctx.lineTo(x, cy + 4); ctx.stroke(); }
      } else {
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.25);
        core.addColorStop(0, 'rgba(64,216,230,.12)'); core.addColorStop(1, 'rgba(64,216,230,0)');
        ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, baseR * 1.25, 0, Math.PI * 2); ctx.fill();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#EAF1FC'; ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.fillText(analyser ? localText('SIGNAL LIVE', 'SINYAL AKTIF') : localText('SIGNAL / IDLE', 'SINYAL / SIAGA'), cx, cy + 5);
        ctx.fillStyle = 'rgba(157,180,212,.68)'; ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(localText('RADIAL MODE', 'MODE RADIAL'), cx, cy + 22);
        ctx.textAlign = 'left';
      }
      label(analyser ? localText('WEB AUDIO / FREQUENCY DATA', 'WEB AUDIO / DATA FREKUENSI') : localText('SYNTHETIC SIGNAL / AUDIO NOT CONNECTED', 'SINYAL SINTETIS / AUDIO BELUM TERHUBUNG'));
      if (pointer.inside) {
        ctx.beginPath(); ctx.arc(pointer.x * width, pointer.y * height, 22, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(64,216,230,.3)'; ctx.lineWidth = 1; ctx.stroke();
      }
      updateReadout(analyser ? localText('Audio live', 'Audio aktif') : localText('Synthetic signal', 'Sinyal sintetis'));
    };

    const draw = (time) => {
      if (!width || !height) return;
      if (key === 'gravity') drawGravity(time);
      else if (key === 'generative') drawGenerative(time);
      else if (key === 'waves') drawWaves(time);
      else if (key === 'terrain') drawTerrain(time);
      else if (key === 'typemotion') drawType(time);
      else if (key === 'colorlab') drawColor(time);
      else if (key === 'visualizer') drawVisualizer(time);
    };

    const loop = (time) => {
      raf = 0;
      if (!active || !running || transitionPaused || reduceMotion.matches || document.hidden) return;
      if (time - lastFrame < 1000 / 30) { raf = requestAnimationFrame(loop); return; }
      lastFrame = time;
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      running = true; updateButtons();
      if (active && !transitionPaused && !reduceMotion.matches && !raf) raf = requestAnimationFrame(loop);
      else if (!transitionPaused) draw(performance.now());
      say('Running');
    };
    const pause = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0; updateButtons(); draw(performance.now()); say('Paused');
    };

    const resetScene = () => {
      phase = 0;
      seed = Math.random() * 10000;
      pointer.inside = false;

      if (key === 'gravity') {
        resetParticles();
        gravityAmount = .42;
        trails = true;
        const force = document.querySelector('#gravity-force');
        const forceOut = document.querySelector('#gravity-force-o');
        const trailButton = document.querySelector('#gravity-trails');
        if (force) force.value = '42';
        if (forceOut) forceOut.value = '42%';
        if (trailButton) trailButton.textContent = 'Trails: On';
      }
      if (key === 'waves') resetSources();
      if (key === 'typemotion') phraseIndex = 0;
      if (key === 'colorlab') {
        colorHue = 214;
        colorSat = 72;
        selectedSwatch = 2;
      }
      if (key === 'generative') {
        genMode = 'flow';
        document.querySelectorAll('[data-generative-mode]').forEach((button) => {
          const selected = button.dataset.generativeMode === genMode;
          button.classList.toggle('is-active', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
      }
      if (key === 'visualizer') {
        stopAudio();
        visualMode = 'radial';
        const modeButton = document.querySelector('#visualizer-mode');
        if (modeButton) modeButton.textContent = 'Mode: Radial';
      }

      draw(performance.now());
      say('Reset');
    };

    const copyColor = async () => {
      const color = colorSwatches()[selectedSwatch].hex;
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(color);
        else {
          const field = document.createElement('textarea'); field.value = color;
          field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field); field.select();
          const copied = document.execCommand('copy'); field.remove();
          if (!copied) throw new Error('Clipboard unavailable');
        }
        updateReadout(`${color} · copied`); say('Color copied');
      } catch (_) { updateReadout(color); say('Select a swatch to read its value'); }
    };

    const stopAudio = () => {
      if (oscillator) { try { oscillator.stop(); } catch (_) {} oscillator.disconnect(); oscillator = null; }
      if (gain) { gain.disconnect(); gain = null; }
      analyser = null; audioData = null; timeData = null;
      if (audioButton) audioButton.innerHTML = '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>Start audio';
      if (audioNote) audioNote.textContent = 'Audio is off. Start audio to connect a generated tone to the visualizer.';
      updateReadout('Synthetic signal');
    };
    const startAudio = async () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) { if (audioNote) audioNote.textContent = 'Web Audio is not supported in this browser. The visual signal remains available.'; return; }
      try {
        if (!audioContext) audioContext = new AudioContext();
        await audioContext.resume();
        oscillator = audioContext.createOscillator();
        gain = audioContext.createGain(); analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        audioData = new Uint8Array(analyser.frequencyBinCount);
        timeData = new Uint8Array(analyser.fftSize);
        oscillator.type = 'sine'; oscillator.frequency.value = 110;
        gain.gain.value = .014;
        oscillator.connect(gain); gain.connect(analyser); analyser.connect(audioContext.destination);
        oscillator.start();
        if (audioButton) audioButton.innerHTML = '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>Stop audio';
        if (audioNote) audioNote.textContent = 'A quiet generated tone is connected. Move the pointer horizontally to tune it.';
        say('Audio live');
      } catch (_) { stopAudio(); if (audioNote) audioNote.textContent = 'Audio could not start. Check browser audio permissions.'; }
    };

    if (toggle) toggle.addEventListener('click', () => running ? pause() : start());
    if (reset) reset.addEventListener('click', resetScene);
    if (audioButton) audioButton.addEventListener('click', () => oscillator ? stopAudio() : startAudio());

    // Purpose-built controls for each study.
    if (key === 'gravity') {
      const force = document.querySelector('#gravity-force');
      const forceOut = document.querySelector('#gravity-force-o');
      const trailButton = document.querySelector('#gravity-trails');
      if (force) force.addEventListener('input', () => {
        gravityAmount = Number(force.value) / 100;
        if (forceOut) forceOut.value = `${force.value}%`;
      });
      if (trailButton) trailButton.addEventListener('click', () => {
        trails = !trails; trailButton.textContent = `Trails: ${trails ? 'On' : 'Off'}`;
      });
    }
    if (key === 'generative') {
      document.querySelectorAll('[data-generative-mode]').forEach((button) => {
        button.addEventListener('click', () => {
          genMode = button.dataset.generativeMode;
          document.querySelectorAll('[data-generative-mode]').forEach((item) => {
            item.setAttribute('aria-pressed', String(item === button));
            item.classList.toggle('is-active', item === button);
          });
          draw(performance.now()); say(`${genMode} composition`);
        });
      });
    }
    if (key === 'waves') {
      const clearButton = document.querySelector('#waves-clear');
      if (clearButton) clearButton.addEventListener('click', () => { sources = []; updateReadout('No sources · click to add'); draw(performance.now()); });
    }
    if (key === 'typemotion') {
      const next = document.querySelector('#typemotion-next');
      if (next) next.addEventListener('click', () => { phraseIndex = (phraseIndex + 1) % phrases.length; draw(performance.now()); say('New phrase'); });
    }
    if (key === 'colorlab') {
      const randomButton = document.querySelector('#colorlab-random');
      const copyButton = document.querySelector('#colorlab-copy');
      if (randomButton) randomButton.addEventListener('click', () => { colorHue = Math.round(random(0, 359)); colorSat = Math.round(random(48, 90)); selectedSwatch = Math.floor(random(0, 6)); draw(performance.now()); say('New palette'); });
      if (copyButton) copyButton.addEventListener('click', copyColor);
    }
    if (key === 'visualizer') {
      const modeButton = document.querySelector('#visualizer-mode');
      if (modeButton) modeButton.addEventListener('click', () => {
        visualMode = visualMode === 'radial' ? 'waveform' : 'radial';
        modeButton.textContent = visualMode === 'radial' ? 'Mode: Radial' : 'Mode: Waveform';
        draw(performance.now());
      });
    }

    canvas.addEventListener('pointermove', (event) => {
      if (transitionPaused) return;
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
        inside: true,
        down: event.buttons > 0
      };
      if (key === 'visualizer' && oscillator && audioContext) oscillator.frequency.setTargetAtTime(75 + pointer.x * 430, audioContext.currentTime, .08);
      if (!running) draw(performance.now());
    }, { passive: true });
    canvas.addEventListener('pointerleave', () => {
      pointer.inside = false; pointer.down = false;
      if (!running) draw(performance.now());
    });
    canvas.addEventListener('pointerdown', (event) => {
      if (transitionPaused) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (key === 'gravity') {
        if (event.button === 2) {
          if (wells.length > 1) wells.pop();
        } else {
          wells.push({ x, y, mass: random(.75, 1.45), pulse: random(0, Math.PI * 2) });
          if (wells.length > 5) wells.shift();
        }
      } else if (key === 'generative') {
        seed = Math.random() * 10000;
      } else if (key === 'waves') {
        sources.push({ x, y, phase: random(0, Math.PI * 2), hue: random(184, 236) });
        if (sources.length > 7) sources.shift();
      } else if (key === 'terrain') {
        seed = Math.random() * 10000;
      } else if (key === 'typemotion') {
        phraseIndex = (phraseIndex + 1) % phrases.length;
      } else if (key === 'colorlab') {
        const margin = Math.max(22, width * .045);
        const gap = 12;
        const total = width - margin * 2;
        const cardW = (total - gap * 5) / 6;
        selectedSwatch = clamp(Math.floor((x - margin) / (cardW + gap)), 0, 5);
        copyColor();
      } else if (key === 'visualizer') {
        visualMode = visualMode === 'radial' ? 'waveform' : 'radial';
        const button = document.querySelector('#visualizer-mode');
        if (button) button.textContent = visualMode === 'radial' ? 'Mode: Radial' : 'Mode: Waveform';
      }
      draw(performance.now());
    });
    canvas.addEventListener('contextmenu', (event) => { if (key === 'gravity') event.preventDefault(); });

    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(canvas);
    else addEventListener('resize', fit, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
      else if (!document.hidden && active && running && !transitionPaused && !reduceMotion.matches && !raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener('softspace:transition-start', () => {
      transitionPaused = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (key === 'visualizer') stopAudio();
    });
    document.addEventListener('softspace:transition-end', () => {
      transitionPaused = false;
      if (active && running && !reduceMotion.matches && !raf) raf = requestAnimationFrame(loop);
    });


    document.addEventListener('softspace:language-change', () => {
      if (active && width && height) draw(performance.now());
    });

    fit(); updateButtons(); say('Ready');
    return {
      activate() {
        active = true; fit();
        if (running && !transitionPaused && !reduceMotion.matches && !raf) raf = requestAnimationFrame(loop);
        else if (!transitionPaused) draw(performance.now());
        say(oscillator ? 'Audio live' : (running ? 'Running' : 'Paused'));
      },
      deactivate() {
        active = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (key === 'visualizer') stopAudio();
      },
      resize: fit,
      state: () => oscillator ? 'Audio live' : (running ? 'Running' : 'Paused')
    };
  };

  window.SoftSpaceLabExtras = { create };
})();

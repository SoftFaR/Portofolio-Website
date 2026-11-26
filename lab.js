/* Lab workbench: Swarm (Canvas 2D), Sound Grid (Web Audio), Code Playground (sandboxed iframe). */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  const canAnimate = () => Boolean(gsap) && !reduce.matches;

  const topStatus = $('#wb-status-text');
  const metaState = $('#wb-state');
  const setState = (text) => {
    if (topStatus) topStatus.textContent = text;
    if (metaState) metaState.textContent = text;
  };

  // ---------------------------------------------------------------- Swarm
  const initSwarm = (onState) => {
    const canvas = $('#swarm-canvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const countEl = $('#sw-count');
    const speedEl = $('#sw-speed');
    const countOut = $('#sw-count-o');
    const speedOut = $('#sw-speed-o');
    const playBtn = $('#sw-play');
    const resetBtn = $('#sw-reset');
    const readout = $('#sw-boids');
    const presetBtns = $$('[data-swarm-preset]');
    const PRESETS = {
      calm: { count: 60, speed: 2 },
      dense: { count: 160, speed: 3 },
      dynamic: { count: 110, speed: 5.5 }
    };
    const RANGE = 58;
    const APART = 22;
    const POINTER_RADIUS = 200;
    const RIPPLE_LIFE = 950;
    const MAX_RIPPLES = 3;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let boids = [];
    let pointer = null;
    let ripples = [];
    let running = !reduce.matches;
    let visible = false;
    let active = false;
    let transitionPaused = document.documentElement.classList.contains('ss-transition-entering');
    let raf = 0;

    const makeBoid = () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * Math.max(1, w),
        y: Math.random() * Math.max(1, h),
        vx: Math.cos(angle) * 1.6,
        vy: Math.sin(angle) * 1.6,
        z: 0.5 + Math.random() * 0.5
      };
    };

    const fit = () => {
      const target = Number(countEl.value);
      while (boids.length < target) boids.push(makeBoid());
      if (boids.length > target) boids.length = target;
      if (readout) readout.textContent = `${boids.length} boids`;
    };

    const size = () => {
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = canvas.clientWidth;
      const nextH = canvas.clientHeight;
      if (!nextW || !nextH) return;
      if (nextW === w && nextH === h && nextDpr === dpr) return;
      w = nextW;
      h = nextH;
      dpr = nextDpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      boids.forEach((b) => {
        b.x = ((b.x % w) + w) % w;
        b.y = ((b.y % h) + h) % h;
      });
      ctx.fillStyle = '#060C17';
      ctx.fillRect(0, 0, w, h);
    };

    const paint = (clear) => {
      if (!w || !h) return;
      if (clear) {
        ctx.fillStyle = '#060C17';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = 'rgba(6,12,23,0.24)';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.lineCap = 'round';
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        const speed = Math.hypot(b.vx, b.vy) || 1;
        const near = pointer ? Math.max(0, 1 - Math.hypot(pointer.x - b.x, pointer.y - b.y) / 170) : 0;
        let hot = near > 0.1;
        let rippleHeat = 0;
        for (let k = 0; k < ripples.length; k++) {
          const ripple = ripples[k];
          const age = performance.now() - ripple.start;
          if (age < 0 || age > RIPPLE_LIFE) continue;
          const radius = (age / RIPPLE_LIFE) * ripple.max;
          const band = Math.abs(Math.hypot(b.x - ripple.x, b.y - ripple.y) - radius);
          if (band < 34) {
            rippleHeat = Math.max(rippleHeat, 1 - band / 34);
            hot = true;
          }
        }
        ctx.globalAlpha = (0.22 + b.z * 0.5) + near * 0.24;
        ctx.strokeStyle = hot ? 'rgba(64,216,230,1)' : 'rgba(143,163,196,1)';
        ctx.lineWidth = 0.8 + b.z * 0.9 + rippleHeat * 0.5;
        const length = Math.min(10, 3 + speed * 1.5);
        const nx = b.vx / speed;
        const ny = b.vy / speed;
        ctx.beginPath();
        ctx.moveTo(b.x - nx * length, b.y - ny * length);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        if (b.z > 0.84) {
          ctx.globalAlpha = 0.5 + near * 0.4;
          ctx.fillStyle = hot ? 'rgba(64,216,230,1)' : 'rgba(195,210,236,1)';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let k = 0; k < ripples.length; k++) {
        const ripple = ripples[k];
        const age = performance.now() - ripple.start;
        if (age < 0 || age > RIPPLE_LIFE) continue;
        const t = age / RIPPLE_LIFE;
        ctx.globalAlpha = (1 - t) * 0.45;
        ctx.strokeStyle = 'rgba(64,216,230,1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, t * ripple.max, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (pointer) {
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = 'rgba(91,140,255,1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = 'rgba(91,140,255,1)';
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (now) => {
      const maxSpeed = Number(speedEl.value);
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let ax = 0;
        let ay = 0;
        let cx = 0;
        let cy = 0;
        let avx = 0;
        let avy = 0;
        let neighbours = 0;

        for (let j = 0; j < boids.length; j++) {
          if (j === i) continue;
          const o = boids[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > RANGE * RANGE) continue;
          neighbours++;
          cx += o.x;
          cy += o.y;
          avx += o.vx;
          avy += o.vy;
          if (d2 < APART * APART && d2 > 0.01) {
            ax -= (dx / d2) * 44;
            ay -= (dy / d2) * 44;
          }
        }

        if (neighbours) {
          ax += (cx / neighbours - b.x) * 0.004 + (avx / neighbours - b.vx) * 0.05;
          ay += (cy / neighbours - b.y) * 0.004 + (avy / neighbours - b.vy) * 0.05;
        }

        if (pointer) {
          const dx = pointer.x - b.x;
          const dy = pointer.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < POINTER_RADIUS && d > 1) {
            ax += (dx / d) * 0.14;
            ay += (dy / d) * 0.14;
          }
        }

        for (let k = 0; k < ripples.length; k++) {
          const ripple = ripples[k];
          const age = now - ripple.start;
          if (age < 0 || age > RIPPLE_LIFE) continue;
          const radius = (age / RIPPLE_LIFE) * ripple.max;
          const dx = b.x - ripple.x;
          const dy = b.y - ripple.y;
          const d = Math.hypot(dx, dy) || 1;
          const band = Math.abs(d - radius);
          if (band < 40) {
            const force = (1 - band / 40) * (1 - age / RIPPLE_LIFE);
            ax += (dx / d) * force * 0.9;
            ay += (dy / d) * force * 0.9;
          }
        }

        b.vx += ax;
        b.vy += ay;
        const speed = Math.hypot(b.vx, b.vy) || 1;
        const limited = Math.max(0.6, Math.min(speed, maxSpeed));
        b.vx = (b.vx / speed) * limited;
        b.vy = (b.vy / speed) * limited;
        b.x = ((b.x + b.vx) % w + w) % w;
        b.y = ((b.y + b.vy) % h + h) % h;
      }

      for (let k = ripples.length - 1; k >= 0; k--) {
        if (now - ripples[k].start > RIPPLE_LIFE) ripples.splice(k, 1);
      }
    };

    const loop = (now) => {
      step(now);
      paint(false);
      raf = requestAnimationFrame(loop);
    };

    const sync = () => {
      const go = running && active && visible && !transitionPaused && !document.hidden;
      if (go && !raf) raf = requestAnimationFrame(loop);
      if (!go && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const localPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMove = (event) => {
      if (transitionPaused) return;
      pointer = localPoint(event);
      if (!raf) paint(true);
    };

    const onDown = (event) => {
      if (transitionPaused) return;
      pointer = localPoint(event);
      ripples.push({
        x: pointer.x,
        y: pointer.y,
        start: performance.now(),
        max: Math.min(240, Math.max(w, h) * 0.7)
      });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      if (!raf) paint(true);
    };

    const onLeave = () => {
      if (transitionPaused) return;
      pointer = null;
      if (!raf) paint(true);
    };

    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerdown', onDown, { passive: true });
    canvas.addEventListener('pointerleave', onLeave, { passive: true });
    canvas.addEventListener('pointerup', onLeave, { passive: true });
    canvas.addEventListener('pointercancel', onLeave, { passive: true });

    const updatePlay = () => {
      const label = playBtn.querySelector('span');
      const icon = playBtn.querySelector('i');
      if (label) label.textContent = running ? 'Pause' : 'Play';
      if (icon) icon.className = 'fa-solid ' + (running ? 'fa-pause' : 'fa-play');
      if (onState) onState(running ? 'Running' : 'Paused');
    };

    const clearPresets = () => presetBtns.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));

    countEl.addEventListener('input', () => {
      countOut.textContent = countEl.value;
      fit();
      if (!raf) paint(true);
    });
    speedEl.addEventListener('input', () => {
      speedOut.textContent = speedEl.value;
      clearPresets();
    });
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = PRESETS[btn.dataset.swarmPreset];
        if (!preset) return;
        countEl.value = String(preset.count);
        speedEl.value = String(preset.speed);
        countOut.textContent = countEl.value;
        speedOut.textContent = speedEl.value;
        presetBtns.forEach((item) => item.setAttribute('aria-pressed', String(item === btn)));
        fit();
        if (!raf) paint(true);
      });
    });
    playBtn.addEventListener('click', () => {
      running = !running;
      updatePlay();
      sync();
      if (!running) paint(true);
    });
    resetBtn.addEventListener('click', () => {
      boids = [];
      ripples = [];
      pointer = null;
      fit();
      paint(true);
    });

    document.addEventListener('visibilitychange', sync);
    document.addEventListener('softspace:transition-start', () => { transitionPaused = true; sync(); });
    document.addEventListener('softspace:transition-end', () => { transitionPaused = false; sync(); });
    reduce.addEventListener('change', () => {
      if (reduce.matches) {
        running = false;
        updatePlay();
        sync();
        paint(true);
      }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      }, { rootMargin: '80px' }).observe(canvas);
    } else {
      visible = true;
    }
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        size();
        if (!raf) paint(true);
      }).observe(canvas);
    }

    updatePlay();
    size();
    fit();
    paint(true);

    return {
      activate: () => {
        active = true;
        size();
        sync();
        if (!raf) paint(true);
        if (onState) onState(running ? 'Running' : 'Paused');
      },
      deactivate: () => {
        active = false;
        pointer = null;
        sync();
      },
      resize: () => {
        size();
        if (!raf) paint(true);
      },
      state: () => (running ? 'Running' : 'Paused')
    };
  };

  // ------------------------------------------------------------ Sound Grid
  const initSound = (onState) => {
    const seq = $('#seq');
    if (!seq) return null;
    const NOTES = [
      { name: 'C5', f: 523.25 },
      { name: 'A4', f: 440 },
      { name: 'G4', f: 392 },
      { name: 'E4', f: 329.63 }
    ];
    const STEPS = 8;
    const PATTERNS = {
      pulse: [[3, 0], [3, 4], [1, 2], [1, 6], [0, 4]],
      arp: [[3, 0], [2, 1], [1, 2], [0, 3], [3, 4], [2, 5], [1, 6], [0, 7]],
      sparse: [[0, 0], [2, 2], [3, 4], [1, 6]]
    };
    const playBtn = $('#sq-play');
    const clearBtn = $('#sq-clear');
    const tempo = $('#sq-tempo');
    const tempoOut = $('#sq-tempo-o');
    const vol = $('#sq-vol');
    const volOut = $('#sq-vol-o');
    const status = $('#sq-status');
    const stepEl = $('#sq-step');
    const stepsEl = $('#seq-steps');
    const rhythmBtns = $$('[data-rhythm]');
    const grid = NOTES.map(() => Array(STEPS).fill(false));
    const cells = [];
    let ac = null;
    let master = null;
    let timer = 0;
    let pos = -1;
    let active = false;

    const fillPattern = (pattern) => {
      grid.forEach((row) => row.fill(false));
      pattern.forEach(([row, col]) => { grid[row][col] = true; });
      cells.forEach((cell, index) => {
        const row = Math.floor(index / STEPS);
        const col = index % STEPS;
        cell.setAttribute('aria-pressed', String(grid[row][col]));
      });
    };

    NOTES.forEach((note, row) => {
      for (let col = 0; col < STEPS; col++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.setAttribute('aria-pressed', String(grid[row][col]));
        cell.setAttribute('aria-label', `${note.name}, step ${col + 1}`);
        cell.addEventListener('click', () => {
          grid[row][col] = !grid[row][col];
          cell.setAttribute('aria-pressed', String(grid[row][col]));
          if (ensureAudio() && grid[row][col]) {
            tone(note.f);
            if (!timer) {
              status.textContent = 'Audio is on. Press Start to play the loop.';
              if (onState) onState('Audio off');
            }
          }
        });
        cells.push(cell);
        seq.append(cell);
      }
    });

    for (let col = 0; col < STEPS; col++) {
      const label = document.createElement('span');
      label.textContent = String(col + 1);
      if (col % 4 === 0) label.classList.add('is-downbeat');
      stepsEl.append(label);
    }

    const level = () => (Number(vol.value) / 100) * 0.4;

    const ensureAudio = () => {
      if (!ac) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          status.textContent = 'Web Audio is not supported in this browser.';
          return false;
        }
        ac = new AudioContextClass();
        master = ac.createGain();
        master.gain.value = level();
        master.connect(ac.destination);
      }
      if (ac.state === 'suspended') ac.resume();
      return true;
    };

    const tone = (frequency) => {
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.8, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.4);
    };

    const mark = (col) => {
      cells.forEach((cell, index) => {
        cell.classList.toggle('now', col >= 0 && index % STEPS === col);
      });
      if (stepsEl) {
        [...stepsEl.children].forEach((label, index) => {
          label.classList.toggle('is-now', col >= 0 && index === col);
        });
      }
      if (stepEl) stepEl.textContent = col >= 0 ? String(col + 1).padStart(2, '0') : '—';
    };

    const tick = () => {
      pos = (pos + 1) % STEPS;
      mark(pos);
      NOTES.forEach((note, row) => { if (grid[row][pos]) tone(note.f); });
    };

    const interval = () => 60000 / Number(tempo.value) / 2;

    const updatePlay = () => {
      const label = playBtn.querySelector('span');
      const icon = playBtn.querySelector('i');
      if (label) label.textContent = timer ? 'Stop' : 'Start';
      if (icon) icon.className = 'fa-solid ' + (timer ? 'fa-stop' : 'fa-play');
    };

    const start = () => {
      if (!ensureAudio()) return;
      pos = -1;
      tick();
      timer = setInterval(tick, interval());
      status.textContent = `Playing at ${tempo.value} BPM, in eighth notes.`;
      updatePlay();
      if (onState) onState('Playing');
    };

    const stop = (text) => {
      if (timer) {
        clearInterval(timer);
        timer = 0;
      }
      mark(-1);
      updatePlay();
      status.textContent = text || 'Stopped.';
      if (onState) onState('Audio off');
    };

    playBtn.addEventListener('click', () => (timer ? stop() : start()));
    tempo.addEventListener('input', () => {
      tempoOut.textContent = tempo.value;
      if (timer) {
        clearInterval(timer);
        timer = setInterval(tick, interval());
        status.textContent = `Playing at ${tempo.value} BPM, in eighth notes.`;
      }
    });
    vol.addEventListener('input', () => {
      if (volOut) volOut.textContent = `${vol.value}%`;
      if (master) master.gain.value = level();
    });
    clearBtn.addEventListener('click', () => {
      grid.forEach((row) => row.fill(false));
      cells.forEach((cell) => cell.setAttribute('aria-pressed', 'false'));
      rhythmBtns.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
      status.textContent = timer ? 'Pattern cleared while playing.' : 'Pattern cleared.';
    });
    rhythmBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pattern = PATTERNS[btn.dataset.rhythm];
        if (!pattern) return;
        fillPattern(pattern);
        rhythmBtns.forEach((item) => item.setAttribute('aria-pressed', String(item === btn)));
        status.textContent = timer ? `${btn.textContent.trim()} rhythm loaded.` : `${btn.textContent.trim()} rhythm loaded. Press Start to play.`;
      });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && timer) stop('Stopped because the tab was hidden.');
    });
    document.addEventListener('softspace:transition-start', () => {
      if (timer) stop('Stopped while changing pages.');
    });

    fillPattern(PATTERNS.sparse);
    if (volOut) volOut.textContent = `${vol.value}%`;

    return {
      activate: () => {
        active = true;
        if (!timer) status.textContent = 'Audio is off. Press Start or toggle a cell to enable sound.';
        if (onState) onState(timer ? 'Playing' : 'Audio off');
      },
      deactivate: () => {
        active = false;
        if (timer) stop('Stopped when you left the sequencer.');
      },
      state: () => (timer ? 'Playing' : 'Audio off')
    };
  };

  // --------------------------------------------------------- Code Playground
  const initPlayground = (onState) => {
    const htmlIn = $('#pg-html');
    const cssIn = $('#pg-css');
    const frame = $('#pg-frame');
    if (!htmlIn || !cssIn || !frame) return null;
    const resetBtn = $('#pg-reset');
    const previewBtn = $('#pg-preview-full');
    const preview = $('#pg-preview');
    const statusEl = $('#pg-status');
    const noteEl = $('#pg-note');
    const START = {
      html: '<main class="card">\n  <p class="eyebrow">SoftSpace Lab</p>\n  <h1>Hello, Lab</h1>\n  <p>Edit the HTML and CSS. The preview updates as you type.</p>\n  <button type="button">A button</button>\n</main>',
      css: ':root {\n  color-scheme: light;\n}\nbody {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  font-family: system-ui, sans-serif;\n  background: #f4f7fc;\n  color: #1e2738;\n}\n.card {\n  width: min(420px, calc(100% - 48px));\n  padding: 28px;\n  background: #fff;\n  border: 1px solid #dbe3f0;\n  border-radius: 16px;\n}\n.eyebrow {\n  margin: 0 0 8px;\n  font-size: 11px;\n  letter-spacing: .16em;\n  text-transform: uppercase;\n  color: #3566cc;\n}\nh1 { margin: 0 0 8px; font-size: 2rem; }\np { margin: 0 0 18px; color: #5f6b82; }\nbutton {\n  padding: 10px 16px;\n  font: inherit;\n  color: #fff;\n  background: #1e2738;\n  border: 0;\n  border-radius: 999px;\n  cursor: pointer;\n}'
    };
    let timer = 0;
    let rendered = false;

    const setStatus = (text) => { if (statusEl) statusEl.textContent = text; };

    const render = () => {
      clearTimeout(timer);
      frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${cssIn.value}</style></head><body>${htmlIn.value}</body></html>`;
      rendered = true;
      setStatus('Rendering');
    };

    const queue = () => {
      clearTimeout(timer);
      setStatus('Typing');
      timer = setTimeout(render, 220);
    };

    const load = (announce) => {
      htmlIn.value = START.html;
      cssIn.value = START.css;
      render();
      if (announce) {
        if (noteEl) noteEl.textContent = 'Starter code restored. The preview updated immediately.';
        setStatus('Reset');
      }
    };

    htmlIn.addEventListener('input', queue);
    cssIn.addEventListener('input', queue);
    frame.addEventListener('load', () => {
      if (rendered) setStatus('Updated');
    });
    resetBtn.addEventListener('click', () => load(true));

    const fullPreview = () => {
      if (document.fullscreenElement === preview) {
        document.exitFullscreen();
      } else if (preview.requestFullscreen) {
        preview.requestFullscreen().catch(() => {
          if (noteEl) noteEl.textContent = 'Fullscreen preview could not start in this browser.';
        });
      }
    };

    if (previewBtn) {
      if (!document.fullscreenEnabled || !preview.requestFullscreen) {
        previewBtn.disabled = true;
        previewBtn.title = 'Fullscreen is not supported in this browser.';
      } else {
        previewBtn.addEventListener('click', fullPreview);
        document.addEventListener('fullscreenchange', () => {
          const on = document.fullscreenElement === preview;
          previewBtn.setAttribute('aria-pressed', String(on));
          const label = previewBtn.querySelector('span');
          if (label) label.textContent = on ? 'Exit preview' : 'Fullscreen preview';
          const icon = previewBtn.querySelector('i');
          if (icon) icon.className = 'fa-solid ' + (on ? 'fa-compress' : 'fa-expand');
        });

        const exitBtn = $('#pg-exit');
        if (exitBtn) {
          exitBtn.addEventListener('click', () => {
            if (document.fullscreenElement === preview) {
              document.exitFullscreen().catch(() => {});
            }
          });
        }
      }
    }

    load(false);

    return {
      activate: () => {
        if (!rendered) render();
        if (onState) onState('Live preview');
      },
      deactivate: () => {},
      state: () => 'Live preview',
      resize: () => {}
    };
  };

  // ------------------------------------------------------------- Workbench
  const wb = $('#wb');
  if (!wb) return;

  const INFO = {
    swarm: {
      no: '01',
      name: 'Swarm Simulation',
      engine: 'Canvas 2D · Boids',
      desc: 'Boids follow three rules — separation, alignment and cohesion. The pointer adds attraction; clicks send a ripple through the flock.'
    },
    sound: {
      no: '02',
      name: 'Sound Grid',
      engine: 'Web Audio API · Sequencer',
      desc: 'A four-note, eight-step sequencer built with oscillators. Nothing plays until you press Start or toggle a cell.'
    },
    playground: {
      no: '03',
      name: 'Code Playground',
      engine: 'Sandboxed iframe · HTML + CSS',
      desc: 'Write HTML and CSS and watch the sandboxed preview update. Scripts are disabled inside the frame.'
    },
    gravity: { no: '04', name: 'Gravity Playground', engine: 'Canvas 2D · Particle physics', desc: 'A particle field with movable attractors. Place up to five gravity wells, tune the gravitational strength and switch trails on or off to change how the field behaves.' },
    generative: { no: '05', name: 'Generative Art', engine: 'Canvas 2D · Procedural composition', desc: 'Three generative systems — Flow, Orbit and Bloom — draw different families of luminous paths. Pointer movement bends the field; each new seed creates a different arrangement.' },
    waves: { no: '06', name: 'Wave Interference', engine: 'Canvas 2D · Oscillation field', desc: 'Build an interference field by adding wave sources directly to the stage. Watch circular wavefronts overlap into bands of constructive and destructive interference.' },
    terrain: { no: '07', name: 'Digital Terrain', engine: 'Canvas 2D · Procedural landscape', desc: 'A synthetic mountain range built from layered mathematical ridgelines, atmospheric depth, a moving sky and a distant sun. The pointer creates a subtle parallax shift.' },
    typemotion: { no: '08', name: 'Type in Motion', engine: 'Canvas 2D · Kinetic typography', desc: 'Each letter responds independently to a pointer field. Cycle through four phrases and see how movement changes the weight, rhythm and personality of a word.' },
    colorlab: { no: '09', name: 'Color Laboratory', engine: 'Canvas 2D · Color harmony', desc: 'Tune hue and saturation to generate a six-part color harmony. Select any swatch to read and copy its HEX value, or ask for a surprise palette.' },
    visualizer: { no: '10', name: 'Sound Visualizer', engine: 'Web Audio API · Canvas 2D', desc: 'A radial frequency instrument with two visual modes. It runs on a synthetic signal by default, or connects to a quiet generated tone when you enable audio.' }
  };

  const tabs = $$('.wb-tab');
  const tabStrip = $('.wb-tabs');
  const tabWrap = $('.wb-tabs-wrap');
  let edgeTick = 0;
  const syncTabEdges = () => {
    if (!tabStrip || !tabWrap) return;
    const max = tabStrip.scrollWidth - tabStrip.clientWidth;
    const horizontal = getComputedStyle(tabStrip).flexDirection === 'row';
    tabWrap.classList.toggle('has-left', horizontal && tabStrip.scrollLeft > 4);
    tabWrap.classList.toggle('has-right', horizontal && max > 4 && tabStrip.scrollLeft < max - 4);
    tabStrip.setAttribute('aria-orientation', horizontal ? 'horizontal' : 'vertical');
  };
  if (tabStrip) {
    tabStrip.addEventListener('scroll', () => {
      if (edgeTick) return;
      edgeTick = requestAnimationFrame(() => { edgeTick = 0; syncTabEdges(); });
    }, { passive: true });
    addEventListener('resize', syncTabEdges);
  }
  const panels = {};
  const controls = {};
  $$('.wb-panel').forEach((panel) => { panels[panel.dataset.panel] = panel; });
  $$('[data-controls]').forEach((group) => { controls[group.dataset.controls] = group; });

  const extras = window.SoftSpaceLabExtras;
  const controllers = {
    swarm: initSwarm(setState),
    sound: initSound(setState),
    playground: initPlayground(setState),
    gravity: extras ? extras.create('gravity', setState) : null,
    generative: extras ? extras.create('generative', setState) : null,
    waves: extras ? extras.create('waves', setState) : null,
    terrain: extras ? extras.create('terrain', setState) : null,
    typemotion: extras ? extras.create('typemotion', setState) : null,
    colorlab: extras ? extras.create('colorlab', setState) : null,
    visualizer: extras ? extras.create('visualizer', setState) : null
  };

  const nameEl = $('#wb-active-name');
  const noEl = $('#wb-active-no');
  const engineEl = $('#wb-engine');
  const descEl = $('#wb-desc');
  const fullBtn = $('#wb-full');
  const wbMain = $('#wb-main');
  let current = null;

  const setInfo = (key) => {
    const info = INFO[key];
    if (!info) return;
    if (nameEl) nameEl.textContent = info.name;
    if (noEl) noEl.textContent = info.no;
    if (engineEl) engineEl.textContent = info.engine;
    if (descEl) descEl.textContent = info.desc;
  };

  const switchTo = (key, animate = true, updateHash = true) => {
    if (!INFO[key] || key === current) return;
    const index = tabs.findIndex((tab) => tab.dataset.exp === key);
    const oldKey = current;
    const oldPanel = oldKey ? panels[oldKey] : null;
    const nextPanel = panels[key];
    const oldIndex = oldKey ? tabs.findIndex((tab) => tab.dataset.exp === oldKey) : index;
    const direction = index >= oldIndex ? 1 : -1;

    if (oldKey && controllers[oldKey]) controllers[oldKey].deactivate();

    tabs.forEach((tab) => {
      const selected = tab.dataset.exp === key;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && tab.scrollIntoView) {
        try { tab.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (error) { /* ignore */ }
      }
    });

    if (oldPanel && oldPanel !== nextPanel) {
      oldPanel.classList.remove('is-active');
      oldPanel.setAttribute('aria-hidden', 'true');
      oldPanel.setAttribute('inert', '');
    }
    nextPanel.classList.add('is-active');
    nextPanel.removeAttribute('aria-hidden');
    nextPanel.removeAttribute('inert');

    Object.entries(controls).forEach(([controlKey, group]) => {
      group.classList.toggle('is-active', controlKey === key);
    });

    setInfo(key);

    if (animate && oldPanel && oldPanel !== nextPanel && canAnimate()) {
      if (gsap) {
        gsap.killTweensOf([oldPanel, nextPanel]);
        Object.values(panels).forEach((panel) => {
          if (panel !== nextPanel) {
            panel.classList.remove('is-leaving');
            gsap.set(panel, { clearProps: 'all' });
          }
        });
        oldPanel.classList.add('is-leaving');
        gsap.fromTo(nextPanel, { autoAlpha: 0, x: direction * 26 }, {
          autoAlpha: 1,
          x: 0,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => gsap.set(nextPanel, { clearProps: 'all' })
        });
        gsap.to(oldPanel, {
          autoAlpha: 0,
          x: direction * -26,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            oldPanel.classList.remove('is-leaving');
            gsap.set(oldPanel, { clearProps: 'all' });
          }
        });
      }
    } else if (oldPanel && oldPanel !== nextPanel) {
      oldPanel.classList.remove('is-leaving');
      if (gsap) gsap.set([oldPanel, nextPanel], { clearProps: 'all' });
    }

    current = key;
    if (controllers[key] && controllers[key].activate) controllers[key].activate();
    if (controllers[key] && controllers[key].state) setState(controllers[key].state());

    if (updateHash && location.hash !== '#' + key) {
      try { history.replaceState(null, '', '#' + key); } catch (error) { /* file:// can reject */ }
    }
    requestAnimationFrame(syncTabEdges);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTo(tab.dataset.exp));
    tab.addEventListener('keydown', (event) => {
      const index = tabs.indexOf(tab);
      let next = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next == null) return;
      event.preventDefault();
      tabs[next].focus();
      switchTo(tabs[next].dataset.exp);
    });
  });

  if (fullBtn && wbMain) {
    if (!document.fullscreenEnabled || !wbMain.requestFullscreen) {
      fullBtn.disabled = true;
      fullBtn.title = 'Fullscreen is not supported in this browser.';
    } else {
      fullBtn.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else wbMain.requestFullscreen().catch(() => {
          fullBtn.title = 'Fullscreen could not start in this browser.';
        });
      });
      document.addEventListener('fullscreenchange', () => {
        const on = document.fullscreenElement === wbMain;
        fullBtn.setAttribute('aria-pressed', String(on));
        const label = fullBtn.querySelector('span');
        if (label) label.textContent = on ? 'Exit' : 'Fullscreen';
        const icon = fullBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid ' + (on ? 'fa-compress' : 'fa-expand');
        setTimeout(() => {
          if (controllers[current] && controllers[current].resize) controllers[current].resize();
        }, 260);
      });
    }
  }

  const hashKey = location.hash.replace('#', '');
  const initial = INFO[hashKey] ? hashKey : 'swarm';
  switchTo(initial, false, false);
  syncTabEdges();
  requestAnimationFrame(syncTabEdges);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncTabEdges);

  addEventListener('hashchange', () => {
    const key = location.hash.replace('#', '');
    if (INFO[key]) switchTo(key, true, false);
  });
})();

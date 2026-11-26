/* Home page: content data, rendering, contact form and hero choreography. */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = () => Boolean(window.gsap) && !reduceQuery.matches && document.documentElement.classList.contains('motion');
  const REPO_URL = 'https://github.com/FaR7COde/far7code.github.io';
  const PROFILE_URL = 'https://github.com/s0ftspace-dev';

  const SKILLS = [
    {
      cat: 'Frontend Development', icon: 'fa-code', items: [
        { name: 'HTML5', icon: 'fa-brands fa-html5', tone: 't-html', level: 'In practice', text: 'Semantic structure, accessible markup and page architecture.', ex: { label: 'SoftSpace and Masjid Al-Qalam' } },
        { name: 'CSS3', icon: 'fa-brands fa-css3-alt', tone: 't-css', level: 'In practice', text: 'Custom properties, layout systems, responsive styling and motion.', ex: { label: 'SoftSpace design system' } },
        { name: 'JavaScript', icon: 'fa-brands fa-js', tone: 't-js', level: 'In practice', text: 'Vanilla JavaScript for interface behaviour, data rendering and browser APIs.', ex: { label: 'SoftSpace and Arunika Perfume' } },
        { name: 'TypeScript', icon: 'fa-solid fa-code', tone: 't-mist', level: 'Exploring', text: 'A typed layer for making larger JavaScript projects easier to maintain.' },
        { name: 'React', icon: 'fa-brands fa-react', tone: 't-mist', level: 'Exploring', text: 'Component-based UI development for interactive web interfaces.' },
        { name: 'Tailwind CSS', icon: 'fa-solid fa-wind', tone: 't-sage', level: 'Exploring', text: 'Utility-first styling as an alternative workflow to hand-written CSS.' },
        { name: 'Bootstrap', icon: 'fa-brands fa-bootstrap', tone: 't-blush', level: 'Exploring', text: 'A component and grid toolkit for building consistent layouts.' },
        { name: 'GSAP', icon: 'fa-solid fa-bezier-curve', tone: 't-sand', level: 'In practice', text: 'Timeline-based motion and scroll-triggered animation with ScrollTrigger.' }
      ]
    },
    {
      cat: 'Backend Development', icon: 'fa-server', items: [
        { name: 'PHP', icon: 'fa-brands fa-php', tone: 't-mist', level: 'Exploring', text: 'Server-side scripting for dynamic web pages and form-driven projects.' },
        { name: 'Laravel', icon: 'fa-brands fa-laravel', tone: 't-blush', level: 'Exploring', text: 'A PHP framework for structured routing, application logic and server-rendered experiences.' },
        { name: 'Node.js', icon: 'fa-brands fa-node-js', tone: 't-sage', level: 'Exploring', text: 'JavaScript runtime for tooling and server-side development.' },
        { name: 'REST API', icon: 'fa-solid fa-arrows-rotate', tone: 't-sand', level: 'Exploring', text: 'A common interface pattern for exchanging data between services.' }
      ]
    },
    {
      cat: 'Programming Languages', icon: 'fa-terminal', items: [
        { name: 'Python', icon: 'fa-brands fa-python', tone: 't-py', level: 'Practicing', text: 'Small tools, programming exercises and experiments outside the browser.' },
        { name: 'C / C++', icon: 'fa-solid fa-microchip', tone: 't-git', level: 'Practicing', text: 'Programming fundamentals and Arduino-based hardware experiments.' },
        { name: 'SQL', icon: 'fa-solid fa-database', tone: 't-mist', level: 'Exploring', text: 'Query language used to read, organize and update relational data.' }
      ]
    },
    {
      cat: 'Database & Data', icon: 'fa-database', items: [
        { name: 'MySQL', icon: 'fa-solid fa-database', tone: 't-sage', level: 'Exploring', text: 'Relational database commonly paired with PHP and Laravel.' },
        { name: 'PostgreSQL', icon: 'fa-solid fa-database', tone: 't-mist', level: 'Exploring', text: 'Relational database for structured application data.' },
        { name: 'SQLite', icon: 'fa-solid fa-hard-drive', tone: 't-sand', level: 'Exploring', text: 'Lightweight relational database suited to local and embedded projects.' },
        { name: 'MongoDB', icon: 'fa-solid fa-leaf', tone: 't-sage', level: 'Exploring', text: 'Document-oriented data storage for flexible records.' }
      ]
    },
    {
      cat: 'Creative Coding', icon: 'fa-wand-magic-sparkles', items: [
        { name: 'Canvas 2D', icon: 'fa-solid fa-circle-nodes', tone: 't-mist', level: 'In practice', text: 'Pointer-driven simulation, particles and generative drawing without a framework.', ex: { label: 'Swarm Simulation in the Lab', href: 'lab.html#swarm' } },
        { name: 'Web Audio', icon: 'fa-solid fa-wave-square', tone: 't-sage', level: 'In practice', text: 'Browser-generated sound using oscillators, scheduling and audio nodes.', ex: { label: 'Sound Grid in the Lab', href: 'lab.html#sound' } },
        { name: 'SVG', icon: 'fa-solid fa-bezier-curve', tone: 't-blush', level: 'Practicing', text: 'Scalable vector shapes for icons, diagrams and interface details.' },
        { name: 'Three.js', icon: 'fa-solid fa-cube', tone: 't-sand', level: 'Exploring', text: 'A JavaScript library for real-time 3D graphics in the browser.' },
        { name: 'WebGL', icon: 'fa-solid fa-cubes', tone: 't-mist', level: 'Exploring', text: 'Low-level browser graphics API for accelerated visual experiments.' }
      ]
    },
    {
      cat: 'UI & Interface Design', icon: 'fa-pen-ruler', items: [
        { name: 'UI Design', icon: 'fa-solid fa-pen-ruler', tone: 't-blush', level: 'Practicing', text: 'Layout, hierarchy and spacing decided before implementation.' },
        { name: 'Typography', icon: 'fa-solid fa-font', tone: 't-sand', level: 'In practice', text: 'A deliberate type scale pairing expressive display type with readable body copy.' },
        { name: 'Figma', icon: 'fa-brands fa-figma', tone: 't-blush', level: 'Exploring', text: 'Interface exploration, wireframes and visual direction.' },
        { name: 'Accessibility', icon: 'fa-solid fa-universal-access', tone: 't-sage', level: 'Practicing', text: 'Keyboard navigation, semantic structure, contrast and reduced-motion support.' },
        { name: 'Responsive UI', icon: 'fa-solid fa-mobile-screen', tone: 't-mist', level: 'In practice', text: 'Layouts that adapt to different viewport sizes and input methods.' }
      ]
    },
    {
      cat: 'Tools & Workflow', icon: 'fa-diagram-project', items: [
        { name: 'Git', icon: 'fa-brands fa-git-alt', tone: 't-git', level: 'In practice', text: 'Version control for tracking project changes.' },
        { name: 'GitHub', icon: 'fa-brands fa-github', tone: 't-gh', level: 'In practice', text: 'Code hosting, collaboration and static-site deployment.', ex: { label: 'SoftSpace profile', href: PROFILE_URL } },
        { name: 'VS Code', icon: 'fa-solid fa-code', tone: 't-mist', level: 'In practice', text: 'Daily editor for writing, testing and debugging code.' },
        { name: 'Vite', icon: 'fa-solid fa-bolt', tone: 't-sand', level: 'Exploring', text: 'A fast development server and frontend build tool.' },
        { name: 'DevTools', icon: 'fa-brands fa-chrome', tone: 't-sage', level: 'Practicing', text: 'Browser inspection, responsive testing and performance debugging.' },
        { name: 'AI-assisted workflow', icon: 'fa-solid fa-robot', tone: 't-mist', level: 'In practice', text: 'AI as an assistant for speed; every result is reviewed, tested and corrected by hand.' }
      ]
    }
  ];

  const PROJECTS = [
    {
      name: 'SoftSpace Portfolio',
      category: 'Portfolio',
      icon: 'fa-layer-group',
      tone: 't-sand',
      desc: 'A personal portfolio and creative coding playground in plain HTML, CSS and JavaScript.',
      stack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Canvas'],
      status: 'In progress',
      details: 'Built without a framework or build step. The hero uses a Canvas 2D signal field, section reveals use GSAP ScrollTrigger, and the Lab holds interactive browser experiments.', caseStudy: { challenge: 'Create a personal site that demonstrates both interface craft and working browser experiments.', approach: 'Use semantic HTML, hand-written CSS, vanilla JavaScript, Canvas 2D and GSAP for purposeful motion.', outcome: 'A multi-section portfolio with a live signal field, project previews and an interactive Lab.' },
      live: 'https://far7code.github.io/',
      source: REPO_URL
    },
    {
      name: 'Arunika Perfume',
      category: 'E-commerce',
      icon: 'fa-bag-shopping',
      tone: 't-blush',
      desc: 'Premium perfume reseller storefront with a brand showcase, filters, quick view and WhatsApp ordering.',
      stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
      status: 'Demo build',
      details: 'Sells products from three brands: Mykonos, HMNS and SAFF. The repository is a demo; product data and the WhatsApp number are placeholders.', caseStudy: { challenge: 'Present a small perfume catalog in a way that makes browsing and product discovery straightforward.', approach: 'Build a branded storefront with product categories, quick view and a WhatsApp ordering path.', outcome: 'A front-end demo. Product data and the WhatsApp destination remain placeholders, so it is not a live store.' },
      live: 'https://softfar.github.io/arunika-parfume-demos/',
      preview: true
    },
    {
      name: 'Masjid Al-Qalam',
      category: 'Website',
      icon: 'fa-mosque',
      tone: 't-sage',
      desc: 'A static HTML and CSS site built for BQ City in February 2024.',
      stack: ['HTML', 'CSS'],
      status: '2024 · first public build',
      details: 'The first public repository: seven commits in a single day, built end to end as a static site.', caseStudy: { challenge: 'Create a simple web presence for a mosque and its community information.', approach: 'Build a static page structure with HTML and CSS, keeping the implementation direct and lightweight.', outcome: 'A published static website and the earliest verified public repository in the journey.' },
      live: 'https://softfar.github.io/Masjid-Al-Qalam1/',
      preview: true
    },
    {
      name: 'Katalog Mobil',
      category: 'Website',
      icon: 'fa-car-side',
      tone: 't-mist',
      desc: 'A car catalog website built as a coursework brief in September 2025.',
      stack: ['HTML', 'CSS'],
      status: '2025 · coursework',
      details: 'Coursework brief: build a car catalog website. Kept as a record of the 2025 practice phase.', caseStudy: { challenge: 'Organize vehicle information in a format that is easy to scan.', approach: 'Use a straightforward HTML and CSS layout to present vehicle cards and catalog content.', outcome: 'A coursework project that records practice with structured content and page layout.' },
      live: 'https://softfar.github.io/katalog-mobil/',
      preview: true
    },
    {
      name: 'Jadwal Sholat',
      category: 'Website',
      icon: 'fa-clock',
      tone: 't-sand',
      desc: 'A prayer-schedule page built with HTML, CSS and JavaScript in November 2025.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      status: '2025 · coursework',
      details: 'Repository description: “Website Jadwal Solat”. A small utility page built around prayer times.', caseStudy: { challenge: 'Make daily prayer-time information easy to find in a focused page.', approach: 'Combine HTML, CSS and JavaScript into a small browser-based utility.', outcome: 'A published practice project. It is presented as a small utility build rather than a production service.' },
      live: 'https://softfar.github.io/Jadwal-Solat/',
      preview: true
    }
  ];

  const JOURNEY = [
    {
      year: '2023',
      entries: [
        {
          kicker: 'Owner-confirmed',
          title: 'Learning the foundations',
          text: 'Started with HTML and CSS, then JavaScript. No public repository from this year exists, so this entry records the start without attaching a project to it.',
          meta: '2023 · no public artifact · start date confirmed by Muhamad Fadil'
        }
      ]
    },
    {
      year: '2024',
      entries: [
        {
          kicker: 'Feb 2024 · First public repository',
          title: 'Masjid Al-Qalam',
          text: 'Published the first public build: an HTML and CSS site for BQ City, committed end to end in one day. It is the earliest verified public build.',
          meta: '7 commits · HTML, CSS'
        }
      ]
    },
    {
      year: '2025',
      entries: [
        {
          kicker: 'Feb — Aug 2025 · Practice',
          title: 'Deliberate exercises',
          text: 'Small builds to isolate fundamentals: HTML basics, a personal profile card and responsive card layouts. Alongside them, Arduino experiments in C++ with LEDs, an LCD and an ultrasonic sensor.',
          meta: 'Practice repositories · HTML, CSS, C++'
        },
        {
          kicker: 'Aug — Dec 2025 · Project work',
          title: 'Catalogs and a prayer schedule',
          text: 'Moved from exercises to small applications: a product catalog with JavaScript, a car catalog, and Jadwal-Solat, a prayer-time page built with HTML, CSS and JavaScript.',
          meta: '3 repositories · HTML, CSS, JavaScript'
        }
      ]
    },
    {
      year: '2026',
      entries: [
        {
          kicker: 'Apr — Jun 2026 · Portfolio and camp',
          title: 'A portfolio and a coding camp',
          text: 'Built a personal portfolio over 23 commits, made kicau-cing, and completed a RevoU Coding Camp mini project in JavaScript, CSS and HTML.',
          meta: '23 commits on My-Portfolio · 3 commits on the camp project'
        },
        {
          kicker: 'Oct — Nov 2026 · Design and competition',
          title: 'Interface and competition work',
          text: 'Worked on wireframes, the Wellora site, NusaProperty, a Sertikom competition prototype and an Arunika Perfume demo storefront.',
          meta: '5 repositories · HTML, CSS, JavaScript'
        },
        {
          kicker: 'Nov 2026 · Current',
          title: 'SoftSpace V2',
          text: 'Rebuilding this portfolio as SoftSpace with GSAP ScrollTrigger, a Canvas signal field and a browser-audio Lab. This is the work in progress you are looking at.',
          meta: 'Current build · HTML, CSS, JavaScript, GSAP'
        }
      ]
    }
  ];

  const STARTERS = {
    Website: { icon: 'fa-solid fa-globe', text: "Hi Fadil, I'd like to build a website. Here's what I need:\n\n" },
    'Web App': { icon: 'fa-solid fa-laptop-code', text: "Hi Fadil, I'd like to discuss a web app. Here's what it should do:\n\n" },
    'UI Design': { icon: 'fa-solid fa-pen-ruler', text: "Hi Fadil, I need help with UI design. Here's the project:\n\n" },
    'Just saying hi': { icon: 'fa-solid fa-face-smile', text: 'Hi Fadil, just saying hi! ' }
  };

  const h = (tag, props = {}, ...kids) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === 'class') el.className = value;
      else if (key === 'text') el.textContent = value;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? '' : value);
    });
    kids.flat().forEach((child) => { if (child) el.append(child); });
    return el;
  };
  const external = (href) => /^https?:/.test(href);

  // ---------- About portrait fallback ----------
  const photo = $('#photo');
  if (photo) {
    const fallback = () => {
      const portrait = photo.parentElement;
      if (!portrait || !photo.isConnected) return;
      photo.removeEventListener('error', fallback);
      portrait.replaceChildren(
        h('span', { class: 'initials', role: 'img', 'aria-label': 'Muhamad Fadil. Portrait image not available.', text: 'MF' }),
        h('span', { class: 'portrait-fallback', text: 'Portrait coming soon' })
      );
    };
    photo.addEventListener('error', fallback, { once: true });
    if (photo.complete && photo.naturalWidth === 0 && photo.getAttribute('src')) fallback();
  }

  // ---------- Journey ----------
  const journeyTrack = $('#journey-track');
  if (journeyTrack) {
    JOURNEY.forEach((group) => {
      const entries = h('ul', { class: 'j-entries' }, h('span', { class: 'j-line', 'aria-hidden': 'true' }));
      group.entries.forEach((entry) => {
        entries.append(h('li', { class: 'j-entry' },
          h('span', { class: 'j-dot', 'aria-hidden': 'true' }),
          h('div', {},
            h('p', { class: 'j-kicker', text: entry.kicker }),
            h('h3', { text: entry.title }),
            h('p', { text: entry.text }),
            h('p', { class: 'j-meta', text: entry.meta })
          )
        ));
      });
      journeyTrack.append(h('li', { class: 'j-year' },
        h('span', { class: 'j-year-num', 'aria-hidden': 'true', text: group.year }),
        entries
      ));
    });
  }

  // ---------- Skills ----------
  const icon = (className) => h('i', { class: className, 'aria-hidden': 'true' });
  const skillsRoot = $('#skills-index');
  if (skillsRoot) {
    SKILLS.forEach((group) => {
      const detail = h('div', { class: 'detail', 'aria-live': 'polite' });
      const buttons = [];

      const show = (skill, button) => {
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        const content = [
          h('p', {}, h('strong', { text: skill.name + ': ' }), skill.text),
          h('p', { class: 'skill-level-line' }, h('span', { class: 'skill-level-label', text: 'Experience' }), h('span', { class: 'skill-level ' + String(skill.level || 'Exploring').toLowerCase().replace(/[^a-z]+/g, '-'), text: skill.level || 'Exploring' }))
        ];
        if (skill.ex) {
          const ref = skill.ex.href
            ? h('a', { href: skill.ex.href, rel: external(skill.ex.href) ? 'noopener noreferrer' : null, target: external(skill.ex.href) ? '_blank' : null, text: skill.ex.label })
            : skill.ex.label;
          content.push(h('p', {}, 'Example: ', ref));
        }
        detail.replaceChildren(...content);
        if (canAnimate()) {
          gsap.fromTo(detail, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out' });
        }
      };

      const list = h('ul', { class: 'tiles' });
      group.items.forEach((skill) => {
        const button = h('button', {
          class: 'tile-btn ' + skill.tone,
          type: 'button',
          'aria-pressed': 'false',
          onclick: () => show(skill, button)
        }, icon(skill.icon), h('span', { text: skill.name }));
        buttons.push(button);
        list.append(h('li', {}, button));
      });

      const panel = h('div', { class: 'cat' },
        h('div', { class: 'cat-head' },
          h('h3', {}, icon('fa-solid ' + group.icon + ' cat-icon'), group.cat),
          h('span', { class: 'cat-count', text: String(group.items.length).padStart(2, '0') })
        ),
        list,
        detail
      );
      show(group.items[0], buttons[0]);
      skillsRoot.append(panel);
    });
  }

  // ---------- Project live preview ----------
  let openPreview = null;
  const pvDialog = $('#pv-dialog');
  if (pvDialog) {
    const pvFrame = $('#pv-frame');
    const pvTitle = $('#pv-title');
    const pvUrl = $('#pv-url');
    const pvOpen = $('#pv-open');
    const pvClose = $('#pv-close');
    const pvLoading = $('#pv-loading');
    const root = document.documentElement;
    const idleText = pvLoading ? pvLoading.textContent : '';
    let pvTimer = 0;

    const resetPreview = () => {
      clearTimeout(pvTimer);
      root.classList.remove('pv-open');
      root.style.removeProperty('overflow');
      root.style.removeProperty('padding-right');
      if (pvFrame) pvFrame.src = 'about:blank';
      if (pvLoading) {
        pvLoading.hidden = false;
        pvLoading.textContent = idleText;
      }
    };

    openPreview = (project) => {
      if (!project.live) return;
      if (typeof pvDialog.showModal !== 'function') {
        window.open(project.live, '_blank', 'noopener,noreferrer');
        return;
      }
      if (pvTitle) pvTitle.textContent = project.name;
      if (pvUrl) pvUrl.textContent = project.live.replace(/^https?:\/\//, '');
      if (pvOpen) pvOpen.href = project.live;
      if (pvLoading) {
        pvLoading.hidden = false;
        pvLoading.textContent = idleText;
      }
      if (pvFrame) {
        pvFrame.title = project.name + ' live preview';
        pvFrame.src = project.live;
      }
      const gap = window.innerWidth - root.clientWidth;
      root.classList.add('pv-open');
      root.style.overflow = 'hidden';
      if (gap > 0) root.style.paddingRight = gap + 'px';
      pvDialog.showModal();
      if (pvClose) pvClose.focus({ preventScroll: true });
      clearTimeout(pvTimer);
      pvTimer = window.setTimeout(() => {
        if (pvLoading && !pvLoading.hidden) {
          pvLoading.textContent = 'Still loading. If nothing appears, open the site in a new tab.';
        }
      }, 9000);
    };

    if (pvFrame) {
      pvFrame.addEventListener('load', () => {
        if (pvFrame.getAttribute('src') === 'about:blank') return;
        if (pvLoading) pvLoading.hidden = true;
        clearTimeout(pvTimer);
      });
    }
    if (pvClose) pvClose.addEventListener('click', () => pvDialog.close());
    pvDialog.addEventListener('close', resetPreview);
    pvDialog.addEventListener('click', (event) => {
      if (event.target === pvDialog) pvDialog.close();
    });

  }

  // ---------- Projects ----------
  const projectList = $('#project-list');
  if (projectList) {
    const filterRoot = $('#project-filters');
    const categories = ['All', ...new Set(PROJECTS.map((project) => project.category))];
    const projectCards = [];
    if (filterRoot) {
      categories.forEach((category, index) => {
        const button = h('button', {
          class: 'filter-btn' + (index === 0 ? ' is-active' : ''),
          type: 'button',
          'aria-pressed': String(index === 0),
          onclick: () => {
            filterRoot.querySelectorAll('button').forEach((item) => {
              const selected = item === button;
              item.classList.toggle('is-active', selected);
              item.setAttribute('aria-pressed', String(selected));
            });
            projectCards.forEach(({ card, project }) => {
              card.hidden = category !== 'All' && project.category !== category;
            });
          }
        }, category);
        filterRoot.append(button);
      });
    }
    PROJECTS.forEach((project, index) => {
      const id = `pd-${index}`;
      const more = project.details
        ? h('div', { class: 'more', id, hidden: true },
            h('p', { class: 'case-overview', text: project.details }),
            project.caseStudy ? h('dl', { class: 'case-study' },
              h('div', {}, h('dt', { text: 'Challenge' }), h('dd', { text: project.caseStudy.challenge })),
              h('div', {}, h('dt', { text: 'Approach' }), h('dd', { text: project.caseStudy.approach })),
              h('div', {}, h('dt', { text: 'Outcome' }), h('dd', { text: project.caseStudy.outcome }))
            ) : null
          )
        : null;
      const actions = [];

      if (project.live && project.preview && openPreview) {
        actions.push(h('button', {
          class: 'btn small',
          type: 'button',
          onclick: () => openPreview(project)
        }, icon('fa-solid fa-eye'), 'Preview'));
      }

      [
        ['Live site', project.live, 'fa-solid fa-arrow-up-right-from-square'],
        ['Source', project.source, 'fa-brands fa-github']
      ].forEach(([label, href, iconClass]) => {
        if (!href) return;
        actions.push(h('a', { class: 'btn small', href, target: '_blank', rel: 'noopener noreferrer' },
          icon(iconClass), label, h('span', { class: 'sr', text: ' (opens in a new tab)' })
        ));
      });

      if (more) {
        const label = h('span', { class: 'btn-label', text: 'Details' });
        const toggle = h('button', {
          class: 'btn small',
          type: 'button',
          'aria-expanded': 'false',
          'aria-controls': id,
          onclick: () => {
            const open = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', String(open));
            label.textContent = open ? 'Hide details' : 'Details';
            more.hidden = !open;
          }
        }, icon('fa-solid fa-circle-info'), label);
        actions.push(toggle);
      }

      const card = h('li', { class: 'proj' },
        h('div', { class: 'proj-top' },
          h('span', { class: 'tile-ico ' + project.tone }, icon('fa-solid ' + project.icon)),
          h('span', { class: 'no', text: String(index + 1).padStart(2, '0') })
        ),
        h('div', {}, h('h3', { text: project.name }), h('p', { class: 'cat-l', text: project.category })),
        h('p', { text: project.desc }),
        project.status ? h('p', { class: 'status', text: project.status }) : null,
        project.stack.length ? h('ul', { class: 'tags' }, project.stack.map((tag) => h('li', { text: tag }))) : null,
        actions.length ? h('div', { class: 'proj-actions' }, actions) : null,
        more
      );
      projectList.append(card);
      projectCards.push({ card, project });
    });
  }

  // ---------- Contact form ----------
  const form = $('#contact-form');
  if (form) {
    const send = $('#send');
    const sendLabel = send.querySelector('.send-label');
    const status = $('#form-status');
    const message = $('#f-message');
    const topic = $('#f-topic');
    const topics = $('#topics');
    const say = (text, kind) => {
      status.textContent = text;
      status.dataset.kind = kind || '';
    };
    const rules = {
      name: (value) => (value.trim() ? '' : 'Enter your name.'),
      email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address, like name@example.com.'),
      message: (value) => (value.trim().length >= 10 ? '' : 'Write at least 10 characters so I know how to help.')
    };
    const field = (key) => form.querySelector(`[name="${key}"]`);
    const check = (key) => {
      const el = field(key);
      const error = rules[key](el.value);
      $('#e-' + key).textContent = error;
      if (error) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
      return !error;
    };

    Object.keys(rules).forEach((key) => {
      field(key).addEventListener('blur', () => check(key));
      field(key).addEventListener('input', () => {
        if (field(key).getAttribute('aria-invalid')) check(key);
      });
    });

    let lastStarter = '';
    const chips = Object.entries(STARTERS).map(([name, starter]) => {
      const chip = h('button', {
        class: 'chip',
        type: 'button',
        'aria-pressed': 'false',
        onclick: () => {
          chips.forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
          topic.value = name;
          if (message.value.trim() === '' || message.value === lastStarter) {
            lastStarter = window.SoftSpaceI18n ? window.SoftSpaceI18n.t(starter.text) : starter.text;
            message.value = lastStarter;
            say('');
          } else {
            say('Your message was kept. Clear it to use a starter.');
          }
        }
      }, icon(starter.icon), name);
      return chip;
    });
    chips.forEach((chip) => topics.append(chip));

    let sending = false;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (sending) return;
      const invalid = Object.keys(rules).filter((key) => !check(key));
      if (invalid.length) {
        field(invalid[0]).focus();
        say('Fix the marked fields and send again.', 'error');
        return;
      }
      sending = true;
      send.disabled = true;
      if (sendLabel) sendLabel.textContent = 'Sending...';
      say('Sending your message...');
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        form.reset();
        lastStarter = '';
        topic.value = '';
        chips.forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
        say('Message sent. Thanks for reaching out.', 'ok');
      } catch (error) {
        say('The message was not sent. Check your connection and try again. Your text is still in the form.', 'error');
      } finally {
        sending = false;
        send.disabled = false;
        if (sendLabel) sendLabel.textContent = 'Send message';
      }
    });
  }

  // ---------- Hero choreography ----------
  const hero = $('#home');
  if (!hero || !gsap || !canAnimate()) return;

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.12 });
  timeline
    .fromTo('.hero-eyebrow, .hero-edition', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, stagger: 0.06 }, 0)
    .fromTo('.hero-word-soft', { yPercent: 32, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.92 }, 0.12)
    .fromTo('.hero-word-space', { yPercent: 32, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.02 }, 0.22)
    .fromTo('.hero-period', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42 }, 0.58)
    .fromTo('.hero-statement', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58 }, 0.48)
    .fromTo('.hero-lead', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58 }, 0.58)
    .fromTo('.hero-body .actions > *', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44, stagger: 0.09 }, 0.76)
    .fromTo('.hero-index', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62 }, 0.92)
    .fromTo('.signal', { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 1.05 }, 0.3)
    .fromTo('.signal-label', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 1.04)
    .fromTo('.scroll', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.1);

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 981px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.signal', {
        yPercent: 9,
        scale: .96,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 }
      });
      gsap.to('.hero-copy', {
        y: -42,
        opacity: .58,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '65% top', scrub: 0.7 }
      });
      gsap.utils.toArray('.sec .eyebrow .eb-rule').forEach((rule) => {
        gsap.fromTo(rule, { scaleX: 0, opacity: .45 }, {
          scaleX: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: rule.closest('.eyebrow'), start: 'top 88%', end: 'top 58%', scrub: .55 }
        });
      });
      gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.to(card, {
          y: index === 1 ? -12 : -5,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .8 }
        });
      });
      gsap.to('.scroll', {
        opacity: 0,
        y: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '28% top', scrub: true }
      });
    });
  }
})();

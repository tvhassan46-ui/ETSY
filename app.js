/* =========================================================================
   ETSY — Application logic (Firebase Auth + Verification)
   Project: etsy-c801d
   ========================================================================= */

window.FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCAULPFNDbR2u7fXu9CDi6XO2BfKkNxKbM",
  authDomain:        "etsy-c801d.firebaseapp.com",
  projectId:         "etsy-c801d",
  storageBucket:     "etsy-c801d.firebasestorage.app",
  messagingSenderId: "422499301534",
  appId:             "1:422499301534:web:1d215f531874534336e38f",
  measurementId:     "G-ZJGVVLCQ58"
};

/* Feature flag — flip to true once Cloud Functions for OTP are deployed. */
const USE_OTP = false;

/* ─────────────────────────────────────────────────────────────────────
   PRODUCT DATA
   ───────────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { slug:'photoshop', name:'Adobe Photoshop', category:'Design', tag:'BEST SELLER',
    tagline:'The industry standard for image editing, digital painting, and graphic design.',
    description:'Photoshop is the world\'s most powerful raster graphics editor — used by photographers, designers, and digital artists to retouch, composite, paint and export.',
    mockup:'photoshop',
    image:new URL('./assets/photoshop-logo.jfif', import.meta.url).href,
    features:['Layer-based editing with smart objects','AI-powered Generative Fill (v25+)','Advanced retouching and healing brushes','Camera Raw with 4× faster GPU rendering','Full color-managed print and web export','Preset sync across desktop and iPad'],
    specs:{'Operating systems':'Windows 11, macOS 13+','Version':'25.4 (2025)','Disk space':'4 GB minimum','RAM':'8 GB recommended','GPU':'2 GB VRAM minimum'},
    related:['illustrator','premiere','aftereffects'] },
  { slug:'illustrator', name:'Adobe Illustrator', category:'Design',
    tagline:'Create stunning vector graphics, logos, and illustrations with precision.',
    description:'Illustrator is the industry-leading vector design environment — built for logos, icons, typography, and brand systems.',
    mockup:'illustrator',
    image:new URL('./assets/illustrator-logo.jfif', import.meta.url).href,
    features:['True vector graphics at any resolution','Pen tool with precision curve control','Pathfinder boolean operations','Variable-width strokes and brushes','Symbol and asset reuse','Cloud documents shared across devices'],
    specs:{'Operating systems':'Windows 11, macOS 13+','Version':'28.1 (2025)','Disk space':'3.5 GB minimum','RAM':'8 GB recommended','GPU':'1 GB VRAM'},
    related:['photoshop','aftereffects','autocad'] },
  { slug:'premiere', name:'Adobe Premiere Pro', category:'Video', tag:'PRO CHOICE',
    tagline:'Professional video editing software for film, TV, and web content.',
    description:'Premiere Pro is the NLE used by most major studios and YouTubers alike.',
    mockup:'premiere',
    image:new URL('./assets/premiere-logo.jfif', import.meta.url).href,
    features:['Multi-cam and proxy workflows','GPU-accelerated Lumetri color','Text-based editing (v24+)','Native ProRes, DNxHR, RED support','Round-trip with After Effects & Audition','Direct export to social media presets'],
    specs:{'Operating systems':'Windows 11, macOS 13+','Version':'24.1 (2025)','Disk space':'8 GB minimum','RAM':'16 GB recommended','GPU':'4 GB VRAM'},
    related:['aftereffects','photoshop','illustrator'] },
  { slug:'aftereffects', name:'Adobe After Effects', category:'Video',
    tagline:'Create cinematic visual effects and motion graphics for any project.',
    description:'After Effects is the planet\'s most-used compositing and motion graphics tool.',
    mockup:'aftereffects',
    image:new URL('./assets/aftereffects-logo.jfif', import.meta.url).href,
    features:['3D compositing with cameras & lights','Motion tracking and rotoscoping','Hundreds of third-party plugins','Text animators and shape layers','Expressions for procedural animation','Native C4D Lite integration'],
    specs:{'Operating systems':'Windows 11, macOS 13+','Version':'24.1 (2025)','Disk space':'6 GB minimum','RAM':'16 GB recommended','GPU':'4 GB VRAM'},
    related:['premiere','illustrator','photoshop'] },
  { slug:'autocad', name:'AutoCAD', category:'Engineering', tag:'INDUSTRY STANDARD',
    tagline:'Industry-leading 2D and 3D CAD software for architects and engineers.',
    description:'AutoCAD is the reference CAD system for drafting, detailing, and design documentation.',
    mockup:'autocad',
    image:new URL('./assets/autocad-logo.jfif', import.meta.url).href,
    features:['2D drafting and 3D modeling','Dynamic blocks and sheet sets','Full DWG/DXF round-trip','Xref management','AutoLISP and .NET APIs','Cloud collaboration via Autodesk Docs'],
    specs:{'Operating systems':'Windows 11, macOS 13+','Version':'2025','Disk space':'10 GB minimum','RAM':'16 GB recommended','GPU':'4 GB VRAM'},
    related:['revit','illustrator','photoshop'] },
  { slug:'revit', name:'Autodesk Revit', category:'Engineering',
    tagline:'BIM software for architects, structural engineers, and designers.',
    description:'Revit is the reference BIM platform — a single model that carries geometry, data, and documentation.',
    mockup:'revit',
    image:new URL('./assets/revit-logo.jfif', import.meta.url).href,
    features:['Full BIM model (geometry + data)','Parametric families','Live schedules and quantities','Structural & MEP disciplines','Native IFC import/export','Cloud worksharing'],
    specs:{'Operating systems':'Windows 11','Version':'2025','Disk space':'12 GB minimum','RAM':'16 GB recommended','GPU':'4 GB VRAM'},
    related:['autocad','covadis','illustrator'] },
  { slug:'animate', name:'Adobe Animate', category:'Video', tag:'ANIMATION',
    tagline:'Create 2D animations and interactive content for video, web, and games.',
    description:'Adobe Animate is an authoring tool for creating vector animation and interactive content. Confirm the available license and supported export formats before purchase.',
    mockup:'software', image:new URL('./assets/animate-logo.jfif', import.meta.url).href, accent:'#6258e8',
    features:['Create vector-based 2D animations','Animate characters and objects with keyframes','Add interactivity to supported projects','Export animation for supported platforms','Work with layered artwork and timelines','Available features depend on software version and license'],
    specs:{'Platforms':'Windows and macOS; verify current system requirements','Internet':'May be required for installation and account services','License':'Confirm license type, duration, and included features before purchase'},
    related:['aftereffects','premiere','illustrator'] },
  { slug:'covadis', name:'Covadis', category:'Engineering', tag:'SURVEYING & CAD',
    tagline:'Civil engineering and surveying tools for CAD-based project workflows.',
    description:'Covadis provides specialized tools for surveying, terrain modeling, and civil engineering workflows. Confirm compatibility, supported CAD version, and license details before purchase.',
    mockup:'software', image:new URL('./assets/covadis-logo.webp', import.meta.url).href, accent:'#d9e3ea',
    features:['Surveying and measurement workflows','Terrain and digital surface modeling','Civil engineering project tools','CAD-based drawing workflows','Road and infrastructure design tools','Compatibility depends on the Covadis and CAD versions'],
    specs:{'Platform':'Windows; check the current vendor requirements','CAD compatibility':'Verify supported CAD application and version','License':'Confirm license type, duration, and included features before purchase'},
    related:['autocad','revit','covadis'] },
  { slug:'microsoft365', name:'Microsoft 365', category:'Productivity',
    tagline:'Everyday productivity apps for documents, spreadsheets, presentations, and email.',
    description:'Microsoft 365 brings familiar productivity apps and cloud services together for work, school, and personal projects.',
    mockup:'software', image:new URL('./assets/microsoft365-logo.png', import.meta.url).href, accent:'#38a3f1',
    features:['Create and edit documents and spreadsheets','Build presentations and manage email','Cloud file storage and syncing','Work across desktop, web, and mobile','Collaborate on shared files','Multiple plan options may be available'],
    specs:{'Platforms':'Windows, macOS, web, Android, iOS','Internet':'Required for online services','Plan':'Confirm included apps and devices before purchase'},
    related:['photoshop','illustrator','aftereffects'] }
];

/* SVG mockups */
const MOCKUPS = {
  photoshop: () => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ps-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#001e36"/><stop offset="1" stop-color="#001224"/></linearGradient><linearGradient id="ps-canvas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#312e81"/><stop offset="0.5" stop-color="#7c3aed"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><rect width="640" height="400" fill="url(#ps-bg)"/><rect x="0" y="0" width="640" height="34" fill="#001629"/><circle cx="18" cy="17" r="5" fill="#ff5f57"/><circle cx="36" cy="17" r="5" fill="#febc2e"/><circle cx="54" cy="17" r="5" fill="#28c840"/><text x="80" y="22" font-family="Inter,sans-serif" font-size="11" fill="#8892a6">Adobe Photoshop — Untitled-1 @ 100%</text><rect x="0" y="34" width="44" height="366" fill="#001224"/><rect x="6" y="46" width="32" height="24" rx="3" fill="#31a8ff"/><rect x="60" y="50" width="478" height="334" fill="#0f0f18"/><rect x="90" y="70" width="418" height="294" fill="url(#ps-canvas)"/><circle cx="300" cy="230" r="90" fill="#06b6d4" opacity="0.35"/><circle cx="400" cy="160" r="60" fill="#a855f7" opacity="0.45"/></svg>`,
  illustrator: () => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ai-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a0f00"/><stop offset="1" stop-color="#0a0500"/></linearGradient><linearGradient id="ai-shape" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a00"/><stop offset="1" stop-color="#e63946"/></linearGradient></defs><rect width="640" height="400" fill="url(#ai-bg)"/><rect x="0" y="0" width="640" height="34" fill="#2a1a00"/><circle cx="18" cy="17" r="5" fill="#ff5f57"/><circle cx="36" cy="17" r="5" fill="#febc2e"/><circle cx="54" cy="17" r="5" fill="#28c840"/><text x="80" y="22" font-family="Inter,sans-serif" font-size="11" fill="#b09468">Adobe Illustrator — Untitled-1</text><rect x="110" y="60" width="480" height="320" fill="#ffffff"/><circle cx="260" cy="210" r="55" fill="url(#ai-shape)"/><circle cx="330" cy="240" r="45" fill="#7c3aed" opacity="0.85"/><polygon points="400,180 450,270 350,270" fill="#06b6d4" opacity="0.9"/></svg>`,
  premiere: () => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="pr-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0020"/><stop offset="1" stop-color="#000010"/></linearGradient><linearGradient id="pr-monitor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a0033"/><stop offset="0.6" stop-color="#7c3aed"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><rect width="640" height="400" fill="url(#pr-bg)"/><rect x="0" y="0" width="640" height="34" fill="#150030"/><circle cx="18" cy="17" r="5" fill="#ff5f57"/><circle cx="36" cy="17" r="5" fill="#febc2e"/><circle cx="54" cy="17" r="5" fill="#28c840"/><text x="80" y="22" font-family="Inter,sans-serif" font-size="11" fill="#8c78b0">Adobe Premiere Pro</text><rect x="60" y="44" width="400" height="190" fill="#000"/><rect x="70" y="54" width="380" height="170" fill="url(#pr-monitor)"/><polygon points="248,124 248,156 280,140" fill="#0a0018"/><rect x="60" y="270" width="140" height="120" fill="#0a0018"/><rect x="66" y="276" width="128" height="22" rx="3" fill="#ea77ff" opacity="0.8"/><rect x="66" y="302" width="128" height="22" rx="3" fill="#7c3aed" opacity="0.8"/></svg>`,
  aftereffects: () => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ae-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a2e"/><stop offset="1" stop-color="#05051a"/></linearGradient><linearGradient id="ae-comp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1a4e"/><stop offset="0.5" stop-color="#6d28d9"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><rect width="640" height="400" fill="url(#ae-bg)"/><rect x="0" y="0" width="640" height="34" fill="#0f0f3a"/><circle cx="18" cy="17" r="5" fill="#ff5f57"/><circle cx="36" cy="17" r="5" fill="#febc2e"/><circle cx="54" cy="17" r="5" fill="#28c840"/><text x="80" y="22" font-family="Inter,sans-serif" font-size="11" fill="#8c88b0">After Effects — Composition 01</text><rect x="70" y="54" width="300" height="180" fill="url(#ae-comp)"/><circle cx="180" cy="140" r="40" fill="#ffffff" opacity="0.2"/><circle cx="260" cy="140" r="40" fill="#06b6d4" opacity="0.4"/><circle cx="340" cy="140" r="40" fill="#a855f7" opacity="0.35"/></svg>`,
  autocad: () => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="640" height="400" fill="#0a0a0a"/><rect x="0" y="0" width="640" height="34" fill="#1a1a1a"/><circle cx="18" cy="17" r="5" fill="#ff5f57"/><circle cx="36" cy="17" r="5" fill="#febc2e"/><circle cx="54" cy="17" r="5" fill="#28c840"/><text x="80" y="22" font-family="Inter,sans-serif" font-size="11" fill="#888">AutoCAD 2025 — Drawing1.dwg</text><g stroke="#00cc66" stroke-width="1.5" fill="none"><rect x="120" y="100" width="200" height="150"/><line x1="120" y1="100" x2="200" y2="60"/><line x1="320" y1="100" x2="400" y2="60"/><line x1="200" y1="60" x2="400" y2="60"/><circle cx="220" cy="175" r="30"/></g></svg>`,
  revit: () => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="rv-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1a2a"/><stop offset="1" stop-color="#020810"/></linearGradient><linearGradient id="rv-model" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d3b66"/><stop offset="1" stop-color="#1a5490"/></linearGradient></defs><rect width="640" height="400" fill="url(#rv-bg)"/><rect x="0" y="0" width="640" height="34" fill="#122838"/><circle cx="18" cy="17" r="5" fill="#ff5f57"/><circle cx="36" cy="17" r="5" fill="#febc2e"/><circle cx="54" cy="17" r="5" fill="#28c840"/><text x="80" y="22" font-family="Inter,sans-serif" font-size="11" fill="#7fa8c8">Revit 2025 — Project.rvt</text><g transform="translate(180,90)"><polygon points="0,80 120,20 240,80 240,240 120,300 0,240" fill="url(#rv-model)" stroke="#3a8ec8" stroke-width="1.5"/><polygon points="120,20 240,80 120,140 0,80" fill="#1a6aa8" opacity="0.8"/></g></svg>`,
  software: (name, accent, slug) => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="software-bg-${slug}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10121f"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="640" height="400" fill="url(#software-bg-${slug})"/><rect x="52" y="54" width="536" height="292" rx="24" fill="#10121f" fill-opacity=".72" stroke="${accent}" stroke-opacity=".65"/><circle cx="320" cy="170" r="58" fill="${accent}" fill-opacity=".22" stroke="${accent}" stroke-width="3"/><path d="M296 170h48m-24-24v48" stroke="${accent}" stroke-width="8" stroke-linecap="round"/><text x="320" y="270" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="600" fill="#f0f4ff">${name}</text></svg>`
};
const getProductMockup = product => {
  if (product.image) return `<img class="product-logo" src="${product.image}" alt="${product.name} logo" />`;
  return MOCKUPS[product.mockup]?.(product.name, product.accent, product.slug) || '';
};

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const getProduct = (slug) => PRODUCTS.find(p => p.slug === slug);

const VoltAudio = {
  enabled: true,
  context: null,
  output: null,
  lastSparkAt: 0,

  unlock() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      this.enabled = false;
      const toggle = $('.volt-sound-toggle');
      if (toggle) {
        toggle.disabled = true;
        toggle.setAttribute('aria-label', 'Login sounds are not supported');
        toggle.title = 'Login sounds are not supported by this browser';
      }
      return;
    }

    if (!this.context) {
      this.context = new AudioContext();
      this.output = this.context.createGain();
      this.output.gain.value = 0.12;
      this.output.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') {
      this.context.resume().catch(error => {
        console.warn('[ETSY] Login sounds could not start:', error);
      });
    }
  },

  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) this.unlock();
    const toggle = $('.volt-sound-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(enabled));
      toggle.setAttribute('aria-label', enabled ? 'Mute login sounds' : 'Enable login sounds');
      toggle.title = enabled ? 'Mute login sounds' : 'Enable login sounds';
      toggle.classList.toggle('is-muted', !enabled);
    }
  },

  play(effect) {
    if (!this.enabled || !this.context || this.context.state !== 'running') return;
    const now = this.context.currentTime;
    const makeTone = (startHz, endHz, duration, volume, type = 'sine', delay = 0) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const start = now + delay;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startHz, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endHz), start + duration);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.012, duration / 3));
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(this.output);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
    };

    if (effect === 'spark') {
      if (now - this.lastSparkAt < 0.075) return;
      this.lastSparkAt = now;
      makeTone(1250 + Math.random() * 900, 260 + Math.random() * 140, 0.055, 0.025, 'triangle');
    } else if (effect === 'charge') {
      makeTone(240, 680, 0.17, 0.045, 'sawtooth');
    } else if (effect === 'error') {
      makeTone(620, 150, 0.24, 0.055, 'sawtooth');
      makeTone(110, 75, 0.2, 0.04, 'square', 0.06);
    } else if (effect === 'success') {
      makeTone(520, 780, 0.16, 0.04, 'sine');
      makeTone(780, 1040, 0.2, 0.04, 'sine', 0.12);
    }
  }
};

const VoltLogin = {
  active: false,
  frameId: 0,
  form: null,
  modal: null,
  canvas: null,
  context: null,
  controller: null,
  reduceMotion: false,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  target: { x: 0, y: 0 },
  sparks: [],
  hit: null,
  heat: 0,

  init(form) {
    this.stop();
    this.form = form;
    this.modal = $('#account-modal .account-modal');
    this.canvas = this.modal?.querySelector('.volt-login-sky');
    this.context = this.canvas?.getContext('2d');
    if (!this.modal || !this.canvas || !this.context) return;

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.active = true;
    this.controller = new AbortController();
    const { signal } = this.controller;
    this.sparks = [];
    this.hit = null;
    this.heat = 0;
    this.resize();

    const email = $('#auth-email', form);
    const password = $('#auth-password', form);
    const eye = $('.volt-eye', form);
    const submit = $('.volt-submit', form);
    const followElement = element => {
      VoltAudio.play('spark');
      const rect = element.getBoundingClientRect();
      const modalRect = this.modal.getBoundingClientRect();
      this.target = {
        x: rect.left - modalRect.left + rect.width * (element === email ? 0.18 : 0.5),
        y: Math.max(12, rect.top - modalRect.top - 14)
      };
      if (this.reduceMotion) {
        this.position = { ...this.target };
        this.draw(performance.now());
      }
    };
    const strikeAtInput = input => {
      VoltAudio.play('spark');
      const rect = input.getBoundingClientRect();
      const modalRect = this.modal.getBoundingClientRect();
      this.hit = {
        x: rect.left - modalRect.left + Math.min(rect.width - 22, Math.max(18, input.value.length * 9 + 18)),
        y: rect.top - modalRect.top + rect.height / 2,
        time: performance.now()
      };
      followElement(input);
      if (this.reduceMotion) this.draw(performance.now());
    };

    [email, password, eye, submit].forEach(element => {
      element.addEventListener('focus', () => followElement(element), { signal });
      element.addEventListener('pointerenter', () => followElement(element), { signal });
    });
    email.addEventListener('input', () => strikeAtInput(email), { signal });
    password.addEventListener('input', () => strikeAtInput(password), { signal });
    this.form.addEventListener('pointermove', event => {
      if (this.reduceMotion) return;
      const field = event.target.closest('.volt-auth-field');
      if (field) followElement(field);
    }, { signal });
    this.modal.addEventListener('pointerleave', () => {
      if (!this.active || this.reduceMotion) return;
      const rect = this.modal.getBoundingClientRect();
      this.target = { x: rect.width / 2, y: 20 };
    }, { signal });

    const modalRect = this.modal.getBoundingClientRect();
    const firstField = email.getBoundingClientRect();
    this.position = {
      x: firstField.left - modalRect.left - 32,
      y: Math.max(12, firstField.top - modalRect.top - 14)
    };
    this.target = {
      x: firstField.left - modalRect.left + firstField.width * 0.18,
      y: Math.max(12, firstField.top - modalRect.top - 14)
    };
    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);
    if (this.reduceMotion) this.draw(performance.now());
    else this.frameId = requestAnimationFrame(now => this.animate(now));
  },

  resize() {
    if (!this.active || !this.modal || !this.canvas || !this.context) return;
    const rect = this.modal.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw(performance.now());
  },

  animate(now) {
    if (!this.active) return;
    const follow = this.reduceMotion ? 1 : 0.16;
    this.position.x += (this.target.x - this.position.x) * follow;
    this.position.y += (this.target.y - this.position.y) * follow;
    this.heat *= 0.94;
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const spark = this.sparks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.96;
      spark.vy = spark.vy * 0.96 + 0.025;
      spark.life -= 1 / 60;
      if (spark.life <= 0) this.sparks.splice(i, 1);
    }
    this.draw(now);
    this.frameId = requestAnimationFrame(next => this.animate(next));
  },

  draw(now) {
    if (!this.context || !this.canvas || !this.modal) return;
    const ctx = this.context;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.width / ratio;
    const height = this.canvas.height / ratio;
    const { x, y } = this.position;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const glow = ctx.createRadialGradient(x, y, 0, x, y, 78);
    glow.addColorStop(0, `rgba(230,255,79,${0.13 + this.heat * 0.1})`);
    glow.addColorStop(0.35, `rgba(230,255,79,${0.07 + this.heat * 0.04})`);
    glow.addColorStop(1, 'rgba(230,255,79,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 78, y - 78, 156, 156);

    if (!this.reduceMotion) {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const length = 8 + Math.random() * 12;
        ctx.beginPath();
        ctx.moveTo(x, y);
        this.drawBolt(ctx, x, y, x + Math.cos(angle) * length, y + Math.sin(angle) * length, 8);
        ctx.strokeStyle = `rgba(230,255,79,${0.4 + Math.random() * 0.35})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    }

    if (this.hit && now - this.hit.time < 140) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      this.drawBolt(ctx, x, y, this.hit.x, this.hit.y, this.reduceMotion ? 0 : 20);
      ctx.strokeStyle = `rgba(240,255,170,${Math.max(0, 1 - (now - this.hit.time) / 140)})`;
      ctx.lineWidth = 1.7;
      ctx.stroke();
    }

    for (const spark of this.sparks) {
      const alpha = Math.min(1, spark.life);
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${spark.hot ? '255,154,122' : '240,255,170'},${alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = spark.hot ? '#ff9a7a' : '#e6ff4f';
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 16;
    ctx.shadowColor = this.heat > 0.1 ? '#ff9a7a' : '#e6ff4f';
    ctx.fill();
    ctx.restore();
  },

  drawBolt(ctx, ax, ay, bx, by, jitter) {
    if (jitter < 2) {
      ctx.lineTo(bx, by);
      return;
    }
    const mx = (ax + bx) / 2 + (Math.random() - 0.5) * jitter;
    const my = (ay + by) / 2 + (Math.random() - 0.5) * jitter;
    this.drawBolt(ctx, ax, ay, mx, my, jitter / 2);
    this.drawBolt(ctx, mx, my, bx, by, jitter / 2);
  },

  fail() {
    VoltAudio.play('error');
    this.heat = 1;
    if (!this.reduceMotion && this.modal) {
      const rect = this.modal.getBoundingClientRect();
      for (let i = 0; i < 18; i++) {
        this.sparks.push({
          x: this.position.x,
          y: this.position.y,
          vx: (Math.random() - 0.5) * 5,
          vy: -(1 + Math.random() * 3),
          life: 0.7 + Math.random() * 0.7,
          radius: 1 + Math.random() * 1.5,
          hot: true
        });
      }
      this.target = { x: rect.width / 2, y: Math.max(10, rect.height * 0.25) };
    }
    this.draw(performance.now());
  },

  charge(element) {
    if (!this.active || !element) return;
    VoltAudio.play('charge');
    const rect = element.getBoundingClientRect();
    const modalRect = this.modal.getBoundingClientRect();
    this.target = {
      x: rect.left - modalRect.left + rect.width / 2,
      y: rect.top - modalRect.top + rect.height / 2
    };
    this.hit = { ...this.target, time: performance.now() };
  },

  stop() {
    this.active = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.controller) this.controller.abort();
    this.controller = null;
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.context && this.canvas) this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.frameId = 0;
    this.form = null;
    this.modal = null;
    this.canvas = null;
    this.context = null;
    this.sparks = [];
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   FIREBASE AUTH
   ═══════════════════════════════════════════════════════════════════════ */
const Firebase = {
  ready: false,
  app: null,
  auth: null,
  mod: null,
  currentUser: null,

  async init() {
    try {
      const { initializeApp } = await import(
        'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js'
      );
      const authMod = await import(
        'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js'
      );

      this.app = initializeApp(window.FIREBASE_CONFIG);
      this.auth = authMod.getAuth(this.app);
      this.mod = authMod;
      this.ready = true;

      authMod.onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        this.updateAccountUI(user);
        if (user && user.emailVerified && window.location.hash === '#/verify') {
          ETSY.showVerifySuccess(user);
        }
      });

      console.info('%c[ETSY] Firebase Auth ready — etsy-c801d', 'color:#06b6d4;font-weight:600');
    } catch (err) {
      console.error('[ETSY] Firebase init failed:', err);
      this.ready = false;
    }
  },

  updateAccountUI(user) {
    const btn = document.getElementById('account-btn');
    if (!btn) return;
    btn.title = user ? `Signed in as ${user.email}` : 'Account';
    btn.textContent = user ? '✅' : '👤';
  },

  async signUp(email, password) {
    if (!this.ready) throw new Error('Firebase not ready');
    const cred = await this.mod.createUserWithEmailAndPassword(this.auth, email, password);
    await this.mod.sendEmailVerification(cred.user);
    return cred.user;
  },

  async signIn(email, password) {
    if (!this.ready) throw new Error('Firebase not ready');
    const cred = await this.mod.signInWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  },

  async resetPassword(email) {
    if (!this.ready) throw new Error('Firebase not ready');
    await this.mod.sendPasswordResetEmail(this.auth, email);
  },

  async signOut() {
    if (!this.ready) return;
    await this.mod.signOut(this.auth);
  },

  async resendVerification() {
    if (!this.ready || !this.currentUser) throw new Error('Not signed in');
    await this.mod.sendEmailVerification(this.currentUser);
  },

  async reloadUser() {
    if (!this.ready || !this.currentUser) return null;
    await this.currentUser.reload();
    return this.currentUser;
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   ETSY APP
   ═══════════════════════════════════════════════════════════════════════ */
const ETSY = {
  currentProductSlug: '',
  currentPayment: '',
  activeCategory: 'All',
  searchQuery: '',
  resendCooldown: 0,
  resendIntervalId: null,

  init() {
    Firebase.init();
    this.initMotionEffects();

    const navbar = $('#navbar');
    window.addEventListener('scroll', () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    this.initThemeSwitch();

    const accountBtn = $('#account-btn');
    if (accountBtn) accountBtn.addEventListener('click', () => this.openAccount());
    const soundToggle = $('.volt-sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => VoltAudio.setEnabled(!VoltAudio.enabled));
      VoltAudio.setEnabled(VoltAudio.enabled);
    }

    window.addEventListener('hashchange', () => this.route());
    this.route();

    this.buildPayOptions();
    this.revealHomeProducts();
    this.initGridBackground();
    this.bindVerifyButtons();
    requestAnimationFrame(() => this.dismissBootLoader());
  },

  route() {
    const hash = window.location.hash || '#/';
    const path = hash.replace(/^#/, '').split('?')[0];
    $$('.view').forEach(v => v.hidden = true);

    if (path === '/' || path === '') return this.showView('home');
    if (path === '/products' || path === '/categories') {
      this.showView('products'); this.renderProductsView(); return;
    }
    if (path === '/about') return this.showView('about');
    if (path === '/verify') return this.renderVerifyView();
    if (path === '/faq') {
      this.showView('home');
      setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      if (getProduct(slug)) { this.showView('product'); this.renderProductDetail(slug); return; }
    }
    this.showView('404');
  },

  showView(name) {
    const el = $(`.view[data-view="${name}"]`);
    if (!el) return;
    $$('.view').forEach(v => v.hidden = true);
    el.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  revealHomeProducts() {
    const grid = $('#featured-grid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(p => this.renderProductCard(p)).join('');
    this.attachTilt(grid);
    grid.hidden = false;
  },

  renderProductsView() {
    const grid = $('#products-grid');
    const filters = $('#category-filters');
    if (!grid || !filters) return;

    const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];
    filters.innerHTML = categories.map(c =>
      `<button class="filter-chip ${c === this.activeCategory ? 'active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');

    filters.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.dataset.cat;
        filters.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderFilteredProducts();
      });
    });

    const search = $('#search-input');
    if (search) {
      search.value = this.searchQuery;
      search.addEventListener('input', e => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderFilteredProducts();
      });
    }
    this.renderFilteredProducts();
  },

  renderFilteredProducts() {
    const grid = $('#products-grid');
    if (!grid) return;
    let items = PRODUCTS;
    if (this.activeCategory !== 'All') items = items.filter(p => p.category === this.activeCategory);
    if (this.searchQuery) {
      items = items.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.tagline.toLowerCase().includes(this.searchQuery) ||
        p.category.toLowerCase().includes(this.searchQuery));
    }
    if (!items.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--etsy-muted)"><p style="font-size:17px;margin-bottom:8px">No software matches your search.</p><p style="font-size:14px">Try a different keyword or category.</p></div>`;
      return;
    }
    grid.innerHTML = items.map(p => this.renderProductCard(p)).join('');
    this.attachTilt(grid);
  },

  renderProductCard(product) {
    const mockup = getProductMockup(product);
    return `
      <article class="product-card" data-slug="${product.slug}">
        <div class="product-card-media">
          ${product.tag ? `<span class="product-card-tag">${product.tag}</span>` : ''}
          ${mockup}
        </div>
        <div class="product-card-body">
          <div class="product-card-cat">${product.category}</div>
          <h3>${product.name}</h3>
          <p class="product-card-desc">${product.tagline}</p>
          <div class="product-card-actions">
            <a href="#/product/${product.slug}" class="btn-details">View details</a>
            <button class="btn-buy" data-action="buy" data-slug="${product.slug}">Request access</button>
          </div>
        </div>
      </article>`;
  },

  attachTilt(container) {
    const cards = container.querySelectorAll('.product-card');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      cards.forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      });
    }
    container.querySelectorAll('[data-action="buy"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const product = getProduct(btn.dataset.slug);
        if (product) this.openCheckout(product.name);
      });
    });
  },

  renderProductDetail(slug) {
    const product = getProduct(slug);
    if (!product) return;
    const hero = $('#product-hero');
    if (hero) {
      hero.innerHTML = `
        <div class="product-hero-media">${getProductMockup(product)}</div>
        <div class="product-hero-info">
          <span class="kicker">${product.category}</span>
          <h1>${product.name}</h1>
          <p>${product.tagline}</p>
          <div class="product-hero-cta">
            <button class="btn-primary btn-lg" onclick="ETSY.openCheckout('${product.name.replace(/'/g, "\\'")}')">Request access</button>
            <button class="btn-ghost btn-lg" onclick="ETSY.openWhatsApp('Hi ETSY, I\\'d like more info on ${product.name.replace(/'/g, "\\'")}.')">Talk to sales</button>
          </div>
        </div>`;
    }
    const tabs = $('#product-tabs');
    const content = $('#product-content');
    const tabsData = ['Overview', 'Features', 'Specs'];
    let activeTab = 'Overview';
    const renderTabContent = () => {
      if (!content) return;
      if (activeTab === 'Overview') content.innerHTML = `<h3>About ${product.name}</h3><p>${product.description}</p>`;
      else if (activeTab === 'Features') content.innerHTML = `<h3>Key features</h3><ul>${product.features.map(f => `<li>${f}</li>`).join('')}</ul>`;
      else content.innerHTML = `<h3>System requirements</h3><ul>${Object.entries(product.specs).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>`;
    };
    if (tabs) {
      tabs.innerHTML = tabsData.map(t => `<button class="product-tab ${t === activeTab ? 'active' : ''}" data-tab="${t}">${t}</button>`).join('');
      tabs.querySelectorAll('.product-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTab = btn.dataset.tab;
          tabs.querySelectorAll('.product-tab').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderTabContent();
        });
      });
    }
    renderTabContent();
    const related = $('#product-related');
    if (related) {
      const relatedProducts = product.related.map(getProduct).filter(Boolean);
      related.innerHTML = `<h3>You may also like</h3><div class="product-grid">${relatedProducts.map(p => this.renderProductCard(p)).join('')}</div>`;
      this.attachTilt(related);
    }
  },

  buildPayOptions() {
    const wrap = $('#pay-options');
    if (!wrap) return;
    const methods = [
      { key:'PayPal', icon:'💳', desc:'Secure online payment' },
      { key:'RIB Bank Transfer', icon:'🏦', desc:'Moroccan bank transfer' },
      { key:'Cash on Delivery', icon:'💵', desc:'Pay when you receive' },
      { key:'Cash Plus', icon:'🟠', desc:'Pay at any local agency' },
      { key:'Wafacash', icon:'🟡', desc:'Pay at any branch' },
      { key:'Barid Cash', icon:'🟢', desc:'Pay via Barid Al-Maghrib' }
    ];
    wrap.innerHTML = methods.map(m => `
      <div class="pay-option" data-method="${m.key}">
        <div class="pay-option-icon">${m.icon}</div>
        <div class="pay-option-body">
          <div class="pay-option-name">${m.key}</div>
          <div class="pay-option-desc">${m.desc}</div>
        </div>
      </div>`).join('');
    wrap.querySelectorAll('.pay-option').forEach(el => {
      el.addEventListener('click', () => {
        wrap.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        this.currentPayment = el.dataset.method;
      });
    });
  },
  openCheckout(productName) {
    this.currentProductSlug = productName;
    this.currentPayment = '';
    const sub = $('#checkout-product'); if (sub) sub.textContent = productName;
    $$('.pay-option').forEach(el => el.classList.remove('selected'));
    const modal = $('#checkout-modal'); if (modal) modal.hidden = false;
    document.body.style.overflow = 'hidden';
  },
  closeCheckout() {
    const modal = $('#checkout-modal'); if (modal) modal.hidden = true;
    document.body.style.overflow = '';
  },
  confirmOrder() {
    if (!this.currentPayment) {
      const modal = $('.glass-modal');
      if (modal) { modal.style.animation = 'none'; modal.offsetHeight; modal.style.animation = 'pop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2)'; }
      const label = $('.pay-label');
      if (label) { label.style.color = '#ef4444'; setTimeout(() => label.style.color = 'var(--etsy-muted)', 1500); }
      return;
    }
    const msg = `Hello ETSY,\n\nI want to purchase: ${this.currentProductSlug}\nPreferred payment: ${this.currentPayment}\n\nPlease send me the details to proceed.`;
    this.openWhatsApp(msg);
    this.closeCheckout();
  },

  openWhatsApp(customMsg) {
    const WA_NUMBER = '212610591514'; // ← CHANGE TO YOUR NUMBER
    const msg = customMsg || 'Hello ETSY, I would like to know more about your software.';
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  },

  openAccount() {
    const modal = $('#account-modal');
    const content = $('#account-content');
    if (!modal || !content) return;

    VoltAudio.unlock();
    VoltLogin.stop();
    if (!Firebase.ready) {
      content.innerHTML = `<p class="account-hint">Connecting to Firebase…</p>`;
    } else if (Firebase.currentUser) {
      this.renderAccountSignedIn(content);
    } else {
      this.renderAccountSignedOut(content);
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const form = $('#signin-form');
    if (form) VoltLogin.init(form);
  },

  renderAccountSignedIn(content) {
    VoltLogin.stop();
    const u = Firebase.currentUser;
    const title = document.getElementById('account-title');
    const subtitle = document.querySelector('#account-modal .modal-sub');
    if (title) title.textContent = 'Account';
    if (subtitle) subtitle.textContent = 'Manage your ETSY account.';

    content.innerHTML = `
      <p class="account-hint account-signed-in">
        Signed in as <strong>${u.email}</strong><br>
        ${u.emailVerified
          ? '<span style="color:#22c55e">✅ Email verified</span>'
          : '<span style="color:#f59e0b">⚠️ Email not verified</span>'}
      </p>
      ${!u.emailVerified ? `<button class="btn-ghost auth-action" id="resend-verify">Go to verification screen</button>` : ''}
      <button class="btn-primary auth-submit" id="signout-btn">Sign out</button>`;

    const resendBtn = content.querySelector('#resend-verify');
    if (resendBtn) {
      resendBtn.addEventListener('click', () => {
        this.closeAccount();
        window.location.hash = '#/verify';
      });
    }
    content.querySelector('#signout-btn').addEventListener('click', async () => {
      await Firebase.signOut();
      this.openAccount();
    });
  },

  renderAccountSignedOut(content, mode = 'signin') {
    VoltLogin.stop();
    const isSignUp = mode === 'signup';
    const title = document.getElementById('account-title');
    const subtitle = document.querySelector('#account-modal .modal-sub');
    if (title) title.textContent = isSignUp ? 'Create your account' : 'Welcome back';
    if (subtitle) subtitle.textContent = isSignUp
      ? 'Create an account to access your purchases and downloads.'
      : 'Sign in to access your purchases and downloads.';

    content.innerHTML = `
      <form class="account-form volt-login-form" id="signin-form" data-auth-mode="${mode}" aria-describedby="auth-error">
        <label class="auth-field volt-auth-field" for="auth-email">
          <span>Email address</span>
          <input type="email" placeholder="you@example.com" required id="auth-email" autocomplete="email" />
        </label>
        <label class="auth-field volt-auth-field volt-password-field" for="auth-password">
          <span>${isSignUp ? 'Password (at least 6 characters)' : 'Password'}</span>
          <span class="volt-password-input">
            <input type="password" placeholder="${isSignUp ? 'Create a password' : 'Enter your password'}" required id="auth-password" minlength="6" autocomplete="${isSignUp ? 'new-password' : 'current-password'}" />
            <button class="volt-eye" type="button" aria-label="Show password" aria-pressed="false">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3.2"/><path class="volt-eye-slash" d="M3.5 20.5 20.5 3.5"/></svg>
            </button>
          </span>
        </label>
        ${isSignUp ? `
          <label class="auth-field volt-auth-field volt-password-field" for="auth-confirm-password">
            <span>Confirm password</span>
            <span class="volt-password-input">
              <input type="password" placeholder="Confirm your password" required id="auth-confirm-password" minlength="6" autocomplete="new-password" />
              <button class="volt-eye" type="button" aria-label="Show confirm password" aria-pressed="false">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12S5.5 4.5 12 4.5 22.5 19.5 12 19.5 1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3.2"/><path class="volt-eye-slash" d="M3.5 20.5 20.5 3.5"/></svg>
              </button>
            </span>
          </label>` : ''}
        <button class="auth-submit volt-submit" type="submit">
          <span class="volt-submit-label">${isSignUp ? 'Create account' : 'Sign in'}</span>
          <span class="volt-submit-loading" aria-hidden="true"></span>
        </button>
        <div class="auth-secondary volt-auth-secondary">
          ${isSignUp
            ? '<button class="btn-ghost" type="button" id="auth-back-signin">Back to sign in</button>'
            : '<button class="btn-ghost" type="button" id="auth-create-account">Create account</button><button class="btn-ghost" type="button" id="auth-reset">Forgot password?</button>'}
        </div>
      </form>
      <p class="auth-error volt-auth-error" id="auth-error" role="alert" aria-live="polite"></p>`;
    this.bindAuthForms();
    const form = $('#signin-form');
    if (form && !$('#account-modal').hidden) VoltLogin.init(form);
  },

  closeAccount() {
    VoltLogin.stop();
    const modal = $('#account-modal'); if (modal) modal.hidden = true;
    document.body.style.overflow = '';
  },

  bindAuthForms() {
    const showError = (msg) => {
      const el = document.getElementById('auth-error');
      if (el) el.textContent = msg;
    };

    const form = $('#signin-form');
    const eyes = $$('.volt-eye', form || document);
    eyes.forEach(eye => {
      const password = eye.closest('.volt-password-field')?.querySelector('input');
      if (!password) return;
      eye.addEventListener('click', () => {
        const showPassword = password.type === 'password';
        password.type = showPassword ? 'text' : 'password';
        eye.setAttribute('aria-pressed', String(showPassword));
        const label = password.id === 'auth-confirm-password' ? 'confirm password' : 'password';
        eye.setAttribute('aria-label', `${showPassword ? 'Hide' : 'Show'} ${label}`);
        eye.closest('.volt-password-field').classList.toggle('is-showing', showPassword);
        password.focus();
      });
    });

    const createAccountBtn = $('#auth-create-account');
    if (createAccountBtn) {
      createAccountBtn.addEventListener('click', () => this.renderAccountSignedOut($('#account-content'), 'signup'));
    }
    const backToSignInBtn = $('#auth-back-signin');
    if (backToSignInBtn) {
      backToSignInBtn.addEventListener('click', () => this.renderAccountSignedOut($('#account-content')));
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showError('');
        const email = $('#auth-email').value.trim();
        const password = $('#auth-password').value;
        const isSignUp = form.dataset.authMode === 'signup';
        const confirmPassword = $('#auth-confirm-password');
        if (isSignUp && password !== confirmPassword.value) {
          showError('Passwords do not match. Please check and try again.');
          confirmPassword.focus();
          return;
        }
        const submit = form.querySelector('[type="submit"]');
        const submitLabel = submit.querySelector('.volt-submit-label');
        VoltLogin.charge(submit);
        submit.disabled = true;
        submit.setAttribute('aria-busy', 'true');
        submit.classList.add('is-loading');
        if (submitLabel) submitLabel.textContent = isSignUp ? 'Creating account…' : 'Signing in…';
        try {
          const user = isSignUp
            ? await Firebase.signUp(email, password)
            : await Firebase.signIn(email, password);
          VoltAudio.play('success');
          this.closeAccount();
          if (isSignUp || !user.emailVerified) {
            window.location.hash = '#/verify';
          }
        } catch (err) {
          VoltLogin.fail();
          showError(this.friendlyAuthError(err));
        } finally {
          if (form.isConnected) {
            submit.disabled = false;
            submit.removeAttribute('aria-busy');
            submit.classList.remove('is-loading');
            if (submitLabel) submitLabel.textContent = isSignUp ? 'Create account' : 'Sign in';
          }
        }
      });
    }

    const resetBtn = $('#auth-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        showError('');
        const email = $('#auth-email').value.trim();
        if (!email) { showError('Enter your email first.'); return; }
        try {
          await Firebase.resetPassword(email);
          VoltAudio.play('success');
          alert('Password reset email sent. Check your inbox.');
        } catch (err) {
          showError(this.friendlyAuthError(err));
        }
      });
    }
  },

  friendlyAuthError(err) {
    const code = err.code || '';
    const map = {
      'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
      'auth/invalid-email': 'That email address is invalid.',
      'auth/weak-password': 'Password is too weak — use at least 6 characters.',
      'auth/user-not-found': 'No account found for this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
      'auth/network-request-failed': 'Network error. Check your connection.'
    };
    return map[code] || (err.message || 'Something went wrong.');
  },

  /* ═══════════════════════════════════════════════════════════════════
     EMAIL VERIFICATION
     ═══════════════════════════════════════════════════════════════════ */
  bindVerifyButtons() {
    const resend = document.getElementById('verify-resend');
    const check  = document.getElementById('verify-check');
    if (resend) resend.addEventListener('click', () => this.resendVerificationEmail());
    if (check)  check.addEventListener('click',  () => this.checkVerificationStatus());

    const inputs = document.querySelectorAll('.otp-digit');
    inputs.forEach((input, i) => {
      input.addEventListener('input', () => {
        const v = input.value.replace(/\D/g, '');
        input.value = v.slice(0, 1);
        if (v && i < inputs.length - 1) inputs[i + 1].focus();
        const code = Array.from(inputs).map(x => x.value).join('');
        if (code.length === 6) this.submitOtp(code);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && i > 0) inputs[i - 1].focus();
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
        text.split('').forEach((ch, k) => { if (inputs[k]) inputs[k].value = ch; });
        const last = Math.min(text.length, inputs.length - 1);
        inputs[last].focus();
        if (text.length === 6) this.submitOtp(text);
      });
    });
  },

  renderVerifyView() {
    if (!Firebase.ready) {
      this.showView('verify');
      this.setVerifyState('loading', 'Connecting to ETSY…', 'Just a moment.');
      return;
    }
    const user = Firebase.currentUser;
    if (!user) {
      this.showView('home');
      this.openAccount();
      return;
    }
    this.showView('verify');
    if (user.emailVerified) {
      this.showVerifySuccess(user);
      return;
    }
    this.showVerifyPending(user);
  },

  showVerifyPending(user) {
    const card = document.getElementById('verify-card');
    const title = document.getElementById('verify-title');
    const desc = document.getElementById('verify-desc');
    const actions = document.getElementById('verify-actions');
    const note = document.getElementById('verify-note');
    const status = document.getElementById('verify-status');
    const otp = document.getElementById('verify-otp');
    const icon = document.getElementById('verify-icon');

    if (!card) return;
    card.classList.remove('success', 'error');
    if (status) status.hidden = true;
    if (actions) actions.hidden = false;
    if (note) note.hidden = false;
    if (otp) otp.hidden = !USE_OTP;

    if (title) title.textContent = 'Check your email';
    if (desc) {
      desc.innerHTML = `We sent a verification link to <strong>${this.escapeHtml(user.email || 'your inbox')}</strong>.<br>Click the link in the email to activate your ETSY account.`;
    }
    if (icon) {
      icon.innerHTML = `<svg viewBox="0 0 64 64" width="56" height="56"><defs><linearGradient id="v-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="none" stroke="url(#v-grad)" stroke-width="2"/><path d="M18 22l14 10 14-10M18 22v20h28V22H18z" fill="none" stroke="url(#v-grad)" stroke-width="2" stroke-linejoin="round"/></svg>`;
    }
    this.refreshResendButton();
  },

  showVerifySuccess(user) {
    const card = document.getElementById('verify-card');
    const title = document.getElementById('verify-title');
    const desc = document.getElementById('verify-desc');
    const icon = document.getElementById('verify-icon');
    const actions = document.getElementById('verify-actions');
    const note = document.getElementById('verify-note');
    const status = document.getElementById('verify-status');
    const otp = document.getElementById('verify-otp');

    if (!card) return;
    card.classList.remove('error');
    card.classList.add('success');
    if (status) status.hidden = true;
    if (note) note.hidden = true;
    if (otp) otp.hidden = true;

    if (icon) {
      icon.innerHTML = `<svg viewBox="0 0 64 64" width="56" height="56"><defs><linearGradient id="vg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22c55e"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="none" stroke="url(#vg)" stroke-width="2.5"/><path d="M20 33l8 8 16-16" fill="none" stroke="url(#vg)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    if (title) title.textContent = 'Email verified!';
    if (desc) {
      desc.innerHTML = `Your ETSY account <strong>${this.escapeHtml(user.email)}</strong> is now fully active.<br>You can continue shopping or return to your account.`;
    }
    if (actions) {
      actions.hidden = false;
      actions.innerHTML = `
        <button class="btn-primary btn-lg" id="verify-continue">Continue shopping</button>
        <button class="btn-ghost btn-lg" id="verify-account">Go to my account</button>`;
      const cont = document.getElementById('verify-continue');
      const acc  = document.getElementById('verify-account');
      if (cont) cont.addEventListener('click', () => window.location.hash = '#/');
      if (acc)  acc.addEventListener('click', () => this.openAccount());
    }
  },

  setVerifyState(kind, title, desc) {
    const card = document.getElementById('verify-card');
    const titleEl = document.getElementById('verify-title');
    const descEl = document.getElementById('verify-desc');
    const actions = document.getElementById('verify-actions');
    const status = document.getElementById('verify-status');
    const note = document.getElementById('verify-note');
    if (!card) return;
    card.classList.remove('success', 'error');
    if (kind === 'success') card.classList.add('success');
    if (kind === 'error') card.classList.add('error');
    if (actions) actions.hidden = true;
    if (note) note.hidden = true;
    if (status) status.hidden = (kind !== 'loading');
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
  },

  async resendVerificationEmail() {
    const btn = document.getElementById('verify-resend');
    if (!btn || btn.disabled) return;
    try {
      btn.disabled = true;
      btn.textContent = 'Sending…';
      await Firebase.resendVerification();
      this.resendCooldown = 60;
      this.startResendCooldown();
      const note = document.getElementById('verify-note');
      if (note) {
        note.textContent = 'Verification email sent again. Check your inbox.';
        note.style.color = '#22c55e';
        setTimeout(() => {
          if (note) {
            note.textContent = "Didn't receive the email? Check your spam folder, or wait 60 seconds before resending.";
            note.style.color = '';
          }
        }, 5000);
      }
    } catch (err) {
      const note = document.getElementById('verify-note');
      if (note) {
        note.textContent = 'Could not send email. ' + (err.message || 'Try again.');
        note.style.color = '#ef4444';
      }
      btn.disabled = false;
      btn.textContent = 'Resend email';
    }
  },

  startResendCooldown() {
    if (this.resendIntervalId) clearInterval(this.resendIntervalId);
    const btn = document.getElementById('verify-resend');
    if (!btn) return;
    btn.disabled = true;
    const tick = () => {
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendIntervalId);
        this.resendIntervalId = null;
        btn.disabled = false;
        btn.textContent = 'Resend email';
        return;
      }
      btn.textContent = `Resend in ${this.resendCooldown}s`;
      this.resendCooldown--;
    };
    tick();
    this.resendIntervalId = setInterval(tick, 1000);
  },

  refreshResendButton() {
    const btn = document.getElementById('verify-resend');
    if (!btn) return;
    if (this.resendCooldown > 0) this.startResendCooldown();
    else { btn.disabled = false; btn.textContent = 'Resend email'; }
  },

  async checkVerificationStatus() {
    const checkBtn = document.getElementById('verify-check');
    const status = document.getElementById('verify-status');
    const statusTx = document.getElementById('verify-status-text');
    if (checkBtn) { checkBtn.disabled = true; checkBtn.textContent = 'Checking…'; }
    if (status) status.hidden = false;
    if (statusTx) statusTx.textContent = 'Checking verification status…';

    try {
      const user = await Firebase.reloadUser();
      if (user && user.emailVerified) {
        this.showVerifySuccess(user);
      } else {
        if (status) status.hidden = true;
        const note = document.getElementById('verify-note');
        if (note) {
          note.textContent = 'Your email is not verified yet. Please click the link in the email we sent.';
          note.style.color = '#f59e0b';
          setTimeout(() => {
            if (note) {
              note.textContent = "Didn't receive the email? Check your spam folder, or wait 60 seconds before resending.";
              note.style.color = '';
            }
          }, 6000);
        }
        if (checkBtn) { checkBtn.disabled = false; checkBtn.textContent = "I've verified — continue"; }
      }
    } catch (err) {
      if (status) status.hidden = true;
      if (checkBtn) { checkBtn.disabled = false; checkBtn.textContent = "I've verified — continue"; }
    }
  },

  async submitOtp(code) {
    if (!USE_OTP) {
      console.warn('[ETSY] OTP flow not enabled.');
      return;
    }
    try {
      const { getFunctions, httpsCallable } = await import('https://www.gstatic.com/firebasejs/13.2.0/firebase-functions.js');
      const fn = getFunctions(Firebase.app);
      const verify = httpsCallable(fn, 'verifyOtp');
      await verify({ email: Firebase.currentUser?.email, code });
      await Firebase.reloadUser();
      this.showVerifySuccess(Firebase.currentUser);
    } catch (err) {
      this.setVerifyState('error', 'Invalid code', err.message || 'The code you entered is incorrect.');
    }
  },

  escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  },

  setTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  },

  toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    this.setTheme(isLight ? 'dark' : 'light');
  },

  initThemeSwitch() {
    const box = $('#theme-switch');
    const input = box?.querySelector('.hbs-input');
    const ball = box?.querySelector('.hbs-ball');
    const shadow = box?.querySelector('.hbs-shadow');
    const steelDay = box?.querySelector('.hbs-steel-day');
    const ring = box?.querySelector('.hbs-ring');
    if (!box || !input || !ball || !shadow || !steelDay || !ring) return;

    const HUMP = 14;
    const GRAVITY = 2.2;
    const BOUNCE = 0.42;
    const ROLL = 0.992;
    const KICK = 9.4;
    const THROW = 0.35;
    const MAX_SPEED = 14;
    const EDGE = 8;
    const TRACK_LENGTH = 248 - EDGE * 2 - 64 * 2;
    const STEP = 1000 / 60;
    const getScale = () => Number.parseFloat(getComputedStyle(box).getPropertyValue('--switch-scale')) || 1;
    const themeTintDuration = window.matchMedia('(max-width: 480px)').matches ? 320 : 500;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const ease = value => 1 - Math.pow(1 - clamp(value, 0, 1), 3);
    const slope = position => HUMP * Math.PI / TRACK_LENGTH * Math.cos(Math.PI * position / TRACK_LENGTH);
    const rise = position => Math.sin(Math.PI * clamp(position, 0, TRACK_LENGTH) / TRACK_LENGTH);
    const sideOf = position => position < TRACK_LENGTH / 2 ? 'light' : 'dark';

    let theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    let position = theme === 'dark' ? TRACK_LENGTH : 0;
    let velocity = 0;
    let drag = null;
    let frame = 0;
    let lastFrame = 0;
    let accumulator = 0;
    let themeTransition = null;
    let shake = null;
    input.checked = theme === 'dark';

    const setTheme = nextTheme => {
      theme = nextTheme;
      input.checked = nextTheme === 'dark';
      this.setTheme(nextTheme);
      themeTransition = { startedAt: performance.now(), target: nextTheme };
      if (navigator.vibrate) navigator.vibrate(nextTheme === 'light' ? 14 : 8);
    };

    const hit = speed => {
      if (Math.abs(speed) > 1.2) {
        shake = { startedAt: performance.now(), amplitude: Math.min(3.2, Math.abs(speed) * 0.36), direction: Math.sign(speed) };
      }
    };

    const paint = time => {
      const arc = rise(position);
      const lift = arc * HUMP;
      const x = EDGE + position;
      const size = (1 + arc * 0.075) * (drag?.onBall ? 0.97 : 1);
      ball.style.transform = `translate(${x.toFixed(2)}px, ${(EDGE + 2 - arc * 1.5).toFixed(2)}px) scale(${size.toFixed(4)})`;
      shadow.style.transform = `translate(${(x - EDGE + 3 + arc * 3).toFixed(2)}px, ${(6 + lift * 0.45).toFixed(2)}px) scale(${(0.92 + arc * 0.1).toFixed(3)})`;
      shadow.style.opacity = (0.62 - arc * 0.3).toFixed(3);

      const turn = Math.PI / 2 + position / TRACK_LENGTH * Math.PI * 2;
      const width = Math.abs(Math.sin(turn)) * 64;
      const front = Math.sin(2 * turn) >= 0;
      ring.style.width = `${width.toFixed(2)}px`;
      ring.style.marginLeft = `${(-width / 2).toFixed(2)}px`;
      ring.style.borderWidth = front ? '0 2px 0 0' : '0 0 0 2px';
      ring.style.boxShadow = front ? '1px 0 0 rgba(255,255,255,.22)' : '-1px 0 0 rgba(255,255,255,.22)';

      let tint = theme === 'light' ? 1 : 0;
      if (themeTransition) {
        const progress = (time - themeTransition.startedAt) / (reduceMotion ? 0 : themeTintDuration);
        if (reduceMotion) {
          tint = themeTransition.target === 'light' ? 1 : 0;
          themeTransition = null;
        } else {
          const eased = ease(progress);
          tint = themeTransition.target === 'light' ? eased : 1 - eased;
          if (progress >= 1) themeTransition = null;
        }
      }
      box.style.setProperty('--t', tint.toFixed(3));
      steelDay.style.opacity = tint.toFixed(3);

      const shakeProgress = shake ? (time - shake.startedAt) / 260 : 1;
      const offset = shakeProgress < 1
        ? shake.amplitude * shake.direction * Math.exp(-shakeProgress * 4) * Math.cos(shakeProgress * 18)
        : 0;
      if (shakeProgress >= 1) shake = null;
      box.style.setProperty('--shake-x', `${offset.toFixed(2)}px`);
    };

    const step = () => {
      velocity -= GRAVITY * 5 / 7 * slope(position);
      velocity *= ROLL;
      position += velocity;
      if (position < 0 || position > TRACK_LENGTH) {
        position = position < 0 ? 0 : TRACK_LENGTH;
        hit(velocity);
        const side = sideOf(position);
        if (side !== theme) setTheme(side);
        velocity = -velocity * BOUNCE;
      }
      if (Math.abs(velocity) < 0.03) {
        velocity = 0;
        return true;
      }
      return false;
    };

    const tick = time => {
      accumulator += Math.min(time - lastFrame, 64);
      lastFrame = time;
      let settled = !drag;
      while (accumulator >= STEP) {
        accumulator -= STEP;
        if (!drag) settled = step();
      }
      paint(time);
      if (!drag && settled && !themeTransition && !shake) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const run = () => {
      if (frame) return;
      lastFrame = performance.now();
      accumulator = 0;
      frame = requestAnimationFrame(tick);
    };

    const releaseSpeed = history => {
      const recent = history.filter(point => point.time > history[history.length - 1].time - 90);
      const first = recent[0];
      const last = recent[recent.length - 1];
      const elapsed = last.time - first.time;
      const handSpeed = elapsed > 0 ? (last.x - first.x) / elapsed : 0;
      const ballSpeed = elapsed > 0 ? (last.position - first.position) / elapsed : 0;
      return clamp((Math.abs(handSpeed) >= THROW ? handSpeed * 0.9 : ballSpeed) * STEP, -MAX_SPEED, MAX_SPEED);
    };

    const kick = (nextTheme, slide = false) => {
      if (theme === nextTheme && !drag) return;
      if (reduceMotion || slide) {
        const start = position;
        const startedAt = performance.now();
        const target = nextTheme === 'light' ? 0 : TRACK_LENGTH;
        setTheme(nextTheme);
        if (reduceMotion) {
          position = target;
          paint(startedAt);
          return;
        }
        const animate = time => {
          position = start + (target - start) * ease((time - startedAt) / 220);
          paint(time);
          if (time - startedAt < 280) requestAnimationFrame(animate);
          else run();
        };
        requestAnimationFrame(animate);
        return;
      }
      velocity = nextTheme === 'light' ? -KICK : KICK;
      run();
    };

    box.addEventListener('pointerdown', event => {
      if (drag || event.button > 0) return;
      event.preventDefault();
      const onBall = ball.contains(event.target);
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startPosition: position,
        startingSide: sideOf(position),
        onBall,
        moved: false,
        history: [{ x: event.clientX / getScale(), position, time: performance.now() }]
      };
      velocity = 0;
      box.setPointerCapture(event.pointerId);
      box.classList.add('dragging');
      run();
    });

    box.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const deltaX = (event.clientX - drag.startX) / getScale();
      if (Math.abs(deltaX) > 4) drag.moved = true;
      if (drag.moved && drag.onBall && !reduceMotion) {
        const limit = drag.startingSide === 'light'
          ? TRACK_LENGTH / 2 - 26 - 15
          : TRACK_LENGTH / 2 + 26 + 15;
        const over = drag.startingSide === 'light' ? drag.startPosition + deltaX - limit : limit - drag.startPosition - deltaX;
        if (over > 0) {
          const give = over * 30 / (over + 30) * 0.5;
          position = drag.startingSide === 'light'
            ? limit + give
            : limit - give;
        } else {
          position = clamp(drag.startPosition + deltaX, 0, TRACK_LENGTH);
        }
      }
      drag.history.push({ x: event.clientX / getScale(), position, time: performance.now() });
      if (drag.history.length > 12) drag.history.shift();
    });

    const drop = event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const currentDrag = drag;
      drag = null;
      box.classList.remove('dragging');
      if (!currentDrag.moved) {
        kick(currentDrag.startingSide === 'light' ? 'dark' : 'light');
      } else if (reduceMotion) {
        kick(event.clientX >= currentDrag.startX ? 'dark' : 'light');
      } else if (currentDrag.onBall) {
        velocity = releaseSpeed(currentDrag.history);
      }
      run();
    };

    box.addEventListener('pointerup', drop);
    box.addEventListener('pointercancel', drop);
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        input.click();
      }
    });
    input.addEventListener('change', () => {
      kick(input.checked ? 'dark' : 'light', true);
    });

    paint(performance.now());
  },

  initMotionEffects() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroTitle = $('.hero-title');
    const typingLines = heroTitle ? $$('.typing-line[data-typing-text]', heroTitle) : [];

    if (!reducedMotion && typingLines.length) {
      const step = window.matchMedia('(max-width: 480px)').matches ? 14 : 22;
      const lines = typingLines.map(line => ({
        element: line,
        characters: Array.from(line.dataset.typingText || '')
      }));
      lines.forEach(({ element }) => {
        element.textContent = '';
        element.classList.add('is-typing');
      });

      let lineIndex = 0;
      let characterIndex = 0;
      const typeNextCharacter = () => {
        const line = lines[lineIndex];
        if (!line) {
          heroTitle.classList.add('is-glitching');
          window.setTimeout(() => heroTitle.classList.remove('is-glitching'), 460);
          return;
        }

        line.element.textContent += line.characters[characterIndex];
        characterIndex += 1;
        if (characterIndex >= line.characters.length) {
          line.element.classList.remove('is-typing');
          lineIndex += 1;
          characterIndex = 0;
        }
        window.setTimeout(typeNextCharacter, step);
      };
      typeNextCharacter();
    }

    const revealSelector = [
      '.hero-eyebrow', '.hero-title', '.hero-sub', '.hero-cta',
      '.trust-bar > div', '.section-head', '.product-card', '.stat',
      '.faq', '.verify-card', '.section-404 > *', '.product-detail, .product-detail > *',
      '.footer-brand', '.footer-col', '.footer-bottom'
    ].join(',');
    const revealObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const element = entry.target;
            element.classList.add('is-visible');
            revealObserver.unobserve(element);
            if (element.matches('.stat')) {
              const counter = $('h3[data-count-to]', element);
              if (counter) this.animateCounter(counter);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' })
      : null;

    const prepareReveal = root => {
      if (root.nodeType !== Node.ELEMENT_NODE) return;
      const elements = [];
      if (root.matches(revealSelector)) elements.push(root);
      elements.push(...root.querySelectorAll(revealSelector));
      elements.forEach(element => {
        if (element.classList.contains('scroll-reveal')) return;
        element.classList.add('scroll-reveal');
        if (reducedMotion || !revealObserver) {
          element.classList.add('is-visible');
        } else {
          revealObserver.observe(element);
        }
      });
    };

    prepareReveal(document.body);
    if (revealObserver) document.body.classList.add('motion-ready');
    if ('MutationObserver' in window && revealObserver && !reducedMotion) {
      const mutationObserver = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(prepareReveal));
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }
  },

  animateCounter(element) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || element.dataset.countStarted) return;
    element.dataset.countStarted = 'true';

    const target = Number(element.dataset.countTo);
    const decimals = Number(element.dataset.countDecimals || 0);
    const suffix = element.dataset.countSuffix || '';
    if (!Number.isFinite(target)) return;

    const duration = window.matchMedia('(max-width: 480px)').matches ? 560 : 900;
    const start = performance.now();
    const update = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  dismissBootLoader() {
    const loader = $('#boot-loader');
    if (loader) loader.classList.add('hidden');
  },

  /* WebGL grid background */
  initGridBackground() {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) return;

    const VERTEX = `#version 300 es
    void main() {
      vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
      gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    }`;
    const FRAGMENT = `#version 300 es
    precision highp float; precision highp int;
    uniform vec2 uResolution; uniform vec2 uOffset; uniform float uCellSize;
    uniform sampler2D uState; uniform ivec2 uCells;
    uniform vec3 uColor; uniform vec3 uGridColor;
    uniform float uLineWidth; uniform float uMaxOpacity; uniform float uFillOpacity;
    uniform float uGridOpacity; uniform vec2 uMouse; uniform float uRadius;
    uniform float uSpotlight; uniform float uPresence; uniform float uEdgeFade;
    out vec4 outColor;
    float level(vec2 cell) {
      if (cell.x<0.||cell.y<0.||cell.x>=float(uCells.x)||cell.y>=float(uCells.y)) return 0.;
      float v = texelFetch(uState, ivec2(cell), 0).r; return v*v*(3.-2.*v);
    }
    float line(float d, float width) { float w=max(width,1.); return clamp(w*.5+.5-d,0.,1.)*(width/w); }
    void main() {
      vec2 pos = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
      vec2 g=(pos-uOffset)/uCellSize; vec2 cell=floor(g); vec2 f=g-cell;
      vec2 edge=min(f,1.-f)*uCellSize;
      float vx=line(edge.x,uLineWidth), vy=line(edge.y,uLineWidth);
      float mark=max(vx,vy);
      vec2 tm=pos-uMouse;
      float spot=exp(-dot(tm,tm)/max(uRadius*uRadius,1.)*1.6)*uSpotlight*uPresence;
      float fade=1.;
      vec2 norm=pos/uResolution;
      vec2 a=clamp(norm/uEdgeFade,0.,1.), b=clamp((1.-norm)/uEdgeFade,0.,1.);
      vec2 sa=a*a*a*(a*(a*6.-15.)+10.), sb=b*b*b*(b*(b*6.-15.)+10.);
      fade=sa.x*sa.y*sb.x*sb.y;
      float own=level(cell);
      float gridAlpha=mark*min(uGridOpacity+spot*.45,1.)*fade;
      vec2 side=step(.5,f)*2.-1.;
      float nx=level(cell+vec2(side.x,0.)), ny=level(cell+vec2(0.,side.y));
      float nc=level(cell+side);
      float ex=max(own,nx), ey=max(own,ny), joint=max(max(ex,ey),nc);
      float lit=max(vx*(edge.y<uLineWidth?joint:ex),vy*(edge.x<uLineWidth?joint:ey))*uMaxOpacity;
      float fill=own*uFillOpacity;
      lit*=fade; fill*=fade;
      float cellA=clamp(max(lit,fill),0.,1.);
      float alpha=cellA+gridAlpha*(1.-cellA);
      vec3 premul=uColor*cellA+uGridColor*gridAlpha*(1.-cellA);
      outColor=vec4(premul,alpha);
    }`;
    const compile = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null; };
    const vs = compile(gl.VERTEX_SHADER, VERTEX), fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const u = {}; const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(program, i); if (info) u[info.name] = gl.getUniformLocation(program, info.name); }
    const vao = gl.createVertexArray(); const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';
    const S = { width:1,height:1,ratio:1,cell:60,cols:0,rows:0,offX:0,offY:0,levels:new Float32Array(0),targets:new Float32Array(0),touched:new Float32Array(0),pixels:new Uint8Array(0),mouse:{x:0,y:0},pointer:{x:0,y:0,inside:false},presence:0,clock:0,dirty:true,raf:0,last:0 };
    const rebuild = () => {
      S.width = Math.max(1, window.innerWidth); S.height = Math.max(1, window.innerHeight);
      S.ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(S.width * S.ratio); canvas.height = Math.round(S.height * S.ratio);
      const cols = Math.ceil(S.width / S.cell) + 1, rows = Math.ceil(S.height / S.cell) + 1;
      S.cols = cols; S.rows = rows;
      S.offX = (S.width - cols * S.cell) / 2; S.offY = (S.height - rows * S.cell) / 2;
      S.levels = new Float32Array(cols * rows); S.targets = new Float32Array(cols * rows);
      S.touched = new Float32Array(cols * rows).fill(-1e9); S.pixels = new Uint8Array(cols * rows);
      gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, cols, rows, 0, gl.RED, gl.UNSIGNED_BYTE, S.pixels);
      S.dirty = true;
    };
    const light = (i, v) => { if (v > S.targets[i]) S.targets[i] = v; S.touched[i] = S.clock; };
    const energize = (x, y) => {
      const r = 140;
      const minC = Math.max(0, Math.floor((x - r - S.offX) / S.cell));
      const maxC = Math.min(S.cols - 1, Math.floor((x + r - S.offX) / S.cell));
      const minR = Math.max(0, Math.floor((y - r - S.offY) / S.cell));
      const maxR = Math.min(S.rows - 1, Math.floor((y + r - S.offY) / S.cell));
      for (let row = minR; row <= maxR; row++) for (let col = minC; col <= maxC; col++) {
        const cx = S.offX + col * S.cell + S.cell / 2, cy = S.offY + row * S.cell + S.cell / 2;
        const d = Math.hypot(cx - x, cy - y); if (d > r) continue;
        const v = 1 - d / r; if (v > 0) light(row * S.cols + col, v);
      }
    };
    const draw = () => {
      gl.viewport(0,0,canvas.width,canvas.height); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program); gl.bindVertexArray(vao); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      if (S.dirty) { for (let i=0;i<S.levels.length;i++) S.pixels[i] = Math.round(Math.min(1,Math.max(0,S.levels[i]))*255); gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,S.cols,S.rows,gl.RED,gl.UNSIGNED_BYTE,S.pixels); S.dirty=false; }
      const l = isLight();
      gl.uniform1i(u.uState,0); gl.uniform2f(u.uResolution,canvas.width,canvas.height);
      gl.uniform2f(u.uOffset,S.offX*S.ratio,S.offY*S.ratio); gl.uniform1f(u.uCellSize,S.cell*S.ratio);
      gl.uniform2i(u.uCells,S.cols,S.rows);
      gl.uniform3f(u.uColor,l?.1:.9,l?.1:.9,l?.15:1.0);
      gl.uniform3f(u.uGridColor,l?.2:.6,l?.2:.6,l?.3:1.0);
      gl.uniform1f(u.uLineWidth,1*S.ratio); gl.uniform1f(u.uMaxOpacity,.9);
      gl.uniform1f(u.uFillOpacity,.06); gl.uniform1f(u.uGridOpacity,.07);
      gl.uniform2f(u.uMouse,S.mouse.x*S.ratio,S.mouse.y*S.ratio);
      gl.uniform1f(u.uRadius,140*S.ratio); gl.uniform1f(u.uSpotlight,.6);
      gl.uniform1f(u.uPresence,S.presence); gl.uniform1f(u.uEdgeFade,.2);
      gl.drawArrays(gl.TRIANGLES,0,3); gl.bindVertexArray(null);
    };
    const frame = (now) => {
      S.raf = 0;
      const dt = S.last ? Math.min(.05,(now-S.last)/1000) : 1/60; S.last = now; S.clock += dt;
      const follow = 1 - Math.exp(-dt/.07);
      S.mouse.x += (S.pointer.x - S.mouse.x) * follow; S.mouse.y += (S.pointer.y - S.mouse.y) * follow;
      const goal = S.pointer.inside ? 1 : 0; S.presence += (goal - S.presence) * (1 - Math.exp(-dt/.25));
      const holdS = .4, fadeStep = dt/.8, attack = 1 - Math.exp(-dt/.045);
      let active = Math.abs(S.presence - goal) > .002;
      for (let i=0;i<S.levels.length;i++) {
        const t = S.targets[i];
        if (t <= 0 && S.levels[i] <= 0) continue;
        let tgt = t;
        if (S.clock - S.touched[i] > holdS) tgt = Math.max(0, tgt - fadeStep);
        S.targets[i] = tgt;
        const before = S.levels[i];
        const next = tgt > before ? before + (tgt - before) * attack : tgt;
        S.levels[i] = next < .002 ? 0 : next;
        if (S.levels[i] !== before) S.dirty = true;
        if (S.levels[i] > 0 || tgt > 0) active = true;
      }
      draw();
      if (active) S.raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!S.raf) { S.last = 0; S.raf = requestAnimationFrame(frame); } };
    window.addEventListener('pointermove', e => {
      const x=e.clientX,y=e.clientY;
      const inside=x>=0&&y>=0&&x<=window.innerWidth&&y<=window.innerHeight;
      const was=S.pointer.inside; S.pointer.inside=inside;
      if(!inside){ if(was) wake(); return; }
      S.pointer.x=x; S.pointer.y=y;
      if(!was){ S.mouse.x=x; S.mouse.y=y; }
      energize(x,y); wake();
    }, { passive: true });
    window.addEventListener('pointerdown', e => { energize(e.clientX,e.clientY); wake(); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', ()=>{ S.pointer.inside=false; wake(); });
    window.addEventListener('resize', ()=>{ rebuild(); draw(); wake(); });
    rebuild(); draw(); wake();
  }
};

window.ETSY = ETSY;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ETSY.init());
} else {
  ETSY.init();
}
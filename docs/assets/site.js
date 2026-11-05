(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Year + nav shadow
  const yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();
  const nav = $('nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveal on scroll
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach((el) => io ? io.observe(el) : el.classList.add('in'));

  // Card spotlight follows the mouse
  document.querySelectorAll('.card').forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`);
    c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  // Live clock in the tray card
  const clock = $('clock');
  const tick = () => { if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };
  tick(); setInterval(tick, 30000);

  // Direct download link to the newest installer
  fetch('https://api.github.com/repos/itshassan999999-lab/Voxly-releases/releases/latest')
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => {
      if (!rel) return;
      const exe = (rel.assets || []).find((a) => /\.exe$/i.test(a.name));
      const ver = (rel.tag_name || '').replace(/^v/, '');
      if (exe) document.querySelectorAll('.js-download').forEach((a) => (a.href = exe.browser_download_url));
      if (ver) {
        const v = $('verNote'); if (v) v.textContent = `Version ${ver}`;
        document.querySelectorAll('.js-download-label').forEach((s) => (s.textContent = `Download for Windows · v${ver}`));
      }
    })
    .catch(() => {});

  // Selection button demo
  const outs = [
    "Hey, can you send me those reports by Friday? It's kind of urgent. Thanks!",
    "Could you send me the reports by Friday? It's a little urgent. Thanks!",
    'Can you send the reports by Friday? Thanks!',
    "Hi, could you please send me the reports by Friday? It's fairly urgent. Thank you.",
  ];
  const menu = $('selMenu'), selOut = $('selOut');
  let selIdx = 0, selTimer;
  const setSel = (i) => {
    selIdx = i;
    menu.querySelectorAll('span').forEach((s, j) => s.classList.toggle('on', j === i));
    selOut.style.opacity = 0;
    setTimeout(() => { selOut.textContent = outs[i]; selOut.style.opacity = 1; }, 180);
  };
  if (menu) {
    menu.querySelectorAll('span').forEach((s) => s.addEventListener('pointerenter', () => { clearInterval(selTimer); setSel(+s.dataset.i); }));
    if (!reduce) selTimer = setInterval(() => setSel((selIdx + 1) % outs.length), 3200);
  }

  // Hero demo
  const scenes = [
    {
      ico: '#', icoBg: '#7c5cff', app: 'team-updates', ph: 'Message #team-updates',
      who: 'Sara', av: 'SR', avBg: 'linear-gradient(135deg,#ff8a4d,#ff4d8d)',
      ctx: 'Is the HLPT fix live yet? Guest Support keeps asking.',
      raw: 'yeah so um the h l p t fix went out this morning uh guest support can tell customers it\'s fixed',
      out: 'Yes, the [HLPT] fix went out this morning. [Guest Support] can tell customers it\'s fixed.',
      ms: '0.9 s',
    },
    {
      ico: 'M', icoBg: '#3d8bff', app: 'New message', ph: 'Message body',
      who: 'To: Mark Chen', av: 'MC', avBg: 'linear-gradient(135deg,#3d8bff,#38d9f5)',
      ctx: 'Subject: Q4 onboarding report',
      raw: 'hi mark the q4 onboarding report is ready um i attached it and the main thing is churn dropped by eight percent thanks alex',
      out: 'Hi Mark,\n\nThe Q4 onboarding report is ready. I attached it, and the main takeaway is that churn dropped by 8%.\n\nThanks,\nAlex',
      ms: '1.2 s',
    },
    {
      ico: 'G', icoBg: '#16a34a', app: 'Conversations · GHL', ph: 'Type a message',
      who: 'Customer', av: 'JL', avBg: 'linear-gradient(135deg,#8b5cf6,#d16cff)',
      ctx: 'Hi, my calendar widget stopped syncing since yesterday?',
      raw: 'hi jordan thanks for reaching out so i checked your account and uh the calendar sync is working again let me know if you see it again',
      out: 'Hi Jordan,\n\nThanks for reaching out. I checked your account, and the calendar sync is working again.\n\nLet me know if it happens again.',
      ms: '1.0 s',
    },
  ];

  const els = {
    pill: $('pill'), state: $('pillState'), bars: $('bars'), raw: $('rawText'), typed: $('typedText'), caret: $('caret'),
    ph: $('ph'), ico: $('appIco'), app: $('appName'), ctx: $('ctxText'), hint: $('keysHint'), hintLabel: $('keysLabel'),
    chip: $('timerChip'), chipVal: $('timerVal'), msg: $('ctxMsg'),
  };
  if (!els.pill) return;

  for (let i = 0; i < 18; i++) els.bars.appendChild(document.createElement('i'));
  const barEls = [...els.bars.children];
  let barsOn = false;
  const animBars = () => {
    barEls.forEach((b, i) => {
      const h = barsOn ? 4 + Math.abs(Math.sin(Date.now() / 140 + i * 0.7)) * (6 + Math.random() * 12) : 4;
      b.style.height = `${h}px`;
    });
    requestAnimationFrame(animBars);
  };
  requestAnimationFrame(animBars);

  const tabs = [...document.querySelectorAll('.win-tabs button')];
  let scene = 0, run = 0;

  const html = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const renderOut = (text, n) => {
    // [term] marks vocabulary words, highlighted once fully typed
    let out = '', shown = 0, i = 0;
    while (i < text.length && shown < n) {
      if (text[i] === '[') {
        const end = text.indexOf(']', i);
        const term = text.slice(i + 1, end);
        const take = Math.min(term.length, n - shown);
        out += take === term.length ? `<span class="vocab-hl">${html(term)}</span>` : html(term.slice(0, take));
        shown += take; i = end + 1;
      } else { out += html(text[i]); shown++; i++; }
    }
    return out;
  };
  const plainLen = (t) => t.replace(/[\[\]]/g, '').length;

  async function play(idx) {
    const my = ++run;
    const alive = () => my === run;
    const s = scenes[idx];
    tabs.forEach((t, j) => t.classList.toggle('on', j === idx));
    els.ico.textContent = s.ico; els.ico.style.background = s.icoBg; els.app.textContent = s.app;
    els.ctx.textContent = s.ctx; els.msg.querySelector('.who').firstChild.textContent = s.who + ' ';
    const av = els.msg.querySelector('.avatar'); av.textContent = s.av; av.style.background = s.avBg;
    els.raw.textContent = ''; els.typed.innerHTML = ''; els.ph.textContent = s.ph; els.ph.style.display = '';
    els.caret.style.display = 'none'; els.chip.classList.remove('show');
    els.pill.classList.remove('show', 'working'); els.hint.classList.remove('down'); els.hintLabel.textContent = 'hold to talk';

    if (reduce) {
      els.ph.style.display = 'none'; els.typed.innerHTML = renderOut(s.out, 1e9); return;
    }
    await sleep(900); if (!alive()) return;
    // key down + pill
    els.hint.classList.add('down'); els.hintLabel.textContent = 'recording';
    els.pill.classList.add('show'); els.state.textContent = 'Listening…'; barsOn = true;
    els.ph.style.display = 'none';
    const words = s.raw.split(' ');
    for (let w = 0; w < words.length; w++) {
      if (!alive()) return;
      els.raw.textContent = words.slice(0, w + 1).join(' ');
      await sleep(150 + Math.random() * 90);
    }
    await sleep(350); if (!alive()) return;
    // release
    barsOn = false; els.hint.classList.remove('down'); els.hintLabel.textContent = 'released';
    els.pill.classList.add('working'); els.state.textContent = 'Correcting…';
    await sleep(800); if (!alive()) return;
    els.pill.classList.remove('show');
    els.raw.textContent = ''; els.caret.style.display = '';
    els.chipVal.textContent = s.ms; els.chip.classList.add('show');
    const total = plainLen(s.out);
    for (let n = 1; n <= total; n += 3) {
      if (!alive()) return;
      els.typed.innerHTML = renderOut(s.out, n);
      await sleep(14);
    }
    els.typed.innerHTML = renderOut(s.out, total);
    els.hintLabel.textContent = 'hold to talk';
    await sleep(3600); if (!alive()) return;
    scene = (idx + 1) % scenes.length;
    play(scene);
  }

  tabs.forEach((t) => t.addEventListener('click', () => { scene = +t.dataset.scene; play(scene); }));

  // Start when the demo is visible
  const demo = document.querySelector('.demo');
  let started = false;
  const start = () => { if (!started) { started = true; play(0); } };
  if (io) {
    const o = new IntersectionObserver((e) => { if (e[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: 0.3 });
    o.observe(demo);
  } else start();
})();

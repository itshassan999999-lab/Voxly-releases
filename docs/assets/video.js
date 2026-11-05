/* Voxly animated demo: a 40 second, code-driven "video" in the Voxly app style.
   Mount: <div id="voxlyVideo" data-logo="assets/logo.png"></div>  (add data-full for a bare 16:9 stage) */
(() => {
  const root = document.getElementById('voxlyVideo');
  if (!root) return;
  const LOGO = root.dataset.logo || 'assets/logo.png';
  const full = root.hasAttribute('data-full');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ic = {
    home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    spell: '<path d="M4 16 8 5l4 11M5.5 12h5M13 15l3 3 5-7"/>',
    hist: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>',
    book: '<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6v14"/>',
    voice: '<circle cx="9" cy="8" r="4"/><path d="M2 20c1-4 4-6 7-6s6 2 7 6M17 5c1.5 1.5 1.5 4.5 0 6M20 3c3 3 3 7 0 10"/>',
    brain: '<path d="M12 5.5A3 3 0 0 0 6.5 4 3 3 0 0 0 3.6 8.2 3.4 3.4 0 0 0 4.2 14 3 3 0 0 0 7.5 18.5 3 3 0 0 0 12 19.5z"/><path d="M12 5.5A3 3 0 0 1 17.5 4a3 3 0 0 1 2.9 4.2 3.4 3.4 0 0 1-.6 5.8 3 3 0 0 1-3.3 4.5 3 3 0 0 1-4.5 1z"/><path d="M12 5.5v14M8 9.5h2M16 9.5h-2M8.5 14h1.5M15.5 14H14"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 10a2 2 0 0 1 4 0"/>',
    style: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h8M8 16h5"/>',
    wand: '<path d="m4 20 11-11M14 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM19 13l.6 1.4L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.6z"/>',
  };
  const svg = (k, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg>`;
  const rail = (sel) => {
    const items = [['home', 'Home'], ['mic', 'Dictation'], ['chip', 'Speech & AI'], ['spell', 'Vocabulary'], ['hist', 'History'], ['book', 'Knowledge'], ['voice', 'Training'], ['brain', 'Memory'], ['palette', 'Theme']];
    return `<div class="vv-rail"><img src="${LOGO}" alt="">${items.map(([k, l]) => `<div class="${l === sel ? 'sel' : ''}"><i>${svg(k)}</i>${l}</div>`).join('')}</div>`;
  };
  const head = (n, chapter, title, sub) => `<div class="vv-chapter"><b>${n}</b>${chapter}</div><div class="vv-title">${title}</div><div class="vv-sub">${sub}</div>`;
  const badge = (k, t, s) => `<div class="vv-badge"><i>${svg(k, 1.7)}</i><span><b>${t}</b>${s}</span></div>`;
  const cursor = `<svg class="vv-cursor" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

  const scenes = [
    { name: 'Intro', dur: 4.5, clip: 3.58, say: 'Meet Voxly. Talk, and clean text appears in any Windows app.', html: `
      <div class="vv-orbit">${['ear', 'brain', 'spell', 'style', 'wand', 'mic'].map((k, i) => { const a = i / 6 * Math.PI * 2; return `<i style="left:${237 + Math.cos(a) * 260}px;top:${237 + Math.sin(a) * 260}px">${svg(k)}</i>`; }).join('')}</div>
      <div class="vv-center"><img src="${LOGO}" alt=""><h3>Meet <span>Voxly</span></h3><p>Talk, and clean text appears in any Windows app.</p></div>` },
    { name: 'The ears', dur: 6, clip: 4.8, say: "These are the ears. Hold Control and Windows, and talk. Let go, and it's typed for you.", html: `
      ${head('01', 'The ears', 'Hold <span>Ctrl + Win</span> and talk', 'A small popup shows the mic is on. Let go, and your words are typed for you.')}
      <div class="vv-keys" data-keys><kbd>Ctrl</kbd>+<kbd>Win</kbd><span data-klabel>hold to talk</span></div>
      <div class="vv-chat"><div class="bar"><b>#</b>team-updates</div>
        <div class="m"><i>SR</i><div><b>Sara</b>Is the HLPT fix live yet? Guest Support keeps asking.</div></div>
        <div class="vv-pill" data-pill><span class="rec"></span><span class="bars" data-bars></span><span data-pstate>Listening…</span></div>
        <div class="vv-compose" data-compose></div>
      </div>
      <div class="vv-timer" data-timer>Release to paste<b>0.9 s</b></div>` },
    { name: 'The brain', dur: 5.8, clip: 4.91, say: 'This is the brain. Use the fast cloud engine, or keep everything private on your PC.', html: `
      ${head('02', 'The brain', 'Online <span>or offline</span> AI', 'Fast cloud speech and correction, or everything on your PC with no internet.')}
      ${badge('brain', 'The brain', 'Speech & AI settings')}
      <div class="vv-app">${rail('Speech & AI')}<div class="vv-page"><h4>Speech &amp; AI</h4><div class="desc">Where your voice is turned into text and corrected.</div>
        <div class="vv-card"><h5>Speech engine</h5>
          <div class="vv-radio on" data-r="0"><span class="dot"></span><div>Voxly Cloud<small>Fastest, about 0.2 s</small></div></div>
          <div class="vv-radio" data-r="1"><span class="dot"></span><div>This PC<small>Private and offline</small></div></div></div>
        <div class="vv-card"><h5>Correction mode</h5>
          <div class="vv-seg"><span data-m="0">Raw</span><span data-m="1" class="on">Basic</span><span data-m="2">Advanced</span></div>
          <div class="vv-example" data-ex>The deploy is done. I think we can tell Guest Support.</div></div>
      </div></div>` },
    { name: 'Vocabulary', dur: 5.6, clip: 4.74, say: 'This is your vocabulary. Names, products and team lingo, always spelled your way.', html: `
      ${head('03', 'The vocabulary', 'Your words, <span>always right</span>', 'Names, products and team lingo are never turned into ordinary English.')}
      ${badge('spell', 'Your dictionary', 'Add words or import Slack')}
      <div class="vv-app">${rail('Vocabulary')}<div class="vv-page"><h4>Vocabulary</h4><div class="desc">Words Voxly must always spell your way.</div>
        <div class="vv-card"><h5>Your words</h5><div class="vv-chips">${['GoHighLevel', 'HLPT', 'GHL', 'Guest Support', 'LeadConnector', 'sub-account', 'Snapshots', 'Workflows'].map((w, i) => `<span style="animation-delay:${0.5 + i * 0.18}s">${w}</span>`).join('')}</div></div>
        <div class="vv-card"><h5>Sounds-like fixes</h5>
          <div class="vv-fix"><s>lead captor</s> → <b>LeadConnector</b></div>
          <div class="vv-fix"><s>h l p t</s> → <b>HLPT</b></div></div>
        <span class="vv-btn">Import Slack export</span> <span class="vv-btn ghost">Add a word</span>
      </div></div>` },
    { name: 'The memory', dur: 5.7, clip: 4.82, say: 'And this is the memory. Voxly learns your rules and style, even from your edits.', html: `
      ${head('04', 'The memory', 'It learns <span>how you write</span>', 'Rules and style you set, plus fixes Voxly notices from your edits.')}
      ${badge('brain', 'The memory', 'Memory and skills')}
      <div class="vv-app">${rail('Memory')}<div class="vv-page"><h4>Memory and skills</h4><div class="desc">Used on every dictation that matches.</div>
        <div class="vv-card"><h5>Your rules and style</h5>
          <div class="vv-mem" style="animation-delay:.5s"><em class="r">Rule</em>Write sub-account with a hyphen</div>
          <div class="vv-mem" style="animation-delay:.8s"><em class="s">Style</em>Keep Slack messages short and friendly</div>
          <div class="vv-mem" style="animation-delay:1.1s"><em class="s">Style</em>Sign emails with "Thanks, Alex"</div>
          <div class="vv-mem" style="animation-delay:1.7s"><em class="n">Noticed</em><div>You changed "Hi team" to "Hey team"</div><div class="acts"><span class="yes" data-accept>Accept</span><span>Dismiss</span></div></div>
        </div>
      </div></div>${cursor}` },
    { name: 'Fits the app', dur: 4.6, clip: 3.71, say: 'Email, chat, or a customer reply. The text fits every app.', html: `
      ${head('05', 'The style', 'Fits <span>every app</span>', 'Email gets a greeting and sign-off. Chat stays short. Support replies read clearly.')}
      <div class="vv-said"><small>You said</small>hi mark the report is ready thanks alex</div>
      <div class="vv-styles">
        <div class="vv-sbox" style="animation-delay:.4s"><b><i style="background:#3d8bff">@</i>Email</b>Hi Mark,

The report is ready.

Thanks,
Alex</div>
        <div class="vv-sbox" style="animation-delay:.8s"><b><i style="background:#7c5cff">#</i>Chat</b>Hi Mark, the report is ready. Thanks, Alex</div>
        <div class="vv-sbox" style="animation-delay:1.2s"><b><i style="background:#16a34a">G</i>Customer reply</b>Hi Mark,

Thanks for your patience. The report is ready for you now.</div>
      </div>` },
    { name: 'The fixer', dur: 6, clip: 3.93, say: 'Select any text, click Voxly, and make it professional in one click.', html: `
      ${head('06', 'The fixer', 'Fix any text <span>in one click</span>', 'Select text anywhere. Fix grammar, rephrase, shorten, or make it professional.')}
      ${badge('wand', 'Selection button', 'Works in any app')}
      <div class="vv-doc"><h6>Draft · Notes</h6><div class="t" data-doc>hey can u send me them reports by friday its kinda urgent thx</div>
        <div class="vv-fixbtn" data-fb><img src="${LOGO}" alt="">Voxly</div>
        <div class="vv-menu" data-menu><div>Fix grammar</div><div>Rephrase</div><div>Shorter</div><div data-pro>Professional</div></div>
        <div class="vv-undo" data-undo><span>Undo</span>Ctrl+Z puts the original back</div>
        ${cursor}
      </div>` },
    { name: 'Get Voxly', dur: 4, clip: 1.69, say: "Voxly. Speak. It's written.", html: `
      <div class="vv-center"><img src="${LOGO}" alt=""><h3>Speak. <span>It's written.</span></h3><p>Free for Windows 10 and 11</p>
        <div class="row"><span>Online + offline</span><span>Grammar fixes</span><span>Your vocabulary</span><span>Starts with Windows</span></div></div>` },
  ];
  const total = scenes.reduce((a, s) => a + s.dur, 0);
  let acc = 0; scenes.forEach((s) => { s.start = acc; acc += s.dur; });

  root.classList.add('vv-frame'); if (full) root.classList.add('full');
  root.innerHTML = `<div class="vv-viewport"><div class="vv-stage" role="img" aria-label="Animated walkthrough of Voxly"><div class="vv-grid"></div>${scenes.map((s, i) => `<section class="vv-scene" data-i="${i}">${s.html}</section>`).join('')}<div class="vv-cap" aria-live="off"><p></p></div></div>
    <button class="vv-sound" type="button"><span>${'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'}</span>Play with sound</button></div>
    <div class="vv-controls"><button class="vv-play" aria-label="Pause"></button><button class="vv-mute" aria-label="Turn sound on"></button><div class="vv-track">${scenes.map((s, i) => `<button style="--w:${s.dur}" data-seek="${i}" aria-label="${s.name}"><i><b></b></i><span>${s.name}</span></button>`).join('')}</div><span class="vv-time">0:00 / 0:${String(Math.round(total)).padStart(2, '0')}</span></div>`;

  const stage = root.querySelector('.vv-stage');
  const viewport = root.querySelector('.vv-viewport');
  const els = [...root.querySelectorAll('.vv-scene')];
  const segs = [...root.querySelectorAll('.vv-track button')];
  const playBtn = root.querySelector('.vv-play');
  const timeEl = root.querySelector('.vv-time');
  const fit = () => { const k = viewport.clientWidth / 960; stage.style.transform = `scale(${k})`; const cp = root.querySelector('.vv-cap p'); if (cp && k) cp.style.fontSize = `${Math.max(19, 9.5 / k)}px`; };
  fit(); window.addEventListener('resize', fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(viewport);

  const capP = root.querySelector('.vv-cap p');
  const soundBtn = root.querySelector('.vv-sound');
  const muteBtn = root.querySelector('.vv-mute');
  const audio = root.dataset.audio ? new Audio(root.dataset.audio) : null;
  if (audio) { audio.preload = 'auto'; } else { soundBtn.remove(); muteBtn.remove(); }
  let soundOn = false;
  const capWords = scenes.map((sc) => sc.say.split(' '));
  const capHTML = scenes.map((sc, i) => capWords[i].map((w, j) => `<span data-w="${j}">${w}</span>`).join(' '));
  let capFor = -1;
  const caption = (i, t) => {
    if (capFor !== i) { capP.innerHTML = capHTML[i]; capFor = i; }
    const sc = scenes[i], words = capWords[i];
    const k = (t - 0.35) / sc.clip; // 0..1 through the spoken line
    const total = words.reduce((a, w) => a + w.length + 1, 0);
    let acc = 0;
    capP.querySelectorAll('span').forEach((sp, j) => { acc += words[j].length + 1; sp.classList.toggle('said', k * total >= acc - words[j].length - 1 && k > 0); });
    capP.parentElement.classList.toggle('show', t > 0.2 && t < sc.clip + 0.9);
  };
  const ico = { on: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4Zm-2.5-8.8v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z"/></svg>', off: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.6 3 2.2-2.2-1.4-1.4-2.2 2.2-2.2-2.2-1.4 1.4 2.2 2.2-2.2 2.2 1.4 1.4 2.2-2.2 2.2 2.2 1.4-1.4z"/></svg>' };
  const setSound = (on) => {
    soundOn = on && !!audio;
    if (muteBtn.isConnected) { muteBtn.innerHTML = soundOn ? ico.on : ico.off; muteBtn.setAttribute('aria-label', soundOn ? 'Mute' : 'Turn sound on'); }
    root.classList.toggle('sound', soundOn);
    if (!audio) return;
    if (!soundOn) audio.pause();
  };
  const globalT = () => (cur < 0 ? 0 : scenes[cur].start + sceneT);
  const syncAudio = () => {
    if (!audio || !soundOn) return;
    if (!playing || !visible) { if (!audio.paused) audio.pause(); return; }
    const g = globalT();
    if (Math.abs(audio.currentTime - g) > 0.3) { try { audio.currentTime = g; } catch (e) {} }
    if (audio.paused) audio.play().catch(() => {});
  };
  const q = (i, sel) => els[i].querySelector(sel);
  const qa = (i, sel) => [...els[i].querySelectorAll(sel)];

  // Bars in the pill
  const barsBox = q(1, '[data-bars]');
  for (let i = 0; i < 16; i++) barsBox.appendChild(document.createElement('i'));
  const bars = [...barsBox.children];

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const hlText = (t, n) => {
    let out = '', shown = 0, i = 0;
    while (i < t.length && shown < n) {
      if (t[i] === '[') { const e = t.indexOf(']', i); const w = t.slice(i + 1, e); const k = Math.min(w.length, n - shown); out += k === w.length ? `<span class="hl">${esc(w)}</span>` : esc(w.slice(0, k)); shown += k; i = e + 1; }
      else { out += esc(t[i]); shown++; i++; }
    }
    return out;
  };
  const RAW = 'yeah so um the h l p t fix went out this morning uh guest support can tell customers';
  const OUT = 'Yes, the [HLPT] fix went out this morning. [Guest Support] can tell customers.';
  const OUTLEN = OUT.replace(/[\[\]]/g, '').length;
  const EXAMPLES = ['um so the deploy is uh done i think we can tell guest support', 'The deploy is done. I think we can tell Guest Support.', 'The deploy is done, so we can let Guest Support know.'];

  // Per-scene frame functions, t = seconds into the scene. Must be pure for a given t.
  const frame = [
    () => {},
    (t) => {
      const keys = q(1, '[data-keys]'), lab = q(1, '[data-klabel]'), pill = q(1, '[data-pill]'), st = q(1, '[data-pstate]'), comp = q(1, '[data-compose]'), timer = q(1, '[data-timer]');
      const rec = t > 0.9 && t < 3.7, work = t >= 3.7 && t < 4.4;
      keys.classList.toggle('down', rec); lab.textContent = rec ? 'recording' : t >= 3.7 ? 'released' : 'hold to talk';
      pill.classList.toggle('show', rec || work); pill.classList.toggle('work', work); st.textContent = work ? 'Correcting…' : 'Listening…';
      bars.forEach((b, i) => { b.style.height = `${rec ? 4 + Math.abs(Math.sin(t * 9 + i * 0.7)) * (6 + (i % 4) * 3) : 4}px`; });
      timer.classList.toggle('show', t > 4.4);
      if (t < 1.1) comp.innerHTML = '<span class="raw">Message #team-updates</span>';
      else if (t < 4.4) { const w = RAW.split(' '); comp.innerHTML = `<span class="raw">${esc(w.slice(0, Math.min(w.length, Math.floor((t - 1.1) / 2.5 * w.length) + 1)).join(' '))}</span>`; }
      else comp.innerHTML = hlText(OUT, Math.floor((t - 4.4) * 90));
    },
    (t) => {
      const mode = t < 1.6 ? 1 : t < 3.2 ? 0 : 2;
      qa(2, '[data-m]').forEach((s, i) => s.classList.toggle('on', i === mode));
      q(2, '[data-ex]').textContent = EXAMPLES[mode];
      const eng = t > 4.2 ? 1 : 0;
      qa(2, '[data-r]').forEach((r, i) => r.classList.toggle('on', i === eng));
    },
    () => {},
    (t) => {
      const c = q(4, '.vv-cursor'), acc = q(4, '[data-accept]');
      c.style.left = t < 2.6 ? '900px' : '808px'; c.style.top = t < 2.6 ? '480px' : '342px';
      c.classList.toggle('click', t > 3.3 && t < 3.5); acc.classList.toggle('done', t > 3.4);
      acc.textContent = t > 3.4 ? 'Saved' : 'Accept';
    },
    () => {},
    (t) => {
      const doc = q(6, '[data-doc]'), fb = q(6, '[data-fb]'), menu = q(6, '[data-menu]'), pro = q(6, '[data-pro]'), undo = q(6, '[data-undo]'), c = q(6, '.vv-cursor');
      const src = 'hey can u send me them reports by friday its kinda urgent thx';
      const fixed = 'Hi, could you please send me the reports by Friday? It is fairly urgent. Thank you.';
      const selN = t < 0.8 ? 0 : Math.min(src.length, Math.floor((t - 0.8) / 0.9 * src.length));
      if (t < 4.1) doc.innerHTML = `<span class="sel">${esc(src.slice(0, selN))}</span>${esc(src.slice(selN))}`;
      else doc.textContent = fixed;
      fb.classList.toggle('show', t > 1.9 && t < 4.1);
      menu.classList.toggle('show', t > 2.7 && t < 4.1);
      pro.classList.toggle('hot', t > 3.4 && t < 4.1);
      undo.classList.toggle('show', t > 4.3);
      const pos = t < 0.8 ? [26, 48] : t < 1.7 ? [500, 72] : t < 2.5 ? [80, 162] : t < 3.6 ? [100, 288] : [470, 330];
      c.style.left = pos[0] + 'px'; c.style.top = pos[1] + 'px';
      c.classList.toggle('click', (t > 2.5 && t < 2.65) || (t > 3.6 && t < 3.75));
    },
    () => {},
  ];

  let cur = -1, sceneT = 0, playing = !reduce, last = performance.now(), visible = full;
  const show = (i) => {
    if (cur === i) return;
    if (cur >= 0) { els[cur].classList.remove('on', 'play'); }
    cur = i; sceneT = 0;
    void els[i].offsetWidth; els[i].classList.add('on', 'play');
    segs.forEach((s, j) => s.classList.toggle('cur', j === i));
  };
  const setPlay = (p) => {
    playing = p; stage.classList.toggle('paused', !p);
    playBtn.innerHTML = p ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    playBtn.setAttribute('aria-label', p ? 'Pause' : 'Play');
  };
  const draw = () => {
    frame[cur](sceneT);
    caption(cur, sceneT);
    syncAudio();
    const g = scenes[cur].start + sceneT;
    segs.forEach((s, j) => { const sc = scenes[j]; s.querySelector('b').style.width = `${Math.max(0, Math.min(1, (g - sc.start) / sc.dur)) * 100}%`; });
    const sec = Math.floor(g);
    timeEl.textContent = `0:${String(sec).padStart(2, '0')} / 0:${String(Math.round(total)).padStart(2, '0')}`;
  };
  const loop = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (playing && visible) {
      sceneT += dt;
      if (sceneT >= scenes[cur].dur) { show((cur + 1) % scenes.length); }
    }
    draw();
    requestAnimationFrame(loop);
  };

  playBtn.addEventListener('click', () => setPlay(!playing));
  if (audio) {
    muteBtn.addEventListener('click', (e) => { e.stopPropagation(); setSound(!soundOn); if (soundOn) root.classList.add('heard'); });
    soundBtn.addEventListener('click', (e) => { e.stopPropagation(); root.classList.add('heard'); cur = -1; show(0); setPlay(true); setSound(true); audio.currentTime = 0; audio.play().catch(() => {}); });
    // First click or tap anywhere on the page turns the narration on (browsers need a user gesture).
    const firstGesture = (e) => {
      document.removeEventListener('pointerdown', firstGesture, true);
      if (root.contains(e.target) || root.classList.contains('heard')) return;
      root.classList.add('heard'); setSound(true); audio.play().catch(() => {});
    };
    document.addEventListener('pointerdown', firstGesture, true);
  }
  stage.addEventListener('click', () => setPlay(!playing));
  segs.forEach((s) => s.addEventListener('click', () => { const i = +s.dataset.seek; cur = -1; show(i); setPlay(true); }));
  if ('IntersectionObserver' in window && !full) {
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0.35 }).observe(root);
  } else visible = true;

  show(reduce ? 2 : 0); setPlay(playing); setSound(false);
  if (reduce) { sceneT = 1; }
  requestAnimationFrame((n) => { last = n; loop(n); });

  // For recording: window.voxlyVideo.restart()
  window.voxlyVideo = { restart: () => { cur = -1; show(0); setPlay(true); }, total, scenes: scenes.map((x) => ({ name: x.name, start: x.start, dur: x.dur })) };
})();

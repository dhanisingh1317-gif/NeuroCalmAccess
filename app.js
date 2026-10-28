/* NeuroCalm Access - prototype. Data is saved in the browser (localStorage). */
const $ = (s, r = document) => r.querySelector(s);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- Characters (drawn in SVG, swap for sticker PNGs later) ---------- */
const CLOUD = '<g fill="#fff" stroke="#e4eef7" stroke-width="3"><circle cx="40" cy="58" r="22"/><circle cx="66" cy="42" r="27"/><circle cx="94" cy="58" r="22"/><rect x="40" y="58" width="54" height="22"/></g>';
function cloudy(mood = 'happy') {
  const eyes = { happy: '<circle cx="54" cy="54" r="3.4"/><circle cx="80" cy="54" r="3.4"/>', sleepy: '<path d="M50 54q4 4 9 0M76 54q4 4 9 0" fill="none" stroke="#4a4a68" stroke-width="3" stroke-linecap="round"/>', sad: '<circle cx="54" cy="56" r="3.4"/><circle cx="80" cy="56" r="3.4"/>' }[mood];
  const mouth = { happy: 'M60 62q7 7 14 0', sleepy: 'M62 64q5 4 10 0', sad: 'M60 67q7-6 14 0' }[mood];
  return `<svg viewBox="0 0 130 90">${CLOUD}<g fill="#4a4a68">${eyes}</g><path d="${mouth}" fill="none" stroke="#4a4a68" stroke-width="3" stroke-linecap="round"/><ellipse cx="46" cy="63" rx="6" ry="4" fill="#ffb3c6"/><ellipse cx="88" cy="63" rx="6" ry="4" fill="#ffb3c6"/></svg>`;
}
const MOODS = [
  { k: 'happy', l: 'Happy', c: '#ffe9a8', say: 'Yay! Your sunshine is showing.', cl: 'happy' },
  { k: 'calm', l: 'Calm', c: '#cfe6c4', say: 'Nice and steady. Keep that calm going.', cl: 'happy' },
  { k: 'tired', l: 'Tired', c: '#d9d4f2', say: 'Sleepy brain? A sip of water and a stretch can help.', cl: 'sleepy' },
  { k: 'stressed', l: 'Stressed', c: '#ffd0b8', say: 'Big hug. Try the breathing bubble below with me.', cl: 'sad' },
  { k: 'overwhelmed', l: 'Overwhelmed', c: '#c9e3f7', say: 'One small step at a time. Start with one slow breath.', cl: 'sad' }
];
function face(k, c) {
  const dot = '<circle cx="30" cy="38" r="3.6"/><circle cx="50" cy="38" r="3.6"/>';
  const parts = {
    happy: [dot, 'M30 50q10 10 20 0'],
    calm: ['<path d="M25 38q5 5 10 0M45 38q5 5 10 0" fill="none" stroke="#4a4a68" stroke-width="3" stroke-linecap="round"/>', 'M34 52q6 5 12 0'],
    tired: ['<path d="M25 38h10M45 38h10" stroke="#4a4a68" stroke-width="3" stroke-linecap="round"/>', 'M34 54h12'],
    stressed: [dot + '<path d="M24 29l10 3M56 29l-10 3" stroke="#4a4a68" stroke-width="3" stroke-linecap="round"/>', 'M28 54l5-4 5 4 5-4 5 4 4-3'],
    overwhelmed: ['<circle cx="30" cy="38" r="6" fill="#fff" stroke="#4a4a68" stroke-width="2.5"/><circle cx="50" cy="38" r="6" fill="#fff" stroke="#4a4a68" stroke-width="2.5"/><circle cx="30" cy="39" r="2.4"/><circle cx="50" cy="39" r="2.4"/>', 'M40 50a5 6 0 1 0 .1 0']
  }[k];
  return `<svg viewBox="0 0 80 80"><circle cx="40" cy="42" r="34" fill="${c}" stroke="#fff" stroke-width="4"/><g fill="#4a4a68">${parts[0]}</g><path d="${parts[1]}" fill="none" stroke="#4a4a68" stroke-width="3" stroke-linecap="round"/><ellipse cx="20" cy="50" rx="5" ry="3.5" fill="#ffb3c6" opacity=".8"/><ellipse cx="60" cy="50" rx="5" ry="3.5" fill="#ffb3c6" opacity=".8"/></svg>`;
}
function sprout(stage) {
  const pot = '<path d="M26 70h28l-4 22H30z" fill="#e9b79a" stroke="#fff" stroke-width="3"/><rect x="23" y="64" width="34" height="9" rx="4" fill="#f2c9b0" stroke="#fff" stroke-width="3"/>';
  const leaf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="#a9d98f" stroke="#fff" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`;
  let top = '';
  if (stage >= 1) top += '<path d="M40 64V44" stroke="#7fbf6a" stroke-width="4" stroke-linecap="round"/>' + leaf(32, 46, -25) + leaf(48, 46, 25);
  if (stage >= 2) top += '<path d="M40 44V30" stroke="#7fbf6a" stroke-width="4" stroke-linecap="round"/>' + leaf(30, 32, -30) + leaf(50, 32, 30);
  if (stage >= 3) top += '<g transform="translate(40 22)"><circle r="5" fill="#fff3a0"/>' + [0, 72, 144, 216, 288].map(a => `<ellipse cy="-9" rx="5" ry="7" fill="#ffb3c6" stroke="#fff" stroke-width="1.5" transform="rotate(${a})"/>`).join('') + '<circle r="4.5" fill="#ffe27a"/></g>';
  if (stage === 0) top = '<ellipse cx="40" cy="62" rx="6" ry="4" fill="#9b7653"/>';
  return `<svg viewBox="0 0 80 96">${top}${pot}${stage === 0 ? '<path d="M33 80q3 3 6 0M42 80q3 3 6 0" stroke="#4a4a68" stroke-width="2" fill="none"/>' : '<circle cx="35" cy="79" r="1.8" fill="#4a4a68"/><circle cx="45" cy="79" r="1.8" fill="#4a4a68"/><path d="M37 83q3 3 6 0" stroke="#4a4a68" stroke-width="2" fill="none"/>'}</svg>`;
}
function sun() {
  const rays = Array.from({ length: 10 }, (_, i) => `<rect x="62" y="6" width="6" height="16" rx="3" fill="#ffd96b" transform="rotate(${i * 36} 65 50)"/>`).join('');
  return `<svg viewBox="0 0 130 100">${rays}<circle cx="65" cy="50" r="30" fill="#ffe27a" stroke="#fff" stroke-width="4"/><g fill="#4a4a68"><circle cx="55" cy="46" r="3.2"/><circle cx="75" cy="46" r="3.2"/></g><path d="M57 57q8 8 16 0" fill="none" stroke="#4a4a68" stroke-width="3" stroke-linecap="round"/><ellipse cx="48" cy="55" rx="6" ry="4" fill="#ffb3c6"/><ellipse cx="82" cy="55" rx="6" ry="4" fill="#ffb3c6"/></svg>`;
}

/* ---------- Navigation + speech bubbles ---------- */
const HELLO = { home: () => { const h = new Date().getHours(); return (h < 5 ? 'Up so late? I am right here with you.' : h < 12 ? 'Good morning! How is your heart today?' : h < 18 ? 'Hi there! Ready for a calm little break?' : 'Good evening! Let us make studying gentler.'); },
  stress: () => 'Tap the face that matches how you feel. There are no wrong answers.',
  focus: () => 'Pick a time and start. I will grow every time you finish a session.',
  about: () => 'Hi, I am Sunny! Here is why we made NeuroCalm Access.',
  design: () => 'Here is why everything looks this way, and how we will test it.' };
const say = (id, t) => { const b = $('#say-' + id); if (b) b.textContent = t; };
function go(name) {
  document.querySelectorAll('.view').forEach(v => v.hidden = v.id !== 'v-' + name);
  document.body.dataset.page = name;
  say(name, HELLO[name]());
  if (name === 'stress') drawBars();
  if (name === 'focus') drawFocus();
  history.replaceState(null, '', '#' + name);
  scrollTo(0, 0);
}
document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go); });
$('#calmBtn').onclick = e => {
  const on = document.body.classList.toggle('calm');
  e.target.textContent = 'Calm mode: ' + (on ? 'on' : 'off'); e.target.setAttribute('aria-pressed', on);
};

/* ---------- Stress Check ---------- */
$('#homeCloud').innerHTML = cloudy('happy');
$('#stressCloud').innerHTML = cloudy('happy');
$('#sunBig').innerHTML = sun(); $('#sunBig2').innerHTML = sun();
$('#moods').innerHTML = MOODS.map(m => `<button class="mood" data-k="${m.k}" aria-label="${m.l}">${face(m.k, m.c)}<span>${m.l}</span></button>`).join('');
const dayKey = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
$('#moods').onclick = e => {
  const b = e.target.closest('.mood'); if (!b) return;
  const m = MOODS.find(x => x.k === b.dataset.k);
  const log = store.get('nc_moods', []); log.push({ k: m.k, t: Date.now() }); store.set('nc_moods', log);
  $('#stressCloud').innerHTML = cloudy(m.cl); say('stress', m.say);
  b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 400);
  drawBars();
};
function drawBars() {
  const since = Date.now() - 7 * 864e5, log = store.get('nc_moods', []).filter(x => x.t > since);
  const n = MOODS.map(m => log.filter(x => x.k === m.k).length), max = Math.max(1, ...n);
  $('#bars').innerHTML = MOODS.map((m, i) => `<div class="bcol"><i>${n[i]}</i><div class="bar" style="height:${n[i] / max * 100}px;background:${m.c}"></div>${face(m.k, m.c)}</div>`).join('');
  $('#barNote').textContent = log.length ? 'Check-ins this week: ' + log.length : 'No check-ins yet. Tap a face above to start your chart.';
}

/* ---------- Breathing ---------- */
const MODES = {
  whale: { text: 'Whale: inhale big, hold, exhale strong like a water spout.', steps: [['Breathe in big', 4, 1.45], ['Hold', 2, 1.45], ['Blow out strong', 6, 1]] },
  snake: { text: 'Snake: inhale through your nose, exhale with a long "sssss".', steps: [['Breathe in', 4, 1.45], ['Ssssssss...', 8, 1]] }
};
let mode = 'whale', breathing = false;
const orb = $('#orb'), orbText = $('#orbText'), sleep = ms => new Promise(r => setTimeout(r, ms));
function setMode(m) {
  mode = m; $('#modeText').textContent = MODES[m].text; orb.classList.toggle('snake', m === 'snake');
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
}
document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { if (!breathing) setMode(b.dataset.mode); });
setMode('whale');
$('#breathGo').onclick = async e => {
  if (breathing) { breathing = false; return; }
  breathing = true; e.target.textContent = 'Stop';
  say('stress', 'Follow the bubble with me. Slow and soft.');
  for (let round = 0; round < 4 && breathing; round++)
    for (const [label, sec, scale] of MODES[mode].steps) {
      if (!breathing) break;
      orb.style.transitionDuration = (document.body.classList.contains('calm') ? 0 : sec) + 's';
      orb.style.transform = `scale(${scale})`; orbText.textContent = label; await sleep(sec * 1000);
    }
  orb.style.transform = 'scale(1)'; orbText.textContent = 'Ready?'; e.target.textContent = 'Start';
  if (breathing) say('stress', 'Beautiful. Notice how your shoulders feel now.'); breathing = false;
};

/* ---------- Focus Support ---------- */
let mins = 25, left = 25 * 60, timer = null;
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
const weekDates = () => { const d = new Date(); const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return x; }); };
function drawFocus() {
  const data = store.get('nc_focus', {}), dates = weekDates(), names = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const counts = dates.map(d => data[dayKey(d)] || 0), total = counts.reduce((a, b) => a + b, 0);
  $('#week').innerHTML = counts.map((c, i) => `<div><div class="day">${Array.from({ length: Math.min(c, 6) }, () => sprout(1).replace(/<svg /, '<svg style="width:34px" ')).join('')}</div><div class="dl">${names[i]}</div></div>`).join('');
  $('#plantBig').innerHTML = sprout(total === 0 ? 0 : total === 1 ? 1 : total < 4 ? 2 : 3);
}
$('#mins').onclick = e => {
  const b = e.target.closest('[data-m]'); if (!b || timer) return;
  mins = +b.dataset.m; left = mins * 60; $('#clock').textContent = fmt(left);
  document.querySelectorAll('#mins .btn').forEach(x => x.classList.toggle('on', x === b));
};
$('#focusGo').onclick = e => {
  if (timer) { clearInterval(timer); timer = null; e.target.textContent = 'Start focusing'; left = mins * 60; $('#clock').textContent = fmt(left); say('focus', 'No worries. We can start again whenever you are ready.'); return; }
  e.target.textContent = 'Stop'; say('focus', 'You can do this. I am cheering quietly.');
  timer = setInterval(() => {
    left--; $('#clock').textContent = fmt(left);
    if (left <= 0) {
      clearInterval(timer); timer = null; e.target.textContent = 'Start focusing'; left = mins * 60; $('#clock').textContent = fmt(left);
      const data = store.get('nc_focus', {}), k = dayKey(new Date()); data[k] = (data[k] || 0) + 1; store.set('nc_focus', data);
      say('focus', 'Session done! Your plant just got a big drink of water.'); drawFocus();
    }
  }, 1000);
};

go(location.hash.slice(1) in HELLO ? location.hash.slice(1) : 'home');

let startTime = 0;
let elapsed   = 0;
let timerInterval = null;
let running   = false;
let laps      = [];
let lapStart  = 0;

const display    = document.getElementById('display');
const displayMs  = document.getElementById('display-ms');
const btnMain    = document.getElementById('btn-main');
const btnLap     = document.getElementById('btn-lap');
const btnReset   = document.getElementById('btn-reset');
const lapList    = document.getElementById('lap-list');
const lapSection = document.getElementById('lap-section');


function fmt(ms) {
  const t = Math.floor(ms);
  const s = Math.floor(t / 1000) % 60;
  const m = Math.floor(t / 60000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function fmtMs(ms) {
  return '.' + String(Math.floor(ms % 1000)).padStart(3, '0');
}


function tick() {
  elapsed = Date.now() - startTime;
  display.textContent   = fmt(elapsed);
  displayMs.textContent = fmtMs(elapsed);
}


function toggleStartPause() {
  if (!running) {
    startTime = Date.now() - elapsed;
    if (laps.length === 0) lapStart = startTime;
    timerInterval = setInterval(tick, 30);
    running = true;

    btnMain.textContent = '⏸ Pause';
    btnMain.className   = 'btn btn-pause';
    btnLap.disabled     = false;
    btnReset.disabled   = false;
  } else {
    clearInterval(timerInterval);
    running = false;

    btnMain.textContent = '▶ Resume';
    btnMain.className   = 'btn btn-start';
    btnLap.disabled     = true;
  }
}

function recordLap() {
  if (!running) return;
  const now   = Date.now();
  const split = now - lapStart;
  lapStart    = now;
  laps.unshift({ num: laps.length + 1, split });
  renderLaps();
  lapSection.style.display = 'block';
}

function renderLaps() {
  const splits = laps.map(l => l.split);
  const best   = Math.min(...splits);
  const worst  = Math.max(...splits);

  lapList.innerHTML = laps.map((l, i) => {
    const totalMs = laps.slice(i).reduce((a, b) => a + b.split, 0);
    const cls = splits.length > 1
      ? (l.split === best  ? 'lap-best'
       : l.split === worst ? 'lap-worst' : '')
      : '';

    return `<li class="lap-item ${cls}">
      <span class="lap-num">Lap ${l.num}</span>
      <span class="lap-split">${fmt(l.split)}${fmtMs(l.split)}</span>
      <span class="lap-total">${fmt(totalMs)}${fmtMs(totalMs)}</span>
    </li>`;
  }).join('');
}


function resetWatch() {
  clearInterval(timerInterval);
  running  = false;
  elapsed  = 0;
  laps     = [];
  lapStart = 0;

  display.textContent   = '00:00';
  displayMs.textContent = '.000';

  btnMain.textContent = '▶ Start';
  btnMain.className   = 'btn btn-start';
  btnLap.disabled     = true;
  btnReset.disabled   = true;

  lapList.innerHTML        = '';
  lapSection.style.display = 'none';
}
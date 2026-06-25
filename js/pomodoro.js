const Pomodoro = (() => {
  const WORK  = 25 * 60;
  const BREAK = 5  * 60;
  const MAX_SESSIONS = 4;

  let remaining = WORK;
  let isRunning  = false;
  let isWork     = true;
  let session    = 1;
  let interval   = null;

  function toggle() {
    if (isRunning) { _pause(); } else { _start(); }
  }

  function reset() {
    _pause();
    isWork    = true;
    session   = 1;
    remaining = WORK;
    _render();
  }

  function _start() {
    isRunning = true;
    document.getElementById('pom-play-btn').innerHTML = '<span class="material-icons">pause</span>';
    interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) { _next(); } else { _render(); }
    }, 1000);
  }

  function _pause() {
    isRunning = false;
    clearInterval(interval);
    document.getElementById('pom-play-btn').innerHTML = '<span class="material-icons">play_arrow</span>';
  }

  function _next() {
    _pause();
    if (isWork) {
      // work done → break
      isWork    = false;
      remaining = BREAK;
      _notify('Pausa! 5 minuti di riposo ☕');
    } else {
      // break done → next work session
      isWork = true;
      if (session < MAX_SESSIONS) session++;
      remaining = WORK;
      _notify('Forza! Inizia la sessione ' + session + ' 🍅');
    }
    _render();
    _start();
  }

  function _render() {
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    document.getElementById('pom-timer').textContent = `${m}:${s}`;
    document.getElementById('pom-mode').textContent  = isWork ? 'Lavoro' : 'Pausa';
    document.getElementById('pom-session').textContent = `Sessione ${session}`;

    // dots
    const dots = document.getElementById('pom-dots');
    if (dots) {
      dots.innerHTML = Array.from({ length: MAX_SESSIONS }, (_, i) =>
        `<div class="pom-dot${i < session - 1 || (!isWork && i < session) ? ' done' : ''}"></div>`
      ).join('');
    }

    // change title color during break
    const modeEl = document.getElementById('pom-mode');
    if (modeEl) modeEl.style.color = isWork ? 'var(--red)' : 'var(--green)';
  }

  function _notify(msg) {
    // browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Laurea Tracker', { body: msg, icon: '' });
    }
    // always show toast
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
  }

  function init() {
    _render();
    // ask notification permission silently
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  return { toggle, reset, init };
})();

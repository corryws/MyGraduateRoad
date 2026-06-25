const Profilo = (() => {
  const KEY = 'lt-profilo';

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }
  function save() {
    const p = {
      nome:  document.getElementById('p-nome').value.trim(),
      corso: document.getElementById('p-corso').value.trim(),
      uni:   document.getElementById('p-uni').value.trim(),
    };
    localStorage.setItem(KEY, JSON.stringify(p));
    _updateTopbar(p);
    close();
    _toast('Profilo salvato');
  }
  function openModal() {
    const p = get();
    document.getElementById('p-nome').value  = p.nome  || '';
    document.getElementById('p-corso').value = p.corso || '';
    document.getElementById('p-uni').value   = p.uni   || '';
    document.getElementById('modal-profilo').classList.add('open');
  }
  function close() { document.getElementById('modal-profilo').classList.remove('open'); }
  function closeOnBackdrop(e) { if (e.target === document.getElementById('modal-profilo')) close(); }

  function _updateTopbar(p) {
    const sub = document.getElementById('topbar-sub');
    const title = document.getElementById('topbar-title');
    if (p.nome) {
      sub.textContent = `Ciao, ${p.nome}! 🎓`;
    } else {
      sub.textContent = 'Ciao! 🎓';
    }
  }

  function init() {
    const p = get();
    _updateTopbar(p);
    // click sul titolo apre il profilo
    document.getElementById('topbar-title').addEventListener('click', openModal);
  }

  function _toast(msg) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  return { init, openModal, save, close, closeOnBackdrop };
})();

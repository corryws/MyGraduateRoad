const ModalAppello = (() => {
  const KEY = 'lt-appelli';
  let editingId = null;

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }
  function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

  function openAdd() {
    editingId = null;
    document.getElementById('modal-appello-title').textContent = 'Aggiungi appello';
    document.getElementById('fa-nome').value  = '';
    document.getElementById('fa-data').value  = '';
    document.getElementById('fa-aula').value  = '';
    document.getElementById('btn-delete-appello').style.display = 'none';
    document.getElementById('modal-appello').classList.add('open');
  }

  function openEdit(id) {
    const list = getAll();
    const a    = list.find(x => x.id === id);
    if (!a) return;
    editingId = id;
    document.getElementById('modal-appello-title').textContent = 'Modifica appello';
    document.getElementById('fa-nome').value  = a.nome  || '';
    document.getElementById('fa-data').value  = a.data  || '';
    document.getElementById('fa-aula').value  = a.aula  || '';
    document.getElementById('btn-delete-appello').style.display = 'block';
    document.getElementById('modal-appello').classList.add('open');
  }

  function save() {
    const nome = document.getElementById('fa-nome').value.trim();
    const data = document.getElementById('fa-data').value;
    const aula = document.getElementById('fa-aula').value.trim();
    if (!nome) { document.getElementById('fa-nome').focus(); return; }

    let list = getAll();
    if (editingId) {
      const idx = list.findIndex(x => x.id === editingId);
      if (idx !== -1) list[idx] = { ...list[idx], nome, data, aula };
    } else {
      list.push({ id: Date.now().toString(), nome, data, aula });
    }
    _save(list);
    close();
    renderHome();
  }

  function deleteAppello() {
    if (!editingId) return;
    let list = getAll().filter(x => x.id !== editingId);
    _save(list);
    close();
    renderHome();
  }

  function close() { document.getElementById('modal-appello').classList.remove('open'); }
  function closeOnBackdrop(e) { if (e.target === document.getElementById('modal-appello')) close(); }

  function renderHome() {
    const el   = document.getElementById('appelli-home-list');
    if (!el) return;
    const now  = new Date();
    const list = getAll()
      .sort((a, b) => new Date(a.data) - new Date(b.data));

    if (!list.length) {
      el.innerHTML = `<div class="empty-state" style="padding:20px 0 4px;">
        <span class="material-icons">event</span>
        <p>Nessun appello salvato.</p></div>`;
      return;
    }

    el.innerHTML = list.map(a => {
      const d    = a.data ? new Date(a.data) : null;
      const past = d && d < now;
      const diff = d ? Math.ceil((d - now) / (1000 * 60 * 60 * 24)) : null;
      const dateStr = d
        ? d.toLocaleDateString('it-IT', { day:'2-digit', month:'short', year:'numeric' })
          + ' ' + d.toLocaleTimeString('it-IT', { hour:'2-digit', minute:'2-digit' })
        : '–';
      const meta = [dateStr, a.aula].filter(Boolean).join(' · ');
      const badge = past
        ? 'Passato'
        : diff === 0 ? 'Oggi!'
        : diff === 1 ? 'Domani'
        : diff !== null ? `${diff}gg` : '';

      return `<div class="appello-card${past ? ' past' : ''}" onclick="ModalAppello.openEdit('${a.id}')">
        <div class="ap-icon"><span class="material-icons">event</span></div>
        <div class="ap-info">
          <div class="ap-nome">${_esc(a.nome)}</div>
          <div class="ap-meta">${_esc(meta)}</div>
        </div>
        ${badge ? `<div class="ap-days">${badge}</div>` : ''}
      </div>`;
    }).join('');
  }

  function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { getAll, openAdd, openEdit, save, deleteAppello, close, closeOnBackdrop, renderHome };
})();

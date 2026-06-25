/**
 * modal.js
 * Handles the bottom-sheet modal for adding / editing a materia.
 */
const Modal = (() => {
  let editingId = null;

  /* ── OPEN ──────────────────────────────────────────────────── */
  function openAdd() {
    editingId = null;
    _set('modal-title', 'Aggiungi materia');
    _val('f-nome',  '');
    _val('f-cfu',   '');
    _val('f-stato', 'da-fare');
    _val('f-voto',  '');
    document.getElementById('f-lode').checked = false;
    document.getElementById('btn-delete').style.display = 'none';
    toggleVotoField();
    _open();
  }

  function openEdit(id) {
    const m = Store.getById(id);
    if (!m) return;

    editingId = id;
    _set('modal-title', 'Modifica materia');
    _val('f-nome',  m.nome);
    _val('f-cfu',   m.cfu || '');
    _val('f-stato', m.stato);
    _val('f-voto',  m.voto || '');
    document.getElementById('f-lode').checked = !!m.lode;
    document.getElementById('btn-delete').style.display = 'block';
    toggleVotoField();
    _open();
  }

  /* ── SAVE ──────────────────────────────────────────────────── */
  function save() {
    const nome  = document.getElementById('f-nome').value.trim();
    const cfu   = parseInt(document.getElementById('f-cfu').value)  || 0;
    const stato = document.getElementById('f-stato').value;
    const voto  = stato === 'completata'
      ? parseInt(document.getElementById('f-voto').value) || null
      : null;
    const lode  = stato === 'completata' && document.getElementById('f-lode').checked;

    if (!nome) {
      document.getElementById('f-nome').focus();
      return;
    }

    if (editingId) {
      Store.update(editingId, { nome, cfu, stato, voto, lode });
    } else {
      Store.add({ id: Date.now().toString(), nome, cfu, stato, voto, lode });
    }

    close();
    _refreshAll();
  }

  /* ── DELETE ────────────────────────────────────────────────── */
  function deleteMateria() {
    if (!editingId) return;
    Store.remove(editingId);
    close();
    _refreshAll();
  }

  /* ── HELPERS ────────────────────────────────────────────────── */
  function toggleVotoField() {
    const show = document.getElementById('f-stato').value === 'completata';
    document.getElementById('voto-field').style.display = show ? 'block' : 'none';
    document.getElementById('lode-field').style.display = show ? 'block' : 'none';
  }

  function close() {
    document.getElementById('modal').classList.remove('open');
  }

  function closeOnBackdrop(e) {
    if (e.target === document.getElementById('modal')) close();
  }

  function _open() {
    document.getElementById('modal').classList.add('open');
  }

  function _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function _val(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function _refreshAll() {
    Home.render();
    Graduate.render();
    Materie.render();
  }

  return { openAdd, openEdit, save, deleteMateria, toggleVotoField, close, closeOnBackdrop };
})();

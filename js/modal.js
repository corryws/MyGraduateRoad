const Modal = (() => {
  let editingId = null;

  function openAdd() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Aggiungi materia';
    _val('f-nome',''); _val('f-cfu',''); _val('f-stato','da-fare');
    _val('f-voto',''); _val('f-data','');
    document.getElementById('f-lode').checked = false;
    document.getElementById('btn-delete').style.display = 'none';
    toggleVotoField();
    document.getElementById('modal').classList.add('open');
  }

  function openEdit(id) {
    const m = Store.getById(id);
    if (!m) return;
    editingId = id;
    document.getElementById('modal-title').textContent = 'Modifica materia';
    _val('f-nome',  m.nome);
    _val('f-cfu',   m.cfu || '');
    _val('f-stato', m.stato);
    _val('f-voto',  m.voto || '');
    _val('f-data',  m.data || '');
    document.getElementById('f-lode').checked = !!m.lode;
    document.getElementById('btn-delete').style.display = 'block';
    toggleVotoField();
    document.getElementById('modal').classList.add('open');
  }

  function save() {
    const nome  = document.getElementById('f-nome').value.trim();
    const cfu   = parseInt(document.getElementById('f-cfu').value) || 0;
    const stato = document.getElementById('f-stato').value;
    const voto  = stato === 'completata' ? parseInt(document.getElementById('f-voto').value) || null : null;
    const lode  = stato === 'completata' && document.getElementById('f-lode').checked;
    const data  = stato === 'completata' ? document.getElementById('f-data').value : null;

    if (!nome) { document.getElementById('f-nome').focus(); return; }

    if (editingId) {
      Store.update(editingId, { nome, cfu, stato, voto, lode, data });
    } else {
      Store.add({ id: Date.now().toString(), nome, cfu, stato, voto, lode, data });
    }
    close();
    Home.render(); Graduate.render(); Materie.render();
  }

  function deleteMateria() {
    if (!editingId) return;
    Store.remove(editingId);
    close();
    Home.render(); Graduate.render(); Materie.render();
  }

  function toggleVotoField() {
    const show = document.getElementById('f-stato').value === 'completata';
    document.getElementById('voto-field').style.display = show ? 'block' : 'none';
    document.getElementById('lode-field').style.display = show ? 'block' : 'none';
    document.getElementById('data-field').style.display = show ? 'block' : 'none';
  }

  function close() { document.getElementById('modal').classList.remove('open'); }
  function closeOnBackdrop(e) { if (e.target === document.getElementById('modal')) close(); }
  function _val(id, v) { const el = document.getElementById(id); if (el) el.value = v; }

  return { openAdd, openEdit, save, deleteMateria, toggleVotoField, close, closeOnBackdrop };
})();

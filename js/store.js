/**
 * store.js
 * Single source of truth for app data.
 * All modules read/write through Store.
 */
const Store = (() => {
  const KEY = 'lt-materie';
  let materie = [];

  function load() {
    try {
      materie = JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      materie = [];
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(materie));
  }

  function getAll() {
    return materie;
  }

  function getCompleted() {
    return materie.filter(m => m.stato === 'completata');
  }

  function getById(id) {
    return materie.find(m => m.id === id) || null;
  }

  function add(materia) {
    materie.push(materia);
    save();
  }

  function update(id, data) {
    const idx = materie.findIndex(m => m.id === id);
    if (idx !== -1) {
      materie[idx] = { ...materie[idx], ...data };
      save();
      return true;
    }
    return false;
  }

  function remove(id) {
    materie = materie.filter(m => m.id !== id);
    save();
  }

  // Initialize on load
  load();

  return { getAll, getCompleted, getById, add, update, remove };
})();

/**
 * materie.js
 * Renders the Materie screen with filter chips.
 */
const Materie = (() => {
  let currentFilter = 'all';

  const ICON_MAP = {
    'completata': 'check_circle',
    'in-corso':   'pending',
    'da-fare':    'radio_button_unchecked',
  };

  const LABEL_MAP = {
    'completata': 'Completata',
    'in-corso':   'In corso',
    'da-fare':    'Da fare',
  };

  function render() {
    const all      = Store.getAll();
    const filtered = currentFilter === 'all'
      ? all
      : all.filter(m => m.stato === currentFilter);

    const el = document.getElementById('materie-list');

    if (!filtered.length) {
      el.innerHTML = `
        <div class="empty-state">
          <span class="material-icons">menu_book</span>
          <p>${currentFilter === 'all'
            ? 'Aggiungi la prima materia con il pulsante +.'
            : 'Nessuna materia in questa categoria.'}</p>
        </div>`;
      return;
    }

    el.innerHTML = filtered.map(m => {
      const votoHtml = m.stato === 'completata'
        ? `<div class="mc-voto${m.lode ? ' lode' : ''}">${m.lode ? '30L' : (m.voto || '–')}</div>`
        : '';
      return `
        <div class="materia-card ${m.stato}" onclick="Modal.openEdit('${m.id}')">
          <div class="mc-icon">
            <span class="material-icons">${ICON_MAP[m.stato]}</span>
          </div>
          <div class="mc-info">
            <div class="mc-name">${_esc(m.nome)}</div>
            <div class="mc-meta">${m.cfu || '?'} CFU · ${LABEL_MAP[m.stato]}</div>
          </div>
          ${votoHtml}
        </div>`;
    }).join('');
  }

  function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.filter-chip')
      .forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    render();
  }

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return { render, setFilter };
})();

/**
 * data.js
 * Esporta e importa i dati come file JSON.
 * Usato per trasferire i dati tra dispositivi (PC ↔ iPhone).
 */
const Data = (() => {

  function esporta() {
    const materie = Store.getAll();
    if (!materie.length) {
      _toast('Nessun dato da esportare');
      return;
    }

    const payload = {
      versione: 1,
      esportato: new Date().toISOString(),
      materie,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const data = new Date().toLocaleDateString('it-IT').replace(/\//g, '-');

    a.href     = url;
    a.download = `laurea-tracker-${data}.json`;
    a.click();
    URL.revokeObjectURL(url);

    _toast(`Esportate ${materie.length} materie`);
  }

  function importaClick() {
    document.getElementById('import-input').click();
  }

  function importa(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);

        // Supporta sia il formato con wrapper { versione, materie }
        // che un array diretto (export grezzo)
        const materie = Array.isArray(parsed)
          ? parsed
          : (parsed.materie || []);

        if (!materie.length) {
          _toast('File vuoto o non valido');
          return;
        }

        // Conferma sovrascrittura se ci sono già dati
        const esistenti = Store.getAll().length;
        if (esistenti > 0) {
          const ok = confirm(`Hai già ${esistenti} materie salvate.\nImportando sostituirai tutto. Continuare?`);
          if (!ok) {
            event.target.value = '';
            return;
          }
        }

        // Sovrascrive il localStorage direttamente via Store
        materie.forEach(m => {
          // Sanity check campi minimi
          if (!m.id) m.id = Date.now().toString() + Math.random();
          if (!m.nome) m.nome = 'Senza nome';
          if (!m.stato) m.stato = 'da-fare';
        });

        localStorage.setItem('lt-materie', JSON.stringify(materie));
        // Ricarica lo store
        location.reload();

      } catch (err) {
        _toast('Errore: file JSON non valido');
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // reset input per poter reimportare lo stesso file
  }

  function _toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  return { esporta, importaClick, importa };
})();

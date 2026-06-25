const Home = (() => {
  function render() {
    const all        = Store.getAll();
    const completate = Store.getCompleted();
    const voti       = completate.filter(m => m.voto).map(m => m.lode ? 31 : m.voto);
    const media      = voti.length ? voti.reduce((a,b) => a+b,0) / voti.length : null;
    const cfuTot     = all.reduce((a,m) => a+(m.cfu||0), 0);
    const cfuFatti   = completate.reduce((a,m) => a+(m.cfu||0), 0);
    const perc       = cfuTot > 0 ? Math.round((cfuFatti/cfuTot)*100) : 0;

    _set('stat-media',     media ? media.toFixed(2) : '–');
    _set('stat-media-sub', voti.length ? `su ${voti.length} esam${voti.length===1?'e':'i'}` : 'nessun voto');
    _set('stat-esami',     completate.length);
    _set('stat-esami-sub', `di ${all.length} total${all.length===1?'e':'i'}`);
    _set('stat-cfu',       cfuFatti);
    _set('stat-cfu-sub',   `di ${cfuTot} totali`);
    _set('stat-perc',      perc+'%');
    _set('prog-label',     `${cfuFatti} / ${cfuTot}`);
    document.getElementById('progress-fill').style.width = perc+'%';

    ModalAppello.renderHome();
    _renderRecent(completate);
  }

  function _renderRecent(completate) {
    const el     = document.getElementById('recent-list');
    const recent = [...completate]
      .sort((a, b) => {
        if (!a.data && !b.data) return 0;
        if (!a.data) return 1;
        if (!b.data) return -1;
        return new Date(b.data) - new Date(a.data);
      })
      .slice(0, 5);
    if (!recent.length) {
      el.innerHTML = `<div class="empty-state"><span class="material-icons">school</span><p>Ancora nessun esame completato.</p></div>`;
      return;
    }
    el.innerHTML = recent.map(m => {
      const dataStr = m.data ? new Date(m.data).toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'}) : null;
      return `<div class="media-card">
        <div class="icon-wrap green"><span class="material-icons">check_circle</span></div>
        <div class="mc-body">
          <div class="mc-title">${_esc(m.nome)}</div>
          <div class="mc-sub">${m.cfu||'?'} CFU${dataStr ? ' · '+dataStr : ''}</div>
        </div>
        <div class="badge green">${m.lode ? '30L' : (m.voto||'–')}</div>
      </div>`;
    }).join('');
  }

  function _set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
  function _esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  return { render };
})();
const Graduate = (() => {
  function render() { _drawCorona(); updateSummary(); }

  function _drawCorona() {
    const svg        = document.getElementById('corona-svg');
    const all        = Store.getAll();
    const completate = Store.getCompleted();
    const N   = Math.max(all.length, 8);
    const cx  = 120, cy = 120, R_outer = 100, R_inner = 52;
    const midR = (R_outer + R_inner) / 2;
    const petalH = (R_outer - R_inner) / 2 + 10;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    let html = '';
    for (let i = 0; i < N; i++) {
      const angle    = (i/N)*2*Math.PI - Math.PI/2;
      const earned   = i < completate.length;
      const px       = cx + midR * Math.cos(angle);
      const py       = cy + midR * Math.sin(angle);
      const angleDeg = (angle * 180 / Math.PI) + 90;
      const rw       = Math.min(13, (2*Math.PI*midR/N)*0.36);
      html += `<ellipse cx="${px.toFixed(2)}" cy="${py.toFixed(2)}"
        rx="${rw.toFixed(2)}" ry="${petalH.toFixed(2)}"
        transform="rotate(${angleDeg.toFixed(1)},${px.toFixed(2)},${py.toFixed(2)})"
        fill="${earned ? '#28a745' : (isDark ? '#333' : '#e0e0e0')}"
        stroke="${earned ? '#1e7e34' : (isDark ? '#444' : '#c8c8c8')}"
        stroke-width="1" style="transition:fill 0.4s ease;"/>`;
    }
    const circleFill = isDark ? '#1e1e1e' : 'white';
    const textFill   = isDark ? '#f0f0f0' : '#212121';
    const pct = all.length ? Math.round((completate.length/all.length)*100) : 0;
    html += `<circle cx="120" cy="120" r="${R_inner-4}" fill="${circleFill}" stroke="${isDark?'#444':'#e0e0e0'}" stroke-width="1.5"/>
      <text x="120" y="111" text-anchor="middle" font-family="Inter,sans-serif" font-size="30" font-weight="700" fill="${textFill}">${completate.length}</text>
      <text x="120" y="129" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" fill="${isDark?'#666':'#9e9e9e'}">/ ${all.length} esami</text>
      <text x="120" y="147" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#28a745">${pct}%</text>`;
    svg.innerHTML = html;
  }

  function updateSummary() {
    const completate = Store.getCompleted().filter(m => m.voto);
    const card = document.getElementById('voto-finale-card');
    const valEl = document.getElementById('vf-value');
    const subEl = document.getElementById('vf-sub');
    if (!completate.length) {
      valEl.textContent = '–'; subEl.textContent = 'Completa almeno un esame';
      card.classList.remove('complete'); return;
    }
    const voti = completate.map(m => m.lode ? 31 : m.voto);
    const media30 = voti.reduce((a,b)=>a+b,0)/voti.length;
    let votoLaurea = (media30/30)*110;
    if (document.getElementById('lode-check')?.checked)  votoLaurea += 1;
    if (document.getElementById('bonus-check')?.checked) votoLaurea += 1;
    votoLaurea = Math.min(110, Math.round(votoLaurea));
    const conLode = votoLaurea === 110 && (document.getElementById('lode-check')?.checked || document.getElementById('bonus-check')?.checked);
    valEl.textContent = conLode ? '110L' : votoLaurea;
    subEl.textContent = `Media ponderata: ${media30.toFixed(2)} / 30`;
    card.classList.toggle('complete', votoLaurea >= 100);
  }

  return { render, updateSummary };
})();

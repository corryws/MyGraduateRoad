const Nav = (() => {
  const SCREENS = {
    graduate: { title:'Graduate', sub:'Il tuo traguardo finale',       render:()=>Graduate.render(), fab:false },
    home:     { title:'Dashboard', sub:'',                              render:()=>Home.render(),     fab:false },
    materie:  { title:'Materie',   sub:'Gestisci il tuo piano di studi',render:()=>Materie.render(),  fab:true  },
  };
  function goTo(id, btn) {
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    document.getElementById('screen-'+id).classList.add('active');
    btn.classList.add('active');
    const cfg = SCREENS[id];
    document.getElementById('topbar-title').textContent = cfg.title;
    // keep greeting on sub when on home
    if (id !== 'home') document.getElementById('topbar-sub').textContent = cfg.sub;
    else { const p = Profilo.get(); document.getElementById('topbar-sub').textContent = p.nome ? `Ciao, ${p.nome}! 🎓` : 'Ciao! 🎓'; }
    document.getElementById('fab').classList.toggle('hidden', !cfg.fab);
    cfg.render();
  }
  return { goTo };
})();

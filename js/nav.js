/**
 * nav.js
 * Handles bottom navigation and screen switching.
 */
const Nav = (() => {
  const SCREENS = {
    graduate: {
      title: 'Graduate',
      sub:   'Il tuo traguardo finale',
      render: () => Graduate.render(),
      fab: false,
    },
    home: {
      title: 'Dashboard',
      sub:   'Ciao! Tieni traccia del tuo percorso 🎓',
      render: () => Home.render(),
      fab: false,
    },
    materie: {
      title: 'Materie',
      sub:   'Gestisci il tuo piano di studi',
      render: () => Materie.render(),
      fab: true,
    },
  };

  function goTo(id, btn) {
    // hide all screens
    document.querySelectorAll('.screen')
      .forEach(s => s.classList.remove('active'));

    // deactivate all nav items
    document.querySelectorAll('.nav-item')
      .forEach(n => n.classList.remove('active'));

    // activate target
    document.getElementById('screen-' + id).classList.add('active');
    btn.classList.add('active');

    // update topbar
    const cfg = SCREENS[id];
    document.getElementById('topbar-title').textContent = cfg.title;
    document.getElementById('topbar-sub').textContent   = cfg.sub;

    // toggle FAB
    const fab = document.getElementById('fab');
    fab.classList.toggle('hidden', !cfg.fab);

    // render screen content
    cfg.render();
  }

  return { goTo };
})();

const Theme = (() => {
  function init() {
    const saved = localStorage.getItem('lt-theme') || 'light';
    _apply(saved);
  }
  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    _apply(current === 'dark' ? 'light' : 'dark');
  }
  function _apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lt-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }
  return { init, toggle };
})();

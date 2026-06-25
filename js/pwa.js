/**
 * pwa.js
 * Mostra un banner di installazione su iOS Safari
 * se l'app non è già in esecuzione come PWA standalone.
 */
const PWA = (() => {
  const DISMISSED_KEY = 'lt-pwa-dismissed';

  function init() {
    // Se già installata come PWA, non mostrare nulla
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) return;

    // Se l'utente ha già chiuso il banner, non riproporre
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Mostra solo su iOS Safari
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent);

    if (isIOS && isSafari) {
      // Piccolo delay per non apparire subito al caricamento
      setTimeout(() => {
        document.getElementById('pwa-banner')?.classList.remove('hidden');
      }, 2000);
    }
  }

  function dismiss() {
    document.getElementById('pwa-banner')?.classList.add('hidden');
    localStorage.setItem(DISMISSED_KEY, '1');
  }

  return { init, dismiss };
})();

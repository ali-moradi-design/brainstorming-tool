// Applies the stored theme and language before first paint (no flash).
// It is a separate file so the Content-Security-Policy can forbid inline scripts.
try {
  var theme = localStorage.getItem('bt:theme');
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  var lang = localStorage.getItem('bt:lang');
  if (lang !== 'en' && lang !== 'es' && lang !== 'fa') lang = 'en';
  var root = document.documentElement;
  root.dataset.theme = theme;
  root.lang = lang;
  root.dir = lang === 'fa' ? 'rtl' : 'ltr';
} catch (e) {
  /* storage unavailable: keep the defaults from index.html */
}

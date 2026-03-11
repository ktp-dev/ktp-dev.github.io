// Fade out before navigating to internal pages
document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
  if (!link) return;
  if (link.target === '_blank') return; // let external links open normally
  if (!link.href || link.href.startsWith('#')) return;

  e.preventDefault();
  const dest = link.href;
  document.body.classList.add('fade-out');
  setTimeout(() => { window.location.href = dest; }, 300);
});

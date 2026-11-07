/**
 * Full-screen mobile menu: aria-expanded on the toggle, focus moved into the
 * dialog and kept there, Escape and links close it, page scroll locked while open.
 */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const open = () => {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close menu';
    document.documentElement.style.overflow = 'hidden';
    menu.querySelector<HTMLElement>('[data-menu-link]')?.focus();
  };

  const close = (restoreFocus = true) => {
    if (!isOpen()) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Open menu';
    document.documentElement.style.overflow = '';
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  menu.querySelector('[data-menu-close]')?.addEventListener('click', () => close());
  // Links navigate to an anchor; don't pull focus back to the toggle.
  menu
    .querySelectorAll('[data-menu-link]')
    .forEach((link) => link.addEventListener('click', () => close(false)));

  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Leaving the mobile breakpoint with the menu open would leave scroll locked.
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (e) => {
    if (e.matches) close(false);
  });
}

/**
 * Project index filters: toggle buttons (aria-pressed) show the projects in one
 * area and announce the result through a polite live region.
 */
export function initFilters(): void {
  const root = document.querySelector<HTMLElement>('[data-project-index]');
  if (!root) return;
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-categories]'));
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  if (buttons.length === 0 || items.length === 0) return;

  const apply = (filter: string, announce: boolean) => {
    let shown = 0;
    for (const item of items) {
      const match = filter === 'all' || (item.dataset.categories ?? '').split(' ').includes(filter);
      item.hidden = !match;
      if (match) shown += 1;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    }
    if (status && announce) {
      const label = buttons
        .find((b) => b.dataset.filter === filter)
        ?.firstChild?.textContent?.trim();
      const noun = shown === 1 ? 'project' : 'projects';
      status.textContent =
        filter === 'all' ? `Showing all ${shown} ${noun}` : `Showing ${shown} ${noun} in ${label}`;
    }
  };

  for (const button of buttons) {
    button.addEventListener('click', () => apply(button.dataset.filter ?? 'all', true));
  }
}

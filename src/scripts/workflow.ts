/**
 * Workflow ring as an ARIA tab widget: roving tabindex, arrow keys / Home / End,
 * automatic activation. Stages auto-advance while the section is on screen and
 * stop for good on the first user interaction. Reduced motion: no auto-advance.
 */
const ADVANCE_MS = 4500;

export function initWorkflow(): void {
  const root = document.querySelector<HTMLElement>('[data-workflow]');
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-stage-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-stage-panel]'));
  if (tabs.length === 0 || tabs.length !== panels.length) return;

  let current = Math.max(
    0,
    tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'),
  );

  const select = (index: number, focus: boolean) => {
    current = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = panels[i];
      if (panel) panel.hidden = !active;
    });
    if (focus) tabs[current]?.focus();
  };
  select(current, false);

  // --- auto-advance -------------------------------------------------------
  let timer: number | undefined;
  let stopped = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false;

  const schedule = () => {
    window.clearTimeout(timer);
    if (stopped || !visible) return;
    timer = window.setTimeout(() => {
      select(current + 1, false);
      schedule();
    }, ADVANCE_MS);
  };
  const stop = () => {
    stopped = true;
    window.clearTimeout(timer);
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        root.classList.toggle('is-paused', !visible);
        schedule();
      },
      { threshold: 0.3 },
    ).observe(root);
  }

  // --- interaction --------------------------------------------------------
  const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
  tablist?.addEventListener('pointerdown', stop);
  tablist?.addEventListener('focusin', stop);

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      stop();
      select(i, false);
    });
    tab.addEventListener('keydown', (event) => {
      const keys: Record<string, number> = {
        ArrowRight: current + 1,
        ArrowDown: current + 1,
        ArrowLeft: current - 1,
        ArrowUp: current - 1,
        Home: 0,
        End: tabs.length - 1,
      };
      const target = keys[event.key];
      if (target === undefined) return;
      event.preventDefault();
      stop();
      select(target, true);
    });
  });
}

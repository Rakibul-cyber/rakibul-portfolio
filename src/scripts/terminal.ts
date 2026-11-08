/**
 * Replay the CI transcript line by line once the terminal scrolls into view.
 * Reduced motion (or no IntersectionObserver): the full output stays visible.
 */
export function initTerminal(): void {
  const term = document.querySelector<HTMLElement>('[data-terminal]');
  if (!term) return;
  const lines = Array.from(term.querySelectorAll<HTMLElement>('[data-line]'));
  if (lines.length === 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  term.classList.add('is-replaying');

  const play = () => {
    let i = 0;
    const next = () => {
      const line = lines[i];
      if (!line) {
        term.classList.remove('is-replaying');
        return;
      }
      line.classList.add('is-shown');
      i += 1;
      // Commands pause longer than the output they produce.
      const delay = line.classList.contains('line-cmd') ? 520 : 170;
      window.setTimeout(next, delay);
    };
    next();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        play();
      }
    },
    { threshold: 0.35 },
  );
  observer.observe(term);
}

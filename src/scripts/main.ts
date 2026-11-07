import { initFilters } from './filters';
import { initHeader } from './header';
import { initMenu } from './menu';
import { initReveal } from './reveal';

// Single entry point: Astro bundles this once for every page. Each initialiser
// is null-safe and does nothing when its markup is absent.
initHeader();
initMenu();
initFilters();
initReveal();

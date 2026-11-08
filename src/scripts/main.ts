import { initContactForm } from './contact';
import { initFilters } from './filters';
import { initHeader } from './header';
import { initMenu } from './menu';
import { initReveal } from './reveal';
import { initTerminal } from './terminal';
import { initWorkflow } from './workflow';

// Single entry point: Astro bundles this once for every page. Each initialiser
// is null-safe and does nothing when its markup is absent.
initHeader();
initMenu();
initFilters();
initWorkflow();
initTerminal();
initContactForm();
initReveal();

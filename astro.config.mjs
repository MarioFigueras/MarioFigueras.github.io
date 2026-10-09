// @ts-check
import { defineConfig } from 'astro/config';

// User site on GitHub Pages: served from the domain root, so no `base`.
// The redirects keep the topic pages of the projects' working titles (NihonWorld, Generator,
// Agent Hub, renamed on 2026-10-13) alive: a static page that forwards to the new address.
export default defineConfig({
  site: 'https://mariofigueras.github.io',
  redirects: {
    '/topics/nihonworld': '/topics/kotomachi-gakuen/',
    '/topics/generator': '/topics/kotokiln/',
    '/topics/agent-hub': '/topics/ringi/',
  },
});

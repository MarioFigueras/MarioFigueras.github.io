# mariofigueras.github.io

My devlog: building Kotomachi Gakuen and learning to work with AI agents, Jira and architecture, in the open.

- **Stack:** [Astro](https://astro.build) 7.3.7 (pinned), static output, GitHub Pages.
- **Entries:** one Markdown file per entry in `src/content/blog/`.
- **Publishing:** every entry arrives through a pull request. Merging it to `main` is the approval, and
  the workflow in `.github/workflows/deploy.yml` builds and deploys the site.
- **CI:** official GitHub actions only, pinned by commit SHA. Astro telemetry is off.
- **Look:** a two-ink riso zine with a Japanese retro-futurist touch. Fonts are self-hosted from
  `public/fonts/` (SIL Open Font License, texts in `public/fonts/licenses/`), so visitors' browsers never
  call Google.
- **Dioramas:** drawn in code at build time (`src/lib/iso.ts`, one scene per post in `src/dioramas/`,
  named in the post's `diorama:` frontmatter). No client JavaScript.
- **Extras (号外):** a post with `series: "Extra"` is news between the numbered entries. It gets no
  number: its plinth and chip say 号外, the word on a newspaper's special edition.
- **Home extras:** the "now" terminal (`src/data/now.ts`) and the next-entry teaser (`src/data/next.ts`,
  hidden automatically once that entry is published).

## Local

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

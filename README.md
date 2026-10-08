# mariofigueras.github.io

My devlog: building NihonWorld and learning to work with AI agents, Jira and architecture, in the open.

- **Stack:** [Astro](https://astro.build) 7.3.7 (pinned), static output, GitHub Pages.
- **Entries:** one Markdown file per entry in `src/content/blog/`.
- **Publishing:** every entry arrives through a pull request. Merging it to `main` is the approval, and
  the workflow in `.github/workflows/deploy.yml` builds and deploys the site.
- **CI:** official GitHub actions only, pinned by commit SHA. Astro telemetry is off.

## Local

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

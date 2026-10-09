import type { APIRoute } from 'astro';
import { posts } from '../lib/site';

// A hand-written RSS feed: a few lines here instead of another dependency.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://mariofigueras.github.io');
  const items = (await posts())
    .map((p) => {
      const url = new URL(`/blog/${p.id}/`, base).href;
      return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid>${url}</guid>` +
        `<pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.description)}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>` +
    `<title>Mario Figueras · Devlog</title><link>${base.href}</link>` +
    `<description>Building NihonWorld with three AI assistants, in the open.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};

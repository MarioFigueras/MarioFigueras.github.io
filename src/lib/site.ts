import { getCollection, type CollectionEntry } from 'astro:content';
import { next } from '../data/next';

export type Post = CollectionEntry<'blog'>;

/** 2026.10.08: the Japanese way of writing a date, used everywhere on the site. */
export const jdate = (d: Date | string) => {
  const x = typeof d === 'string' ? new Date(d) : d;
  const mm = String(x.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(x.getUTCDate()).padStart(2, '0');
  return `${x.getUTCFullYear()}.${mm}.${dd}`;
};

/** "Devlog #1" → 1 (the entry number shown on its plinth). An Extra has no number (0). */
export const entryNumber = (p: Post) => Number((p.data.series ?? '').match(/#(\d+)/)?.[1] ?? 0);

/** An Extra (号外, a newspaper's special edition): news between the numbered entries. */
export const isExtra = (p: Post) => /^extra\b/i.test(p.data.series ?? '');

export const pad2 = (n: number) => String(n).padStart(2, '0');

export async function posts(): Promise<Post[]> {
  return (await getCollection('blog')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** The announced next entry, unless it is already published. */
export async function upcoming() {
  if (!next) return null;
  const published = (await posts()).some((p) => entryNumber(p) === next.n);
  return published ? null : next;
}

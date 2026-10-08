import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per published entry. A file only lands here through a reviewed PR:
// drafts live outside the repo, so nothing unreviewed is ever public.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    series: z.string().optional(),
    tags: z.array(z.string()).default([]),
    jira: z.string().optional(),
  }),
});

export const collections = { blog };

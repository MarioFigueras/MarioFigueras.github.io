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
    // who wrote the first draft (Mario reviews and approves every post)
    drafted: z.string().default('claude'),
    // the post's own little diorama (src/dioramas), with its museum label
    diorama: z
      .object({ name: z.string(), jp: z.string(), en: z.string(), note: z.string().optional() })
      .optional(),
    // the ticket the story comes from, shown as a spec card in the margin (key only, never a link)
    spec: z
      .object({ key: z.string(), text: z.string(), rows: z.array(z.tuple([z.string(), z.string()])).default([]) })
      .optional(),
  }),
});

export const collections = { blog };

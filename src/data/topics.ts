// The topics a post can belong to. They are the site's filters: every topic gets its own page
// (/topics/<slug>/) and a chip on each entry. Add a topic here before using it in a post; the
// content schema rejects any other value, so a typo fails the build instead of making a new filter.
export const TOPICS = [
  { slug: 'kotomachi-gakuen', label: 'Kotomachi Gakuen', ink: 'pink' },
  { slug: 'kotokiln', label: 'Kotokiln', ink: 'mint' },
  { slug: 'ringi', label: 'Ringi', ink: 'blue' },
  { slug: 'jira-confluence', label: 'Jira & Confluence', ink: 'grey' },
] as const;

// Renaming a slug? Add a redirect from the old one in astro.config.mjs, so shared links keep working.

export type TopicSlug = (typeof TOPICS)[number]['slug'];
export const TOPIC_SLUGS = TOPICS.map((t) => t.slug) as [TopicSlug, ...TopicSlug[]];
export const topic = (slug: string) => TOPICS.find((t) => t.slug === slug);

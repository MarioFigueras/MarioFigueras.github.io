// The topics a post can belong to. They are the site's filters: every topic gets its own page
// (/topics/<slug>/) and a chip on each entry. Add a topic here before using it in a post; the
// content schema rejects any other value, so a typo fails the build instead of making a new filter.
export const TOPICS = [
  { slug: 'nihonworld', label: 'NihonWorld', ink: 'pink' },
  { slug: 'generator', label: 'Generator', ink: 'mint' },
  { slug: 'agent-hub', label: 'Agent Hub', ink: 'blue' },
  { slug: 'jira-confluence', label: 'Jira & Confluence', ink: 'grey' },
] as const;

export type TopicSlug = (typeof TOPICS)[number]['slug'];
export const TOPIC_SLUGS = TOPICS.map((t) => t.slug) as [TopicSlug, ...TopicSlug[]];
export const topic = (slug: string) => TOPICS.find((t) => t.slug === slug);

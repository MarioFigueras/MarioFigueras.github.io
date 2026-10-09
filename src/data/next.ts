// The next entry, announced on the home page ("next transmission"). It hides itself once a post
// with that series number is published, so a forgotten update never announces a post twice.
// `null` announces nothing.
export const next: { n: number; key: string; title: string; date: string } | null = {
  n: 2,
  key: 'DLOG-5',
  title: 'Jira and Confluence for a team of one (and three AIs)',
  date: '2026-10-15',
};

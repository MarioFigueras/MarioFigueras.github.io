import { lab } from './lab';
import { oneRepoTwoProducts } from './one-repo-two-products';
import { realNames } from './real-names';

// One diorama per post, named in its frontmatter (`diorama:`), plus the lab on the home page.
// Drawn once per build: the functions are pure, so caching keeps the build quick.
const scenes: Record<string, () => string> = {
  lab,
  'one-repo-two-products': oneRepoTwoProducts,
  'real-names': realNames,
};

const cache = new Map<string, string>();

export function diorama(name: string): string | undefined {
  const draw = scenes[name];
  if (!draw) return undefined;
  if (!cache.has(name)) cache.set(name, draw());
  return cache.get(name);
}

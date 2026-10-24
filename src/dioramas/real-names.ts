import { Scene } from '../lib/iso';

/** Extra · 命名 the naming: the three projects on one plinth with their real names. At the back,
 *  the Kotokiln kiln (raw grey content in, fired mint content out on a belt to the game) and the
 *  Kotomachi Gakuen school. At the front, the ringi: the three AIs have stamped the sheet and Mario
 *  stamps last. The working titles are crossed out on the side of the plinth. */
export function realNames(): string {
  const s = new Scene(26);
  const W = 7.5, D = 6.55;

  s.box(0, 0, -0.7, W, D, 0.7, 'f-paper s-ink', 'f-solid s-ink', 'f-solid2 s-ink');
  const tiles = (x0: number, y0: number, n: number, m: number, size: number, a: string, b: string) => {
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const x = x0 + i * size, y = y0 + j * size;
      s.poly([[x, y, 0], [x + size, y, 0], [x + size, y + size, 0], [x, y + size, 0]], `${(i + j) % 2 ? a : b} s-blue-thin`);
    }
  };
  tiles(0.15, 0.15, 4, 4, 0.85, 'f-wall1', 'f-paper');
  tiles(3.95, 0.15, 4, 4, 0.85, 'f-grey2', 'f-grey1');
  tiles(0.15, 3.85, 8, 3, 0.9, 'f-pink-t', 'f-paper');

  // Kotokiln: a kiln with its fire going, raw grey content waiting, and the fired package leaving
  s.box(0.6, 0.5, 0, 1.9, 1.6, 0.95, 'f-paper s-ink', 'f-wall2 s-ink', 'f-wall1 s-ink');
  s.box(0.8, 0.65, 0.95, 1.5, 1.3, 0.3, 'f-paper s-ink', 'f-wall2 s-ink', 'f-wall1 s-ink');
  s.box(0.95, 0.75, 1.25, 0.38, 0.38, 1.3, 'f-solid2 s-ink', 'f-solid s-ink', 'f-solid2 s-ink');
  s.poly([[1.1, 2.11, 0.04], [1.85, 2.11, 0.04], [1.85, 2.11, 0.64], [1.1, 2.11, 0.64]], 'f-board s-ink');
  s.poly([[1.22, 2.12, 0.04], [1.73, 2.12, 0.04], [1.73, 2.12, 0.4], [1.48, 2.12, 0.54], [1.22, 2.12, 0.4]], 'f-pink s-none');
  const [cx, cy] = s.p(1.14, 0.94, 2.55);
  [[4, -10, 4.5], [12, -23, 6.5], [23, -39, 8.5]].forEach(([dx, dy, r]) =>
    s.raw(`<circle cx="${(cx + dx).toFixed(1)}" cy="${(cy + dy).toFixed(1)}" r="${r}" class="f-paper s-ink"/>`, [cx + dx - r, cy + dy - r], [cx + dx + r, cy + dy + r]),
  );
  s.box(2.6, 2.3, 0, 0.45, 0.45, 0.35, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  s.box(2.55, 1.0, 0, 1.95, 0.6, 0.18, 'f-wall1 s-ink', 'f-wall2 s-ink', 'f-wall2 s-ink');
  s.box(3.4, 1.05, 0.18, 0.5, 0.5, 0.4, 'f-mint s-ink', 'f-mint-d s-ink', 'f-mint s-ink');

  // Kotomachi Gakuen: a grey-box school with its clock tower and gate, and a player walking in
  s.box(4.6, 0.45, 0, 2.5, 1.25, 1.3, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  const win = (x0: number, z0: number) =>
    s.poly([[x0, 1.71, z0], [x0 + 0.28, 1.71, z0], [x0 + 0.28, 1.71, z0 + 0.3], [x0, 1.71, z0 + 0.3]], 'f-wall1 s-ink-thin');
  [4.77, 5.25, 5.73, 6.21, 6.65].forEach((x) => win(x, 0.82));
  [4.77, 5.25, 6.21, 6.65].forEach((x) => win(x, 0.3));
  s.poly([[5.7, 1.71, 0], [6.05, 1.71, 0], [6.05, 1.71, 0.6], [5.7, 1.71, 0.6]], 'f-board s-ink');
  s.box(5.5, 0.65, 1.3, 0.7, 0.7, 0.75, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  const [kx, ky] = s.p(5.85, 1.36, 1.68);
  s.raw(
    `<g transform="translate(${kx.toFixed(1)},${ky.toFixed(1)}) skewY(30)"><circle r="6" class="f-paper s-ink"/>` +
      `<path d="M0,0 V-4 M0,0 H3" class="s-ink f-none"/></g>`,
    [kx - 8, ky - 9], [kx + 8, ky + 12],
  );
  s.box(6.45, 2.75, 0, 0.28, 0.28, 0.75, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  s.box(7.05, 2.75, 0, 0.28, 0.28, 0.75, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  s.figure(6.85, 3.35, 'f-paper', { antenna: false, h: 24 });
  const school = s.p(5.85, 1.0, 2.05);

  // Ringi: the three AIs have stamped the sheet; Mario stamps last
  s.figure(1.5, 4.15, 'f-pink', { prop: 'wrench' });
  s.figure(2.35, 4.15, 'f-mint', { prop: 'clipboard' });
  s.figure(3.2, 4.15, 'f-mint', { prop: 'shield' });
  s.box(1.6, 4.55, 0, 4.2, 1.0, 0.6, 'f-mint s-ink', 'f-mint-d s-ink', 'f-mint s-ink');
  s.poly([[1.9, 4.7, 0.6], [5.5, 4.7, 0.6], [5.5, 5.4, 0.6], [1.9, 5.4, 0.6]], 'f-paper s-ink');
  for (let k = 0; k < 4; k++) {
    const x = 2.0 + k * 0.85;
    s.poly([[x, 4.8, 0.6], [x + 0.75, 4.8, 0.6], [x + 0.75, 5.3, 0.6], [x, 5.3, 0.6]], 'f-paper s-ink-thin');
    const [hx, hy] = s.p(x + 0.375, 5.05, 0.6);
    s.raw(k < 3
      ? `<ellipse cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" rx="7" ry="4.3" class="f-pink blend"/>`
      : `<ellipse cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" rx="7" ry="4.3" class="f-none s-pink" stroke-dasharray="2 2"/>`, [hx - 8, hy - 5], [hx + 8, hy + 5]);
  }
  const mario = s.figure(5.8, 6.2, 'f-paper', { antenna: false, h: 40 });
  s.bubble(mario[0], mario[1] + 4, 'last stamp ✓');
  const sheet = s.p(1.9, 5.05, 0.6);

  // the working titles, crossed out on the side of the plinth
  ([[0.35, 'NihonWorld'], [2.9, 'Generator'], [5.3, 'Agent Hub']] as [number, string][]).forEach(([x, t]) => {
    const [px, py] = s.p(x, D + 0.02, -0.45);
    const w = t.length * 5.4;
    s.raw(
      `<g transform="translate(${px.toFixed(1)},${py.toFixed(1)}) skewY(30)"><text class="t-dot f-board-ink" font-size="9">${t}</text>` +
        `<line x1="-2" y1="-3" x2="${(w + 2).toFixed(1)}" y2="-3" class="s-pink"/></g>`,
      [px, py - 10], [px + w, py + w * 0.58],
    );
  });

  s.label(cx, cy, -46, -26, 'kotokiln\nmakes content');
  s.label(school[0], school[1], 36, -60, 'kotomachi gakuen\nthe game');
  s.label(sheet[0], sheet[1], -50, -40, 'ringi\nthe last stamp');

  const [sx, sy] = s.p(W, 0, 3);
  s.behind((b) => b.sun(sx - 10, sy - 20, 60));

  return s.svg('Diorama of the naming: the Kotokiln kiln sending approved mint content to the Kotomachi Gakuen school, and a ringi sheet stamped by the three AIs, with Mario stamping last. The old names are crossed out on the side of the plinth');
}

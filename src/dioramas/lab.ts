import { Scene } from '../lib/iso';

/** 研究室 · the lab: how the work actually happens. Claude builds at the workbench, the two
 *  OpenAI siblings (ChatGPT reviews, Codex audits) sit by the job board, and Mario decides. */
export function lab(): string {
  const s = new Scene(26);
  const W = 8, D = 6.5, H = 3;

  // plinth + room
  s.box(-0.4, -0.4, -0.9, W + 0.8, D + 0.8, 0.9, 'f-paper s-ink', 'f-solid s-ink', 'f-solid2 s-ink');
  s.poly([[0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H]], 'f-wall1 s-blue');
  s.poly([[0, 0, 0], [0, D, 0], [0, D, H], [0, 0, H]], 'f-wall2 s-blue');
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < Math.ceil(D); j++) {
      const d = Math.min(1, D - j);
      s.poly([[i, j, 0], [i + 1, j, 0], [i + 1, j + d, 0], [i, j + d, 0]], (i + j) % 2 ? 'f-pink-t s-blue-thin' : 'f-paper s-blue-thin');
    }
  }

  // the job board (Jira) on the back wall: four columns of cards
  s.onBackWall(0.5, 4.7, 1.0, 2.65, 'f-board s-ink');
  s.wallText(0.7, 2.45, [{ t: 'IDEA  DRAFT  REVIEW  DONE', cls: 'f-mint' }], 8.5);
  const cols = [0.7, 1.75, 2.8, 3.85];
  const cards: [number, string][][] = [
    [[1.95, 'f-paper'], [1.55, 'f-paper']],
    [[1.95, 'f-pink']],
    [[1.95, 'f-mint']],
    [[1.95, 'f-blue'], [1.55, 'f-blue'], [1.15, 'f-blue']],
  ];
  cols.forEach((x, i) => cards[i].forEach(([z, c]) => s.onBackWall(x, x + 0.7, z, z + 0.3, `${c} s-none`, 0.03)));

  // the workbench screen
  s.onBackWall(5.1, 7.5, 1.15, 2.45, 'f-board s-ink');
  s.wallText(5.3, 2.2, [
    { t: '$ build --scene', cls: 'f-mint' },
    { t: 'checks: ok', cls: 'f-paper' },
    { t: 'waiting for review', cls: 'f-pink' },
  ], 8.5);

  // the minutes (Confluence): a shelf of pages on the left wall
  s.box(0.05, 3.7, 0, 0.55, 2.0, 1.9, 'f-paper s-ink', 'f-wall1 s-ink', 'f-paper s-ink');
  [0.35, 0.95, 1.5].forEach((z) => {
    [3.85, 4.15, 4.45, 4.8, 5.1, 5.4].forEach((y, k) => {
      s.poly([[0.61, y, z], [0.61, y + 0.22, z], [0.61, y + 0.22, z + 0.42], [0.61, y, z + 0.42]], ['f-pink', 'f-blue', 'f-mint', 'f-paper', 'f-blue', 'f-pink'][(k + z * 10) % 6 | 0] + ' s-ink-thin');
    });
  });

  // workbench with the game inside the lab: a tiny grey-box town and a torii
  s.box(5.0, 0.55, 0, 2.7, 1.05, 0.75, 'f-paper s-ink', 'f-wall2 s-ink', 'f-wall1 s-ink');
  s.box(5.25, 0.7, 0.75, 0.5, 0.45, 0.35, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  s.box(5.85, 0.65, 0.75, 0.4, 0.4, 0.55, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  s.box(6.6, 0.95, 0.75, 0.08, 0.08, 0.5, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');
  s.box(7.2, 0.95, 0.75, 0.08, 0.08, 0.5, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');
  s.box(6.5, 0.93, 1.25, 0.9, 0.12, 0.07, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');
  s.box(6.58, 0.95, 1.12, 0.74, 0.08, 0.05, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');

  // Mario's desk with the merge button
  s.box(5.4, 4.3, 0, 1.7, 0.9, 0.72, 'f-mint s-ink', 'f-mint-d s-ink', 'f-mint s-ink');
  const [bx, by] = s.p(6.6, 4.75, 0.72);
  s.raw(`<ellipse cx="${bx}" cy="${by - 2}" rx="9" ry="5" class="f-pink s-ink"/><ellipse cx="${bx}" cy="${by - 5}" rx="9" ry="5" class="f-pink s-ink"/>`, [bx - 10, by - 11]);

  // the crew
  const claude = s.figure(7.3, 2.05, 'f-pink', { prop: 'wrench' });
  const chatgpt = s.figure(1.9, 1.75, 'f-mint', { prop: 'clipboard' });
  const codex = s.figure(3.4, 1.75, 'f-mint', { prop: 'shield' });
  const mario = s.figure(5.9, 5.55, 'f-paper', { antenna: false, h: 40 });
  s.bubble(mario[0], mario[1] + 4, 'OK ✓ merge');

  s.label(claude[0], claude[1] + 18, 74, -40, 'claude · builds');
  s.label(chatgpt[0], chatgpt[1] + 18, -70, -46, 'chatgpt · reviews');
  s.label(codex[0], codex[1] + 18, 26, -92, 'codex · audits');
  s.label(mario[0] - 6, mario[1] + 30, -96, 46, 'mario · decides');

  // the sun goes down behind the lab
  const [sx, sy] = s.p(W - 1.2, 0, H + 0.8);
  s.behind((b) => b.sun(sx + 60, sy + 10, 98));

  return s.svg('Diorama of the lab: Claude builds at the workbench, ChatGPT and Codex review and audit by the job board, Mario decides at his desk');
}

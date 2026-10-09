import { Scene } from '../lib/iso';

/** Devlog #1 · 分割 the split: the game on one plinth, the Generator on another, and only an
 *  approved, hashed content package crossing the gap, one way. */
export function oneRepoTwoProducts(): string {
  const s = new Scene(24);

  // NihonWorld: a grey-box street with a torii and the player
  s.box(0, 0, -0.7, 4.2, 4.2, 0.7, 'f-paper s-ink', 'f-solid s-ink', 'f-solid2 s-ink');
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    s.poly([[i + 0.1, j + 0.1, 0], [i + 1.1, j + 0.1, 0], [i + 1.1, j + 1.1, 0], [i + 0.1, j + 1.1, 0]], (i + j) % 2 ? 'f-grey2 s-blue-thin' : 'f-grey1 s-blue-thin');
  }
  s.box(0.4, 0.4, 0, 1.2, 1.0, 1.1, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  s.box(0.5, 1.8, 0, 0.9, 0.9, 0.8, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  s.box(2.2, 0.4, 0, 1.4, 0.9, 1.5, 'f-grey1 s-ink', 'f-grey3 s-ink', 'f-grey2 s-ink');
  // torii
  s.box(2.3, 2.6, 0, 0.12, 0.12, 0.95, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');
  s.box(3.3, 2.6, 0, 0.12, 0.12, 0.95, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');
  s.box(2.15, 2.58, 0.95, 1.45, 0.16, 0.1, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');
  s.box(2.25, 2.6, 0.78, 1.25, 0.12, 0.07, 'f-pink s-ink', 'f-pink s-ink', 'f-pink s-ink');
  const player = s.figure(2.9, 3.5, 'f-paper', { antenna: false, h: 26 });

  // the one-way bridge: a conveyor carrying the content package across the gap
  s.box(3.9, 1.5, -0.25, 2.1, 0.7, 0.18, 'f-wall1 s-ink', 'f-wall2 s-ink', 'f-wall2 s-ink');
  s.box(4.6, 1.6, -0.07, 0.55, 0.5, 0.45, 'f-mint s-ink', 'f-mint-d s-ink', 'f-mint s-ink');
  const [cx, cy] = s.p(4.85, 1.85, 0.38);

  // the Generator: a machine that proposes, a reviewer stamp, and a queue of candidates
  s.box(5.8, 0, -0.7, 3.4, 4.2, 0.7, 'f-paper s-ink', 'f-solid s-ink', 'f-solid2 s-ink');
  s.box(6.6, 0.4, 0, 1.8, 1.3, 1.7, 'f-wall1 s-ink', 'f-blue s-ink', 'f-wall2 s-ink');
  s.box(6.85, 1.7, 0.9, 1.2, 0.05, 0.5, 'f-board s-ink', 'f-board s-ink', 'f-board s-ink');
  s.box(6.2, 2.2, 0, 2.6, 0.6, 0.35, 'f-paper s-ink', 'f-wall2 s-ink', 'f-wall1 s-ink');
  [6.4, 7.1, 7.8].forEach((x, i) => s.box(x, 2.3, 0.35, 0.45, 0.4, 0.3, i === 0 ? 'f-mint s-ink' : 'f-pink-t s-ink', 'f-paper s-ink', 'f-paper s-ink'));
  const reviewer = s.figure(6.3, 3.55, 'f-paper', { antenna: false, h: 34 });
  s.bubble(reviewer[0], reviewer[1] + 4, '済 approved');

  s.label(player[0], player[1] + 12, -46, 8, 'nihonworld · the game');
  s.label(cx, cy - 4, -12, -58, 'content package · sha256');
  const [mx, my] = s.p(7.5, 0.4, 1.7);
  s.label(mx, my, 26, -26, 'generator · proposes');

  return s.svg('Diorama of the split: NihonWorld and the Generator on separate plinths, with an approved content package crossing one way');
}

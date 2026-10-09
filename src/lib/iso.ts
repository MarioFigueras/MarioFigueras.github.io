// Isometric dioramas as plain SVG strings, drawn at build time (no client JS).
// Colours are CSS classes (`f-*` fills, `s-*` strokes, see global.css), so every drawing follows
// light/dark mode without being redrawn. A Scene keeps track of its own bounds and fits the
// viewBox to what was drawn, so a new diorama never needs hand-tuned offsets.

export type P3 = [number, number, number];

const COS = 0.866;
const SIN = 0.5;

export class Scene {
  private parts: string[] = [];
  private minX = Infinity;
  private minY = Infinity;
  private maxX = -Infinity;
  private maxY = -Infinity;

  constructor(private s = 26) {}

  /** World (x, y, z) to screen (px, py). x runs down-right, y down-left, z up. */
  p(x: number, y: number, z: number): [number, number] {
    const px = (x - y) * this.s * COS;
    const py = (x + y) * this.s * SIN - z * this.s;
    return [px, py];
  }

  private grow(x: number, y: number) {
    this.minX = Math.min(this.minX, x);
    this.minY = Math.min(this.minY, y);
    this.maxX = Math.max(this.maxX, x);
    this.maxY = Math.max(this.maxY, y);
  }

  raw(svg: string, ...pts: [number, number][]) {
    pts.forEach(([x, y]) => this.grow(x, y));
    this.parts.push(svg);
    return this;
  }

  poly(pts: P3[], cls: string) {
    const scr = pts.map((q) => this.p(...q));
    scr.forEach(([x, y]) => this.grow(x, y));
    this.parts.push(`<polygon points="${scr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}" class="${cls}"/>`);
    return this;
  }

  /** A box with its three visible faces: top, the +x face, the +y face. */
  box(x: number, y: number, z: number, w: number, d: number, h: number, top: string, right: string, left: string) {
    this.poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top);
    this.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], right);
    this.poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], left);
    return this;
  }

  /** A flat rectangle on the back wall (y = const) or the left wall (x = const). */
  onBackWall(x0: number, x1: number, z0: number, z1: number, cls: string, y = 0.02) {
    return this.poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], cls);
  }

  onLeftWall(y0: number, y1: number, z0: number, z1: number, cls: string, x = 0.02) {
    return this.poly([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], cls);
  }

  /** Text lying on the back wall: skewed so it runs along the wall. */
  wallText(x: number, z: number, lines: { t: string; cls: string; dx?: number }[], size = 9.5, y = 0.02) {
    const [px, py] = this.p(x, y, z);
    const spans = lines
      .map((l, i) => `<tspan x="${l.dx ?? 0}" y="${i * size * 1.3}" class="${l.cls}">${l.t}</tspan>`)
      .join('');
    return this.raw(`<g transform="translate(${px.toFixed(1)},${py.toFixed(1)}) skewY(26.57)"><text class="t-dot" font-size="${size}">${spans}</text></g>`, [px, py]);
  }

  /** A capsule figure standing at (x, y). Returns the screen point just above its head. */
  figure(x: number, y: number, cls: string, opts: { antenna?: boolean; h?: number; prop?: 'clipboard' | 'shield' | 'wrench' } = {}) {
    const h = opts.h ?? 34;
    const [px, py] = this.p(x, y, 0);
    let g = `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="10" ry="5" class="f-shadow"/>`;
    g += `<rect x="${(px - 8).toFixed(1)}" y="${(py - h).toFixed(1)}" width="16" height="${h}" rx="8" class="${cls} s-ink"/>`;
    g += `<rect x="${(px - 5).toFixed(1)}" y="${(py - h + 7).toFixed(1)}" width="10" height="4" rx="2" class="f-visor"/>`;
    if (opts.antenna !== false) {
      g += `<line x1="${px.toFixed(1)}" y1="${(py - h).toFixed(1)}" x2="${px.toFixed(1)}" y2="${(py - h - 8).toFixed(1)}" class="s-ink"/>`;
      g += `<circle cx="${px.toFixed(1)}" cy="${(py - h - 9).toFixed(1)}" r="2.6" class="f-mint s-ink"/>`;
    }
    if (opts.prop === 'clipboard') {
      g += `<rect x="${(px + 6).toFixed(1)}" y="${(py - h + 12).toFixed(1)}" width="10" height="13" rx="1" class="f-paper s-ink"/>`;
      g += `<line x1="${(px + 8).toFixed(1)}" y1="${(py - h + 17).toFixed(1)}" x2="${(px + 14).toFixed(1)}" y2="${(py - h + 17).toFixed(1)}" class="s-ink"/>`;
      g += `<line x1="${(px + 8).toFixed(1)}" y1="${(py - h + 21).toFixed(1)}" x2="${(px + 13).toFixed(1)}" y2="${(py - h + 21).toFixed(1)}" class="s-ink"/>`;
    } else if (opts.prop === 'shield') {
      const sx = px + 11, sy = py - h + 12;
      g += `<path d="M${sx - 6},${sy} h12 v6 q0,7 -6,10 q-6,-3 -6,-10z" class="f-paper s-ink"/>`;
      g += `<path d="M${sx - 3},${sy + 6} l2.5,3 l4,-5" class="s-ink f-none"/>`;
    } else if (opts.prop === 'wrench') {
      g += `<path d="M${px + 7},${py - h + 24} l9,-9 m-2,-3 a4,4 0 1 0 5,5" class="s-ink f-none" stroke-width="2.2"/>`;
    }
    this.raw(g, [px - 12, py - h - 14], [px + 18, py + 6]);
    return [px, py - h - 12] as [number, number];
  }

  /** A museum-style label with a leader line from (ax, ay) to an offset (dx, dy). */
  label(ax: number, ay: number, dx: number, dy: number, text: string) {
    const tx = ax + dx, ty = ay + dy;
    const w = text.length * 7.1 + 12;
    const left = dx < 0;
    const rx = left ? tx - w : tx;
    const g =
      `<path d="M${ax.toFixed(1)},${ay.toFixed(1)} L${tx.toFixed(1)},${ty.toFixed(1)}" class="s-ink f-none"/>` +
      `<circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="2.4" class="f-ink"/>` +
      `<rect x="${rx.toFixed(1)}" y="${(ty - 9).toFixed(1)}" width="${w.toFixed(1)}" height="17" class="f-paper s-ink"/>` +
      `<text x="${(rx + 6).toFixed(1)}" y="${(ty + 4).toFixed(1)}" class="t-dot f-ink" font-size="12">${text}</text>`;
    return this.raw(g, [ax, ay], [rx - 2, ty - 11], [rx + w + 2, ty + 10]);
  }

  /** Speech bubble whose tail points at (ax, ay). */
  bubble(ax: number, ay: number, text: string) {
    const w = text.length * 7.1 + 14;
    const x = ax + 8, y = ay - 24;
    const g =
      `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="20" rx="4" class="f-paper s-ink"/>` +
      `<path d="M${(x + 6).toFixed(1)},${(y + 20).toFixed(1)} l-5,8 l11,-8" class="f-paper s-ink"/>` +
      `<text x="${(x + 7).toFixed(1)}" y="${(y + 14).toFixed(1)}" class="t-dot f-ink" font-size="12">${text}</text>`;
    return this.raw(g, [x, y], [x + w, y + 28]);
  }

  /** Halftone retro sun with horizontal cuts, centred at a screen point. */
  sun(cx: number, cy: number, r: number) {
    const id = `sun${Math.round(cx)}${Math.round(cy)}`;
    const cuts = [0.58, 0.7, 0.8, 0.88, 0.94].map((f, i) => {
      const y = cy - r + 2 * r * f;
      const h = 4 + i * 0.6;
      return `<rect x="${cx - r - 2}" y="${y.toFixed(1)}" width="${2 * r + 4}" height="${h.toFixed(1)}" fill="#000"/>`;
    }).join('');
    const g =
      `<defs><pattern id="${id}p" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="2" class="f-pink"/></pattern>` +
      `<mask id="${id}m"><rect x="${cx - r - 2}" y="${cy - r - 2}" width="${2 * r + 4}" height="${2 * r + 4}" fill="#fff"/>${cuts}</mask></defs>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}p)" mask="url(#${id}m)" class="blend"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-none s-blue" stroke-dasharray="3 5" opacity=".7"/>`;
    return this.raw(g, [cx - r, cy - r], [cx + r, cy + r]);
  }

  /** Put something behind everything drawn so far (the sun, mostly). */
  behind(fn: (s: Scene) => void) {
    const before = this.parts;
    this.parts = [];
    fn(this);
    this.parts = [...this.parts, ...before];
    return this;
  }

  svg(title: string, pad = 14) {
    const w = this.maxX - this.minX + 2 * pad;
    const h = this.maxY - this.minY + 2 * pad;
    const vb = `${(this.minX - pad).toFixed(0)} ${(this.minY - pad).toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}`;
    return `<svg class="dio" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${this.parts.join('')}</svg>`;
  }
}

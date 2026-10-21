// Draws the demo radial map used as a backdrop (cx, cy = center; scale shrinks it).
function drawMap({ cx = 560, cy = 470, scale = 1, dim = 0 } = {}) {
  const br = [
    ['Marketing', 1],
    ['Engineering', 2],
    ['Design', 4],
    ['Community', 3],
    ['Pricing', 1],
    ['Docs', 2],
  ];
  let svg = '',
    html = '';
  html += `<div class="pill c3" style="left:${cx}px;top:${cy}px;font-size:18px;padding:16px 30px">Product launch</div>`;
  br.forEach(([t, c], i) => {
    const a = (i / br.length) * Math.PI * 2 - Math.PI / 2,
      x = cx + Math.cos(a) * 250 * scale,
      y = cy + Math.sin(a) * 190 * scale;
    svg += `<path d="M${cx} ${cy}Q${(cx + x) / 2 + Math.sin(a) * 26} ${(cy + y) / 2 - Math.cos(a) * 26} ${x} ${y}" fill="none" stroke="var(--edge)" stroke-width="3"/>`;
    html += `<div class="pill c${c}" style="left:${x}px;top:${y}px;${i === 0 ? 'box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 45%,transparent);' : ''}">${t}</div>`;
    [-1, 1].forEach((d) => {
      const b = a + d * 0.3,
        x2 = cx + Math.cos(b) * 400 * scale,
        y2 = cy + Math.sin(b) * 320 * scale;
      svg += `<path d="M${x} ${y}L${x2} ${y2}" stroke="var(--edge)" stroke-width="1.6" opacity=".7"/>`;
      html += `<div class="pill c0" style="left:${x2}px;top:${y2}px;font-weight:500;font-size:12px;padding:5px 12px;border:1.5px solid var(--idea-0-border)">Idea</div>`;
    });
  });
  document.querySelector('.stage').innerHTML =
    `<svg width="1440" height="900" style="position:absolute">${svg}</svg>${html}<div style="position:absolute;inset:0;background:rgba(0,0,0,${dim})"></div>`;
}

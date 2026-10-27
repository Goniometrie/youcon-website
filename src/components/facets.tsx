// Decoratief driehoekspatroon in de stijl van het logo: elke cel is een
// steil parallellogram dat langs de diagonaal in twee facetten is gevouwen.

const TEALS = ["#87cfce", "#76bbc0", "#66a6af", "#56929d", "#447d8e", "#34687d"];
const GREYS = ["#cccccc", "#b4b4b4", "#a0a0a0", "#8c8c8c"];

const CELL_W = 60;
const CELL_H = 100;

export function Facets({
  cols = 8,
  rows = 5,
  greys = false,
  className,
}: {
  cols?: number;
  rows?: number;
  /** Mix grijze facetten erdoor, zoals bij "o u o n" in het logo. */
  greys?: boolean;
  className?: string;
}) {
  const triangles: { points: string; fill: string }[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Laat cellen weg, vaker richting links, zodat het patroon uitwaaiert.
      if ((x * 3 + y * 5) % 7 < Math.max(1, 5 - x)) continue;

      const x0 = x * CELL_W;
      const y0 = y * CELL_H;
      const x1 = x0 + CELL_W;
      const y1 = y0 + CELL_H;
      const halves =
        (x + y) % 2 === 0
          ? [
              `${x0},${y0} ${x1},${y0} ${x1},${y1}`,
              `${x0},${y0} ${x1},${y1} ${x0},${y1}`,
            ]
          : [
              `${x0},${y0} ${x1},${y0} ${x0},${y1}`,
              `${x1},${y0} ${x1},${y1} ${x0},${y1}`,
            ];

      halves.forEach((points, i) => {
        const seed = x * 7 + y * 13 + i * 5;
        const palette = greys && seed % 4 === 0 ? GREYS : TEALS;
        triangles.push({ points, fill: palette[seed % palette.length] });
      });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${cols * CELL_W} ${rows * CELL_H}`}
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMaxYMid slice"
    >
      {triangles.map((t) => (
        <polygon
          key={t.points}
          points={t.points}
          fill={t.fill}
          stroke="#ffffff"
          strokeOpacity={0.35}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

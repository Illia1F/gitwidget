import { createSVGText } from '../svg-utils';

const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const;

export const generateWeekdayLabels = (
  x: number,
  startY: number,
  cellSize: number,
  cellSpacing: number,
  color: string,
): string => {
  const labels: string[] = [];

  for (let i = 0; i < 7; i++) {
    if (WEEKDAYS[i]) {
      const y = startY + i * (cellSize + cellSpacing) + cellSize / 2;
      labels.push(
        createSVGText(WEEKDAYS[i], x + 25, y, {
          fontSize: 9,
          fill: color,
          textAnchor: 'end',
          dominantBaseline: 'middle',
        }),
      );
    }
  }

  return labels.join('');
};

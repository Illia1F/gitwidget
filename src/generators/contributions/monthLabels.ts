import { ContributionWeek } from '@/github/types';
import { createSVGText } from '../svg-utils';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const generateMonthLabels = (
  weeks: ContributionWeek[],
  startX: number,
  y: number,
  cellSize: number,
  cellSpacing: number,
  color: string,
): string => {
  const labels: string[] = [];

  let currentMonth = -1;
  let weekIndex = 0;

  for (const week of weeks) {
    const firstDay = new Date(week.firstDay);
    const month = firstDay.getMonth();

    if (month !== currentMonth) {
      const x = startX + weekIndex * (cellSize + cellSpacing);
      labels.push(
        createSVGText(MONTH_NAMES[month], x, y, {
          fontSize: 10,
          fill: color,
        }),
      );
      currentMonth = month;
    } else if (currentMonth === -1) {
      currentMonth = month;
    }

    weekIndex++;
  }

  return labels.join('');
};

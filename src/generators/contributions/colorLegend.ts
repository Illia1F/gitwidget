import { CONTRIBUTION_LEVELS } from '@/github/types';
import { createSVGRect, createSVGText, formatSVGNumber } from '../svg-utils';
import { getContributionLevelColor, getTheme } from '../themes';
import { Theme } from '../types';

/**
 * Generate color legend for the contribution grid
 */
export const generateColorLegend = (
  totalContributions: number,
  startX: number,
  y: number,
  totalWidth: number,
  theme: Theme,
): string => {
  const colors = getTheme(theme);
  const cellSize = 10;
  const cellSpacing = 2;

  const legendItems: string[] = [];

  const legendScaleWidth = CONTRIBUTION_LEVELS.length * (cellSize + cellSpacing) - cellSpacing;
  const lessTextWidth = 30;
  const moreTextWidth = 40;
  const totalLegendWidth = lessTextWidth + legendScaleWidth + moreTextWidth;

  // Position legend at the right side
  const legendEndX = totalWidth - 20; // 20px from right edge
  const legendStartX = legendEndX - totalLegendWidth;
  const legendY = y + cellSize / 2; // Align vertically with contributions text

  // Total contributions text (left side)
  legendItems.push(
    createSVGText(
      `${formatSVGNumber(totalContributions)} contributions in the last year`,
      startX,
      legendY,
      {
        fontSize: 11,
        fill: colors.mutedForeground,
        dominantBaseline: 'middle',
      },
    ),
  );

  // "Less" text
  legendItems.push(
    createSVGText('Less', legendStartX, legendY, {
      fontSize: 9,
      fill: colors.mutedForeground,
      textAnchor: 'end',
      dominantBaseline: 'middle',
    }),
  );

  // Legend cells
  const cellsStartX = legendStartX + lessTextWidth;
  CONTRIBUTION_LEVELS.forEach((level, index) => {
    const x = cellsStartX + index * (cellSize + cellSpacing);
    const cellY = legendY - cellSize / 2;
    const color = getContributionLevelColor(level, theme);

    legendItems.push(
      createSVGRect(x, cellY, cellSize, cellSize, {
        fill: color,
        rx: 2,
      }),
    );
  });

  // "More" text
  legendItems.push(
    createSVGText('More', cellsStartX + legendScaleWidth + 10, legendY, {
      fontSize: 9,
      fill: colors.mutedForeground,
      dominantBaseline: 'middle',
    }),
  );

  return legendItems.join('');
};

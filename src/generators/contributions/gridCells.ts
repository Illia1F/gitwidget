import { ContributionDay, ContributionWeek } from '@/github/types';
import { Theme } from '../types';
import { getContributionLevelColor } from '../themes';
import { escapeXml } from '../svg-utils';

export const generateContributionCells = (
  weeks: ContributionWeek[],
  startX: number,
  startY: number,
  cellSize: number,
  cellSpacing: number,
  cornerRadius: number,
  theme: Theme,
  enableAnimations: boolean = true,
): string => {
  const cells: string[] = [];

  weeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach((day: ContributionDay, dayIndex: number) => {
      const x = startX + weekIndex * (cellSize + cellSpacing);
      const y = startY + dayIndex * (cellSize + cellSpacing);
      const color = getContributionLevelColor(day.contributionLevel, theme);

      const title = `${day.contributionCount} contribution${
        day.contributionCount !== 1 ? 's' : ''
      } on ${new Date(day.date).toDateString()}`;

      // Create unique cell ID for targeted animations
      const cellId = `cell-${weekIndex}-${dayIndex}`;

      // Add special class for high contribution cells
      const isHighContribution =
        day.contributionLevel === 'FOURTH_QUARTILE' || day.contributionLevel === 'THIRD_QUARTILE';
      const cellClass = `contribution-cell${isHighContribution ? ' high-contribution' : ''}`;

      // Add animation delay style only if animations are enabled
      let styleAttribute = '';
      if (enableAnimations) {
        // Diagonal wave: top-left to bottom-right
        const diagonalIndex = weekIndex + dayIndex;
        const animationDelay = diagonalIndex * 18; // ms per diagonal step
        styleAttribute = ` style="animation-delay: ${animationDelay}ms;"`;
      }

      cells.push(
        `<rect 
            id="${cellId}"
            class="${cellClass}" 
            x="${x}" 
            y="${y}" 
            width="${cellSize}" 
            height="${cellSize}" 
            fill="${color}" 
            rx="${cornerRadius}"${styleAttribute}
          >
            <title>${escapeXml(title)}</title>
          </rect>`,
      );
    });
  });

  return cells.join('');
};

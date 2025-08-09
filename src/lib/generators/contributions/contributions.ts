import { ContributionCalendar } from '@/github/types';
import { ContributionGridOptions } from '../types';
import { getTheme } from '../themes';
import { createSVG, createSVGRect, createSVGText } from '../svg-utils';
import { generateMonthLabels } from './monthLabels';
import { generateWeekdayLabels } from './weekdayLabels';
import { generateColorLegend } from './colorLegend';
import { generateCellAnimations } from './animation';
import { generateContributionCells } from './gridCells';

interface ContributionGridData {
  calendar: ContributionCalendar;
  username: string;
  name?: string | null;
  year?: number;
  dateRange?: {
    from: string;
    to: string;
  };
}

export const generateContributionsGridSVG = (
  data: ContributionGridData,
  options: Partial<ContributionGridOptions> = {},
): string => {
  const {
    theme = 'light',
    cellSize = 11,
    cellSpacing = 3,
    cornerRadius = 2,
    showMonthLabels = true,
    showWeekdayLabels = true,
    showLegend = true,
    hideTitle = false,
    title,
    showBorder = false,
    borderWidth = 1,
    borderRadius = 6,
    enableAnimations = true,
  } = options;

  const colors = getTheme(theme);
  const { calendar, username, name, year } = data;

  // Calculate dimensions
  const weeksCount = calendar.weeks.length;
  const gridWidth = weeksCount * (cellSize + cellSpacing) - cellSpacing;
  const monthLabelHeight = showMonthLabels ? 20 : 0;
  const weekdayLabelWidth = showWeekdayLabels ? 30 : 0;
  const titleHeight = hideTitle ? 0 : 30;
  const legendHeight = showLegend ? 40 : 0;
  const padding = 20;

  // Calculate actual content width needed
  const contentWidth = weekdayLabelWidth + gridWidth + padding * 2;

  const totalWidth = contentWidth;
  const totalHeight =
    titleHeight +
    monthLabelHeight +
    7 * (cellSize + cellSpacing) -
    cellSpacing +
    legendHeight +
    padding * 2;

  let yOffset = padding;

  let titleElement = '';
  if (!hideTitle) {
    const displayName = name || username;
    const displayTitle = title || `${displayName}'s contributions${year ? ` in ${year}` : ''}`;
    titleElement = createSVGText(displayTitle, padding, yOffset + 20, {
      fontSize: 16,
      fontWeight: 600,
      fill: colors.foreground,
    });
    yOffset += titleHeight;
  }

  let monthLabels = '';
  if (showMonthLabels) {
    monthLabels = generateMonthLabels(
      calendar.weeks,
      weekdayLabelWidth + padding,
      yOffset + 15,
      cellSize,
      cellSpacing,
      colors.mutedForeground,
    );
    yOffset += monthLabelHeight;
  }

  let weekdayLabels = '';
  if (showWeekdayLabels) {
    weekdayLabels = generateWeekdayLabels(
      padding,
      yOffset,
      cellSize,
      cellSpacing,
      colors.mutedForeground,
    );
  }

  const grid = generateContributionCells(
    calendar.weeks,
    weekdayLabelWidth + padding,
    yOffset,
    cellSize,
    cellSpacing,
    cornerRadius,
    theme,
    enableAnimations,
  );

  let legend = '';
  if (showLegend) {
    legend = generateColorLegend(
      calendar.totalContributions,
      weekdayLabelWidth + padding,
      yOffset + 7 * (cellSize + cellSpacing) + 20,
      totalWidth - padding,
      theme,
    );
  }

  let border = '';
  if (showBorder) {
    border = createSVGRect(0, 0, totalWidth, totalHeight, {
      fill: 'none',
      stroke: colors.border,
      strokeWidth: borderWidth,
      rx: borderRadius,
    });
  }

  const animations = generateCellAnimations(enableAnimations);

  const content = animations + titleElement + monthLabels + weekdayLabels + grid + legend + border;

  return createSVG(totalWidth, totalHeight, content, {
    background: colors.background,
    style: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;`,
    // responsive: true (default) - creates responsive SVG that stretches to container width
  });
};

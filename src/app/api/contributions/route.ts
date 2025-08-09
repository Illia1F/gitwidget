import { NextRequest, NextResponse } from 'next/server';
import { getLast12MonthsContributions, getYearContributions } from '@/github';
import { generateContributionsGridSVG } from '@/lib/generators/contributions';
import { isValidGitHubUsername } from '@/github/utils';

const CACHE_SECONDS = 60 * 60; // 1 hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || searchParams.get('u') || '';
  const theme = (searchParams.get('theme') || 'light') as 'light' | 'dark';
  const yearParam = searchParams.get('year');

  const showMonthLabels = (searchParams.get('show_month_labels') ?? 'true') === 'true';
  const showWeekdayLabels = (searchParams.get('show_weekday_labels') ?? 'true') === 'true';
  const showLegend = (searchParams.get('show_legend') ?? 'true') === 'true';
  const showBorder = (searchParams.get('show_border') ?? 'false') === 'true';
  const hideTitle = (searchParams.get('hide_title') ?? 'false') === 'true';
  const enableAnimations = (searchParams.get('enable_animations') ?? 'true') === 'true';

  const title = searchParams.get('title') || undefined;
  const cellSize = Number(searchParams.get('cell_size') || '') || undefined;
  const borderWidth = Number(searchParams.get('border_width') || '') || undefined;
  const borderRadius = Number(searchParams.get('border_radius') || '') || undefined;

  if (!username || !isValidGitHubUsername(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  try {
    let result;
    if (yearParam) {
      const year = Number(yearParam);
      if (!Number.isFinite(year)) {
        return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
      }
      result = await getYearContributions(username, year);
    } else {
      result = await getLast12MonthsContributions(username);
    }

    const svg = generateContributionsGridSVG(
      {
        calendar: result.calendar,
        username: result.username,
        name: result.name,
        year: result.dateRange ? new Date(result.dateRange.from).getUTCFullYear() : undefined,
        dateRange: result.dateRange,
      },
      {
        theme,
        cellSize,
        borderWidth,
        borderRadius,
        showMonthLabels,
        showWeekdayLabels,
        showLegend,
        showBorder,
        hideTitle,
        enableAnimations,
        title,
      },
    );

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Create SVG text element with proper encoding
 */
export const createSVGText = (
  text: string,
  x: number,
  y: number,
  options: {
    fontSize?: number;
    fontWeight?: string | number;
    fill?: string;
    textAnchor?: 'start' | 'middle' | 'end';
    dominantBaseline?: 'auto' | 'middle' | 'hanging';
    className?: string;
  } = {},
): string => {
  const {
    fontSize = 12,
    fontWeight = 'normal',
    fill = 'currentColor',
    textAnchor = 'start',
    dominantBaseline = 'auto',
    className = '',
  } = options;

  const classAttr = className ? ` class="${className}"` : '';

  return `<text x="${x}" y="${y}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}"${classAttr}>${escapeXml(
    text,
  )}</text>`;
};

/**
 * Create SVG rectangle element
 */
export const createSVGRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    rx?: number;
    ry?: number;
    className?: string;
    opacity?: number;
  } = {},
): string => {
  const { fill = 'currentColor', stroke, strokeWidth, rx, ry, className = '', opacity } = options;

  let attrs = `x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"`;

  if (stroke) attrs += ` stroke="${stroke}"`;
  if (strokeWidth) attrs += ` stroke-width="${strokeWidth}"`;
  if (rx !== undefined) attrs += ` rx="${rx}"`;
  if (ry !== undefined) attrs += ` ry="${ry}"`;
  if (opacity !== undefined) attrs += ` opacity="${opacity}"`;
  if (className) attrs += ` class="${className}"`;

  return `<rect ${attrs} />`;
};

/**
 * Create SVG circle element
 */
export const createSVGCircle = (
  cx: number,
  cy: number,
  r: number,
  options: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    opacity?: number;
  } = {},
): string => {
  const { fill = 'currentColor', stroke, strokeWidth, className = '', opacity } = options;

  let attrs = `cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"`;

  if (stroke) attrs += ` stroke="${stroke}"`;
  if (strokeWidth) attrs += ` stroke-width="${strokeWidth}"`;
  if (opacity !== undefined) attrs += ` opacity="${opacity}"`;
  if (className) attrs += ` class="${className}"`;

  return `<circle ${attrs} />`;
};

/**
 * Create SVG path element
 */
export const createSVGPath = (
  d: string,
  options: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    opacity?: number;
  } = {},
): string => {
  const { fill = 'currentColor', stroke, strokeWidth, className = '', opacity } = options;

  let attrs = `d="${d}" fill="${fill}"`;

  if (stroke) attrs += ` stroke="${stroke}"`;
  if (strokeWidth) attrs += ` stroke-width="${strokeWidth}"`;
  if (opacity !== undefined) attrs += ` opacity="${opacity}"`;
  if (className) attrs += ` class="${className}"`;

  return `<path ${attrs} />`;
};

/**
 * Create SVG gradient definition
 */
export const createSVGGradient = (
  id: string,
  stops: Array<{ offset: number; color: string; opacity?: number }>,
  type: 'linear' | 'radial' = 'linear',
  options: {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    cx?: number;
    cy?: number;
    r?: number;
  } = {},
): string => {
  const { x1 = 0, y1 = 0, x2 = 1, y2 = 0, cx = 0.5, cy = 0.5, r = 0.5 } = options;

  const gradientType = type === 'radial' ? 'radialGradient' : 'linearGradient';
  const gradientAttrs =
    type === 'radial'
      ? `cx="${cx}" cy="${cy}" r="${r}"`
      : `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`;

  const stopElements = stops
    .map((stop) => {
      const opacity = stop.opacity !== undefined ? ` stop-opacity="${stop.opacity}"` : '';
      return `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}"${opacity} />`;
    })
    .join('');

  return `<${gradientType} id="${id}" ${gradientAttrs}>${stopElements}</${gradientType}>`;
};

/**
 * Create complete SVG wrapper
 */
export const createSVG = (
  width: number,
  height: number,
  content: string,
  options: {
    viewBox?: string;
    xmlns?: boolean;
    className?: string;
    style?: string;
    background?: string;
  } = {},
): string => {
  const { viewBox, xmlns = true, className = '', style = '', background } = options;

  const viewBoxAttr = viewBox ? ` viewBox="${viewBox}"` : ` viewBox="0 0 ${width} ${height}"`;
  const xmlnsAttr = xmlns ? ' xmlns="http://www.w3.org/2000/svg"' : '';
  const classAttr = className ? ` class="${className}"` : '';

  // Make SVG responsive by default for web usage
  const responsiveStyle = 'width: 100%; height: auto; max-width: 100%; display: block;';
  const combinedStyle = responsiveStyle + (style ? ` ${style}` : '');
  const styleAttr = combinedStyle ? ` style="${combinedStyle}"` : '';

  // Use responsive width/height attributes for web, fixed for other contexts
  const widthAttr = ''; //' width="100%"';
  const heightAttr = ''; //' height="auto"';

  let backgroundRect = '';
  if (background) {
    backgroundRect = createSVGRect(0, 0, width, height, { fill: background });
  }

  return `<svg${widthAttr}${heightAttr} preserveAspectRatio="xMidYMid meet" ${viewBoxAttr}${xmlnsAttr}${classAttr}${styleAttr}>${backgroundRect}${content}</svg>`;
};

/**
 * Escape XML/HTML special characters
 */
export const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Create CSS styles for SVG
 */
export const createSVGStyles = (
  styles: Record<string, Record<string, string | number>>,
): string => {
  const cssRules = Object.entries(styles)
    .map(([selector, rules]) => {
      const ruleStrings = Object.entries(rules)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');
      return `.${selector} { ${ruleStrings} }`;
    })
    .join(' ');

  return `<style>${cssRules}</style>`;
};

/**
 * Calculate text width (approximate)
 */
export const calculateTextWidth = (text: string, fontSize: number = 12): number => {
  // Approximate character width for common fonts
  const avgCharWidth = fontSize * 0.6;
  return text.length * avgCharWidth;
};

/**
 * Wrap text to fit within specified width
 */
export const wrapText = (text: string, maxWidth: number, fontSize: number = 12): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = calculateTextWidth(testLine, fontSize);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is longer than max width, force break
        lines.push(word);
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

/**
 * Create animation keyframes
 */
export const createSVGAnimation = (
  attributeName: string,
  values: string[],
  duration: string = '1s',
  repeatCount: string = 'indefinite',
): string => {
  return `<animate attributeName="${attributeName}" values="${values.join(
    ';',
  )}" dur="${duration}" repeatCount="${repeatCount}" />`;
};

/**
 * Format numbers for display in SVG
 */
export const formatSVGNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

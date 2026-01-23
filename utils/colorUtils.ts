/**
 * Utility functions for color manipulation and palette generation.
 */

/**
 * Converts a hex color string to an RGB object.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Converts an RGB object to a hex string.
 */
function rgbToHex(r: number, g: number, b: number): string {
    return (
        "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    );
}

/**
 * Mixes two colors together by a percentage.
 * @param color1 - Base color (hex)
 * @param color2 - Color to mix in (hex)
 * @param weight - Percentage of color2 to mix (0-1)
 */
function mixColors(color1: string, color2: string, weight: number): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const w = weight;
    const a = 1 - w;

    const r = Math.round(rgb1.r * a + rgb2.r * w);
    const g = Math.round(rgb1.g * a + rgb2.g * w);
    const b = Math.round(rgb1.b * a + rgb2.b * w);

    return rgbToHex(r, g, b);
}

/**
 * Generates a Tailwind-like color palette (50-950) from a single base color.
 * The base color is assumed to be the '500' shade.
 */
export const generatePalette = (baseColor: string): Record<number, string> => {
    // Validate hex
    if (!/^#[0-9A-F]{6}$/i.test(baseColor)) {
        console.warn(`Invalid color passed to generatePalette: ${baseColor}. Falling back to blue.`);
        baseColor = '#3b82f6'; // Default Blue
    }

    return {
        50: mixColors(baseColor, '#ffffff', 0.95),
        100: mixColors(baseColor, '#ffffff', 0.9),
        200: mixColors(baseColor, '#ffffff', 0.75),
        300: mixColors(baseColor, '#ffffff', 0.6),
        400: mixColors(baseColor, '#ffffff', 0.3),
        500: baseColor,
        600: mixColors(baseColor, '#000000', 0.1),
        700: mixColors(baseColor, '#000000', 0.25),
        800: mixColors(baseColor, '#000000', 0.4),
        900: mixColors(baseColor, '#000000', 0.6),
        950: mixColors(baseColor, '#000000', 0.75),
    };
};

export const DEFAULT_THEME_COLOR = '#3b82f6'; // Blue-500

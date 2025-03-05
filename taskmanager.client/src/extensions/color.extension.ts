export default class colorExtension {
    public static toNumber(color: string): number {
        return parseInt(color.replace("#", ""), 16);
    }

    public static toHex(color: number): string {
        return "#" + color.toString(16).padStart(6, "0");
    }

    public static adjustBrightness(color: string, percent: number): string {
        let num = this.toNumber(color);

        let r = num >> 16;
        let g = (num >> 8) & 0x00ff;
        let b = num & 0x0000ff;

        let avg = this.avgChannel(r, g, b);

        r += percent;
        g += percent;
        b += percent;

        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        if (
            // If the color is too dark, lighten it in the dark theme
            (avg < 128 - percent && percent > 0) ||
            // If the color is too light, darken it in the light theme
            (avg > 128 - percent && percent < 0)
        ) {
            return this.toHex((r << 16) | (g << 8) | b);
        } else {
            return color;
        }
    }

    private static avgChannel(r: number, g: number, b: number): number {
        return r * 0.299 + g * 0.587 + b * 0.114;
    }

    public static toDarkTheme(color: string): string {
        return this.adjustBrightness(color, +40);
    }

    public static toLightTheme(color: string): string {
        return this.adjustBrightness(color, -40);
    }
}

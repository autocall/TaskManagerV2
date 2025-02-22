export default class stringExtension {
    public static truncate(value: string, length: number = 6): string {
        return value.length > length ? value.substring(0, length) : value;
    }

    public static dateToString(value: Date): string {
        return value.toISOString().split("T")[0];
    }
}
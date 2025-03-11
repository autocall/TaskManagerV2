import moment from "moment";

export default class stringExtension {
    public static truncate(value: string, length: number = 6): string {
        return value.length > length ? value.substring(0, length) : value;
    }

    public static dateToISO(value: Date): string {
        return value.toISOString().split("T")[0];
    }

    public static dateTimeToShort(value: moment.Moment): string {
        let now = moment();
        if (now.year() == value.year()) {
            if (now.dayOfYear() == value.dayOfYear()) {
                return value.format("LT");
            } else {
                return value.format("l LT");
            }
        } else {
            return value.format("l");
        }
    }

    public static dateToShort(value: unknown): string {
        if (value instanceof Date) {
            return this.dateToShort_date(value);
        } else if (moment.isMoment(value)) {
            return this.dateToShort_moment(value);
        } else {
            throw new Error("Invalid date type");
        }
    }

    private static dateToShort_date(value: Date): string {
        return this.dateToShort_moment(moment(value));
    }

    private static dateToShort_moment(value: moment.Moment): string {
        let now = moment();
        if (now.year() == value.year()) {
            return value.format("l").replace("/" + value.year().toString(), "");
        } else {
            return value.format("l");
        }
    }

    public static dateToFromNowShort(value: unknown): string {
        if (value instanceof Date) {
            return this.dateToFromNowShort_date(value);
        } else if (moment.isMoment(value)) {
            return this.dateToFromNowShort_moment(value);
        } else {
            throw new Error("Invalid date type");
        }
    }

    private static dateToFromNowShort_date(value: Date): string {
        return this.dateToFromNowShort_moment(moment(value));
    }

    private static dateToFromNowShort_moment(value: moment.Moment): string {
        // if diff less 1 minute -> 1 min(s)
        // if diff less 1 hour -> 1 hour(s)
        // if diff less 1 day -> 1 day(s)
        // if diff less 1 week -> 1 week(s)
        // if diff less 1 month -> 1 month(s)
        // if diff less 1 year -> 1 year(s)
        let now = moment();
        let diff = now.diff(value, "minutes");
        if (diff < 1) {
            return "now ago";
        }
        if (diff < 2) {
            return diff + " minute ago";
        }
        if (diff < 60) {
            return diff + " minutes ago";
        }
        diff = now.diff(value, "hours");
        if (diff < 2) {
            return diff + " hour ago";
        }
        if (diff < 24) {
            return diff + " hours ago";
        }
        diff = now.diff(value, "days");
        if (diff < 2) {
            return diff + " day ago";
        }
        if (diff < 7) {
            return diff + " days ago";
        }
        diff = now.diff(value, "weeks");
        if (diff < 2) {
            return diff + " week ago";
        }
        if (diff < 4) {
            return diff + " weeks ago";
        }
        diff = now.diff(value, "months");
        if (diff < 2) {
            return diff + " month ago";
        }
        if (diff < 12) {
            return diff + " months ago";
        }
        diff = now.diff(value, "years");
        if (diff < 2) {
            return diff + " year";
        }
        return diff + " years ago";
    }
}

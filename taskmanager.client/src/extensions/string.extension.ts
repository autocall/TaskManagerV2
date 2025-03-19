import moment from "moment-timezone";

export default class stringExtension {
    public static truncate(value: string, length: number = 6): string {
        return value.length > length ? value.substring(0, length) : value;
    }

    public static dateToISO(value: Date | moment.Moment): string {
        if (value instanceof Date) {
            return value.toISOString().split("T")[0];
        } else if (moment.isMoment(value)) {
            return value.format("YYYY-MM-DD");
        } else {
            throw new Error("Invalid date type");
        }
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

    public static dateToShort(value: Date | moment.Moment): string {
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

    public static dateToLong(value: Date | moment.Moment | string, timeZoneId: string): string {
        if (value instanceof Date) {
            return this.dateToLong_date(value, timeZoneId);
        } else if (moment.isMoment(value)) {
            return this.dateToLong_moment(value, timeZoneId);
        } else if (typeof value === "string") {
            return this.dateToLong_string(value, timeZoneId);
        } else {
            throw new Error("Invalid date type");
        }
    }

    private static dateToLong_date(value: Date, timeZoneId: string): string {
        return this.dateToLong_moment(moment(value), timeZoneId);
    }

    private static dateToLong_string(value: string, timeZoneId: string): string {
        return this.dateToLong_moment(moment(value), timeZoneId);
    }

    private static dateToLong_moment(value: moment.Moment, timeZoneId: string): string {
        if (timeZoneId) {
            value = value.clone().tz(timeZoneId);
        }
        let now = moment().tz(timeZoneId);
        let diff = now.diff(value, "weeks");
        if (diff < 1) {
            return value.format("ddd, D MMM YYYY");
        }
        return value.format("D MMM YYYY");
    }

    public static dateToFromNowShort(value: Date | moment.Moment | string, timeZoneId: string): string {
        if (value instanceof Date) {
            return this.dateToFromNowShort_date(value);
        } else if (moment.isMoment(value)) {
            return this.dateToFromNowShort_moment(value);
        } else if (typeof value === "string") {
            return this.dateToFromNowShort_string(value, timeZoneId);
        } else {
            throw new Error("Invalid date type");
        }
    }

    private static dateToFromNowShort_date(value: Date): string {
        return this.dateToFromNowShort_moment(moment(value));
    }

    private static dateToFromNowShort_string(value: string, timeZoneId: string): string {
        return this.dateToFromNowShort_moment(moment.tz(value, timeZoneId));
    }

    private static dateToFromNowShort_moment(value: moment.Moment): string {
        let now = moment();
        let diff = now.diff(value, "seconds");
        if (diff <= 24 * 60 * 60) {
            return "today";
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

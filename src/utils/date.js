import moment from "moment";

export function compareDate(date, day = 0) {
    return moment(date).format("YYYY-MM-DD") ===
        moment().subtract(day, "days").format("YYYY-MM-DD");
}

export function compareYear(date) {
    return moment(date).format("YYYY") === moment().format("YYYY");
}

export function formatDate(date, formatStr) {
    return moment(date).format(formatStr);
}

export function computeMinuteDiff(startTime, endTime) {
    return moment(endTime).diff(startTime) / (1000 * 60);
}
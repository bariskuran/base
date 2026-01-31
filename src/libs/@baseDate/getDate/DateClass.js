import { dateToFormat } from "./dateToFormat";
import { prepareProps } from "./_tools";
import { getTimeDifference } from "../getTimeDifference";
import { calculateNewDate } from "../calculateNewDate";

export class DateClass {
    /**
     * Constructor
     *
     * @param {Date} dateObj - Date obj.
     * @param {string} format - Date format "DD-MM-YYYY"
     * @param {boolean} isNow - Şimdiki zaman bayrağı, varsayılan false
     */
    constructor(dateObj, format, isNow = false) {
        if (!isNow && !(dateObj instanceof Date)) {
            throw new Error("Geçersiz dateObj parametresi");
        }

        this.isNow = isNow;
        this.Date = !isNow ? dateObj : () => new Date();
        this.string = !isNow ? dateObj.toString() : () => new Date().toString();
        this.value = !isNow
            ? dateToFormat(dateObj, format)
            : () => dateToFormat(new Date(), format);
        this.ts = !isNow ? this.Date.getTime() : () => new Date().getTime();
        this.props = isNow ? () => prepareProps(new Date()) : prepareProps(dateObj);

        /* FUNCTIONS */
        this.getTimeDifference = (Date2) => getTimeDifference(isNow ? this.ts() : this.ts, Date2);
        this.format = (format) => {
            return dateToFormat(this.isNow ? this.Date() : this.Date, format);
        };
        this.calculateNewDate = (obj) =>
            new DateClass(calculateNewDate(this.isNow ? this.Date() : this.Date, obj));
    }
}

/**
 * @fileoverview Date and Time utility functions for formatting.
 */

/**
 * Converts a Date object or ISO string to the ISO 8601 UTC format.
 * (e.g., "2023-11-30T16:00:00.000Z").
 * This is the standard format for exchanging dates between client and server.
 *
 * @param {Date|string} dateInput The date to convert. Can be a Date object,
 *                                  a valid date string, or a number (timestamp).
 * @returns {string|null} The date string in ISO 8601 UTC format, or null if input is invalid.
 */
export function toISOStringUTC(dateInput) {
    let date;
    try {
        date = new Date(dateInput);
        if (isNaN(date.getTime())) { // Check for invalid date
            return null;
        }
    } catch (e) {
        return null;
    }
    return date.toISOString();
}

/**
 * Converts a Date object or ISO string to "Oct-dd-yyyy" format.
 * (e.g., "Oct-26-2023").
 *
 * @param {Date|string} dateInput The date to convert. Can be a Date object,
 *                                  a valid date string, or a number (timestamp).
 * @returns {string|null} The formatted date string (e.g., "Oct-26-2023"),
 *                        or null if input is invalid.
 */
export function toMonthDayYear(dateInput) {
    let date;
    try {
        date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            return null;
        }
    } catch (e) {
        return null;
    }

    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options); // e.g., "Oct 26, 2023"

    // Custom adjustment to "Oct-dd-yyyy"
    return formattedDate.replace(' ', '-').replace(',', '');
}

/**
 * Converts a Date object or ISO string to a local 12-hour time format.
 * (e.g., "04:00 PM" or "10:30 AM").
 *
 * @param {Date|string} dateInput The date to convert. Can be a Date object,
 *                                  a valid date string, or a number (timestamp).
 * @returns {string|null} The formatted time string (e.g., "04:00 PM"),
 *                        or null if input is invalid.
 */
export function toLocal12HourTime(dateInput) {
    let date;
    try {
        date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            return null;
        }
    } catch (e) {
        return null;
    }

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use 12-hour clock
        // timeZoneName: 'short', // Optional: e.g., "4:00 PM GMT+5"
    };

    // toLocaleTimeString will format based on the user's locale
    // 'en-US' is often used for a consistent 12-hour format with AM/PM
    return date.toLocaleTimeString('en-US', options);
}

/**
 * Converts a Date object or ISO string to a combined "Oct-dd-yyyy, 04:00 PM" format.
 *
 * @param {Date|string} dateInput The date to convert.
 * @returns {string|null} The combined formatted string, or null if input is invalid.
 */
export function toMonthDayYearAnd12HourTime(dateInput) {
    const formattedDate = toMonthDayYear(dateInput);
    const formattedTime = toLocal12HourTime(dateInput);

    if (formattedDate === null || formattedTime === null) {
        return null;
    }

    return `${formattedDate}, ${formattedTime}`;
}

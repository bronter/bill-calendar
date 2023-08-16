class CurrentDate {
    #dateChangeHandlers = [];
    #currentDate = undefined;

    constructor() {
        // Start tracking date
        this.#updateAtMidnight();
    }

    #updateCurrentDate() {
        const oldDate = this.#currentDate;
        const now = new Date();
        // Omit the specific time and have it be 0:00 local time
        this.#currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const handler of this.#dateChangeHandlers) {
            handler(new Date(oldDate), new Date(this.#currentDate));
        }
    }

    #updateAtMidnight() {
        this.#updateCurrentDate();
        const tomorrowMorning = new Date(this.#currentDate);
        tomorrowMorning.setDate(this.currentDay + 1);
        const timeTillMidnight = tomorrowMorning - Date.now();
        setTimeout(this.#updateAtMidnight.bind(this), timeTillMidnight);
    }

    // Allowing these to be set directly could corrupt internal state;
    // make them read-only by using getters and private properties.
    get currentYear() {
        return this.#currentDate.getFullYear();
    }
    get currentMonth() {
        return this.#currentDate.getMonth();
    }
    get currentDay() {
        return this.#currentDate.getDate();
    }
    get currentDate() {
        return new Date(this.#currentDate);
    }
    get currentTimestamp() {
        return this.#currentDate.getTime();
    }

    // So we can listen for changes to date
    onDateChange(handler) {
        this.#dateChangeHandlers.push(handler);
    }
}

export const currentDateModel = new CurrentDate();

class SelectedDate {
    #dateChangeHandlers = [];
    #selectedDate = new Date();

    set selectedDate(date) {
        const newDate = new Date(date);
        const oldDate = this.#selectedDate;
        this.#selectedDate = newDate;

        for (const handler of this.#dateChangeHandlers) {
            handler(new Date(oldDate), new Date(newDate));
        }
    }

    onSelectedDateChange(handler) {
        this.#dateChangeHandlers.push(handler);
    }

    get selectedDate() {
        return new Date(this.#selectedDate);
    }

    get selectedDayOfMonth() {
        return this.#selectedDate.getDate();
    }
    get selectedYear() {
        return this.#selectedDate.getFullYear();
    }
    get selectedMonth() {
        return this.#selectedDate.getMonth();
    }

    get daysInSelectedMonth() {
        return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    }
    get firstWeekDayOfMonth() {
        return new Date(this.selectedYear, this.selectedMonth, 1).getDay()
    }

    dateFromDayOfMonth(dayOfMonth) {
        return new Date(this.selectedYear, this.selectedMonth, dayOfMonth);
    }
}

export const selectedDateModel = new SelectedDate();
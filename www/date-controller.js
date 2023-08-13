class DateController {
    #dateChangeHandlers = [];
    #currentYear = undefined;
    #currentMonth = undefined;
    #currentDay = undefined;
    #currentDate = undefined;

    constructor() {
        // Start tracking date
        this.#updateAtMidnight();
    }

    #updateCurrentDate() {
        const now = new Date();
        this.#currentYear = now.getFullYear();
        this.#currentMonth = now.getMonth();
        this.#currentDay = now.getDate();
        // Omit the specific time and have it be 0:00 local time
        this.#currentDate = new Date(this.#currentYear, this.#currentMonth, this.#currentDay);

        for (const handler of this.#dateChangeHandlers) {
            handler(this);
        }
    }

    #updateAtMidnight() {
        this.#updateCurrentDate();
        const tomorrowMorning = new Date(this.#currentDate);
        tomorrowMorning.setDate(this.#currentDay + 1);
        const timeTillMidnight = tomorrowMorning - Date.now();
        setTimeout(this.#updateAtMidnight.bind(this), timeTillMidnight);
    }

    // Allowing these to be set directly could corrupt internal state;
    // make them read-only by using getters and private properties.
    get currentYear() {
        return this.#currentYear;
    }
    get currentMonth() {
        return this.#currentMonth;
    }
    get currentDay() {
        return this.#currentDay;
    }
    get currentDate() {
        return this.#currentDate;
    }

    // So we can listen for changes to date
    onDateChange(handler) {
        this.#dateChangeHandlers.push(handler);
    }
}

export default new DateController();

class DateController {
    #dateChangeHandlers = [];
    #currentDate = undefined;

    constructor() {
        // Start tracking date
        this.#updateAtMidnight();
    }

    #updateCurrentDate() {
        const now = new Date();
        // Omit the specific time and have it be 0:00 local time
        this.#currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const handler of this.#dateChangeHandlers) {
            handler(this);
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
        return this.#currentDate;
    }

    // So we can listen for changes to date
    onDateChange(handler) {
        this.#dateChangeHandlers.push(handler);
    }
}

export default new DateController();

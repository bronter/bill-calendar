import TemplatedElement from "./templated-element.js";

// Make sure calendar-day element is loaded first, otherwise bills setter won't work
const calendarDayDefined = customElements.whenDefined('calendar-day');

class BillCalendar extends TemplatedElement {
    static templateId = 'bill-calendar';

    constructor() {
        super();

        this.calendarDayNodeListPromise = calendarDayDefined
            .then(() => this.shadowRoot.querySelectorAll('calendar-day'));
    }

    async connectedCallback() {
        const selectedDay = this.getAttribute('selected-day');
        if (selectedDay) {
            const calendarDayNodeList = await this.calendarDayNodeListPromise;
            calendarDayNodeList.item(selectedDay - 1).classList.add('current-day');
        }
    }

    static get observedAttributes() {
        return ['selected-day'];
    }
    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-day') {
            const calendarDayNodeList = await this.calendarDayNodeListPromise;
            if (oldValue) {
                calendarDayNodeList.item(parseInt(oldValue, 10) - 1).classList.remove('current-day');
            }
            calendarDayNodeList.item(parseInt(newValue, 10) - 1).classList.add('current-day');
        }
    }

    async setBills(allBills) {
        const calendarDayNodeList = await this.calendarDayNodeListPromise;
        allBills.forEach((bills, index) => {
            calendarDayNodeList.item(index).bills = bills;
        });
    }

    async setBillsForDay(dayOfMonth, bills) {
        (await this.calendarDayNodeListPromise).item(dayOfMonth - 1).bills = bills;
    }

    async addBillToDay(dayOfMonth, bill) {
        (await this.calendarDayNodeListPromise).item(dayOfMonth - 1).addBill(bill);
    }
}

customElements.define('bill-calendar', BillCalendar);
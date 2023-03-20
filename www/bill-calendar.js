import TemplatedElement from "./templated-element.js";
// Make sure calendar-day element is loaded first, otherwise bills setter won't work
import './calendar-day.js';

class BillCalendar extends TemplatedElement {
    static templateId = 'bill-calendar';

    constructor() {
        super();

        this.calendarDayNodeList = this.shadowRoot.querySelectorAll('calendar-day');
    }

    connectedCallback() {
        const selectedDay = this.getAttribute('selected-day');
        if (selectedDay) {
            this.calendarDayNodeList.item(selectedDay - 1).classList.add('current-day');
        }
    }

    static get observedAttributes() {
        return ['selected-day'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-day') {
            if (oldValue) {
                this.calendarDayNodeList.item(parseInt(oldValue, 10) - 1).classList.remove('current-day');
            }
            this.calendarDayNodeList.item(parseInt(newValue, 10) - 1).classList.add('current-day');
        }
    }

    setBills(allBills) {
        allBills.forEach((bills, index) => {
            this.calendarDayNodeList.item(index).bills = bills;
        });
    }

    setBillsForDay(dayOfMonth, bills) {
        this.calendarDayNodeList.item(dayOfMonth - 1).bills = bills;
    }

    addBillToDay(dayOfMonth, bill) {
        this.calendarDayNodeList.item(dayOfMonth - 1).addBill(bill);
    }
}

customElements.define('bill-calendar', BillCalendar);
import TemplatedElement from "./templated-element.js";
import { showAddBillDialog, showBillListDialog } from "./bills.js";
import { dateForDay } from "./calendar.js";

class DayBill extends TemplatedElement {
    static templateId = 'day-bill';

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.name = shadowRoot.getElementById('name');
        this.amount = shadowRoot.getElementById('amount');

        this.name.textContent = this.getAttribute('name');
        this.amount.textContent = this.getAttribute('amount');
    }
}

customElements.define('day-bill', DayBill);

class CalendarDay extends TemplatedElement {
    static templateId = 'calendar-day';
    constructor() {
        super();

        this.dayOfMonth = parseInt(this.getAttribute('day-of-month'), 10);
    }

    #updateDayOfMonth() {
        const shadow = this.shadowRoot;
        const dateContainer = shadow.getElementById('day-of-month');
        dateContainer.textContent = this.getAttribute('day-of-month');
    }

    #setupEventListeners() {
        const shadow = this.shadowRoot;

        const addBillButton = shadow.getElementById('add-bill-button');
        addBillButton.addEventListener('click', () =>
            showAddBillDialog(dateForDay(this.dayOfMonth)));

        this.billList.addEventListener('click', () => {
            const billsCount = 0; // TODO: look it up or get it from the slot
            if (billsCount > 0) {
                showBillListDialog();
            }
        });
    }

    connectedCallback() {
        this.billList = this.shadowRoot.getElementById('bill-list');
        this.#updateDayOfMonth();
        this.#setupEventListeners();
    }

    // TODO: Ideally this would do some diffing and only update what it needs to;
    // in most cases only one bill would change at a time and the rest would remain untouched.
    set bills(billsList) {
        const newBills = [];
        for (const bill of billsList) {
            const newBill = document.createElement('day-bill');
            newBill.setAttribute('name', bill.name);
            newBill.setAttribute('amount', bill.amount);
            newBills.push(newBill);
        }
        this.billList.replaceChildren(...newBills);
    }
}

customElements.define('calendar-day', CalendarDay);

// I guess you can't just create aliases for HTMLElement, you have to extend it
class PaddingDay extends HTMLElement {}
// padding-day basically exists so I can use nth-of-type to align the calendar start,
// without having to worry about it interfering with anything else.
// Technically, the browser handles unknown tags well enough where I don't have
// to do this, but for the sake of well-defined behavior I'm doing it anyway.
customElements.define('padding-day', PaddingDay);

import TemplatedElement from "./templated-element.js";

const addBillDialog = document.getElementById('add-bill-dialog');
const billListDialog = document.getElementById('bill-list-dialog');

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
            addBillDialog.showModal(this.dayOfMonth));

        this.billList.addEventListener('click', () => {
            const billsCount = this.billList.children.length; // TODO: look it up or get it from the slot
            if (billsCount > 0) {
                billListDialog.showModal(this.dayOfMonth);
            }
        });
    }

    connectedCallback() {
        this.billList = this.shadowRoot.getElementById('bill-list');
        this.#updateDayOfMonth();
        this.#setupEventListeners();
    }

    #makeDayBill(bill) {
        const listElement = document.createElement('li');
        const newBill = document.createElement('day-bill');
        newBill.setAttribute('id', bill.id);
        newBill.setAttribute('name', bill.name);
        newBill.setAttribute('amount', bill.amount);
        listElement.appendChild(newBill);
        return listElement;
    }

    // Setting all bills like this should only be used when loading up a new month
    // For adding a bill to a day or removing one, we have addBill() and removeBill()
    set bills(billsList) {
        const newBills = [];
        for (const bill of billsList) {
            const newBill = this.#makeDayBill(bill);
            newBills.push(newBill);
        }
        if (this.billList.children.length > 0 || newBills.length > 0) {
            this.billList.replaceChildren(...newBills);
        }
    }

    get bills() {
        return [];
    }

    addBill(bill) {
        const newBill = this.#makeDayBill(bill);
        this.billList.appendChild(newBill);
    }
    removeBill(bill) {
        const toRemove = this.shadowRoot.getElementById(bill.id);
        this.billList.removeChild(toRemove);
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

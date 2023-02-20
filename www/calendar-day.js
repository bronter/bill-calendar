import { showAddBillDialog, showBillListDialog } from "./bills.js";
import { dateForDay } from "./calendar.js";

class CalendarDay extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById('calendar-day');
        const templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateContent.cloneNode(true));
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

        const billList = shadow.getElementById('bill-list');
        billList.addEventListener('click', () => {
            const billsCount = 0; // TODO: look it up or get it from the slot
            if (billsCount > 0) {
                showBillListDialog();
            }
        });
    }

    connectedCallback() {
        this.#updateDayOfMonth();
        this.#setupEventListeners();
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

import TemplatedElement from "./templated-element.js";
import SingletonElement from "./singleton-element.js";
import { selectedDateModel } from "./date-models.js";
import { billsForDate } from "./bills.js";

class BillOptionsRow extends TemplatedElement {
    static templateId = 'bill-options-row-template';

    constructor() {
        super();
        this.connectedPromise = new Promise(resolve => this.resolveConnected = resolve);
    }

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.name = shadowRoot.getElementById('name');
        this.paid = shadowRoot.getElementById('paid');
        this.paid.addEventListener('change', e => {
            const paid = e.target.checked;
            this.bill?.togglePaid(this.date, paid);
            const paidEvent = new CustomEvent('bill-pay', { detail: paid });
            this.dispatchEvent(paidEvent);
        });
        this.resolveConnected();
    }

    setDate(date) {
        this.date = date;
    }

    async setBill(bill) {
        this.bill = bill;
        await this.connectedPromise;
        this.name.textContent = bill.name;
        this.paid.checked = bill.payments.has(this.date.toISOString());
    }
}

customElements.define('bill-options-row', BillOptionsRow);

// TODO: This shares styles and logic with add-bill-dialog,
//       should have them share a stylesheet and extend a BillDialogElement or something
class BillListDialog extends SingletonElement {
    static #headerDateFormatOptions = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.dateHeader = shadowRoot.getElementById('date');
        this.dialog = shadowRoot.getElementById('dialog');
        this.list = shadowRoot.getElementById('list');
        this.done = shadowRoot.getElementById('done');
        this.done.addEventListener('click', () => {
            this.dialog.close();
        })
    }

    #populateBillList(date) {
        const bills = billsForDate(date);
        const billItems = [];
        const eventListener = e => {
            const clone = new e.constructor(e.type, e);
            this.dispatchEvent(clone);
        };
        for (const bill of bills) {
            const billItem = document.createElement('bill-options-row');
            billItem.setBill(bill);
            billItem.setDate(date);
            billItem.addEventListener('bill-pay', eventListener);
            billItems.push(billItem);
        }
        this.list.replaceChildren(...billItems);
    }

    showModal(day) {
        const date = selectedDateModel.dateFromDayOfMonth(day);
        this.date = date;
        const dateStr = date.toLocaleDateString(undefined, BillListDialog.#headerDateFormatOptions);
        this.dateHeader.textContent = dateStr;
        this.#populateBillList(date);
        this.dialog.showModal();
    }
}

customElements.define('bill-list-dialog', BillListDialog);
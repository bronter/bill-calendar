import TemplatedElement from "./templated-element.js";
import { dateForDay, billsForDay } from "./ui-main.js";

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
        this.paid.value = bill.payments.has(this.date.toISOString());
    }
}

customElements.define('bill-options-row', BillOptionsRow);

// TODO: This shares styles and logic with add-bill-dialog,
//       should have them share a stylesheet and extend a BillDialogElement or something
class BillListDialog extends TemplatedElement {
    static templateId = 'bill-list-dialog-template';
    static #headerDateFormatOptions = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.dateHeader = shadowRoot.getElementById('date');
        this.dialog = shadowRoot.getElementById('dialog');
        this.list = shadowRoot.getElementById('list');
    }

    #populateBillList(day, date) {
        const bills = billsForDay(day);
        const billItems = [];
        for (const bill of bills) {
            const billItem = document.createElement('bill-options-row');
            billItem.setBill(bill);
            billItem.setDate(date);
            billItems.push(billItem);
        }
        this.list.replaceChildren(...billItems);
    }

    showModal(day) {
        const date = dateForDay(day);
        this.date = date;
        const dateStr = date.toLocaleDateString(undefined, BillListDialog.#headerDateFormatOptions);
        this.dateHeader.textContent = dateStr;
        this.#populateBillList(day, date);
        this.dialog.showModal();
    }
}

customElements.define('bill-list-dialog', BillListDialog);
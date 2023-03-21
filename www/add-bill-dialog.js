import TemplatedElement from "./templated-element.js";
import { dateForDay } from "./ui-main.js";

class AddBillDialog extends TemplatedElement {
    static templateId = 'add-bill-template';
    static #headerDateFormatOptions = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.addBillDate = shadowRoot.getElementById('date');
        this.addBillDialog = shadowRoot.getElementById('dialog');
        this.billForm = shadowRoot.getElementById('bill-form');
        this.addBillDialog.addEventListener("close", () => this.billForm.reset());
        this.amount = shadowRoot.getElementById('amount');
        this.name = shadowRoot.getElementById('name');
        this.type = shadowRoot.getElementById('type');
        this.temporary = shadowRoot.getElementById('temporary');
        this.endDate = shadowRoot.getElementById('end-date');
        this.hasEndDate = false;
        this.temporary.addEventListener('change', e => {
            const { checked } = e.target;
            this.hasEndDate = checked;
            this.endDate.toggleAttribute('disabled', !checked);
        });
        this.billForm.addEventListener('submit', e => {
            if (e.submitter.value === "cancel") return;

            const detail = {
                amount: this.amount.value,
                name: this.name.value,
                startDate: this.billDate,
                endDate: this.hasEndDate ? new Date(`${this.endDate.value}T00:00:00`) : null,
                type: this.type.selectedOptions[0]?.value
            };
            const newEvent = new CustomEvent('submit', { detail });
            this.dispatchEvent(newEvent);
        });
    }

    showModal(day) {
        const date = dateForDay(day);
        this.billDate = date;
        const addBillDate = date.toLocaleDateString(undefined, AddBillDialog.#headerDateFormatOptions);
        this.addBillDate.textContent = addBillDate;
        this.addBillDialog.showModal();
    }
}

customElements.define('add-bill-dialog', AddBillDialog);
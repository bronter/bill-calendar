class AddBillDialog extends HTMLElement {
    static #headerDateFormatOptions = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };

    constructor() {
        super();

        const template = document.getElementById('add-bill-template');
        const templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.addBillDate = shadowRoot.getElementById('date');
        this.addBillDialog = shadowRoot.getElementById('dialog');
        this.billForm = shadowRoot.getElementById('bill-form');
        this.addBillDialog.addEventListener("close", () => this.billForm.reset());
        this.amount = shadowRoot.getElementById('amount');
        this.name = shadowRoot.getElementById('name');
        this.type = shadowRoot.getElementById('type');
        this.billForm.addEventListener('submit', e => {
            if (e.submitter.value === "cancel") return;

            const detail = {
                amount: this.amount.value,
                name: this.name.value,
                startDate: this.billDate,
                type: this.type.selectedOptions[0]?.value
            };
            const newEvent = new CustomEvent('submit', { detail });
            this.dispatchEvent(newEvent);
        });
    }

    showModal(date) {
        this.billDate = date;
        const addBillDate = date.toLocaleDateString(undefined, AddBillDialog.#headerDateFormatOptions);
        this.addBillDate.textContent = addBillDate;
        this.addBillDialog.showModal();
    }
}

customElements.define('add-bill-dialog', AddBillDialog);
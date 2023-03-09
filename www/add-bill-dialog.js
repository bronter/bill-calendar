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
        this.recurringCheckbox = shadowRoot.getElementById('recurring');
        this.recurringCheckbox.addEventListener('change', e => {
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
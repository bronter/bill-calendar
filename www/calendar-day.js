class CalendarDay extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById('calendar-day');
        const templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    #updateDayOfMonth() {
        const shadow = this.shadowRoot;
        const dateContainer = shadow.getElementById('day-of-month');
        dateContainer.textContent = this.getAttribute('day-of-month');
    }

    connectedCallback() {
        this.#updateDayOfMonth();
    }
}

customElements.define('calendar-day', CalendarDay);

// I guess you can't just create aliases for HTMLElement, you have to extend it
class PaddingDay extends HTMLElement {}
// padding-day basically exists so I can use nth-of-type to align the calendar start,
// without having to worry about it interfering with anything else.
customElements.define('padding-day', PaddingDay);

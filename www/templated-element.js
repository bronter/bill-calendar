export default class TemplatedElement extends HTMLElement {
    static templateId;

    constructor() {
        super();

        const templateId = this.constructor.templateId;
        const template = document.getElementById(templateId);
        const templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
}

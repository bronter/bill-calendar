export default class SingletonElement extends HTMLElement {
    constructor() {
        super();

        let template;
        for (const node of this.childNodes) {
            if (node.nodeName === 'TEMPLATE') {
                template = node;
                break;
            }
        }
        if (!template) throw new Error('Element must have a template in its children');
        const templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateContent.cloneNode(true));
        this.removeChild(template);
    }
}

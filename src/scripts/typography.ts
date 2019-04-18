const CONTAINER_CLASS = '__hopin__js-typography';
const ORIG_TEXT_ATTRIB = '__hopin_typograhy_orig_text';

class Typography {
    container: HTMLElement;

    constructor() {
        this.container = document.querySelector(`.${CONTAINER_CLASS}`) as HTMLElement;
    }

    updateTypeInfo() {
        for (const e of this.container.children) {
            let elementToCheck = e;
            if (e.childElementCount > 0) {
                elementToCheck = e.children[0];
            }
            

            const eStyles = window.getComputedStyle(elementToCheck);
            // TODO Find out which font is actually in use
            const detailText = `: "${eStyles.fontFamily}" ${eStyles.fontWeight}, ${eStyles.fontSize}`;

            if (elementToCheck === e) {
                let origText = elementToCheck.getAttribute(ORIG_TEXT_ATTRIB);
                if (!origText) {
                    origText = elementToCheck.textContent;
                    elementToCheck.setAttribute(ORIG_TEXT_ATTRIB, origText);
                    elementToCheck.textContent = `${origText}${detailText}`
                }
            } else {
                const span = document.createElement('span');
                span.textContent = detailText;
                e.appendChild(span);
            }
        }
    }
}

window.addEventListener('load', () => {
    const t = new Typography();
    t.updateTypeInfo();
});
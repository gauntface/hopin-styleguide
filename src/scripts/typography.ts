const CONTAINER_CLASS = '__hopin__js-typography';

class Typography {
    container: HTMLElement;

    constructor() {
        this.container = document.querySelector(`.${CONTAINER_CLASS}`) as HTMLElement;
    }

    updateTypeInfo() {
        const elements = this.container.querySelectorAll('*');
        const updatedTags: string[] = [];
        for (const e of elements) {
            if (updatedTags.includes(e.tagName)) {
                continue;
            }

            const eStyles = window.getComputedStyle(e);
            

            const infoElement = document.createElement('div');
            infoElement.classList.add('typ-info');
            infoElement.textContent = `Font: "${eStyles.fontFamily}" Size: ${eStyles.fontSize} Weight: ${eStyles.fontSize}`;
            let currentElement = e;
            let before = currentElement.nextSibling;
            while (currentElement.parentElement !== this.container) {
                currentElement = currentElement.parentElement;
                before = currentElement.nextSibling;
                console.log(currentElement, currentElement.parentElement);
            }
            this.container.insertBefore(infoElement, before);
            updatedTags.push(e.tagName);
        }
    }
}

window.addEventListener('load', () => {
    const t = new Typography();
    t.updateTypeInfo();
});
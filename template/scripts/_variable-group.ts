import { friendlyName, friendlyNameFromURL } from "./_friendly-name";

const GROUP_CONTAINER_CLASS = '__hopin__variable-group';
const GROUP_TITLE_CLASS = '__hopin__variable-group__title';

export abstract class VariableGroup {
    constructor(private containerClass: string, private fileSuffix: string) {}

    getGroups(): Group[] {
        const groups: Group[] = [];
        for (const s of document.styleSheets) {
            try {
                if (!s.href) {
                    continue;
                }

                if (s.href.lastIndexOf(this.fileSuffix) !== s.href.length - this.fileSuffix.length) {
                    continue;
                }

                const group: Group = {
                    prettyName: friendlyNameFromURL(s.href, this.fileSuffix),
                    href: s.href,
                    variables: [],
                };

                const cssStylesheet = s as CSSStyleSheet;
                for (const r of cssStylesheet.cssRules) {
                    const cssStyleRule = r as {
                        styleMap?: StyleMap
                    };
                    if (cssStyleRule['styleMap']) {
                        const map = cssStyleRule['styleMap'];
                        for (const e of map.entries()) {
                            // The format of e is ["<param name>", [["<value>"]]]
                            const name = e[0] as string;
                            if (name.indexOf('--') === 0) {
                                let unparsedValue = e[1][0] as CSSUnparsedValue;
                                group.variables.push({
                                    prettyName: friendlyName(name),
                                    variableName: name,
                                    value: unparsedValue.toString(),
                                });
                            }
                        }
                    }
                }
                groups.push(group);
            } catch (err) {
                // External stylesheets will not be accessible from JavaScript
                // in which case this error will be thrown.
                console.error(`Unable to read styles for ${s.href}`, err);
            }
        }
        return groups;
    }

    render() {
        const containerElement = document.querySelector(`.${this.containerClass}`);
        if (!containerElement) {
            console.warn(`Unable to find container with class ${this.containerClass}`)
            return;
        }

        const groups = this.getGroups();
        console.log(`Rendering the following groups:`, groups);
        for (const g of groups) {
            const groupContainer = document.createElement('section');
            groupContainer.classList.add(GROUP_CONTAINER_CLASS);

            if (g.prettyName) {
                const title = document.createElement('h2');
                title.classList.add(GROUP_TITLE_CLASS);
                title.textContent = g.prettyName;
                groupContainer.appendChild(title);
            }

            const elements = this.renderData(g.variables);
            for (const e of elements) {
                groupContainer.appendChild(e);
            }
            containerElement.appendChild(groupContainer);
        } 
    }

    abstract renderData(variables: Variable[]): HTMLElement[];
} 

interface Group {
    prettyName: string|null;
    href: string;
    variables: Variable[];
}

export interface Variable {
    prettyName: string|null;
    variableName: string;
    value: string;
}

interface StyleMap {
    entries: () => Array<string|Array<string>>;
}
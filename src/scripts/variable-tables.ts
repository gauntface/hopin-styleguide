import {copyToClipboard} from './_clipboard';
import {createTable} from './_variable-table';

const tables = [
  {
    fileSuffix: 'dimens.css',
    containerClass: '__hopin__js-dimensions',
  },
  {
    fileSuffix: 'fonts.css',
    containerClass: '__hopin__js-fonts',
  },
];

function generateTable(suffix: string, containerClass: string) {
  const container = document.querySelector(`.${containerClass}`);
  if (!container) {
    return;
  }

  const groups = getStylesheets(suffix);
  for (const g of groups) {
    if (g.variables.length === 0) {
      continue;
    }

    // Add stylesheet name
    const href = new URL(g.href);
    const stylesheetHref = document.createElement('p');
    if (href.host === window.location.host) {
      stylesheetHref.textContent = href.pathname;
    } else {
      stylesheetHref.textContent = g.href;
    }

    const rows: Array<Array<string|HTMLElement>> = [];
    for (const d of g.variables) {
      const copyText = document.createElement('div');
      copyText.textContent = 'Copy';
      copyText.addEventListener('click', (e) => {
        e.preventDefault();
        const success = copyToClipboard(d.name);
        if (success) {
          copyText.textContent = 'Copied';
          setTimeout(() => {
            copyText.textContent = 'Copy';
          }, 1000);
        }
      });
      rows.push([d.name, d.value, copyText]);
    }

    const table = createTable({
      columns: ["Variable Name", "Value", ""],
      rows,
    });

    const groupContainer = document.createElement('section');
    groupContainer.classList.add('cp-stylesheet');
    groupContainer.appendChild(stylesheetHref);
    groupContainer.appendChild(table);

    container.appendChild(groupContainer);
  }
}

function getStylesheets(suffix: string): CSSVarGroup[] {
    const groups: CSSVarGroup[] = [];
    for (const s of document.styleSheets) {
        try {
        if (s.href.lastIndexOf(suffix) !== s.href.length - suffix.length) {
            continue;
        }

        const group: CSSVarGroup = {
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
                    const value = e[1][0][0];
                    group.variables.push({
                        name,
                        value,
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

window.addEventListener('load', function() {
    for (const t of tables) {
        generateTable(t.fileSuffix, t.containerClass);
    }
});

interface CSSVarGroup {
    href: string;
    variables: CSSVariable[];
}

interface CSSVariable {
    name: string;
    value: string;
}

interface StyleMap {
    entries: () => Array<string|Array<string>>;
}
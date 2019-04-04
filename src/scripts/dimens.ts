import {copyToClipboard} from './_clipboard';

const DIMENS_SUFFIX = 'dimens.css';

class Dimens {
  container: HTMLElement;

  constructor() {
    this.container = document.querySelector('.dimens-container');
  }

  updateDimens() {
    // TODO: Make this remove inner children
    this.container.innerHTML = '';

    const groups = this.getDimens();
    for (const g of groups) {
      if (g.dimens.length === 0) {
        continue;
      }

      const href = new URL(g.href);
      const stylesheetHref = document.createElement('p');
      if (href.host === window.location.host) {
        stylesheetHref.textContent = href.pathname;
      } else {
        stylesheetHref.textContent = g.href;
      }

      const dimensTable = document.createElement('table');
      dimensTable.classList.add('dimens-vars');

      const nameCol = document.createElement('th');
      nameCol.textContent = "Variable Name";
      const valueCol = document.createElement('th');
      valueCol.textContent = "Value";
      const copyCol = document.createElement('th');

      const headRow = document.createElement('tr');
      headRow.appendChild(nameCol);
      headRow.appendChild(valueCol);
      headRow.appendChild(copyCol);

      const tblHead = document.createElement('thead');
      tblHead.appendChild(headRow);
      dimensTable.appendChild(tblHead);

      const tblBody = document.createElement('tbody');
      dimensTable.appendChild(tblBody);
      for (const c of g.dimens) {
        const row = document.createElement('tr');
        const nameCol = document.createElement('td');
        nameCol.textContent = c.name;
        const valueCol = document.createElement('td');
        valueCol.textContent = c.value;
        const copyCol = document.createElement('td');

        const copyText = document.createElement('div');
        copyText.classList.add('cp-swatch_copytext');
        copyText.textContent = 'Copy';
        copyCol.appendChild(copyText);

        row.appendChild(nameCol);
        row.appendChild(valueCol);
        row.appendChild(copyCol);

        copyText.addEventListener('click', (e) => {
          e.preventDefault();
          // TODO: Disable it such that you can't copy
          // multiple times.
          const success = copyToClipboard(c.value);
          if (success) {
            copyText.textContent = 'Copied';
            setTimeout(() => {
              copyText.textContent = 'Copy';
            }, 1000);
          }
        });

        tblBody.appendChild(row);
      }

      const groupContainer = document.createElement('section');
      groupContainer.classList.add('cp-stylesheet');
      groupContainer.appendChild(stylesheetHref);
      groupContainer.appendChild(dimensTable);

      this.container.appendChild(groupContainer);
    }
  }

  getDimens(): CSSVarGroup[] {
    const groups: CSSVarGroup[] = [];
    for (const s of document.styleSheets) {
      try {
        if (s.href.lastIndexOf(DIMENS_SUFFIX) !== s.href.length - DIMENS_SUFFIX.length) {
          continue;
        }

        const group: CSSVarGroup = {
          href: s.href,
          dimens: [],
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
                group.dimens.push({
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
}

window.addEventListener('load', () => {
  const di = new Dimens();
  di.updateDimens();
});

interface CSSVarGroup {
  href: string;
  dimens: CSSVariable[];
}

interface CSSVariable {
  name: string;
  value: string;
}

interface StyleMap {
  entries: () => Array<string|Array<string>>;
}
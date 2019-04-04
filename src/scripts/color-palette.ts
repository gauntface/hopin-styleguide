import {copyToClipboard} from './_clipboard';

const COLOR_SUFFIX = 'colors.css';

const CONTAINER_SELECTOR = '.__hopin__c-color-palette';

class ColorPalette {
  container: HTMLElement;

  constructor() {
    this.container = document.querySelector(CONTAINER_SELECTOR);
  }

  updateColorPalette() {
    // TODO: Make this remove inner children
    this.container.innerHTML = '';

    const groups = this.getColors();
    for (const g of groups) {
      if (g.colors.length === 0) {
        continue;
      }

      const href = new URL(g.href);
      const stylesheetHref = document.createElement('p');
      if (href.host === window.location.host) {
        stylesheetHref.textContent = href.pathname;
      } else {
        stylesheetHref.textContent = g.href;
      }

      const stylesheetColors = document.createElement('div');
      stylesheetColors.classList.add('cp-colors');

      for (const c of g.colors) {
        const colorSwatch = document.createElement('div');
        colorSwatch.classList.add('cp-swatch_color');
        colorSwatch.style.backgroundColor = c.value;

        const colorTab = document.createElement('div');
        colorTab.classList.add('cp-swatch_tab');

        const colorName = document.createElement('soan');
        colorName.classList.add('cp-swatch_name');
        colorName.textContent = c.name;

        const copyText = document.createElement('div');
        copyText.classList.add('cp-swatch_copytext');
        copyText.textContent = 'Copy';

        colorTab.appendChild(colorName);
        colorTab.appendChild(copyText);

        const swatch = document.createElement('div');
        swatch.classList.add('cp-swatch');
        swatch.appendChild(colorSwatch);
        swatch.appendChild(colorTab);
        swatch.addEventListener('click', (e) => {
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

        stylesheetColors.appendChild(swatch);
      }

      const groupContainer = document.createElement('section');
      groupContainer.classList.add('cp-stylesheet');
      groupContainer.appendChild(stylesheetHref);
      groupContainer.appendChild(stylesheetColors);

      this.container.appendChild(groupContainer);
    }
  }

  getColors(): ColorGroup[] {
    const groups: ColorGroup[] = [];
    for (const s of document.styleSheets) {
      try {
        if (s.href.lastIndexOf(COLOR_SUFFIX) !== s.href.length - COLOR_SUFFIX.length) {
          continue;
        }

        const group: ColorGroup = {
          href: s.href,
          colors: [],
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
                group.colors.push({
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
  const cp = new ColorPalette();
  cp.updateColorPalette();
  /* const colorPalette = document.querySelector('.color-palette');
colorPalette.innerHTML = '';

for (const s of document.styleSheets) {
  for (const r of s.rules) {
    for (const e of r.styleMap.entries()) {
      const property = e[0];
      const value = e[1][0][0];
      if (property.indexOf('--') === 0) {
          const colorItem = document.createElement('div');
      colorItem.classList.add('color-palette_item');
      colorItem.style.backgroundColor = value;
        colorPalette.appendChild(colorItem);
          }       
    }
  }
}*/
});

interface ColorGroup {
  href: string;
  colors: ColorVariable[];
}

interface ColorVariable {
  name: string;
  value: string;
}

interface StyleMap {
  entries: () => Array<string|Array<string>>;
}
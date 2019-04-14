import {copyToClipboard} from './_clipboard';

const COLOR_SUFFIX = 'colors.css';

const CONTAINER_CLASS = '__hopin__js-color-palette';
const SWATCH_GROUP_CLASS = '__hopin__c-swatch-group';
const SWATCH_CLASS = '__hopin__c-swatch';
const SWATCH_COLOR_CLASS = '__hopin__c-swatch__color';
const SWATCH_HEX_CLASS = '__hopin__c-swatch__hex-value';
const SWATCH_HEX_LIGHT_COLOR = '__hopin__c-swatch__hex--light-color';
const SWATCH_HEX_DARK_COLOR = '__hopin__c-swatch__hex--dark-color';
const SWATCH_FOOTER_CLASS = '__hopin__c-swatch__footer';
const SWATCH_COPY_CLASS = '__hopin__c-swatch__copytext';

class ColorPalette {
  container: HTMLElement;

  constructor() {
    this.container = document.querySelector(`.${CONTAINER_CLASS}`);
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
      stylesheetColors.classList.add(SWATCH_GROUP_CLASS);

      for (const c of g.colors) {
        // Use c.value to get the actual color value
        const hexValue = document.createElement('span');
        hexValue.classList.add(SWATCH_HEX_CLASS);
        hexValue.textContent = c.value;

        // TODO: Use specific fonts applied to text instead of black and white
        const distanceToBlack = this.distance(this.hexToRGB(c.value), this.hexToRGB('#000000'));
        const distanceToWhite = this.distance(this.hexToRGB(c.value), this.hexToRGB('#FFFFFF'));

        if (distanceToBlack > distanceToWhite) {
          hexValue.classList.add(SWATCH_HEX_DARK_COLOR);
        } else {
          hexValue.classList.add(SWATCH_HEX_LIGHT_COLOR);
        }

        const swatchColor = document.createElement('div');
        swatchColor.classList.add(SWATCH_COLOR_CLASS);
        swatchColor.style.backgroundColor = `var(${c.name})`;
        swatchColor.appendChild(hexValue);

        const swatchFooter = document.createElement('div');
        swatchFooter.classList.add(SWATCH_FOOTER_CLASS);

        const colorName = document.createElement('span');
        colorName.textContent = c.name;

        const copyText = document.createElement('div');
        copyText.classList.add(SWATCH_COPY_CLASS);
        copyText.textContent = 'Copy';

        swatchFooter.appendChild(colorName);
        swatchFooter.appendChild(copyText);

        const swatch = document.createElement('div');
        swatch.classList.add(SWATCH_CLASS);
        swatch.appendChild(swatchColor);
        swatch.appendChild(swatchFooter);
        swatch.addEventListener('click', (e) => {
          e.preventDefault();
          // TODO: Disable it such that you can't copy
          // multiple times.
          const success = copyToClipboard(c.name);
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
        if (!s.href) {
          continue;
        }
        
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

  hexToRGB(hex: string): RGBColor {
    const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const result = hexRegex.exec(hex.trim());
    if (!result) {
      throw new Error(`Unable to parse hex string '${hex}'`);
    }
    return {
      Red: parseInt(result[1], 16),
      Green: parseInt(result[2], 16),
      Blue: parseInt(result[3], 16),
    }
  }

  distance(c1: RGBColor, c2: RGBColor): number {
    const d = Math.pow((c1.Red - c2.Red), 2) +
    Math.pow((c1.Green - c2.Green), 2) +
    Math.pow((c1.Blue - c2.Blue), 2);
    return Math.sqrt(d);
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

interface RGBColor {
  Red: number;
  Green: number;
  Blue: number;
}
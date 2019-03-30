class ColorPalette {
  constructor() {
    this.container = document.querySelector('.cp-container');
  }

  getColors() {
    for (const s of document.styleSheets) {
      const stylesheet = s.valueOf(':root');
      if (!stylesheet) {
        continue;
      }

      for (const r of stylesheet.rules) {
        console.log(r);
      }
    }
  }
}

window.addEventListener('load', () => {
  const cp = new ColorPalette();
  cp.getColors();
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
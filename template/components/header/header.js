const HOPIN_MENU_BTN_SELECTOR = '__hopin__js-menu-btn';

function onMenuClick() {
  console.log(`TODO: Open / Close menu.`);
}

window.addEventListener('load', function() {
  const menuBtn = document.querySelector(`.${HOPIN_MENU_BTN_SELECTOR}`);
  if (!menuBtn) {
    console.warn('Unable to find menu btn.');
    return;
  }

  menuBtn.addEventListener('click', onMenuClick);
})
---
title: Styleguide
styles:
  inline:
    - ../src/components/home-item/home-item.css
  sync:
    - /gauntface/styleguide.css
partials:
  - ../src/components/home-item/images/colors-symbol.svg
  - ../src/components/home-item/images/dimens-symbol.svg
  - ../src/components/home-item/images/layout-symbol.svg
  - ../src/components/home-item/images/component-symbol.svg
---

<div class="__hopin__l-home-grid">
  <a href="/colors.html" class="__hopin__c-home-item--link">
    <div class="__hopin__c-home-item">
      <div class="__hopin__c-home-item--content">
        {{> ../src/components/home-item/images/colors-symbol.svg}}
      </div>
      <div class="__hopin__c-home-item--footer">
        <p>Colors</p>
      </div>
    </div>
  </a>

  <a href="/dimensions.html" class="__hopin__c-home-item--link">
    <div class="__hopin__c-home-item">
      <div class="__hopin__c-home-item--content">
        {{> ../src/components/home-item/images/dimens-symbol.svg}}
      </div>
      <div class="__hopin__c-home-item--footer">
        <p>Dimensions</p>
      </div>
    </div>
  </a>

  <a href="/fonts.html" class="__hopin__c-home-item--link">
    <div class="__hopin__c-home-item">
      <div class="__hopin__c-home-item--content">
        ABC
      </div>
      <div class="__hopin__c-home-item--footer">
        <p>Fonts</p>
      </div>
    </div>
  </a>

  <a href="/elements.html" class="__hopin__c-home-item--link">
    <div class="__hopin__c-home-item">
      <div class="__hopin__c-home-item--content">
        {&nbsp;&nbsp;&nbsp;}
      </div>
      <div class="__hopin__c-home-item--footer">
        <p>HTML Elements</p>
      </div>
    </div>
  </a>

  <a href="/components.html" class="__hopin__c-home-item--link">
    <div class="__hopin__c-home-item">
      <div class="__hopin__c-home-item--content">
        {{> ../src/components/home-item/images/component-symbol.svg}}
      </div>
      <div class="__hopin__c-home-item--footer">
        <p>Components</p>
      </div>
    </div>
  </a>

  <a href="/layouts.html" class="__hopin__c-home-item--link">
    <div class="__hopin__c-home-item">
      <div class="__hopin__c-home-item--content">
        {{> ../src/components/home-item/images/layout-symbol.svg}}
      </div>
      <div class="__hopin__c-home-item--footer">
        <p>Layouts</p>
      </div>
    </div>
  </a>

</div>
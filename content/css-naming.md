---
title: CSS Naming
styles:
  inline:
    - ../src/components/swatch/swatch.css
  sync:
    - /gauntface/styleguide.css
    - /gauntface/variables/_primary-colors.css
    - /gauntface/variables/_secondary-colors.css
scripts:
  sync:
    - /scripts/classnames.js
---

# CSS Naming

This page will include information on the CSS selectors used in your stylesheets.

The assumption is you are following the pattern of:

```
.__hopin__c-my-component__sub-section--fancy
|________|_|___________|_____________|______|
    |     |      |            |          |
Namespace |      |            |          |
        Type     |            |          |
                Body          |          |
                           Element       |
                                     Modifier
```

The namespace, element and modifier are optional, so you can
have names such as:

.c-header
.c-header--larger
.c-header__link

The `type` of a selector should be one of the following:

- `c` Component
- `l` Layout
- `u` Utility

<div class='__hopin__js-classnames'></div>
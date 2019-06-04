---
title: Colors
layout: ../../layouts/content/content.tmpl
styles:
  inline:
    - ../../components/swatch-item/swatch-item.css
scripts:
  inline:
    - ../../build/scripts/colors.js
---
# Colors

The color palette is derived from CSS variables defined in CSS files ending in `colors.css`

{{#styleguide.colors}}<link href="{{.}}" rel="stylesheet" type="text/css">{{/styleguide.colors}}

<div class='__hopin__js-colors'></div>

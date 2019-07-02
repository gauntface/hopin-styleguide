---
title: Colors
layout: ../../layouts/content/content.tmpl
---
# Colors

The color palette is derived from CSS variables defined in CSS files ending in `colors.css`

{{#styleguide.colors}}<link href="{{.}}" rel="stylesheet" type="text/css">{{/styleguide.colors}}

{{hopin_loadComponent "../../components/colors-table/colors-table.tmpl"}}

<div class='__hopin__js-colors'></div>

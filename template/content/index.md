---
title: Style Guide
layout: ../layouts/content/content.tmpl
---

{{hopin_loadComponent "../layouts/home-grid/home-grid-open.tmpl"}}

  {{hopin_loadComponent "../components/home-item/home-item.tmpl" 
    title="Colors" 
    img="images/colors-symbol.svg"
    link="/variables/colors.html"}}

  {{hopin_loadComponent "../components/home-item/home-item.tmpl" 
    title="Dimensions" 
    img="images/dimens-symbol.svg"
    link="/variables/dimensions.html"}}

  {{hopin_loadComponent "../components/home-item/home-item.tmpl" 
    title="Fonts"
    content="ABC"
    link="/variables/fonts.html"}}

  {{hopin_loadComponent "../components/home-item/home-item.tmpl" 
    title="HTML Elements"
    content="{   }"
    link="/elements/"}}

  {{hopin_loadComponent "../components/home-item/home-item.tmpl" 
    title="Components" 
    img="images/component-symbol.svg"
    link="/components/"}}

  {{hopin_loadComponent "../components/home-item/home-item.tmpl" 
    title="Layouts" 
    img="images/layout-symbol.svg"
    link="/layouts/"}}

{{hopin_loadComponent "../layouts/home-grid/home-grid-close.tmpl"}}
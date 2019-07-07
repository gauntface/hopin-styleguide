---
title: Components
layout: ../../layouts/content/content.tmpl
styles:
  sync:
    - /gauntface/styleguide.css
---

# Components

This page contains the set of components for the current theme
and will include samples of the components where provided.

{{#components}}

## {{ name }}

{{hopin_loadComponent path page=../page }}

{{/components}}
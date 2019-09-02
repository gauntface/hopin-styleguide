<h1  align="center">@hopin/styleguide</h1>

<p align="center">
  <a href="https://travis-ci.com/gauntface/hopin-web-build-tools"><img src="https://travis-ci.com/gauntface/hopin-styleguide.svg?branch=master" alt="Travis Build Status" /></a>
  <a href="https://coveralls.io/github/gauntface/hopin-styleguide?branch=master"><img src="https://img.shields.io/coveralls/github/gauntface/hopin-styleguide.svg" alt="Coverage Status" /></a>
</p>

<p align="center">
This is still early in development, but the idea is that
it can generate a styleguide for "hopin theme".
</p>

<p align="center">
An example of the output can be found at 
<a href="https://styleguide.gaunt.dev/">styleguide.gaunt.dev</a>.
</p>

<p align="center">
<img alt="Toy Story Style" src="https://media.giphy.com/media/vQ8ma8B3TB5QI/source.gif" />
</p>


## Building Styleguide for Theme

You can build the styleguide using the `build` command.

```
@hopin/styleguide build --dir <Path to Theme>
```

## Developing Theme

You can use the `serve` command to watch and build
your styleguide.

```
@hopin/styleguide serve --dir <Path to Theme>
```
# Rispa Render Static [![Build Status](https://api.travis-ci.org/rispa-io/rispa-render-static.svg?branch=master)](https://travis-ci.org/rispa-io/rispa-render-static)

[![Greenkeeper badge](https://badges.greenkeeper.io/rispa-io/rispa-render-static.svg)](https://greenkeeper.io/)

**Rispa** plugin for static site generation.

Provide an array of paths to be rendered and a matching set of `*.html` files will be rendered in `/build` directory.

## Getting Started
### Installation
To add this plugin, run inside project directory:
```bash
ris add rispa-render-static
```

### Configure
In `@rispa/config` plugin, we can configure render routes.

For example:
```js
const config = {
  ...,
  '@rispa/render-static': {
    routes: [
      '/',
      '/catalog',
      '/about',
    ],
  },
}

export default config

```

### Build
Use [@rispa/webpack](https://github.com/rispa-io/rispa-webpack) commands to build your code and generate static pages.

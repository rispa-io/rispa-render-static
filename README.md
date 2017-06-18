# rispa-render-statiс
Static site generator.

Provide an array of paths to be rendered and a matching set of `*.html` files will be rendered in `/build` directory.

## Getting Started
### Installation
To add this plugin, run inside project directory:
```bash
ris add rispa-render-static
```

### Configure
In the root directory of the plugin contains the configuration file **routes.js**.

For example:
```js
const routes = [
  '/',
  '/catalog',
  {
    location: '/catalog?id=1',
    path: '/catalog/1.html'
  },
  // ADD HERE YOUR ROUTES
]

export default routes

```

### Build
Use [@rispa/webpack](https://github.com/rispa-io/rispa-webpack) commands to build your code and generate static pages.
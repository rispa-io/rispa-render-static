import path from 'path'
import fs from 'fs-extra'
import createDebug from 'debug'
import createRender from './render'

const log = createDebug('rispa:info:render-static')
const logError = createDebug('rispa:error:render-static')

const statsOptions = {
  chunkModules: true,
  modules: true,
  chunks: true,
  assets: true,
  chunkOrigins: true,
  source: false,
  exclude: [/node_modules/],
}

class RenderStaticWebpackPlugin {
  constructor({ routes = [], outputPath = '' }) {
    this.routes = routes.map(route => {
      if (typeof route === 'string') {
        return {
          location: route,
          path: route,
        }
      }
      return route
    }).map(route => {
      if (route.path.endsWith('/')) {
        route.path += 'index.html'
      } else if (!route.path.endsWith('.html')) {
        route.path += '.html'
      }
      return route
    })

    this.outputPath = outputPath
  }

  apply = compiler => compiler.plugin('done', this.onDone)

  onDone = statsWebpack => {
    const stats = statsWebpack.toJson(statsOptions)
    const renderToString = createRender(stats)

    this.renderRoutes(renderToString)
  }

  renderRoutes(renderToString) {
    this.routes.forEach(route => {
      try {
        const content = renderToString(route.location)
        const filePath = path.resolve(this.outputPath, `.${route.path}`)

        fs.ensureDirSync(path.dirname(filePath))
        fs.writeFileSync(filePath, content)

        log(`Render route '${route.location}' to page '${route.path}'`)
      } catch (e) {
        logError(`Failed to render route '${route.location} to page '${route.path}''`)
        logError(e)
      }
    })
  }

}

export default RenderStaticWebpackPlugin

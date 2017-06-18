import path from 'path'
import fs from 'fs'
import createRender from './render'

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
  constructor({ paths, outputPath }) {
    this.paths = paths
    this.outputPath = outputPath
  }

  apply = compiler => compiler.plugin('done', this.render)

  render = statsWebpack => {
    const stats = statsWebpack.toJson(statsOptions)
    const renderPage = createRender(stats)
    const pages = this.paths.map(location => ({
      path: `${location}${location.endsWith('/') ? 'index' : ''}.html`,
      content: renderPage(location),
    }))

    pages.forEach(page => fs.writeFileSync(
      path.resolve(this.outputPath, `.${page.path}`), page.content
    ))
  }

}

export default RenderStaticWebpackPlugin

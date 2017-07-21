import { group, env } from '@webpack-blocks/webpack2'
import config from '@rispa/config'
import RenderStaticWebpackPlugin from '../../src/RenderStaticWebpackPlugin'

export default options => group([
  env('production', [
    () => ({
      plugins: [
        options && options.routes ? new RenderStaticWebpackPlugin({
          outputPath: config.outputPath,
          routes: options.routes,
        }) : null,
      ].filter(Boolean),
    }),
  ]),
])

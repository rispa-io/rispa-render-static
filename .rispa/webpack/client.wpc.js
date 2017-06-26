import { createConfig, env } from '@webpack-blocks/webpack2'
import config from '@rispa/config'
import RenderStaticWebpackPlugin from '../../src/RenderStaticWebpackPlugin'
import routes from '../../routes'

export default () => createConfig([
  env('production', [
    () => ({
      plugins: [
        new RenderStaticWebpackPlugin({
          outputPath: config.outputPath,
          routes,
        }),
      ],
    }),
  ]),
])

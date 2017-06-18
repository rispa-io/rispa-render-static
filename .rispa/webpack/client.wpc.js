import { createConfig, env } from '@webpack-blocks/webpack2'
import config from '@rispa/config'
import RenderStaticWebpackPlugin from '../../src/RenderStaticWebpackPlugin'

export default () => createConfig([
  env('production', [
    () => ({
      plugins: [
        new RenderStaticWebpackPlugin({
          outputPath: config.outputPath,
          paths: [
            '/',
            '/not-found',
            '/test'
          ],
        })
      ],
    }),
  ]),
])
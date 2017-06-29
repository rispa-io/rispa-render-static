import { init, build } from '@rispa/core/events'
import webpackExtensionClient from './webpack/client.wpc'

const activator = on => {
  on(init(build), registry => {
    registry.add('webpack.client', webpackExtensionClient)
  })
}

export default activator

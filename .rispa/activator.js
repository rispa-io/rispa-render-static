import { init, build } from '@rispa/core/events'
import config from '@rispa/config'
import webpackExtensionClient from './webpack/client.wpc'

const renderStaticOptions = config['@rispa/render-static']

const activator = on => {
  on(init(build), registry => {
    registry.add('webpack.client', webpackExtensionClient(renderStaticOptions))
  })
}

export default activator

import path from 'path'
import React from 'react'
import ReactDOM from 'react-dom/server'
import createHistory from 'history/createMemoryHistory'
import flushChunks from 'webpack-flush-chunks'
import reactTreeWalker from 'react-tree-walker'
import {
  ConnectedRouter,
  Provider,
  replace,
  configureStore,
  createWhen,
} from '@rispa/redux'
import { CookiesProvider, Cookies } from 'react-cookie'
import getRoutes from '@rispa/routes'
import config from '@rispa/config'
import { flushWebpackRequireWeakIds } from 'react-loadable'
import Html from './Html'

const createAssets = stats => {
  const rootDir = path.resolve(process.cwd())
  const publicPath = config.publicPath.replace(/\/$/, '')
  const paths = flushWebpackRequireWeakIds().map(
    p => path.relative(rootDir, p).replace(/\\/g, '/')
  )
  const flushedAssets = flushChunks(paths, stats, {
    rootDir,
    before: ['bootstrap'],
    after: ['main'],
  })

  const assets = {
    styles: flushedAssets.stylesheets.reduce((styles, style) => {
      const key = style.replace(/\.css$/, '')
      styles[key] = `${publicPath}/${style}`
      return styles
    }, {}),
    javascript: flushedAssets.scripts.reduce((scripts, script) => {
      const key = script.replace(/\.js$/, '')
      scripts[key] = `${publicPath}/${script}`
      return scripts
    }, {}),
  }

  return assets
}

const createRender = stats => {
  const cookies = new Cookies()
  const history = createHistory()
  const store = configureStore(history)

  const when = createWhen(store)
  const routes = getRoutes({ store, when, cookies })
  const assets = createAssets(stats)

  const App = (
    <Provider store={store}>
      <CookiesProvider>
        <ConnectedRouter history={history}>
          {routes}
        </ConnectedRouter>
      </CookiesProvider>
    </Provider>
  )

  return location => {
    store.dispatch(replace(location))

    reactTreeWalker(App, () => true)

    const content = ReactDOM.renderToString(App)
    const html =
      `<!doctype html>\n${
        ReactDOM.renderToStaticMarkup(
          <Html
            assets={assets}
            content={content}
            initialState={JSON.stringify(store.getState())}
          />
        )}`

    return html
  }
}

export default createRender

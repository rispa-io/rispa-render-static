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
import { CookiesProvider } from '@rispa/vendor/cookies'
import getRoutes from '@rispa/routes'
import { flushWebpackRequireWeakIds } from '@rispa/vendor/loadable'
import Html from './Html'

const createAssets = stats => {
  const rootDir = path.resolve(process.cwd())
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
      const key = styles.replace(/\.css$/, '')
      styles[key] = style
      return styles
    }, {}),
    javascript: flushedAssets.scripts.reduce((newScripts, script) => {
      const key = script.replace(/\.js$/, '')
      newScripts[key] = script
      return newScripts
    }, {}),
  }

  return assets
}

const createRender = stats => location => {
  const history = createHistory()
  const store = configureStore(history, {
    router: {
      location: {
        pathname: location,
      },
    },
  })

  const when = createWhen(store)
  const routes = getRoutes(store, when)

  store.dispatch(replace(location))

  const App = (
    <Provider store={store}>
      <CookiesProvider>
        <ConnectedRouter history={history}>
          {routes}
        </ConnectedRouter>
      </CookiesProvider>
    </Provider>
  )

  reactTreeWalker(App, () => true)

  const assets = createAssets(stats)
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

export default createRender

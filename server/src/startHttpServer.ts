import express from 'express'

import Library from './Library'
import { Config } from './Config'

export default (config: Config) => (library: Library) => {
  const app = express()

  app.get('/', (req, res) => res.json(library.getPhotos()))
  app.use(express.static(config.cacheBasePath))

  app.listen(config.httpPort, () => {
    console.log(`HTTP server started at ${config.httpPort}!`)
  })
}

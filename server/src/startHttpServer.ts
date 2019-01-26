import express from 'express'

import Library from './Library'
import Config from './Config'
import { getThumbnail, getFullSize } from './previews'

export default (config: Config) => (library: Library) => {
  const app = express()

  app.get('/api/photos', (req, res) => res.json(library.getPhotos()))

  app.get('/api/thumbnail/:contentHash', async (req, res) => {
    const photo = library.getPhotoByContentHash(req.params.contentHash)
    if (!photo) res.sendStatus(404)

    res.sendFile(await getThumbnail(config)(photo.contentHash, photo.relativePath))
  })

  app.get('/api/fullSize/:contentHash', async (req, res) => {
    const photo = library.getPhotoByContentHash(req.params.contentHash)
    if (!photo) res.sendStatus(404)

    res.sendFile(await getFullSize(config)(photo.contentHash, photo.relativePath))
  })

  app.listen(config.httpPort, () => {
    console.log(`HTTP server started at ${config.httpPort}!`)
  })
}

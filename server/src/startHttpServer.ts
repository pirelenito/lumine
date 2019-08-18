import os from 'os'
import express from 'express'
import { TaskQueue } from 'cwait'
import Library from './Library'
import Config from './Config'
import { getThumbnail, getFullSize } from './previews'

export default (config: Config) => (library: Library) => {
  const queue = new TaskQueue(Promise, os.cpus().length - 1)
  const getThumbnailThrottled = queue.wrap(getThumbnail(config))
  const getFullSizeThrottled = queue.wrap(getFullSize(config))

  const app = express()

  app.get('/api/photos', (req, res) => res.json(library.getPhotos()))

  app.get('/api/photos/:id', (req, res) => res.json(library.getPhotoByContentHash(req.params.id)))

  app.get('/api/thumbnail/:contentHash', async (req, res) => {
    const photo = library.getPhotoByContentHash(req.params.contentHash)
    if (!photo) res.sendStatus(404)

    try {
      res.sendFile(await getThumbnailThrottled(photo.contentHash, photo.relativePath))
    } catch (error) {
      res.status(500)
      res.send(error.toString())
    }
  })

  app.get('/api/fullSize/:contentHash', async (req, res) => {
    const photo = library.getPhotoByContentHash(req.params.contentHash)
    if (!photo) res.sendStatus(404)

    try {
      res.sendFile(await getFullSizeThrottled(photo.contentHash, photo.relativePath))
    } catch (error) {
      res.status(500)
      res.send(error)
    }
  })

  app.use(express.static('/usr/src/app/client/build'))

  app.listen(config.httpPort, () => {
    console.log(`HTTP server started at ${config.httpPort}!`)
  })
}

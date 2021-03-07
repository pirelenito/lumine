import express from 'express'
import Library from './Library'
import Config from './Config'

export default (config: Config) => {
  const library = new Library(config)

  library.scanFiles()

  const app = express()

  app.get('/api/photos', (req, res) => res.json(library.getPhotos()))

  app.get('/api/photos/:id', (req, res) => res.json(library.getPhotoByContentHash(req.params.id)))

  app.get('/api/thumbnail/:contentHash', async (req, res) => {
    try {
      const file = await library.getThumbnail(req.params.contentHash)
      if (!file) res.sendStatus(404)

      res.sendFile(file)
    } catch (error) {
      res.status(500)
      res.send(error.toString())
    }
  })

  app.get('/api/preview/:contentHash', async (req, res) => {
    try {
      const file = await library.getPreview(req.params.contentHash)
      if (!file) res.sendStatus(404)

      res.sendFile(file)
    } catch (error) {
      res.status(500)
      res.send(error)
    }
  })

  app.use(express.static('/usr/src/app/client/build'))

  app.get('/*', (req, res, next) => {
    res.sendFile('/usr/src/app/client/build/index.html')
  })

  app.listen(config.httpPort, () => {
    console.log(`HTTP server started at ${config.httpPort}!`)
  })
}

import express from 'express'
import { Library } from './library'
import Config from './Config'

export const startServer = async (config: Config) => {
  const library = new Library(config)

  const app = express()

  app.get('/api/status', (req, res) => res.json(library.scanningInfo))

  app.get('/api/photos', (req, res) => res.json(library.getPhotos()))

  app.get('/api/videos', (req, res) => res.json(library.getVideos()))

  app.get('/api/photos/:id', (req, res) => res.json(library.getPhotoByid(req.params.id)))

  app.get('/api/thumbnail/:id', async (req, res) => {
    try {
      const file = await library.getThumbnail(req.params.id)
      if (!file) return res.sendStatus(404)

      res.sendFile(file)
    } catch (error) {
      res.status(500)
      res.send(error.toString())
    }
  })

  app.get('/api/preview/:id', async (req, res) => {
    try {
      const file = await library.getPreview(req.params.id)
      if (!file) return res.sendStatus(404)

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

  return library.scanFiles()
}

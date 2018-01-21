const path = require('path')
const express = require('express')
const store = require('./store')

module.exports = state$ => {
  let state = {}
  state$.observe(_state => (state = _state))

  const app = express()

  app.get('/albums', (req, res) => {
    res.json({
      librarySize: store.getSize(state),
      albums: store.getSortedDayAlbums(state),
    })
  })

  app.get('/album/:album', (req, res) => {
    const album = store.getDayAlbum(req.params.album, state)

    if (!album) res.sendStatus(404)
    res.json(album)
  })

  app.get('/media/:id', (req, res) => {
    const media = store.getMedia(req.params.id, state)

    if (!media) res.sendStatus(404)
    res.json(media)
  })

  app.get('/media/:id/thumbnail.jpg', (req, res) => {
    const thumbnail = store.getMediaThumbnail(req.params.id, state)

    if (!thumbnail) res.sendStatus(404)
    res.sendFile(thumbnail)
  })

  app.get('/media/:id/preview.jpg', (req, res) => {
    const preview = store.getMediaPreview(req.params.id, state)

    if (!preview) res.sendStatus(404)
    res.sendFile(preview)
  })

  app.use(express.static(path.join(__dirname, '../../client/dist')))

  app.listen(80, () => console.log('Listening on port 80'))
}

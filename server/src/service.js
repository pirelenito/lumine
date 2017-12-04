const path = require('path')
const express = require('express')
const app = express()

module.exports = ({ albumsStore }) => {
  app.get('/albums', (req, res) => {
    res.json({
      librarySize: albumsStore.getLibrarySize(),
      albums: albumsStore.getAlbumsList(),
    })
  })

  app.get('/albums/:album', (req, res) => {
    const album = albumsStore.getState().albums[req.params.album]

    if (!album) res.sendStatus(404)
    res.json(album)
  })

  app.get('/photos/:id', (req, res) => {
    const photo = albumsStore.getState().photos[req.params.id]

    if (!photo) res.sendStatus(404)
    res.json(photo)
  })

  app.get('/photos/:id/thumbnails/:size.jpg', (req, res) => {
    const photo = albumsStore.getState().photos[req.params.id]

    if (!photo) res.sendStatus(404)
    res.sendFile(photo.thumbnails[req.params.size])
  })

  app.use(express.static(path.join(__dirname, '../../client/dist')))

  app.listen(80, () => console.log('Listening on port 80'))
}

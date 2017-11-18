const express = require('express')
const app = express()

module.exports = ({ albumsStore }) => {
  app.get('/albums', (req, res) => {
    const state = albumsStore.getState()

    res.json({
      librarySize: Object.keys(state.photos).length,
      albums: Object.keys(state.albums),
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

  app.get('/photos/:id/thumbnails/small.jpg', (req, res) => {
    const photo = albumsStore.getState().photos[req.params.id]

    if (!photo) res.sendStatus(404)
    res.sendFile(photo.thumbnails.small)
  })

  app.listen(3000, () => console.log('Listening on port 3000!'))
}
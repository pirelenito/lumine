const express = require('express')
const app = express()

module.exports = ({ albumsStore }) => {
  app.get('/', (req, res) => {
    const state = albumsStore.getState()

    res.json({
      librarySize: state.all.length,
      albums: Object.keys(state.albums),
    })
  })
  app.get('/:album', (req, res) => {
    const album = albumsStore.getState().albums[req.params.album]

    if (!album) res.sendStatus(404)
    res.json(album)
  })

  app.listen(3000, () => console.log('Listening on port 3000!'))
}

const express = require('express')
const app = express()

module.exports = ({ albumsStore }) => {
  app.get('/', (req, res) => res.json(Object.keys(albumsStore.getState())))
  app.get('/:album', (req, res) => {
    const album = albumsStore.getState()[req.params.album]

    if (!album) res.sendStatus(404)
    res.json(album)
  })

  app.listen(3000, () => console.log('Listening on port 3000!'))
}

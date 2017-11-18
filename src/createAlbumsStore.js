const ramda = require('ramda')

const getAlbumKey = ramda.compose(
  date => date.split(' ')[0].replace(/:/gi, '-'),
  ramda.path(['metadata', 'Properties', 'exif:DateTime'])
)

module.exports = () => {
  let albums = {}

  return {
    getState: () => albums,
    update: photo => {
      const album = albums[getAlbumKey(photo)] || []
      albums[getAlbumKey(photo)] = [...album, photo]
    },
  }
}

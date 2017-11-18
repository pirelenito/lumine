const ramda = require('ramda')

const getAlbumKey = ramda.compose(
  date => (date ? date.split(' ')[0].replace(/:/gi, '-') : 'no-data'),
  ramda.path(['metadata', 'exif', 'CreateDate'])
)

module.exports = () => {
  let state = {
    albums: {},
    all: [],
  }

  return {
    getState: () => state,
    update: photo => {
      const album = state.albums[getAlbumKey(photo)] || []
      state.albums[getAlbumKey(photo)] = [...album, photo]

      state.all = [...state.all, photo]
    },
  }
}

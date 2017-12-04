const ramda = require('ramda')

const getAlbumId = ramda.compose(
  date => (date ? date.split(' ')[0].replace(/:/gi, '-') : 'no-data'),
  ramda.path(['metadata', 'exif', 'CreateDate'])
)

module.exports = () => {
  let state = {
    albums: {},
    photos: {},
  }

  const updateAlbums = photo => {
    const id = getAlbumId(photo)
    const album = state.albums[id] || []
    state.albums[id] = [...album, photo]
  }

  const updatePhotos = photo => {
    state.photos = { ...state.photos, [photo.id]: photo }
  }

  return {
    getState: () => state,
    getAlbumsList: () => {
      return Object.keys(state.albums).map(id => ({
        id: id,
        title: id,
        coverPhotoId: state.albums[id][0].id,
      }))
    },
    getLibrarySize: () => Object.keys(state.photos).length,
    update: photo => {
      updateAlbums(photo)
      updatePhotos(photo)
    },
  }
}

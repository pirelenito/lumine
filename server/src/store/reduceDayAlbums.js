const mediaSelectors = require('../mediaSelectors')

module.exports = (albums = {}, media) => {
  const key = mediaSelectors.getDayKey(media)
  const album = albums[key] || { id: key, medias: [] }

  return {
    ...albums,
    [key]: {
      ...album,
      medias: [...album.medias, media.id],
    },
  }
}

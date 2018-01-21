const { sort, path } = require('ramda')
const reduceDayAlbums = require('./reduceDayAlbums')
const reduceIndexedMedias = require('./reduceIndexedMedias')

const store = (state = {}, media) => {
  return {
    dayAlbums: reduceDayAlbums(state.dayAlbums, media),
    indexedMedias: reduceIndexedMedias(state.indexedMedias, media),
  }
}

store.getSize = state => Object.keys(state.indexedMedias).length

store.getSortedDayAlbums = state =>
  sort((a, b) => (a > b ? 1 : -1), Object.keys(state.dayAlbums)).map(key =>
    store.getDayAlbum(key, state)
  )

store.getDayAlbum = (key, state) => {
  const dayAlbum = state.dayAlbums[key]

  if (!dayAlbum) {
    return null
  }

  return {
    id: dayAlbum.id,
    medias: dayAlbum.medias,
    resources: {
      thumbnail: `/media/${dayAlbum.medias[0]}/thumbnail.jpg`,
    },
  }
}

store.getMedia = (key, state) => {
  const media = state.indexedMedias[key]

  if (!media) {
    return null
  }

  return {
    id: media.id,
    metadata: media.metadata,
    resources: {
      preview: `/media/${media.id}/preview.jpg`,
      thumbnail: `/media/${media.id}/thumbnail.jpg`,
    },
  }
}

store.getMediaThumbnail = (key, state) =>
  path(['indexedMedias', key, 'resources', 'thumbnail'], state)

store.getMediaPreview = (key, state) => path(['indexedMedias', key, 'resources', 'preview'], state)

module.exports = store

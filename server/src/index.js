const path = require('path')
const mergeMapConcurrently = require('most/lib/combinator/mergeConcurrently').mergeMapConcurrently

const watchPhotos = require('./watchPhotos')
const enrichMetadata = require('./enrichMetadata')
const generateThumbnail = require('./generateThumbnail')

const config = {
  mastersPath: path.join(__dirname, '../library/masters'),
  metadataPath: path.join(__dirname, '../library/metadata'),
  thumbnailsPath: path.join(__dirname, '../library/thumbnails'),
}

const photos$ = watchPhotos(config.mastersPath)
const thumbnailSmall$ = mergeMapConcurrently(
  generateThumbnail(config.thumbnailsPath, 'small'),
  4,
  photos$
)
const thumbnailPreview$ = mergeMapConcurrently(
  generateThumbnail(config.thumbnailsPath, 'preview'),
  4,
  thumbnailSmall$
)
const enriched$ = mergeMapConcurrently(enrichMetadata(config.metadataPath), 4, thumbnailPreview$)

const createAlbumsStore = require('./createAlbumsStore')
const albumsStore = createAlbumsStore()

enriched$.observe(photo => albumsStore.update(photo))

require('./service')({ albumsStore })

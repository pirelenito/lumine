const path = require('path')
const mergeMapConcurrently = require('most/lib/combinator/mergeConcurrently').mergeMapConcurrently

const watchPhotos = require('./watchPhotos')
const enrichMetadata = require('./enrichMetadata')
const generateThumbnails = require('./generateThumbnails')

const config = {
  mastersPath: path.join(__dirname, '../library/masters'),
  metadataPath: path.join(__dirname, '../library/metadata'),
  thumbnailsPath: path.join(__dirname, '../library/thumbnails'),
}

const photos$ = watchPhotos(config.mastersPath)
const thumbnails$ = mergeMapConcurrently(generateThumbnails(config.thumbnailsPath), 4, photos$)
const enriched$ = mergeMapConcurrently(enrichMetadata(config.metadataPath), 4, thumbnails$)

const createAlbumsStore = require('./createAlbumsStore')
const albumsStore = createAlbumsStore()

enriched$.observe(photo => albumsStore.update(photo))

require('./service')({ albumsStore })

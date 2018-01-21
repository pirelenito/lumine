const generateId = require('./generateId')
const convertResource = require('./convertResource')
const loadMetadata = require('./loadMetadata')

module.exports = cacheFolder => async media => {
  return generateId(media)
    .then(convertResource(cacheFolder, 'preview'))
    .then(convertResource(cacheFolder, 'thumbnail'))
    .then(loadMetadata)
}

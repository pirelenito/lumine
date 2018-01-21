const calculateHash = require('./calculateHash')
const convertResource = require('./convertResource')
const loadMetadata = require('./loadMetadata')

module.exports = cacheFolder => async sourcePath => {
  const hash = await calculateHash(sourcePath)

  return createMedia(hash, sourcePath)
    .then(convertResource(cacheFolder, 'preview'))
    .then(convertResource(cacheFolder, 'thumbnail'))
    .then(loadMetadata)
}

const createMedia = (hash, sourcePath) =>
  Promise.resolve({ id: hash, resources: { source: sourcePath } })

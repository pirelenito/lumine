const calculateHash = require('./calculateHash')
const convertResource = require('./convertResource')
const loadMetadata = require('./loadMetadata')
const fromCache = require('./fromCache')

module.exports = cacheFolder => async sourcePath => {
  const hash = await calculateHash(sourcePath)

  return await fromCache(cacheFolder)(hash, hash =>
    createMedia(hash, sourcePath)
      .then(convertResource(cacheFolder, 'preview'))
      .then(convertResource(cacheFolder, 'thumbnail'))
      .then(loadMetadata)
  )
}

const createMedia = (hash, sourcePath) =>
  Promise.resolve({ id: hash, resources: { source: sourcePath } })

const path = require('path')
const promisify = require('util').promisify
const ensureDir = promisify(require('fs-extra').ensureDir)

module.exports = async (cacheFolder, namespace, id) => {
  const dir = path.join(cacheFolder, namespace, id.slice(0, 2))
  const resourcePath = path.join(dir, `${id.slice(2)}.jpg`)
  await ensureDir(dir)
  return resourcePath
}

const promisify = require('util').promisify
const stat = promisify(require('fs').stat)
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const ensureCacheResource = require('./ensureCacheResource')

module.exports = cacheFolder => async (hash, builder) => {
  const targetPath = await ensureCacheResource(cacheFolder, 'data', hash, 'json')
  let data

  try {
    await stat(targetPath)
    data = JSON.parse(await readFile(targetPath, 'utf8'))
  } catch (err) {
    data = await builder(hash)
    await writeFile(targetPath, JSON.stringify(data), 'utf8')
  }

  return data
}

const promisify = require('util').promisify
const stat = promisify(require('fs').stat)

module.exports = async media => {
  const fileStat = await stat(media.resources.source)
  return {
    ...media,
    metadata: {
      ...media.metadata,
      file: {
        ctimeMs: fileStat.ctimeMs,
        mtimeMs: fileStat.mtimeMs,
        size: fileStat.size,
      },
    },
  }
}

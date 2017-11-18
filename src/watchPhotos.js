const { create } = require('@most/create')
const path = require('path')
const chokidar = require('chokidar')
const crypto = require('crypto')

module.exports = basePath => {
  return create((add, end, error) => {
    const pattern = path.join(basePath, '/**/*')
    const watcher = chokidar.watch(pattern)

    const publish = (filePath, stats) => {
      const relativePath = path.relative(basePath, filePath)
      const hash = crypto.createHash('sha256')
      hash.update(`${relativePath}${stats.mtimeMs}${stats.ctimeMs}`)

      if (!filePath.match(/\.(arw|jpg|jpeg|)$/i)) return

      add({
        id: hash.digest('hex'),
        relativePath,
        absolutePath: filePath,
        modifiedTime: stats.mtimeMs,
        createdTime: stats.ctimeMs,
      })
    }

    watcher.on('add', publish).on('error', err => error(err))

    return () => watcher.close()
  })
}

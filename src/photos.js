const { create } = require('@most/create')
const path = require('path')
const chokidar = require('chokidar')
const crypto = require('crypto')

module.exports = basePath => {
  return create((add, end, error) => {
    const pattern = path.join(basePath, '/**/*.@(ARW|jpg|jpeg|avi|mpeg)')
    const watcher = chokidar.watch(pattern)

    const publish = (filePath, stats) => {
      const relativePath = path.relative(basePath, filePath)
      const hash = crypto.createHash('sha256')
      hash.update(`${relativePath}${stats.mtimeMs}${stats.ctimeMs}`)

      add({
        id: hash.digest('hex'),
        path: filePath,
        modifiedTime: stats.mtimeMs,
        createdTime: stats.ctimeMs,
      })
    }

    watcher.on('add', publish).on('error', err => error(err))

    return () => watcher.close()
  })
}

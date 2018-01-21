const { create } = require('@most/create')
const path = require('path')
const chokidar = require('chokidar')

module.exports = basePath => {
  return create((add, end, error) => {
    const pattern = path.join(basePath, '/**/*')
    const watcher = chokidar.watch(pattern)

    watcher.on('add', filePath => {
      if (!filePath.match(/\.(arw|jpg|jpeg|)$/i)) return

      add({
        type: 'ADD',
        filePath,
      })
    })

    watcher.on('error', err => error(err))

    return () => watcher.close()
  })
}

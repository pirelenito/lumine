import { create } from '@most/create'
import path from 'path'
import chokidar from 'chokidar'
import { Config } from './Config'
import { fromPromise } from 'most'
import importPhoto from './importPhoto'

function watchFiles(basePath: string) {
  const newFiles$ = create<string>((add, end, error) => {
    const pattern = path.join(basePath, '/**/*')
    const watcher = chokidar.watch(pattern)

    watcher.on('add', fullPath => {
      const filePath = path.relative(basePath, fullPath)
      console.log(fullPath, filePath)

      if (!filePath.match(/\.(arw|jpg|jpeg|)$/i)) return
      add(filePath)
    })

    watcher.on('error', err => error(err))

    return () => watcher.close()
  })

  return { newFiles$ }
}

export default function watch(config: Config) {
  const { newFiles$ } = watchFiles(config.libraryBasePath)

  const photo$ = newFiles$.concatMap(filePath => fromPromise(importPhoto(config)(filePath)))

  return photo$
}

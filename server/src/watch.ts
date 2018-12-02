import { create } from '@most/create'
import path from 'path'
import glob from 'glob'
import { Config } from './Config'
import { fromPromise } from 'most'
import importPhoto from './importPhoto'

function watchFiles(basePath: string) {
  const newFiles$ = create<string>((add, end, error) => {
    const cwd = path.join(basePath)
    const pattern = '**/*.{arw,jpg,jpeg}'

    glob(pattern, { nocase: true, cwd }, function(err, files) {
      if (err) {
        return error(err)
      }

      files.forEach(filePath => {
        add(filePath)
      })

      end()
    })

    return () => {}
  })

  return { newFiles$ }
}

export default function watch(config: Config) {
  const { newFiles$ } = watchFiles(config.libraryBasePath)

  const photo$ = newFiles$.concatMap(filePath => fromPromise(importPhoto(config)(filePath)))

  return photo$
}

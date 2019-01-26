import { create } from '@most/create'
import path from 'path'
import glob from 'glob'
import Config from './Config'
import { fromPromise, Stream } from 'most'
import { mergeMapConcurrently } from 'most/lib/combinator/mergeConcurrently'
import importPhoto from './importPhoto'
import Photo from './Photo'

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

  const photo$ = mergeMapConcurrently(
    (filePath: string) => fromPromise(importPhoto(config)(filePath)),
    8,
    newFiles$,
  ) as Stream<Photo>

  return photo$
}

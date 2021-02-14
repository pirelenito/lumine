import { create } from '@most/create'
import path from 'path'
import glob from 'glob'
import Config from './Config'
import { fromPromise, Stream } from 'most'
import { mergeMapConcurrently } from 'most/lib/combinator/mergeConcurrently'
import importPhoto from './importPhoto'
import Photo from './Photo'

function watchFiles(basePath: string) {
  return create<string>((add, end, error) => {
    const cwd = path.join(basePath)
    const pattern = '**/*.{arw,jpg,jpeg,mp4,avi,mov,mpg}'

    glob(pattern, { nocase: true, cwd }, function (err, files) {
      if (err) {
        return error(err)
      }

      files.forEach((filePath) => {
        add(filePath)
      })

      end()
    })

    return () => {}
  })
}

export default function watch(config: Config) {
  return mergeMapConcurrently(
    (filePath: string) => fromPromise(importPhoto(config)(filePath)),
    8,
    watchFiles(config.libraryBasePath),
  ) as Stream<Photo>
}

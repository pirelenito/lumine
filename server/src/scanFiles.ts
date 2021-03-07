import os from 'os'
import path from 'path'
import glob from 'glob'
import Config from './Config'
import importPhoto from './importPhoto'
import { promisify } from 'util'
import { TaskQueue } from 'cwait'

const globPromisified = promisify(glob)

export default async function scanFiles(config: Config) {
  const queue = new TaskQueue(Promise, os.cpus().length - 1)
  const importPhotoThrottled = queue.wrap(importPhoto(config))

  const cwd = path.join(config.libraryBasePath)
  const pattern = '**/*.{arw,jpg,jpeg,mp4,avi,mov,mpg}'

  const files = await globPromisified(pattern, { nocase: true, cwd })
  const photos = await Promise.all(files.map(importPhotoThrottled))

  return photos
}
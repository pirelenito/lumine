import Config from './Config'
import Photo from './Photo'
import os from 'os'
import path from 'path'
import glob from 'glob'
import importPhoto from './importPhoto'
import { promisify } from 'util'
import { TaskQueue } from 'cwait'

const globPromisified = promisify(glob)

export default class Library {
  photos: Photo[]
  config: Config

  constructor(config: Config) {
    this.config = config
    this.photos = []
  }

  async scanFiles() {
    const queue = new TaskQueue(Promise, os.cpus().length - 1)
    const importPhotoThrottled = queue.wrap(importPhoto(this.config))

    const cwd = path.join(this.config.libraryBasePath)
    const pattern = '**/*.{arw,jpg,jpeg,mp4,avi,mov,mpg}'

    const files = await globPromisified(pattern, { nocase: true, cwd })
    this.photos = await Promise.all(files.map(importPhotoThrottled))
  }

  addPhoto(photo: Photo) {
    this.photos.push(photo)
  }

  getPhotos() {
    return this.photos
  }

  getPhotoByContentHash(contentHash: string) {
    return this.photos.find((photo) => photo.contentHash === contentHash)
  }
}

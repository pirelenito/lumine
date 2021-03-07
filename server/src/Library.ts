import Config from './Config'
import os from 'os'
import path from 'path'
import glob from 'glob'
import { Photo, importPhoto, getThumbnail, getPreview } from './photo'
import { promisify } from 'util'
import { TaskQueue } from 'cwait'

const globPromisified = promisify(glob)

const queue = new TaskQueue(Promise, os.cpus().length - 1)
const getThumbnailThrottled = queue.wrap(getThumbnail)
const getPreviewThrottled = queue.wrap(getPreview)
const importPhotoThrottled = queue.wrap(importPhoto)

export default class Library {
  photos: Photo[]
  config: Config

  constructor(config: Config) {
    this.config = config
    this.photos = []
  }

  async scanFiles() {
    const cwd = path.join(this.config.libraryBasePath)
    const pattern = '**/*.{arw,jpg,jpeg,mp4,avi,mov,mpg}'

    const files = await globPromisified(pattern, { nocase: true, cwd })
    this.photos = await Promise.all(files.map((filePath) => importPhotoThrottled(this.config, filePath)))
  }

  async getThumbnail(contentHash: string) {
    const photo = this.getPhotoByContentHash(contentHash)
    if (!photo) return

    return getThumbnailThrottled(this.config, photo.contentHash, photo.relativePath)
  }

  async getPreview(contentHash: string) {
    const photo = this.getPhotoByContentHash(contentHash)
    if (!photo) return

    return getPreviewThrottled(this.config, photo.contentHash, photo.relativePath)
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

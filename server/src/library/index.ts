import Config from '../Config'
import os from 'os'
import path from 'path'
import glob from 'glob'
import { Photo, importPhoto, getThumbnail, getPreview } from '../photo'
import { promisify } from 'util'
import { TaskQueue } from 'cwait'

export const setupLibrary = async (config: Config) => {
  const library = new Library(config)
  await library.scanFiles()

  return library
}

const globPromisified = promisify(glob)

const queue = new TaskQueue(Promise, os.cpus().length - 1)
const getThumbnailThrottled = queue.wrap(getThumbnail)
const getPreviewThrottled = queue.wrap(getPreview)
const importPhotoThrottled = queue.wrap(importPhoto)

class Library {
  photos: Photo[]
  videos: Photo[]
  config: Config

  constructor(config: Config) {
    this.config = config
    this.photos = []
  }

  async scanFiles() {
    const cwd = path.join(this.config.libraryBasePath)
    const pattern = '**/*.{arw,jpg,jpeg,mp4,avi,mov,mpg}'

    const files = await globPromisified(pattern, { nocase: true, cwd })
    const photos = await Promise.all(files.map((filePath) => importPhotoThrottled(this.config, filePath)))

    this.photos = photos.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt)
    this.videos = this.photos.filter((photo) => photo.mediaType === 'video')
  }

  async getThumbnail(id: string) {
    const photo = this.getPhotoByid(id)
    if (!photo) return

    return getThumbnailThrottled(this.config, photo.id, photo.relativePath)
  }

  async getPreview(id: string) {
    const photo = this.getPhotoByid(id)
    if (!photo) return

    return getPreviewThrottled(this.config, photo.id, photo.relativePath)
  }

  getPhotos() {
    return this.photos
  }

  getVideos() {
    return this.videos
  }

  getPhotoByid(id: string) {
    return this.photos.find((photo) => photo.id === id)
  }
}

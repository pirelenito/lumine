import Config from '../Config'
import os from 'os'
import path from 'path'
import glob from 'glob'
import { Photo, importPhoto, getThumbnail, getPreview } from '../photo'
import { promisify } from 'util'
import { TaskQueue } from 'cwait'

const globPromisified = promisify(glob)

const queue = new TaskQueue(Promise, os.cpus().length - 1)
const getThumbnailThrottled = queue.wrap(getThumbnail)
const getPreviewThrottled = queue.wrap(getPreview)
const importPhotoThrottled = queue.wrap(importPhoto)

interface ScanningInfo {
  total: number
  ready: number
}

export class Library {
  photos: Photo[]
  videos: Photo[]
  config: Config
  scanningInfo: ScanningInfo

  constructor(config: Config) {
    this.config = config
    this.photos = []
    this.scanningInfo = { total: 0, ready: 0 }
  }

  async scanFiles() {
    this.scanningInfo = { total: 0, ready: 0 }

    const cwd = path.join(this.config.libraryBasePath)
    const pattern = '**/*.{arw,jpg,jpeg,mp4,avi,mov,mpg}'

    const files = await globPromisified(pattern, { nocase: true, cwd })
    this.scanningInfo.total = files.length

    const photos = await Promise.all(
      files.map(async (filePath) => {
        const photo = await importPhotoThrottled(this.config, filePath)

        // increase the progress
        this.scanningInfo.ready += 1
        console.log('📷 Imported', filePath)

        return photo
      }),
    )

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

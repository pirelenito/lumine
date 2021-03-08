import Config from '../Config'
import path from 'path'
import glob from 'glob'
import { Photo, importPhoto, getThumbnail, getPreview } from '../photo'
import { promisify } from 'util'

const globPromisified = promisify(glob)

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
        const photo = await importPhoto(this.config, filePath)

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

    return getThumbnail(this.config, photo.id, photo.relativePath)
  }

  async getPreview(id: string) {
    const photo = this.getPhotoByid(id)
    if (!photo) return

    return getPreview(this.config, photo.id, photo.relativePath)
  }

  async getOriginal(id: string) {
    const photo = this.getPhotoByid(id)
    if (!photo) return

    return path.join(this.config.libraryBasePath, photo.relativePath)
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

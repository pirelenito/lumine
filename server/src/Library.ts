import Config from './Config'
import Photo from './Photo'
import scanFiles from './scanFiles'

export default class Library {
  photos: Photo[]
  config: Config

  constructor(config: Config) {
    this.config = config
    this.photos = []
  }

  async scanFiles() {
    this.photos = await scanFiles(this.config)
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

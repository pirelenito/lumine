import Photo from './Photo'

export default class Library {
  photos: Photo[]
  constructor() {
    this.photos = []
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

export default interface Photo {
  relativePath: string
  contentHash: string

  preview: Preview

  metadata: {
    file: FileMetadata
    exif: ExifMetadata
  }
}

export interface FileMetadata {
  createdAt: number
  modifiedAt: number
  size: number
}

export interface ExifMetadata {
  dates: {
    createdAt: number
  }
  exif: any
  image: any
  gps: any
}

export interface Preview {
  thumbnailPath: string
  fullSizePath: string
}

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
  createdAt: Date
  modifiedAt: Date
  size: Date
}

export interface ExifMetadata {
  dates: {
    createdAt: Date
  }
  exif: any
  image: any
  gps: any
}

export interface Preview {
  thumbnailPath: string
  fullSizePath: string
}

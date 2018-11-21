export default interface Photo {
  relativePath: string
  contentHash: string

  preview: Preview

  metadata: {
    file: FileMetadata
  }
}

export interface FileMetadata {
  createdAt: number
  modifiedAt: number
  size: number
}

export interface Preview {
  thumbnailPath: string
  fullSizePath: string
}

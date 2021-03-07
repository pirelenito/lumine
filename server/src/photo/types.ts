export interface Photo {
  relativePath: string
  contentHash: string
  metadata: Metadata
  mediaType: 'photo' | 'video'
}

export interface Metadata {
  createdAt: number
  cameraModel?: string | number
  gps?: GPS
}

export interface GPS {
  altitude: number
  latitude: number
  longitude: number
}

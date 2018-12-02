export default interface Photo {
  relativePath: string
  contentHash: string
  metadata: Metadata
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

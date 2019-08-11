import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface Photo {
  relativePath: string
  contentHash: string
  metadata: Metadata
  mediaType: 'photo' | 'video'
}

interface Metadata {
  createdAt: number
  cameraModel?: string | number
  gps?: GPS
}

interface GPS {
  altitude: number
  latitude: number
  longitude: number
}

const context = createContext<Photo[]>([])

export const useGalery = () => useContext(context)

export const GaleryProvider = ({ children }: { children: ReactNode }) => {
  const [photo, setPhoto] = useState<Photo[]>([])

  useEffect(() => {
    fetch('/api/photos')
      .then(function(response) {
        return response.json()
      })
      .then(function(photos: Photo[]) {
        setPhoto(photos.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt))
      })
  }, [])

  return <context.Provider value={photo}>{children}</context.Provider>
}

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Media {
  relativePath: string
  contentHash: string
  metadata: Metadata
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

const context = createContext<Media[]>([])

export const useGalery = () => useContext(context)

export const GaleryProvider = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<Media[]>([])

  useEffect(() => {
    fetch('/api/photos')
      .then(function(response) {
        return response.json()
      })
      .then(function(photos) {
        setMedia(photos)
      })
  }, [])

  return <context.Provider value={media}>{children}</context.Provider>
}

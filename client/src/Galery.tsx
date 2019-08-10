import React, { useState, useEffect } from 'react'
import { Grid } from 'react-virtualized'

interface Photo {
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

export default function Galery({}) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const columnCount = Math.floor(width / 200)
  const rowCount = Math.floor(photos.length / columnCount)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
    })

    fetch('/api/photos')
      .then(function(response) {
        return response.json()
      })
      .then(function(photos) {
        setPhotos(photos)
      })
  }, [])

  return (
    <Grid
      cellRenderer={({ columnIndex, key, rowIndex, style }: any) => {
        const media = photos[rowIndex * columnCount + columnIndex]

        const thumbnail = `/api/thumbnail/${media.contentHash}`

        return (
          <div key={key} style={style}>
            <img src={thumbnail} style={{ padding: 5, width: 190, height: 190 }} />
          </div>
        )
      }}
      columnCount={columnCount}
      rowCount={rowCount}
      height={height}
      width={width}
      columnWidth={200}
      rowHeight={200}
    />
  )
}

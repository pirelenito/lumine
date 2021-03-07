import React, { CSSProperties, useState, useEffect } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import { Link } from 'react-router-dom'
import Spinner from './Spinner'

import AutoSizer from 'react-virtualized-auto-sizer'
import { useGallery, Photo } from '../gallery'

interface CellProps {
  style: CSSProperties
  columnIndex: number
  rowIndex: number
  data: { gallery: Photo[]; columnCount: number }
}

const Cell = ({ columnIndex, rowIndex, data, style }: CellProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const { gallery, columnCount } = data
  const photo = gallery[columnCount * rowIndex + columnIndex]

  useEffect(() => {
    if (!photo) return

    const timeoutId = setTimeout(() => {
      setThumbnail(`/api/thumbnail/${photo.id}`)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [photo])

  if (!photo) return null

  return (
    <div style={style}>
      <Link to={`/media/${photo.mediaType}/${photo.id}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {!loaded && <Spinner />}
          {thumbnail && (
            <img
              src={thumbnail}
              onLoad={() => setLoaded(true)}
              style={{ position: 'absolute', top: 1, left: 1, width: 198, height: 198 }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 1,
              right: 1,
              left: '50%',
              textAlign: 'right',
              color: '#adadad',
              background: 'rgba(0,0,0,0.6)',
              fontWeight: 'bold',
              fontSize: 12,
              paddingTop: 2,
              paddingBottom: 2,
              paddingRight: 4,
              paddingLeft: 4,
            }}
          >
            {photo.mediaType === 'video' ? (
              <div style={{ position: 'absolute', left: 4, top: 3 }}>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9" stroke="#E3E3E3" strokeWidth="2" />
                  <path d="M15 10L7.5 14.3301L7.5 5.66987L15 10Z" fill="#E3E3E3" />
                </svg>
              </div>
            ) : null}
            {new Date(photo.metadata.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Link>
    </div>
  )
}

interface InnerGalleryProps {
  width: number
  height: number
}

const InnerGallery = ({ height, width }: InnerGalleryProps) => {
  const gallery = useGallery()

  const columnCount = Math.floor(width / 200)
  const rowCount = Math.ceil(gallery.length / columnCount)

  return (
    <Grid
      itemData={{ columnCount, gallery }}
      columnCount={columnCount}
      columnWidth={200}
      height={height}
      rowCount={rowCount}
      rowHeight={200}
      width={width}
      overscanRowCount={4}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      {Cell}
    </Grid>
  )
}

export default () => {
  return <AutoSizer>{({ height, width }) => <InnerGallery height={height} width={width} />}</AutoSizer>
}

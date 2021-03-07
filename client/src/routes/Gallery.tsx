import React, { CSSProperties, useState, useEffect, useRef } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import { Link } from 'react-router-dom'
import { RouteChildrenProps } from 'react-router'
import Spinner from './Spinner'

interface Params {
  mediaType: string
}

export default ({ match }: RouteChildrenProps<Params>) => {
  if (!match) return null

  const innerRef = useRef<HTMLDivElement>(null)

  /**
   * Hack to force the grid to be centered on the screen
   * TODO: adapt the size of the cells so that they fill the entire width
   */
  useEffect(() => {
    const element = innerRef.current
    if (!element) return

    element.style.position = 'relative'
  })

  const mediaType = match.params.mediaType
  const [photos, setPhotos] = useState<Photo[]>([])
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  useEffect(() => {
    fetch(`/api/${mediaType === 'video' ? 'videos' : 'photos'}`)
      .then(function (response) {
        return response.json()
      })
      .then(setPhotos)
  }, [mediaType])

  const columnCount = Math.floor(width / 200)
  const rowCount = Math.ceil(photos.length / columnCount)

  return (
    <>
      <Grid
        itemData={{ columnCount, photos }}
        columnCount={columnCount}
        columnWidth={200}
        height={height}
        rowCount={rowCount}
        rowHeight={200}
        width={width}
        overscanRowCount={4}
        innerRef={innerRef}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {Cell}
      </Grid>
      <NavBar />
    </>
  )
}

const NAV_BAR_HEIGHT = 36

function NavBar() {
  return (
    <div
      style={{
        paddingLeft: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: NAV_BAR_HEIGHT,
        background: 'rgb(15 17 21 / 80%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <NavBarLink href="/" label="Photos" />
      <NavBarLink href="/video" label="Videos" />
    </div>
  )
}

function NavBarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link style={{ padding: '0px 8px', textDecoration: 'none', color: '#adadad' }} to={href}>
      {label}
    </Link>
  )
}

interface Photo {
  relativePath: string
  id: string
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

interface CellProps {
  style: CSSProperties
  columnIndex: number
  rowIndex: number
  data: { photos: Photo[]; columnCount: number }
}

const Cell = ({ columnIndex, rowIndex, data, style }: CellProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const { photos, columnCount } = data
  const photo = photos[columnCount * rowIndex + columnIndex]

  useEffect(() => {
    if (!photo) return

    const timeoutId = setTimeout(() => {
      setThumbnail(`/api/thumbnail/${photo.id}`)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [photo])

  if (!photo) return null

  return (
    <div style={{ ...style, top: parseInt((style.top as string) || '0', 10) + NAV_BAR_HEIGHT + 2 }}>
      <Link to={`/${photo.mediaType}/${photo.id}`}>
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

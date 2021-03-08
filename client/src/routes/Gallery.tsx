import React, { CSSProperties, useState, useEffect, useRef } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'
import Spinner from './Spinner'

interface Params {
  mediaType: 'photos' | 'videos'
}

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default () => {
  const match = useRouteMatch<Params>()
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

  const query = useQuery()
  const selectedPhotoIndex = query.get('index') ? parseInt(query.get('index') || '', 10) : undefined
  const selectedPhoto = selectedPhotoIndex ? photos[selectedPhotoIndex] : undefined

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  useEffect(() => {
    fetch(`/api/${mediaType === 'videos' ? 'videos' : 'photos'}`)
      .then(function (response) {
        return response.json()
      })
      .then(setPhotos)
  }, [mediaType])

  const columnCount = Math.floor(width / 200)
  const rowCount = Math.ceil(photos.length / columnCount)
  const overscanRowCount = Math.round((height / 200) * 2)

  if (!match) return null

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
        overscanRowCount={overscanRowCount}
        innerRef={innerRef}
        itemKey={({ columnIndex, rowIndex }) => photos[columnCount * rowIndex + columnIndex].id}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {Cell}
      </Grid>
      {selectedPhoto && selectedPhotoIndex ? (
        <MediaDetail index={selectedPhotoIndex} id={selectedPhoto.id} mediaType={selectedPhoto.mediaType} />
      ) : undefined}
      <NavBar />
    </>
  )
}

interface MediaDetailProps {
  id: string
  mediaType: string
  index: number
}

function MediaDetail({ id, mediaType, index }: MediaDetailProps) {
  const src = `/api/preview/${id}`
  const previousRef = useRef<HTMLAnchorElement>(null)
  const nextRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && previousRef.current) previousRef.current.click()
      if (event.key === 'ArrowRight' && nextRef.current) nextRef.current.click()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        background: '#2c313c',
      }}
    >
      {mediaType === 'photo' ? (
        <img style={{ height: '100vh' }} src={src} />
      ) : (
        <video style={{ height: '100vh' }} src={src} controls loop autoPlay />
      )}
      <Link
        innerRef={previousRef}
        to={`?index=${index - 1}`}
        style={{ position: 'absolute', left: 0, top: '50%', marginTop: '-32px' }}
      >
        <svg width="32" height="64" viewBox="0 0 32 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cy="32" r="32" fill="#0F1115" fill-opacity="0.8" />
          <path d="M19 20L7 32.5L19 45" stroke="#ADADAD" stroke-width="4" />
        </svg>
      </Link>
      <Link
        innerRef={nextRef}
        to={`?index=${index + 1}`}
        style={{ position: 'absolute', right: 0, top: '50%', marginTop: '-32px' }}
      >
        <svg width="32" height="64" viewBox="0 0 32 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" transform="rotate(-180 32 32)" fill="#0F1115" fill-opacity="0.8" />
          <path d="M13 44L25 31.5L13 19" stroke="#ADADAD" stroke-width="4" />
        </svg>
      </Link>
    </div>
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
      <NavBarLink href="/photos" label="Photos" />
      <NavBarLink href="/videos" label="Videos" />
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
  const index = columnCount * rowIndex + columnIndex
  const photo = photos[index]

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
      <Link to={`?index=${index}`}>
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

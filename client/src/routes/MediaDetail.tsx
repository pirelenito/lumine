import React from 'react'
import { RouteChildrenProps } from 'react-router'

interface Params {
  id: string
  mediaType: string
}

export default function MediaDetail({ match }: RouteChildrenProps<Params>) {
  if (!match) return null

  const mediaType = match.params.mediaType
  const src = `/api/preview/${match.params.id}`

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
        <video style={{ height: '100vh' }} src={src} controls loop />
      )}
    </div>
  )
}

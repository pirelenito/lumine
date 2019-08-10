import React from 'react'
import { RouteChildrenProps } from 'react-router'

interface Params {
  id: string
}

export default function MediaDetail({ match }: RouteChildrenProps<Params>) {
  if (!match) return null
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
      <img style={{ height: '100vh' }} src={`/api/fullSize/${match.params.id}`} />
    </div>
  )
}

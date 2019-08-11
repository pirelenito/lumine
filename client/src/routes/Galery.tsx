import React, { useState, useEffect } from 'react'
import { Grid, ArrowKeyStepper } from 'react-virtualized'
import { useGalery } from '../galery'
import { Link } from 'react-router-dom'

export default function Galery() {
  const galery = useGalery()
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const columnCount = Math.floor(width / 200)
  const rowCount = Math.floor(galery.length / columnCount)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
    })
  }, [])

  const [scrollPosition, setScrollPosition] = useState({ scrollToColumn: 0, scrollToRow: 0 })

  return (
    <ArrowKeyStepper
      isControlled
      rowCount={rowCount}
      mode="cells"
      columnCount={columnCount}
      onScrollToChange={setScrollPosition}
      scrollToColumn={scrollPosition.scrollToColumn}
      scrollToRow={scrollPosition.scrollToRow}
    >
      {({ onSectionRendered, scrollToColumn, scrollToRow }) => {
        return (
          <Grid
            cellRenderer={({ columnIndex, key, rowIndex, style }: any) => {
              const photo = galery[rowIndex * columnCount + columnIndex]
              const thumbnail = `/api/thumbnail/${photo.contentHash}`

              return (
                <div key={key} style={style}>
                  <Link to={`/media/${photo.mediaType}/${photo.contentHash}`}>
                    <img src={thumbnail} style={{ padding: 5, width: 190, height: 190 }} />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 5,
                        left: 5,
                        right: 5,
                        textAlign: 'center',
                        color: 'white',
                        background:
                          rowIndex === scrollToRow && columnIndex === scrollToColumn
                            ? 'rgba(0,255,0,0.5)'
                            : 'rgba(0,0,0,0.5)',
                      }}
                    >
                      {new Date(photo.metadata.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                </div>
              )
            }}
            columnCount={columnCount}
            rowCount={rowCount}
            height={height}
            width={width}
            columnWidth={200}
            rowHeight={200}
            onSectionRendered={onSectionRendered}
            scrollToColumn={scrollToColumn}
            scrollToRow={scrollToRow}
          />
        )
      }}
    </ArrowKeyStepper>
  )
}

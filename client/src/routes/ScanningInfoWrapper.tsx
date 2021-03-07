import React, { useState, useEffect, ReactNode } from 'react'

import Spinner from './Spinner'

interface ScanningInfo {
  total: number
  ready: number
}

/**
 * Simple component that checks if the library is loaded before rendering anything.
 */
export default ({ children }: { children: ReactNode }) => {
  const [scanningInfo, setScanningInfo] = useState({ total: 0, ready: 0 })
  const loading = scanningInfo.total === 0 || scanningInfo.ready !== scanningInfo.total

  useEffect(() => {
    if (!loading) return
    let timerId: NodeJS.Timeout

    const checkStatus = async () => {
      const response = await fetch(`/api/status`)
      const newScanningInfo = (await response.json()) as ScanningInfo

      setScanningInfo(newScanningInfo)

      timerId = setTimeout(checkStatus, 1000)
    }

    checkStatus()

    return () => clearTimeout(timerId)
  }, [loading])

  if (loading)
    return (
      <div style={{ alignSelf: 'center', color: 'white', textAlign: 'center', flex: 1 }}>
        <div>📷 Scanning photos: {Math.floor((scanningInfo.ready / scanningInfo.total) * 100)}% completed.</div>
        <Spinner />
      </div>
    )
  return <>{children}</>
}

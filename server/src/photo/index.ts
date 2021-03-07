import { exiftool, Tags, ExifDateTime, ExifDate } from 'exiftool-vendored'
import calculateContentHash from './calculateContentHash'
import Config from '../Config'
import { promisify } from 'util'
import { join } from 'path'
import { exec } from 'child_process'
import { ensureCachePathExists, loadOrWriteCache } from './cache'
import { GPS, Photo } from './types'
export * from './types'

export const importPhoto = async (config: Config, relativePath: string): Promise<Photo> => {
  const fullPath = join(config.libraryBasePath, relativePath)
  const contentHash = await calculateContentHash(fullPath)

  return await loadOrWriteCache<Photo>(config.cacheBasePath, 'data', contentHash, 'json', async () => {
    const metadata = await readExifMetadata(config, contentHash, relativePath)
    const mediaType = getMediaType(relativePath)

    return { relativePath, contentHash, metadata, mediaType }
  })
}

const promisifiedExec = promisify(exec)

export const getThumbnail = async (config: Config, contentHash: string, relativePath: string): Promise<string> => {
  return isVideo(relativePath)
    ? getVideoThumbnail(config, contentHash, relativePath)
    : getPhotoThumbnail(config, contentHash, relativePath)
}

const getPhotoThumbnail = async (config: Config, contentHash: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  return await ensureCachePathExists(config.cacheBasePath, 'thumbnail', contentHash, 'jpg', async (cachePath) => {
    try {
      await exiftool.extractThumbnail(fullPath, cachePath)
    } catch {
      await promisifiedExec(
        `magick convert -size 200x200 -thumbnail 200x200^ -gravity center -extent 200x200 +profile "*" "${fullPath}" "${cachePath}"`,
      )
    }
  })
}

const getVideoThumbnail = async (config: Config, contentHash: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  return await ensureCachePathExists(config.cacheBasePath, 'thumbnail', contentHash, 'jpg', async (cachePath) => {
    await promisifiedExec(
      `ffmpeg -ss 1 -i "${fullPath}" -vf "thumbnail,scale=200:200,crop=200:200" -vframes 1 "${cachePath}"`,
    )
  })
}

export const getPreview = async (config: Config, contentHash: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  if (!isRaw(relativePath) || isVideo(relativePath)) return fullPath

  return await ensureCachePathExists(config.cacheBasePath, '1080p', contentHash, 'jpg', async (cachePath) => {
    try {
      try {
        await exiftool.extractJpgFromRaw(fullPath, cachePath)
      } catch {
        await exiftool.extractPreview(fullPath, cachePath)
      }
    } catch {
      await promisifiedExec(`magick convert -resize 1920x1080\\> "${fullPath}" "${cachePath}"`)
    }
  })
}

export const getMediaType = (filename: string) => (isVideo(filename) ? 'video' : 'photo')

const isRaw = (filename: string) => !filename.match(/\.(jpg|jpeg|png)$/i)

const isVideo = (filename: string) => !!filename.match(/\.(mp4|avi|mpg|mov)$/i)

const readExifMetadata = async (config: Config, contentHash: string, relativePath: string) => {
  const fullPath = join(config.libraryBasePath, relativePath)
  const exif: Tags = await exiftool.read(fullPath)

  return {
    createdAt: readExifTimestamp(relativePath, exif),
    cameraModel: exif.Model,
    gps: readExifGps(exif),
  }
}

const readExifTimestamp = (relativePath: string, exif: Tags) => {
  try {
    return (exif.CreateDate as ExifDateTime).toDate().getTime()
  } catch (e) {
    try {
      return (exif.ModifyDate as ExifDateTime).toDate().getTime()
    } catch (e) {
      try {
        return (exif.DateCreated as ExifDate).toDate().getTime()
      } catch (e) {
        try {
          return (exif.FileModifyDate as ExifDateTime).toDate().getTime()
        } catch (e) {
          console.log(`Error ${relativePath}`, exif.CreateDate)
          throw e
        }
      }
    }
  }
}

const readExifGps = (exif: Tags): GPS => {
  if (!exif.GPSAltitude && !exif.GPSLatitude && !exif.GPSLongitude) {
    return
  }

  return {
    altitude: exif.GPSAltitude,
    latitude: exif.GPSLatitude,
    longitude: exif.GPSLongitude,
  }
}

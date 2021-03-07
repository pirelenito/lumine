import { exiftool, Tags, ExifDateTime, ExifDate } from 'exiftool-vendored'
import generateId from './generateId'
import Config from '../Config'
import { promisify } from 'util'
import { join } from 'path'
import { exec } from 'child_process'
import { ensureCachePathExists, loadOrWriteCache } from './cache'
import { GPS, Photo } from './types'
export * from './types'

export const importPhoto = async (config: Config, relativePath: string): Promise<Photo> => {
  const fullPath = join(config.libraryBasePath, relativePath)
  const id = await generateId(fullPath)

  return await loadOrWriteCache<Photo>(config.cacheBasePath, 'data', id, 'json', async () => {
    const metadata = await readExifMetadata(config, id, relativePath)
    const mediaType = getMediaType(relativePath)

    return { relativePath, id, metadata, mediaType }
  })
}

const promisifiedExec = promisify(exec)

export const getThumbnail = async (config: Config, id: string, relativePath: string): Promise<string> => {
  return isVideo(relativePath)
    ? getVideoThumbnail(config, id, relativePath)
    : getPhotoThumbnail(config, id, relativePath)
}

const getPhotoThumbnail = async (config: Config, id: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  return await ensureCachePathExists(config.cacheBasePath, 'thumbnail', id, 'jpg', async (cachePath) => {
    try {
      await exiftool.extractThumbnail(fullPath, cachePath)
    } catch {
      await promisifiedExec(
        `magick convert -size 200x200 -thumbnail 200x200^ -gravity center -extent 200x200 +profile "*" "${fullPath}" "${cachePath}"`,
      )
    }
  })
}

const getVideoThumbnail = async (config: Config, id: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  return await ensureCachePathExists(config.cacheBasePath, 'thumbnail', id, 'jpg', async (cachePath) => {
    await promisifiedExec(
      `ffmpeg -ss 00:00:00 -i "${fullPath}" -vf "thumbnail,scale=200:200,crop=200:200" -frames:v 1 "${cachePath}"`,
    )
  })
}

export const getPreview = async (config: Config, id: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  if (!isRaw(relativePath) || isVideo(relativePath)) return fullPath

  return await ensureCachePathExists(config.cacheBasePath, '1080p', id, 'jpg', async (cachePath) => {
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

const readExifMetadata = async (config: Config, id: string, relativePath: string) => {
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

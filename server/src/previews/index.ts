import { promisify } from 'util'
import { join, relative } from 'path'
import { exec } from 'child_process'
import { exiftool, Tags } from 'exiftool-vendored'
import { ensureCachePathExists, loadOrWriteCache } from '../cache'
import Config from '../Config'

const promisifiedExec = promisify(exec)

export const getExif = (config: Config) => async (contentHash: string, relativePath: string): Promise<Tags> => {
  const fullPath = join(config.libraryBasePath, relativePath)
  return await loadOrWriteCache<Tags>(config.cacheBasePath, 'exif', contentHash, 'json', async () => {
    return await exiftool.read(fullPath)
  })
}

export const getThumbnail = (config: Config) => async (contentHash: string, relativePath: string): Promise<string> => {
  return isVideo(relativePath)
    ? getVideoThumbnail(config)(contentHash, relativePath)
    : getPhotoThumbnail(config)(contentHash, relativePath)
}

const getPhotoThumbnail = (config: Config) => async (contentHash: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  return await ensureCachePathExists(config.cacheBasePath, 'thumbnail', contentHash, 'jpg', async cachePath => {
    await promisifiedExec(
      `magick convert -size 200x200 -thumbnail 200x200^ -gravity center -extent 200x200 +profile "*" "${fullPath}" "${cachePath}"`,
    )
  })
}

const getVideoThumbnail = (config: Config) => async (contentHash: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  return await ensureCachePathExists(config.cacheBasePath, 'thumbnail', contentHash, 'jpg', async cachePath => {
    await promisifiedExec(
      `ffmpeg -ss 4 -i "${fullPath}" -vf "thumbnail,scale=200:200,crop=200:200" -vframes 1 "${cachePath}"`,
    )
  })
}

export const getFullSize = (config: Config) => async (contentHash: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  if (!isRaw(relativePath) || isVideo(relativePath)) return fullPath

  return await ensureCachePathExists(config.cacheBasePath, '1080p', contentHash, 'jpg', async cachePath => {
    await promisifiedExec(`magick convert -resize 1920x1080\\> "${fullPath}" "${cachePath}"`)
  })
}

export const getMediaType = (filename: string) => (isVideo(filename) ? 'video' : 'photo')

const isRaw = (filename: string) => !filename.match(/\.(jpg|jpeg|png)$/i)

const isVideo = (filename: string) => !!filename.match(/\.(mp4|avi)$/i)

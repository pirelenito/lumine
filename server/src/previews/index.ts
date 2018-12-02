import { promisify } from 'util'
import { join } from 'path'
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
  const fullPath = join(config.libraryBasePath, relativePath)

  const previewPath = await ensureCachePathExists(config.cacheBasePath, 'thumbnail', contentHash, 'jpg')
  await promisifiedExec(
    `magick convert -size 200x200 -thumbnail 200x200^ -gravity center -extent 200x200 +profile "*" "${fullPath}" "${previewPath}"`,
  )

  return previewPath
}

export const getFullSize = (config: Config) => async (contentHash: string, relativePath: string): Promise<string> => {
  const fullPath = join(config.libraryBasePath, relativePath)

  if (!isRaw(relativePath)) return fullPath

  const previewPath = await ensureCachePathExists(config.cacheBasePath, 'thumbnail', contentHash, 'jpg')
  await promisifiedExec(`magick convert -resize 1920x1080\\> "${fullPath}" "${previewPath}"`)

  return previewPath
}

const isRaw = (filename: string) => !filename.match(/\.(jpg|jpeg|png)$/i)

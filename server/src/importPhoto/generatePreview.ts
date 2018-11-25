import { Preview } from './Photo'
import { promisify } from 'util'
import { exec } from 'child_process'
import { ensureCachePathExists } from '../cache'
import { relative } from 'path'

const promisifiedExec = promisify(exec)

export default (cacheFolder: string) => async (contentHash: string, fullPath: string): Promise<Preview> => {
  const fullSizePath = await ensureCachePathExists(cacheFolder, 'fullSize', contentHash, 'jpg')
  await promisifiedExec(`magick convert -resize 1920x1080\\> "${fullPath}" "${fullSizePath}"`)

  const thumbnailPath = await ensureCachePathExists(cacheFolder, 'thumbnail', contentHash, 'jpg')
  await promisifiedExec(
    `magick convert -size 200x200 -thumbnail 200x200^ -gravity center -extent 200x200 +profile "*" "${fullSizePath}" "${thumbnailPath}"`,
  )

  return {
    fullSizePath: relative(cacheFolder, fullSizePath),
    thumbnailPath: relative(cacheFolder, thumbnailPath),
  }
}

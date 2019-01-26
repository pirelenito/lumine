import Photo from '../Photo'
import { join } from 'path'
import calculateContentHash from './calculateContentHash'
import readMetadata from './readMetadata'
import Config from '../Config'
import { loadOrWriteCache } from '../cache'
import { getExif } from '../previews'

export default (config: Config) => async (relativePath: string): Promise<Photo> => {
  const fullPath = join(config.libraryBasePath, relativePath)
  const contentHash = await calculateContentHash(fullPath)

  return await loadOrWriteCache<Photo>(config.cacheBasePath, 'data', contentHash, 'json', async () => {
    const exif = await getExif(config)(contentHash, relativePath)
    const metadata = await readMetadata(exif)

    return { relativePath, contentHash, metadata }
  })
}

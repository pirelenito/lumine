import Photo from './Photo'
import { join } from 'path'
import generatePreview from './generatePreview'
import calculateContentHash from './calculateContentHash'
import readFileMetadata from './readFileMetadata'
import readExifMetadata from './readExifMetadata'
import { Config } from '../Config'

export default (config: Config) => async (relativePath: string): Promise<Photo> => {
  const fullPath = join(config.libraryBasePath, relativePath)
  const contentHash = await calculateContentHash(fullPath)
  const fileMetadata = await readFileMetadata(fullPath)
  const preview = await generatePreview(config.cacheBasePath)(contentHash, fullPath)

  // uses the preview image to read the exif data because RAW images are not supported
  const exifSourceFullPath = join(config.cacheBasePath, preview.fullSizePath)
  const exifMetadata = await readExifMetadata(exifSourceFullPath)

  return { relativePath, contentHash, metadata: { file: fileMetadata, exif: exifMetadata }, preview }
}

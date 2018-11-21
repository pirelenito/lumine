import Photo from './Photo'
import { join } from 'path'
import generatePreview from './generatePreview'
import calculateContentHash from './calculateContentHash'
import readFileMetadata from './readFileMetadata'

interface Config {
  libraryBasePath: string
  cacheBasePath: string
}

export default (config: Config) => async (relativePath: string): Promise<Photo> => {
  const fullPath = join(config.libraryBasePath, relativePath)
  const contentHash = await calculateContentHash(fullPath)
  const fileMetadata = await readFileMetadata(fullPath)
  const preview = await generatePreview(config.cacheBasePath)(contentHash, fullPath)

  return { relativePath, contentHash, metadata: { file: fileMetadata }, preview }
}

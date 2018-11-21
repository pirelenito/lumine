import Photo from './Photo'
import calculateContentHash from './calculateContentHash'
import { relative, join } from 'path'

interface Config {
  libraryFullPath: string
  tempFolderFullPath: string
}

export default (config: Config) => async (relativePath: string): Promise<Photo> => {
  const fullPath = join(config.libraryFullPath, relativePath)
  const contentHash = await calculateContentHash(fullPath)

  return { relativePath, contentHash }
}

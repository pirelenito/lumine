import { FileMetadata } from './Photo'

const promisify = require('util').promisify
const stat = promisify(require('fs').stat)

export default async (fullPath: string): Promise<FileMetadata> => {
  const fileStat = await stat(fullPath)

  return {
    createdAt: Math.floor(fileStat.ctimeMs / 1000),
    modifiedAt: Math.floor(fileStat.mtimeMs / 1000),
    size: fileStat.size,
  }
}

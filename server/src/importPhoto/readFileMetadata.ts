import { FileMetadata } from './Photo'

const promisify = require('util').promisify
const stat = promisify(require('fs').stat)

export default async (fullPath: string): Promise<FileMetadata> => {
  const fileStat = await stat(fullPath)

  return {
    // birthtime can be null on some filesystems
    // which makes node return something else that might be wrong
    createdAt: convertToDate(fileStat.birthtimeMs > fileStat.mtimeMs ? fileStat.mtimeMs : fileStat.birthtimeMs),
    modifiedAt: convertToDate(fileStat.mtimeMs),
    size: fileStat.size,
  }
}

const convertToDate = (timeMs: number) => new Date(Math.floor(timeMs / 1000) * 1000)

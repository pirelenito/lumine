import { promisify } from 'util'
import fs from 'fs'
import pad from 'pad'

const promisifiedStats = promisify(fs.stat)

/**
 * This creates a quick "hash" based on modification time and size
 * Based on http://manpages.ubuntu.com/manpages/xenial/en/man1/rsync.1.html
 */
export default async function calculateHash(fullPath: string) {
  const stats = await promisifiedStats(fullPath)
  const size = stats.size
  const modificationTime = stats.mtime.getTime()

  const output = `${pad(size.toString(16), 10, '0')}${pad(modificationTime.toString(16), 15, '0')}`
  return output
}

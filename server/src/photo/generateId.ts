import { promisify } from 'util'
import crypto from 'crypto'
import fs from 'fs'
import pad from 'pad'

const promisifiedStats = promisify(fs.stat)

/**
 * This creates a quick "id" based on modification time and size
 * Based on http://manpages.ubuntu.com/manpages/xenial/en/man1/rsync.1.html
 */
export default async function calculateHash(fullPath: string) {
  const stats = await promisifiedStats(fullPath)
  const size = stats.size
  const modificationTime = stats.mtime.getTime()
  const fullPathHash = crypto.createHash('md4').update(fullPath).digest('hex').slice(0, 4)

  return `${fullPathHash}${pad(size.toString(16), 10, '0')}${pad(modificationTime.toString(16), 15, '0')}`
}

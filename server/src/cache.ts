import { join } from 'path'
import { promisify } from 'util'
import { ensureDir } from 'fs-extra'

const promisifiedEnsureDir = promisify(ensureDir)

export async function ensureCachePathExists(
  cacheFolder: string,
  namespace: string,
  id: string,
  fileExtension: string,
): Promise<string> {
  const dir = join(cacheFolder, namespace, id.slice(0, 2))
  const resourcePath = join(dir, `${id.slice(2)}.${fileExtension}`)
  await ensureDir(dir)
  return resourcePath
}

import { join } from 'path'
import { promisify } from 'util'
import { ensureDir, readFile, writeFile } from 'fs-extra'

const promisifiedEnsureDir = promisify(ensureDir)

export async function ensureCachePathExists(
  cacheFolder: string,
  namespace: string,
  id: string,
  fileExtension: string,
): Promise<string> {
  const dir = join(cacheFolder, namespace, id.slice(0, 2))
  const resourcePath = join(dir, `${id.slice(2)}.${fileExtension}`)
  await promisifiedEnsureDir(dir)
  return resourcePath
}

interface Operation<T> {
  (): Promise<T>
}

export async function loadOrWriteCache<T>(
  cacheFolder: string,
  namespace: string,
  id: string,
  fileExtension: string,
  operation: Operation<T>,
): Promise<T> {
  const dir = join(cacheFolder, namespace, id.slice(0, 2))
  const resourcePath = join(dir, `${id.slice(2)}.${fileExtension}`)

  try {
    const buffer = await readFile(resourcePath)
    const object = JSON.parse(buffer.toString())
    return object
  } catch (e) {
    ensureCachePathExists(cacheFolder, namespace, id, fileExtension)
    const data = await operation()
    await writeFile(resourcePath, JSON.stringify(data))
    return data as T
  }
}

import { join } from 'path'
import { ensureDir, readFile, writeFile, pathExists } from 'fs-extra'

export async function ensureCachePathExists(
  cacheFolder: string,
  namespace: string,
  id: string,
  fileExtension: string,
  operation: Operation<void>,
): Promise<string> {
  const resourcePath = await getResourcePath(cacheFolder, namespace, id, fileExtension)
  if (!(await pathExists(resourcePath))) await operation(resourcePath)
  return resourcePath
}

interface Operation<T> {
  (filePath: string): Promise<T>
}

export async function loadOrWriteCache<T>(
  cacheFolder: string,
  namespace: string,
  id: string,
  fileExtension: string,
  operation: Operation<T>,
): Promise<T> {
  const resourcePath = await getResourcePath(cacheFolder, namespace, id, fileExtension)

  try {
    const buffer = await readFile(resourcePath)
    const object = JSON.parse(buffer.toString())
    return object
  } catch (e) {
    const data = await operation(resourcePath)
    await writeFile(resourcePath, JSON.stringify(data))
    return data as T
  }
}

const getResourcePath = async (cacheFolder: string, namespace: string, id: string, fileExtension: string) => {
  const dir = join(cacheFolder, namespace, id.slice(0, 2))
  await ensureDir(dir)
  return join(dir, `${id.slice(2)}.${fileExtension}`)
}

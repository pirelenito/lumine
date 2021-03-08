import { join } from 'path'
import { TaskQueue } from 'cwait'
import os from 'os'
import { ensureDir, readFile, writeFile, pathExists } from 'fs-extra'

/**
 * Given the goal is wrap costly operations, we throttle their execution while leaving always two CPU cores free.
 */
const queue = new TaskQueue(Promise, os.cpus().length - 2)

interface CacheInfo {
  cacheFolder: string
  namespace: string
  id: string
  fileExtension: string
}

/**
 * Given an operation that populates the cache path, it will run the operation if a cache is not available.
 */
export const ensureCachePathExists = async (
  { cacheFolder, namespace, id, fileExtension }: CacheInfo,
  operation: Operation<void>,
): Promise<string> => {
  const resourcePath = await getResourcePath(cacheFolder, namespace, id, fileExtension)
  if (!(await pathExists(resourcePath))) await queue.wrap(operation)(resourcePath)
  return resourcePath
}

interface Operation<T> {
  (filePath: string): Promise<T>
}

/**
 * Given an operation that returns the content of a cache, it will run the operation if the cache is not available
 */
export const loadOrWriteCache = async <T>(
  { cacheFolder, namespace, id, fileExtension }: CacheInfo,
  operation: Operation<T>,
): Promise<T> => {
  const resourcePath = await getResourcePath(cacheFolder, namespace, id, fileExtension)

  try {
    const buffer = await readFile(resourcePath)
    const object = JSON.parse(buffer.toString())
    return object
  } catch (e) {
    const data = await queue.wrap(operation)(resourcePath)
    await writeFile(resourcePath, JSON.stringify(data))
    return data as T
  }
}

const getResourcePath = async (cacheFolder: string, namespace: string, id: string, fileExtension: string) => {
  const dir = join(cacheFolder, namespace, id.slice(0, 2))
  await ensureDir(dir)
  return join(dir, `${id.slice(2)}.${fileExtension}`)
}

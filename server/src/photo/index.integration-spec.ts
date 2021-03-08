/**
 * Stub id generation to get predictable results
 */
jest.mock('./generateId', () => {
  return (fullPath: string) => crypto.createHash('md4').update(fullPath).digest('hex').slice(0, 4)
})

import { join } from 'path'
import { readdirSync } from 'fs'
import rimraf from 'rimraf'
import crypto from 'crypto'

import { importPhoto } from '.'
import { exiftool } from 'exiftool-vendored'

const libraryBasePath = join(__dirname, '../../fixtures')
const cacheBasePath = join(__dirname, '../../tmp')
const config = { libraryBasePath, cacheBasePath, httpPort: 80 }

/**
 * Cleanup any cache we have stored
 */
beforeAll(() => rimraf.sync(cacheBasePath))

readdirSync(libraryBasePath)
  .filter((photoPath) => photoPath.match(/\.(arw|jpg|jpeg|mp4|avi|mov|mpg)$/i))
  .forEach((photoPath: string) => {
    it(`loads ${photoPath}`, async () => {
      const photo = await importPhoto(config, photoPath)
      expect(photo).toMatchSnapshot()
    }, 180000)
  })

/**
 * Stop the singleton instance of the exiftool, otherwise jest is unable to finish
 */
afterAll(() => {
  exiftool.end()
})

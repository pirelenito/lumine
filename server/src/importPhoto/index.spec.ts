import { join } from 'path'
import { readdirSync } from 'fs'
import rimraf from 'rimraf'

import loadPhoto from '.'

const libraryBasePath = join(__dirname, '../../fixtures')
const cacheBasePath = join(__dirname, '../../tmp')
const config = { libraryBasePath, cacheBasePath, httpPort: 80 }

beforeAll(() => rimraf.sync(cacheBasePath))

readdirSync(libraryBasePath)
  .filter(photoPath => photoPath.match(/\.(arw|jpg|jpeg|)$/i))
  .forEach((photoPath: string) => {
    it(`loads ${photoPath}`, async () => {
      const photo = await loadPhoto(config)(photoPath)
      expect(photo).toMatchSnapshot()
    }, 180000)
  })

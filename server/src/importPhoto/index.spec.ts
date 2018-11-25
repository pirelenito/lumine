import loadPhoto from '.'
import { join } from 'path'

const libraryBasePath = join(__dirname, '../../fixtures')
const cacheBasePath = join(__dirname, '../../tmp')
const config = { libraryBasePath, cacheBasePath }

it('loads a6000', async () => {
  const photo = await loadPhoto(config)('a6000.ARW')
  expect(photo).toMatchSnapshot()
}, 180000)

it('loads iphone 6', async () => {
  const photo = await loadPhoto(config)('iphone6.jpg')
  expect(photo).toMatchSnapshot()
}, 180000)

it('loads nokia 5', async () => {
  const photo = await loadPhoto(config)('nokia5.jpg')
  expect(photo).toMatchSnapshot()
}, 180000)

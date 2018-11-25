import loadPhoto from '.'
import { join } from 'path'

it('loads a6000', async () => {
  const config = { libraryBasePath: join(__dirname, 'fixtures'), cacheBasePath: join(__dirname, 'cache') }
  const photo = await loadPhoto(config)('a6000.ARW')
  expect(photo).toMatchSnapshot()
}, 180000)

it('loads iphone 6', async () => {
  const config = { libraryBasePath: join(__dirname, 'fixtures'), cacheBasePath: join(__dirname, 'cache') }
  const photo = await loadPhoto(config)('iphone6.jpg')
  expect(photo).toMatchSnapshot()
}, 180000)

it('loads nokia 5', async () => {
  const config = { libraryBasePath: join(__dirname, 'fixtures'), cacheBasePath: join(__dirname, 'cache') }
  const photo = await loadPhoto(config)('nokia5.jpg')
  expect(photo).toMatchSnapshot()
}, 180000)

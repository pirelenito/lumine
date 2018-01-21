const path = require('path')
const temp = require('temp')
const promisify = require('util').promisify
const mkdirTemp = promisify(temp.mkdir)
const loadMedia = require('.')

it('load a RAW photo', async () => {
  jest.setTimeout(30000)

  const cacheFolder = await mkdirTemp('testing')
  const source = path.join(__dirname, '../../spec/fixtures/DSC02482.ARW')

  const media = await loadMedia(cacheFolder)(source)
  expect(media).toMatchSnapshot()
})

const path = require('path')
const temp = require('temp')
const promisify = require('util').promisify
const mkdirTemp = promisify(temp.mkdir)
const enrich = require('.')

it('enriches a RAW photo', async () => {
  jest.setTimeout(30000)

  const cacheFolder = await mkdirTemp('testing')
  const source = path.join(__dirname, '../../spec/fixtures/DSC02482.ARW')

  const media = {
    resources: {
      source: source,
    },
  }

  const enrichedMedia = await enrich(cacheFolder)(media)
  expect(enrichedMedia).toMatchSnapshot()
})

import path from 'path'
import calculateContentHash from './calculateContentHash'

it('calculates the hash', async () => {
  const fixturePath = path.join(__dirname, '../../fixtures/nokia5.jpg')
  const hash = await calculateContentHash(fixturePath)
  expect(hash).toEqual('22b05500001674cc286200000')
})

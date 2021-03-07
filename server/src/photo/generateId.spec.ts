import path from 'path'
import generateId from './generateId'

// TODO: this test can't be reliable because checking out the file changes its modification time
it.skip('generates the id', async () => {
  const fixturePath = path.join(__dirname, '../../fixtures/nokia5.jpg')
  const hash = await generateId(fixturePath)
  expect(hash).toEqual('22b05500001674cc286200000')
})

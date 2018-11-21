import loadPhoto from '.'
import { join } from 'path'

it('loads photo information', async () => {
  const config = { libraryFullPath: __dirname, tempFolderFullPath: __dirname }

  const photo = await loadPhoto(config)('./fixtures/DSC00010.ARW')

  expect(photo).toEqual({
    contentHash: '98ce370e686f5a40a02523058679a06ca3ff4ce2',
    relativePath: './fixtures/DSC00010.ARW',
  })
})

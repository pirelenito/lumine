import loadPhoto from '.'
import { join } from 'path'

it('loads photo information', async () => {
  const config = { libraryBasePath: join(__dirname, 'fixtures'), cacheBasePath: join(__dirname, 'cache') }

  const photo = await loadPhoto(config)('DSC00010.ARW')

  expect(photo).toEqual({
    contentHash: '98ce370e686f5a40a02523058679a06ca3ff4ce2',
    metadata: { file: { createdAt: 1542831393, modifiedAt: 1534248554, size: 25133056 } },
    preview: {
      fullSizePath: 'fullSize/98/ce370e686f5a40a02523058679a06ca3ff4ce2.jpg',
      thumbnailPath: 'thumbnail/98/ce370e686f5a40a02523058679a06ca3ff4ce2.jpg',
    },
    relativePath: 'DSC00010.ARW',
  })
}, 180000)

const mediaSelectors = require('.')

it('selects the date from the exit if available', () => {
  const media = {
    id: '4bff511b810cba0590e0d787232e9bda2deb4039',
    metadata: {
      exif: {
        CreateDate: '2016:12:19 23:27:24',
      },
    },
  }

  const date = mediaSelectors.getDate(media)
  expect(date).toEqual(new Date(2016, 11, 19, 23, 27, 24))
})

it('selects the date from the file metadata as a fallback', () => {
  const media = {
    id: '4bff511b810cba0590e0d787232e9bda2deb4039',
    metadata: {
      file: {
        mtimeMs: 1482190044000,
      },
    },
  }

  const date = mediaSelectors.getDate(media)
  expect(date).toEqual(new Date(2016, 11, 19, 23, 27, 24))
})

it('selects the date from the file metadata as a fallback to invalid exif data', () => {
  const media = {
    id: '4bff511b810cba0590e0d787232e9bda2deb4039',
    metadata: {
      exif: {
        CreateDate: 'supper wrong stuff',
      },
      file: {
        mtimeMs: 1482190044000,
      },
    },
  }

  const date = mediaSelectors.getDate(media)
  expect(date).toEqual(new Date(2016, 11, 19, 23, 27, 24))
})

it('selects the day as a string', () => {
  const media = {
    id: '4bff511b810cba0590e0d787232e9bda2deb4039',
    metadata: {
      exif: {
        CreateDate: '2016:12:19 23:27:24',
      },
    },
  }

  const key = mediaSelectors.getDayKey(media)
  expect(key).toEqual('2016-12-19')
})

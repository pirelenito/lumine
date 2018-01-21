const store = require('.')

const medias = [
  {
    id: '1',
    metadata: {
      exif: {
        CreateDate: '2016:12:19 23:27:24',
      },
    },
    resources: {
      preview: '/tmp/cache/preview/1.jpg',
      thumbnail: '/tmp/cache/thumbnail/1.jpg',
      source: '/masters/1.jpg',
    },
  },
  {
    id: '2',
    metadata: {
      exif: {
        CreateDate: '2016:12:19 23:27:24',
      },
    },
    resources: {
      preview: '/tmp/cache/preview/2.jpg',
      thumbnail: '/tmp/cache/thumbnail/2.jpg',
      source: '/masters/2.jpg',
    },
  },
  {
    id: '3',
    metadata: {
      exif: {
        CreateDate: '2016:12:20 23:27:24',
      },
    },
    resources: {
      preview: '/tmp/cache/preview/3.jpg',
      thumbnail: '/tmp/cache/thumbnail/3.jpg',
      source: '/masters/3.jpg',
    },
  },
]

let state

beforeEach(() => {
  state = medias.reduce(store, {})
})

it('reduces medias to an unified state', () => {
  expect(state).toEqual({
    dayAlbums: {
      '2016-12-19': {
        id: '2016-12-19',
        medias: ['1', '2'],
      },
      '2016-12-20': {
        id: '2016-12-20',
        medias: ['3'],
      },
    },
    indexedMedias: {
      '1': medias[0],
      '2': medias[1],
      '3': medias[2],
    },
  })
})

it('getSize', () => {
  expect(store.getSize(state)).toEqual(3)
})

it('getSortedDayAlbums', () => {
  expect(store.getSortedDayAlbums(state)).toEqual([
    {
      id: '2016-12-19',
      medias: ['1', '2'],
      resources: {
        thumbnail: '/media/1/thumbnail.jpg',
      },
    },
    {
      id: '2016-12-20',
      medias: ['3'],
      resources: {
        thumbnail: '/media/3/thumbnail.jpg',
      },
    },
  ])
})

it('getDayAlbum', () => {
  expect(store.getDayAlbum('2016-12-20', state)).toEqual({
    id: '2016-12-20',
    medias: ['3'],
    resources: {
      thumbnail: '/media/3/thumbnail.jpg',
    },
  })
})

it('getMedia', () => {
  expect(store.getMedia('3', state)).toEqual({
    id: '3',
    metadata: {
      exif: {
        CreateDate: '2016:12:20 23:27:24',
      },
    },
    resources: {
      preview: '/media/3/preview.jpg',
      thumbnail: '/media/3/thumbnail.jpg',
    },
  })
})

it('getMediaThumbnail', () => {
  expect(store.getMediaThumbnail('3', state)).toEqual('/tmp/cache/thumbnail/3.jpg')
})

it('getMediaPreview', () => {
  expect(store.getMediaPreview('3', state)).toEqual('/tmp/cache/preview/3.jpg')
})

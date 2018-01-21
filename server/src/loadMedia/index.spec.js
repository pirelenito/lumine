const path = require('path')
const temp = require('temp')
const fs = require('fs')
const promisify = require('util').promisify
const mkdirTemp = promisify(temp.mkdir)
const loadMedia = require('.')

it('loads a JPEG photo with no exif', async () => {
  jest.setTimeout(30000)

  const cacheFolder = await mkdirTemp('lumine')
  const source = path.join(__dirname, '../../spec/fixtures/jpeg-without-exif.jpg')
  const stat = fs.statSync(source)

  const media = await loadMedia(cacheFolder)(source)
  expect(media).toEqual({
    id: 'df6079cf7c5a81151a38b9c013be6424623f987c',
    metadata: {
      exif: {},
      gps: {},
      image: {},
      file: {
        ctimeMs: stat.ctimeMs,
        mtimeMs: stat.mtimeMs,
        size: stat.size,
      },
    },
    resources: {
      preview: path.join(
        cacheFolder,
        'preview',
        'df',
        '6079cf7c5a81151a38b9c013be6424623f987c.jpg'
      ),
      source: '/usr/src/app/server/spec/fixtures/jpeg-without-exif.jpg',
      thumbnail: path.join(
        cacheFolder,
        'thumbnail',
        'df',
        '6079cf7c5a81151a38b9c013be6424623f987c.jpg'
      ),
    },
  })
})

it('loads a RAW photo', async () => {
  jest.setTimeout(30000)

  const cacheFolder = await mkdirTemp('lumine')
  const source = path.join(__dirname, '../../spec/fixtures/raw-with-exif.arw')
  const stat = fs.statSync(source)

  const media = await loadMedia(cacheFolder)(source)
  expect(media).toEqual({
    id: '4bff511b810cba0590e0d787232e9bda2deb4039',
    metadata: {
      exif: {
        BrightnessValue: -2.8265625,
        ColorSpace: 1,
        CompressedBitsPerPixel: 8,
        Contrast: 0,
        CreateDate: '2016:12:19 23:27:24',
        CustomRendered: 0,
        DateTimeOriginal: '2016:12:19 23:27:24',
        DigitalZoomRatio: 1,
        ExifImageHeight: 4000,
        ExifImageWidth: 6000,
        ExposureCompensation: 0,
        ExposureMode: 0,
        ExposureProgram: 3,
        ExposureTime: 0.625,
        FNumber: 2.2,
        Flash: 16,
        FocalLength: 35,
        FocalLengthIn35mmFormat: 52,
        ISO: 200,
        InteropOffset: 38114,
        LensModel: 'E 35mm F1.8 OSS',
        LightSource: 11,
        MaxApertureValue: 1.6953125,
        MeteringMode: 5,
        RecommendedExposureIndex: 200,
        Saturation: 0,
        SceneCaptureType: 0,
        SensitivityType: 2,
        Sharpness: 0,
        WhiteBalance: 1,
      },
      gps: {},
      image: {
        ExifOffset: 348,
        ImageDescription: '                               ',
        Make: 'SONY',
        Model: 'ILCE-6000',
        ModifyDate: '2016:12:19 23:27:24',
        Orientation: 1,
        ProcessingSoftware: 'UFRaw 0.20',
        Software: 'ILCE-6000 v1.00',
        SubfileType: 1,
        YCbCrPositioning: 2,
      },
      file: {
        ctimeMs: stat.ctimeMs,
        mtimeMs: stat.mtimeMs,
        size: stat.size,
      },
    },
    resources: {
      preview: path.join(
        cacheFolder,
        'preview',
        '4b',
        'ff511b810cba0590e0d787232e9bda2deb4039.jpg'
      ),
      source: '/usr/src/app/server/spec/fixtures/raw-with-exif.arw',
      thumbnail: path.join(
        cacheFolder,
        'thumbnail',
        '4b',
        'ff511b810cba0590e0d787232e9bda2deb4039.jpg'
      ),
    },
  })
})

const { pickBy, type, contains } = require('ramda')
const ExifImage = require('exif').ExifImage

const onlyNumbersAndStrings = pickBy((val, key) => contains(type(val), ['Number', 'String']))

module.exports = media =>
  new Promise((resolve, reject) => {
    try {
      new ExifImage(
        { image: media.resources.preview || media.resources.source },
        (err, metadata = { image: {}, exif: {}, gps: {} }) => {
          if (err && err.message !== 'No Exif segment found in the given image.') {
            return reject(err)
          }

          resolve({
            ...media,
            metadata: {
              image: onlyNumbersAndStrings(metadata.image),
              exif: onlyNumbersAndStrings(metadata.exif),
              gps: onlyNumbersAndStrings(metadata.gps),
            },
          })
        }
      )
    } catch (e) {
      reject(e)
    }
  })
import { pickBy, type, contains } from 'ramda'
import { ExifImage } from 'exif'
import { ExifMetadata } from './Photo'

const onlyNumbersAndStrings = pickBy((val, key) => contains(type(val), ['Number', 'String']))

export default (fullPath: string): Promise<ExifMetadata> =>
  new Promise((resolve, reject) => {
    try {
      new ExifImage({ image: fullPath }, (err: any, metadata = { image: {}, exif: {}, gps: {} }) => {
        if (err && err.message !== 'No Exif segment found in the given image.') {
          return reject(err)
        }

        const rawMetadata = {
          image: onlyNumbersAndStrings(metadata.image),
          exif: onlyNumbersAndStrings(metadata.exif),
          gps: onlyNumbersAndStrings(metadata.gps),
        }

        resolve(rawMetadata)
      })
    } catch (e) {
      reject(e)
    }
  })

import { pickBy, type, contains } from 'ramda'
import { ExifImage } from 'exif'
import { ExifMetadata } from './Photo'
import parseExifDate from './parseExifDate'

const onlyNumbersAndStrings = pickBy(val => contains(type(val), ['Number', 'String']))

export default (fullPath: string): Promise<ExifMetadata> =>
  new Promise((resolve, reject) => {
    try {
      new ExifImage({ image: fullPath }, (err: any, metadata = { image: {}, exif: {}, gps: {} }) => {
        if (err && err.message !== 'No Exif segment found in the given image.') {
          return reject(err)
        }

        const image = onlyNumbersAndStrings(metadata.image)
        const exif = onlyNumbersAndStrings(metadata.exif)
        const gps = onlyNumbersAndStrings(metadata.gps)
        const createdAt = parseExifDate((exif as { CreateDate: string }).CreateDate)

        resolve({
          image,
          exif,
          gps,
          dates: { createdAt },
        })
      })
    } catch (e) {
      reject(e)
    }
  })

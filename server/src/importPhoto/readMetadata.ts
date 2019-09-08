import { Metadata, GPS } from '../Photo'
import { Tags, ExifDate } from 'exiftool-vendored'

export default async (exif: Tags): Promise<Metadata> => {
  return {
    createdAt:
      exif.CreateDate && (exif.CreateDate as ExifDate).year
        ? toDate(exif.CreateDate as ExifDate).getTime()
        : toDate(exif.FileModifyDate as ExifDate).getTime(),
    cameraModel: exif.Model,
    gps: getGps(exif),
  }
}

const toDate = (exifDate: ExifDate) => new Date(exifDate.year, exifDate.month - 1, exifDate.day)

const getGps = (exif: Tags): GPS => {
  if (!exif.GPSAltitude && !exif.GPSLatitude && !exif.GPSLongitude) {
    return
  }

  return {
    altitude: exif.GPSAltitude,
    latitude: exif.GPSLatitude,
    longitude: exif.GPSLongitude,
  }
}

import { Metadata, GPS } from '../Photo'
import { Tags, ExifDateTime } from 'exiftool-vendored'

export default async (exif: Tags): Promise<Metadata> => {
  return {
    createdAt:
      exif.CreateDate && (exif.CreateDate as ExifDateTime).year
        ? getTimestamp(exif.CreateDate as ExifDateTime)
        : getTimestamp(exif.FileModifyDate),
    cameraModel: exif.Model,
    gps: getGps(exif),
  }
}

const getTimestamp = (exifDate: ExifDateTime) => {
  return exifDate.toDate().getTime()
}

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

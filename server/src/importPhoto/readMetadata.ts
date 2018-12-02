import { Metadata, GPS } from '../Photo'
import { Tags, ExifDate } from 'exiftool-vendored'

export default async (exif: Tags): Promise<Metadata> => {
  return {
    createdAt: exif.CreateDate
      ? (exif.CreateDate as ExifDate).toDate().getTime()
      : (exif.FileModifyDate as ExifDate).toDate().getTime(),
    cameraModel: exif.Model,
    gps: getGps(exif),
  }
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

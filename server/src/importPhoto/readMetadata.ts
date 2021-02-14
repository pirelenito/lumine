import { Metadata, GPS } from '../Photo'
import { Tags, ExifDateTime, ExifDate } from 'exiftool-vendored'

export default async (relativePath: string, exif: Tags): Promise<Metadata> => {
  return {
    createdAt: getTimestamp(relativePath, exif),
    cameraModel: exif.Model,
    gps: getGps(exif),
  }
}

const getTimestamp = (relativePath: string, exif: Tags) => {
  try {
    return (exif.CreateDate as ExifDateTime).toDate().getTime()
  } catch (e) {
    try {
      return (exif.ModifyDate as ExifDateTime).toDate().getTime()
    } catch (e) {
      try {
        return (exif.DateCreated as ExifDate).toDate().getTime()
      } catch (e) {
        try {
          return (exif.FileModifyDate as ExifDateTime).toDate().getTime()
        } catch (e) {
          console.log(`Error ${relativePath}`, exif.CreateDate)
          throw e
        }
      }
    }
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

const ramda = require('ramda')
const format = require('date-fns/format')

const getDateFromExif = media => {
  const rawDate = ramda.path(['metadata', 'exif', 'CreateDate'], media)

  if (!rawDate) {
    return null
  }

  try {
    const components = rawDate.match(/(\d+)/g)

    return new Date(
      components[0],
      components[1] - 1, // month starts in 0
      components[2],
      components[3],
      components[4],
      components[5]
    )
  } catch (e) {
    return null
  }
}

const getDateFromFile = media => {
  const rawDate = ramda.path(['metadata', 'file', 'mtimeMs'], media)
  return new Date(rawDate)
}

const getDate = media => getDateFromExif(media) || getDateFromFile(media)

const getDayKey = media => format(getDate(media), 'YYYY-MM-DD')

module.exports = {
  getDate,
  getDayKey,
}

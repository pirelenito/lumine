const { create } = require('@most/create')
const path = require('path')
const fs = require('fs')
const gm = require('gm').subClass({ imageMagick: true })
const { exec } = require('child_process')

module.exports = thumbnailBasePath => photo => {
  return create((add, end, error) => {
    const thumbnailPath = path.join(thumbnailBasePath, `${photo.id}.jpg`)
    const publish = () => {
      add({
        ...photo,
        thumbnails: { small: thumbnailPath },
      })

      return end()
    }

    fs.stat(thumbnailPath, (err, data) => {
      if (!err) {
        publish()
      }

      exec(`magick convert -resize 25% "${photo.path}" ${thumbnailPath}`, function(err) {
        if (err) return error(err)

        publish()
      })
    })
  })
}

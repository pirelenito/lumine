const { create } = require('@most/create')
const path = require('path')
const fs = require('fs-extra')
const gm = require('gm').subClass({ imageMagick: true })
const { exec } = require('child_process')

module.exports = thumbnailBasePath => {
  fs.ensureDirSync(thumbnailBasePath)

  return photo => {
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
        if (!err) return publish()

        exec(`magick convert -resize 25% "${photo.absolutePath}" ${thumbnailPath}`, function(err) {
          if (err) return error(err)
          publish()
        })
      })
    })
  }
}

const { create } = require('@most/create')
const path = require('path')
const fs = require('fs')
const gm = require('gm').subClass({ imageMagick: true })

module.exports = basePath => photo => {
  return create((add, end, error) => {
    const metadataCachePath = path.join(basePath, photo.id)

    fs.readFile(metadataCachePath, (err, data) => {
      if (!err) {
        add({
          ...photo,
          identify: JSON.parse(data),
        })

        return end()
      }

      gm(photo.thumbnails.small).identify(function(err, value) {
        if (err) return error(err)

        fs.writeFile(metadataCachePath, JSON.stringify(value), err => {
          if (err) return error(err)

          add({
            ...photo,
            identify: value,
          })
          end()
        })
      })
    })
  })
}

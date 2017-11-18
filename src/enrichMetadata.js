const { create } = require('@most/create')
const path = require('path')
const fs = require('fs')
const gm = require('gm').subClass({ imageMagick: true })

module.exports = cacheBasePath => photo => {
  return create((add, end, error) => {
    const photoCache = path.join(cacheBasePath, photo.id)

    fs.readFile(photoCache, (err, data) => {
      if (!err) {
        add({
          ...photo,
          identify: JSON.parse(data),
        })

        return end()
      }

      gm(photo.path).identify(function(err, value) {
        if (err) return error(err)

        fs.writeFile(photoCache, JSON.stringify(value), err => {
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

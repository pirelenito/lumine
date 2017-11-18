const { create } = require('@most/create')
const path = require('path')
const fs = require('fs-extra')
const gm = require('gm').subClass({ imageMagick: true })

module.exports = metadataBasePath => {
  fs.ensureDirSync(metadataBasePath)

  return photo => {
    return create((add, end, error) => {
      const metadataPath = path.join(metadataBasePath, photo.id)

      const publish = metadata => {
        add({
          ...photo,
          metadata,
        })

        end()
      }

      fs.readFile(metadataPath, (err, data) => {
        if (!err) return publish(JSON.parse(data))

        gm(photo.thumbnails.small).identify(function(err, metadata) {
          if (err) return error(err)

          fs.writeFile(metadataPath, JSON.stringify(metadata), err => {
            if (err) return error(err)
            publish(metadata)
          })
        })
      })
    })
  }
}

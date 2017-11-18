const { create } = require('@most/create')
const path = require('path')
const fs = require('fs-extra')
const ExifImage = require('exif').ExifImage

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

        try {
          new ExifImage({ image: photo.thumbnails.small }, function(err, metadata = {}) {
            if (err && err.message !== 'No Exif segment found in the given image.') {
              return error(err)
            }

            fs.writeFile(metadataPath, JSON.stringify(metadata), err => {
              if (err) return error(err)
              // console.log(metadata)
              publish(metadata)
            })
          })
        } catch (err) {
          error(err)
        }
      })
    })
  }
}

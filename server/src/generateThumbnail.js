const { create } = require('@most/create')
const path = require('path')
const fs = require('fs-extra')
const gm = require('gm').subClass({ imageMagick: true })
const { exec } = require('child_process')

const presets = {
  small: '-resize 200x200^ -gravity center -extent 200x200',
  preview: '-resize 1200x800',
}

module.exports = (thumbnailBasePath, preset) => {
  const presetBasePath = path.join(thumbnailBasePath, preset)

  fs.ensureDirSync(presetBasePath)

  return photo => {
    return create((add, end, error) => {
      const thumbnailPath = path.join(presetBasePath, `${photo.id}.jpg`)
      const publish = () => {
        add({
          ...photo,
          thumbnails: { ...photo.thumbnails, [preset]: thumbnailPath },
        })

        return end()
      }

      fs.stat(thumbnailPath, (err, data) => {
        if (!err) return publish()

        exec(`magick convert ${presets[preset]} "${photo.absolutePath}" ${thumbnailPath}`, err => {
          if (err) return error(err)
          publish()
        })
      })
    })
  }
}

const path = require('path')
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const ensureDir = promisify(require('fs-extra').ensureDir)

const presets = {
  thumbnail: '-resize 200x200^ -gravity center -extent 200x200',
  preview: '-resize 1200x800',
}

module.exports = (cachePath, preset) => async media => {
  const targetFolder = path.join(cachePath, preset, media.id.slice(0, 2))
  const targetPath = path.join(targetFolder, `${media.id.slice(2)}.jpg`)
  const source = media.resources.preview || media.resources.source

  await ensureDir(targetFolder)
  await exec(`magick convert ${presets[preset]} "${source}" ${targetPath}`)

  return {
    ...media,
    resources: {
      ...media.resources,
      [preset]: targetPath,
    },
  }
}

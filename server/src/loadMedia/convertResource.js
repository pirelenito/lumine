const path = require('path')
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const ensureCacheResource = require('./ensureCacheResource')

const presets = {
  thumbnail: '-size 200x200 -thumbnail 200x200^ -gravity center -extent 200x200 +profile "*"',
  preview: '-resize 1920x1080\\>',
}

module.exports = (cacheFolder, preset) => async media => {
  const source = media.resources.preview || media.resources.source
  const targetPath = await ensureCacheResource(cacheFolder, preset, media.id, 'jpg')
  await exec(`magick convert ${presets[preset]} "${source}" "${targetPath}"`)

  return {
    ...media,
    resources: {
      ...media.resources,
      [preset]: targetPath,
    },
  }
}

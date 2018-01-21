const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

module.exports = async media => {
  const output = await exec(`shasum -a 1 ${media.resources.source}`)
  const hash = output.stdout.match(/^(\S+)\s+/)[1]
  return {
    ...media,
    id: hash,
  }
}

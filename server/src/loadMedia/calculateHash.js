const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

module.exports = async location => {
  const output = await exec(`shasum -a 1 "${location}"`)
  return output.stdout.match(/^(\S+)\s+/)[1]
}

const gm = require('gm').subClass({ imageMagick: true })
const path = require('path')

gm(path.join(__dirname, 'pics/DSC02482.ARW')).size(function(err, value) {
  if (err) console.log(err)
  console.log('size', value)
})

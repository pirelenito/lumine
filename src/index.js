const photos = require('./photos')
const path = require('path')
const enrichMetadata = require('./enrichMetadata')
const mergeMapConcurrently = require('most/lib/combinator/mergeConcurrently').mergeMapConcurrently

mergeMapConcurrently(
  enrichMetadata(path.join(__dirname, '../metadata')),
  4,
  photos(path.join(__dirname, '../pics'))
).observe(f => console.log(f.id))

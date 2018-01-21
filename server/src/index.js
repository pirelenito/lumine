const path = require('path')
const fromPromise = require('most').fromPromise
const mergeMapConcurrently = require('most/lib/combinator/mergeConcurrently').mergeMapConcurrently

const watchFiles = require('./watchFiles')
const loadMedia = require('./loadMedia')
const store = require('./store')
const service = require('./service')

const config = {
  mastersFolder: '/data/masters',
  cacheFolder: '/data/cache',
}

const file$ = watchFiles(config.mastersFolder)

const media$ = mergeMapConcurrently(
  file => fromPromise(loadMedia(config.cacheFolder)(file.filePath)),
  4,
  file$
)

const state$ = media$.scan(store)

service(state$)

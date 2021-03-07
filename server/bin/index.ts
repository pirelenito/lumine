import startHttpServer from '../src/startHttpServer'

const config = {
  libraryBasePath: '/data/masters',
  cacheBasePath: '/data/cache',
  httpPort: 80,
}

startHttpServer(config)

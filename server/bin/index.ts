import { startServer } from '../src/server'

const config = {
  libraryBasePath: '/data/masters',
  cacheBasePath: '/data/cache',
  httpPort: 80,
}

startServer(config).catch((e) => {
  console.error('Error initializing server', e)
  process.exit(1)
})

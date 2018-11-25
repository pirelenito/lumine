import watch from './watch'

import Library from './Library'
import startHttpServer from './startHttpServer'

const config = {
  libraryBasePath: '/data/masters',
  cacheBasePath: '/data/cache',
  httpPort: 80,
}

const library = new Library()

watch(config)
  .observe(photo => library.addPhoto(photo))
  .then(success => console.log('completed', success))
  .catch(error => console.log('error', error))

startHttpServer(config)(library)

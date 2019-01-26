import watch from '../src/watch'

import Library from '../src/Library'
import startHttpServer from '../src/startHttpServer'

const config = {
  libraryBasePath: '/data/masters',
  cacheBasePath: '/data/cache',
  httpPort: 80,
}

const library = new Library()

watch(config)
  .observe(photo => {
    console.log('📷', photo.relativePath)
    library.addPhoto(photo)
  })
  .then(success => console.log('completed', success))
  .catch(error => console.log('error', error))

startHttpServer(config)(library)

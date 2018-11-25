import watch from './watch'
import { join } from 'path'

const libraryBasePath = join(__dirname, '../fixtures')
const cacheBasePath = join(__dirname, '../tmp')

console.log('Starting watcher')

watch({ libraryBasePath, cacheBasePath })
  .observe(photo => console.log('photo', photo))
  .then(success => console.log('completed', success))
  .catch(error => console.log('error', error))

console.log('Watcher started')

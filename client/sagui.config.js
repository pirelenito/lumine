/**
 * Sagui configuration object
 * see: http://sagui.js.org/
 */
module.exports = {
  pages: ['index'],
  develop: {
    proxy: {
      '/albums': {
        target: 'http://localhost:80',
        secure: false,
      },
      '/media': {
        target: 'http://localhost:80',
        secure: false,
      },
    },
  },
}

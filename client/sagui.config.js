/**
 * Sagui configuration object
 * see: http://sagui.js.org/
 */
module.exports = {
  pages: ['index'],
  develop: {
    proxy: {
      '/albums': {
        target: 'http://localhost:3001',
        secure: false,
      },
      '/photos': {
        target: 'http://localhost:3001',
        secure: false,
      },
    },
  },
}

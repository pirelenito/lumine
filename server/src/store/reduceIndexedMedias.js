module.exports = (indexedMedias = {}, media) => ({ ...indexedMedias, [media.id]: media })

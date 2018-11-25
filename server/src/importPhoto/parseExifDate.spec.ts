import parseExifDate from './parseExifDate'

it('parses exif dates', () => {
  expect(parseExifDate('2018:08:14 14:09:14')).toEqual(new Date(2018, 7, 14, 14, 9, 14))
})

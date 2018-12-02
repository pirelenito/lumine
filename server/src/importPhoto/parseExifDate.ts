import { parse } from 'date-fns'

export default function parseExifDate(dateTimeString: string) {
  if (!dateTimeString) {
    return
  }

  const timeString = dateTimeString.substring(dateTimeString.indexOf(' ') + 1)
  const dateString = dateTimeString.substring(0, dateTimeString.indexOf(' ')).replace(/\:/g, '-')

  return parse(`${dateString}T${timeString}`).getTime()
}

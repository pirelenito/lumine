import { promisify } from 'util'
import { exec } from 'child_process'

const promisifiedExec = promisify(exec)

export default async function calculateHash(fullPath: string) {
  const output = await promisifiedExec(`shasum -a 1 "${fullPath}"`)
  return output.stdout.match(/^(\S+)\s+/)[1]
}

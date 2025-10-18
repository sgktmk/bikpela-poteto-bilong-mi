import fs from 'fs'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PipeFunction = (x: any) => any

const pipe =
  (...fns: PipeFunction[]) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (x: any): any =>
    fns.reduce((v, f) => f(v), x)

const flattenArray = (input: (string | string[])[]): string[] =>
  input.reduce((acc: string[], item) => [...acc, ...(Array.isArray(item) ? item : [item])], [])

const map =
  <T, U>(fn: (item: T) => U) =>
  (input: T[]): U[] =>
    input.map(fn)

const walkDir = (fullPath: string): string | string[] => {
  return fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath)
}

const pathJoinPrefix =
  (prefix: string) =>
  (extraPath: string): string =>
    path.join(prefix, extraPath)

const getAllFilesRecursively = (folder: string): string[] =>
  pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder)

export default getAllFilesRecursively

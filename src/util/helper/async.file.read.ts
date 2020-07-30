import * as fs from 'fs'
import * as util from 'util'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackFunctionVariadic = (...args: any[]) => any

// Convert fs.readFile into Promise version of same
export const asyncFileRead: CallbackFunctionVariadic = util.promisify(fs.readFile)

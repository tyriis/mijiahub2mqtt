/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { asyncFileRead } from '../fs/async.file.read'

export const configFromYamlAsync: (file: string ) => Promise<any> = async (file: string) : Promise<any> => {
  const data: string = await asyncFileRead(file)
  return yaml.safeLoad(data)
}

export const configFromYaml: (file: string) => any = (file: string) : any => {
  const data: string = fs.readFileSync(file, 'utf8')
  return yaml.safeLoad(data)
}

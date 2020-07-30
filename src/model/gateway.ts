import { Sensor } from './sensor'

export class Gateway extends Sensor {
  public ip?: string
  public port?: number
  public protoVersion?: string
  public color?: {[key: string]: number }
  public brightness?: number
  public illumination?: number

  constructor(data: Partial<Gateway>) {
    super(data)
    Object.assign(this, data)
  }
}

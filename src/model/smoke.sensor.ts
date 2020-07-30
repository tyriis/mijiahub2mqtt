import { Sensor } from './sensor'

export class SmokeSensor extends Sensor {
  public density?: number
  public alarm?: boolean

  constructor(data: Partial<SmokeSensor>) {
    super(data)
    Object.assign(this, data)
  }
}

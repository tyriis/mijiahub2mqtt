import { Sensor } from './sensor'

export class MagnetSensor extends Sensor {
  public closed?: boolean

  constructor(data: Partial<MagnetSensor>) {
    super(data)
    Object.assign(this, data)
  }
}

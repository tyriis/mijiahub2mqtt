import { Sensor } from './sensor'

export class WaterSensor extends Sensor {
  public status?: string

  constructor(data: Partial<WaterSensor>) {
    super(data)
    Object.assign(this, data)
  }
}

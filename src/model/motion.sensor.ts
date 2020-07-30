import { Sensor } from './sensor'

export class MotionSensor extends Sensor {

  public occupancy?: boolean
  public noOccupancySince?: number
  public battery?: number
  public voltage?: number
  public lux?: number

  constructor(data: Partial<MotionSensor>) {
    super(data)
    Object.assign(this, data)
  }
}

import { Sensor } from './sensor'

export class WeatherSensor extends Sensor {

  public temperature?: number
  public humidity?: number
  public pressure?: number
  public battery?: number
  public voltage?: number

  constructor(data: Partial<WeatherSensor>) {
    super(data)
    Object.assign(this, data)
  }
}

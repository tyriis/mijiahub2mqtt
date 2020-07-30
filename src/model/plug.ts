import { Sensor } from './sensor'

export class Plug extends Sensor {
  public on?: boolean

  constructor(data: Partial<Plug>) {
    super(data)
    Object.assign(this, data)
  }
}

import { Sensor } from './sensor'

export class Cube extends Sensor {
  public event?: string

  constructor(data: Partial<Cube>) {
    super(data)
    Object.assign(this, data)
  }
}

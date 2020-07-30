import { Sensor } from './sensor'

export class Button extends Sensor {
  public event?: string

  constructor(data: Partial<Button>) {
    super(data)
    Object.assign(this, data)
  }
}

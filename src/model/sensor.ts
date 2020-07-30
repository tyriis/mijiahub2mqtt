export class Sensor {
  public sid: string = 'undefined'
  public model: string = 'undefined'
  public lastSeen: number = -1

  constructor(data: Partial<Sensor>) {
    Object.assign(this, data)
  }

}

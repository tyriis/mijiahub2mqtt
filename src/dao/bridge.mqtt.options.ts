import { QoS } from 'mqtt'

export class BridgeMqttOptions {
  public url?: string
  public baseTopic?: string
  public qos: QoS = 0
  public rejectUnauthorized?: boolean
}

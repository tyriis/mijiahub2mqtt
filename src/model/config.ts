import { QoS } from 'mqtt'

interface ImqttConfig {
  baseTopic: string
  server: string
  qos: QoS
  rejectUnauthorized: boolean
}

export interface IdeviceConfig {
  friendlyName: string
  retain: boolean
  qos: QoS
}

interface IappConfig {
  name: string
  version: string
}

export interface Iconfig {
  app: IappConfig
  homeassistant: boolean
  mqtt: ImqttConfig
  devices: {[key: string]: IdeviceConfig}
}

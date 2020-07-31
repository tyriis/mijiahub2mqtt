import { QoS } from 'mqtt'

interface IMqttConfig {
  baseTopic: string
  server: string
  qos: QoS
  rejectUnauthorized: boolean
}

export interface IDeviceConfig {
  friendlyName: string
  retain: boolean
  qos: QoS
}

interface IAppConfig {
  name: string
  version: string
}

export interface IConfig {
  app: IAppConfig
  homeassistant: boolean
  mqtt: IMqttConfig
  devices: {[key: string]: IDeviceConfig}
}

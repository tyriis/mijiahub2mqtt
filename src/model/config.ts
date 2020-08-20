import { QoS } from 'mqtt'

interface MqttConfig {
  baseTopic: string
  server: string
  qos: QoS
  rejectUnauthorized: boolean
}

export interface DeviceConfig {
  friendlyName: string
  retain: boolean
  qos: QoS
}

interface AppConfig {
  name: string
  version: string
  port: number
  host: string
}

export interface Config {
  app: AppConfig
  homeassistant: boolean
  mqtt: MqttConfig
  devices: {[key: string]: DeviceConfig}
}

/* eslint-disable @typescript-eslint/naming-convention */

import { QoS } from 'mqtt'

interface ImqttConfig {
  base_topic: string
  server: string
  qos: QoS
  reject_unauthorized: boolean
}

export interface IdeviceConfig {
  friendly_name: string
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

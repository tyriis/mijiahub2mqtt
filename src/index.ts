import * as dotenv from 'dotenv'

dotenv.config()

import { logger } from '@strg/logging-winston'
import { BridgeAPI } from './api/bridge.api'
import { BridgeApiSocket } from './api/bridge.api.socket'
import { BridgeService } from './service/bridge.service'
import { BridgeServiceImpl } from './service/bridge.service.impl'
import { BridgeDAO } from './dao/bridge.dao'
import { BridgeMQTT } from './dao/bridge.mqtt'
import { BridgeMqttOptions } from './dao/bridge.mqtt.options'

logger.info(process.env.npm_package_name)

// const NODE_ENV: string = process.env.NODE_ENV || 'development'
// const PORT: number = Number(process.env.PORT) || 3000
const MQTT_BASE_TOPIC: string = process.env.MQTT_BASE_TOPIC || 'xiaomi2mqtt'
const MQTT_URL: string | undefined = process.env.MQTT_URL
const MQTT_QOS: number = Number(process.env.MQTT_QOS) || 0

const APP: string = process.env.npm_package_name || 'xiaomi2mqtt'
const VERSION: string =  process.env.npm_package_version || 'unknown'

logger.info(`APP: starting ${APP} ${VERSION}...`)

const mqttOptions: BridgeMqttOptions = {
  baseTopic: MQTT_BASE_TOPIC,
  url: MQTT_URL,
  qos: MQTT_QOS === 2 ? 2 : (MQTT_QOS === 1 ? 1 : 0),
}

const dao: BridgeDAO = new BridgeMQTT(mqttOptions)
const service: BridgeService = new BridgeServiceImpl(dao)
const api: BridgeAPI = new BridgeApiSocket(service)

async function stop(): Promise<void> {
  try {
    api.stop(() => ({}))
  } catch (e) {
    logger.error(e)
  }
}

// handle unexpected app shutdown
process.on('SIGINT', () => {
  logger.info(`APP: Shutdown crawler ${APP} ${VERSION} with signal SIGINT`)
  stop().then(() => {
    process.exit(0)
  }).catch(() => {
    process.exit(1)
  })
})

// handle unexpected app shutdowns
process.on('SIGTERM',  () => {
  logger.info(`APP: Shutdown crawler ${APP} ${VERSION} with signal SIGTERM`)
  stop().then(() => {
    process.exit(0)
  }).catch(() => {
    process.exit(1)
  })
})

// handle uncaughtException
// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('uncaughtException', (ex: Error) => {
  stop().then(() => {
    process.exit(1)
  })

})

// handle unhandledRejection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('unhandledRejection', (reason: unknown | null | undefined, promise: Promise<unknown>) => {
  stop().then(() => {
    process.exit(1)
  })
})

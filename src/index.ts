import * as dotenv from 'dotenv'

dotenv.config()

import { logger } from '@strg/logging-winston'
import { configFromYaml } from './util/config/config.from.yaml'
import { HubAPI } from './api/hub.api'
import { HubUdpSocket } from './api/hub.udp.socket'
import { BridgeService } from './service/bridge.service'
import { BridgeServiceImpl } from './service/bridge.service.impl'
import { BridgeDAO } from './dao/bridge.dao'
import { BridgeMQTT } from './dao/bridge.mqtt'
import { IConfig } from './model/config'

const CONFIG_PATH = process.env.CONFIG_PATH || './configuration.yaml'

logger.info(`APP: using configuration ${CONFIG_PATH}`)

const config: IConfig = configFromYaml(CONFIG_PATH)
config.app = {
  name: process.env.npm_package_name || 'mijiahub2mqtt',
  version: process.env.npm_package_version || 'unknown',
}

logger.info(`APP: starting ${config.app.name} ${config.app.version}...`)

const dao: BridgeDAO = new BridgeMQTT(config)
const service: BridgeService = new BridgeServiceImpl(dao)
const api: HubAPI = new HubUdpSocket(service)

logger.info(`APP: started ${config.app.name} ${config.app.version}.`)

// shutdown routine
async function shutdown(): Promise<void> {
  try {
    api.stop(() => ({}))
  } catch (e) {
    logger.error(e)
  }
}

// handle unexpected app shutdown
process.on('SIGINT', () => {
  logger.info(`APP: shutdown ${config.app.name} ${config.app.version} with signal SIGINT!`)
  shutdown().then(() => {
    process.exit(0)
  }).catch(() => {
    process.exit(1)
  })
})

// handle unexpected app shutdowns
process.on('SIGTERM',  () => {
  logger.info(`APP: shutdown ${config.app.name} ${config.app.version} with signal SIGTERM!`)
  shutdown().then(() => {
    process.exit(0)
  }).catch(() => {
    process.exit(1)
  })
})

// handle uncaughtException
// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('uncaughtException', (ex: Error) => {
  shutdown().then(() => {
    process.exit(1)
  })
})

// handle unhandledRejection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('unhandledRejection', (reason: unknown | null | undefined, promise: Promise<unknown>) => {
  shutdown().then(() => {
    process.exit(1)
  })
})

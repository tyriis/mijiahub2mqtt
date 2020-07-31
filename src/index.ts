import * as dotenv from 'dotenv'

dotenv.config()

import { logger } from '@strg/logging-winston'
import { configFromYaml } from './util/config/config.from.yaml'
import { BridgeAPI } from './api/bridge.api'
import { BridgeApiSocket } from './api/bridge.api.socket'
import { BridgeService } from './service/bridge.service'
import { BridgeServiceImpl } from './service/bridge.service.impl'
import { BridgeDAO } from './dao/bridge.dao'
import { BridgeMQTT } from './dao/bridge.mqtt'
import { IConfig } from './model/config'

const CONFIG_PATH = process.env.CONFIG_PATH || './configuration.yaml'

const config: IConfig = configFromYaml(CONFIG_PATH)
config.app = {
  name: process.env.npm_package_name || 'xiaomi2mqtt',
  version: process.env.npm_package_version || 'unknown',
}

logger.info(`APP: starting ${config.app.name} ${config.app.version}...`)

const dao: BridgeDAO = new BridgeMQTT(config)
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
  logger.info(`APP: Shutdown ${config.app.name} ${config.app.version} with signal SIGINT`)
  stop().then(() => {
    process.exit(0)
  }).catch(() => {
    process.exit(1)
  })
})

// handle unexpected app shutdowns
process.on('SIGTERM',  () => {
  logger.info(`APP: Shutdown ${config.app.name} ${config.app.version} with signal SIGTERM`)
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

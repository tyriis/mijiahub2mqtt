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
import { Config } from './model/config'
import { ExpressServer } from './util/server/express.server'

const CONFIG_PATH = process.env.CONFIG_PATH || './configuration.yaml'

logger.info(`APP: using configuration ${CONFIG_PATH}`)

const config: Config = configFromYaml(CONFIG_PATH)
config.app = {
  name: process.env.npm_package_name || 'mijiahub2mqtt',
  version: process.env.npm_package_version || 'unknown',
  host: config.app?.host || process.env.NODE_HOST  || '0.0.0.0',
  port: config.app?.port || Number(process.env.NODE_PORT) || 3000,
}

const APP_ID: string = `${config.app.name}:${config.app.version}`

logger.info(`APP: starting ${APP_ID}}...`)

const dao: BridgeDAO = new BridgeMQTT(config)
const service: BridgeService = new BridgeServiceImpl(dao)
const api: HubAPI = new HubUdpSocket(service)
const server: ExpressServer = new ExpressServer(config)

/**
 * The startup routine.
 *
 * @returns {Promise<void>} In any case.
 */
async function startup(): Promise<void> {
  server.start()
}

// shutdown routine
async function shutdown(): Promise<void> {
  try {
    if (server) {
      await server.stop()
    }
  } catch (e) {
    logger.error(e)
  }
  try {
    api.stop(() => ({}))
  } catch (e) {
    logger.error(e)
  }
  logger.info(`APP: shutdown ${APP_ID} completed.`)
}

// handle unexpected app shutdown
process.on('SIGINT', () => {
  logger.info(`APP: shutdown ${APP_ID} with signal SIGINT!`)
  shutdown().then(() => {
    process.exit(0)
  }).catch(() => {
    process.exit(1)
  })
})

// handle unexpected app shutdowns
process.on('SIGTERM',  () => {
  logger.info(`APP: shutdown ${APP_ID} with signal SIGTERM!`)
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

startup().then(() => {
  logger.info(`APP: started ${APP_ID}`)
})

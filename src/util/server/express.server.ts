import * as http from 'http'
import express from 'express'
import { Config } from '../../model/config'
import { Socket } from 'net'
import { Application, Request, Response } from 'express'
import { logger } from '@strg/logging-winston'

export class ExpressServer {

  private sockets: {[key: string]: Socket} = {}
  private server?: http.Server
  public app: Application

  public constructor(private config: Config) {
    this.app = express()
    this.configure()
    this.routes()
  }

  /**
   * Start the ExpressServer and listen to port from config.
   */
  public start(): void {
    this.server = this.app.listen(this.config.app.port, this.config.app.host, () => {
      logger.info(`ExpressServer: listening on http://${this.config.app.host}:${this.config.app.port}`)
    })
    // keep track of keept alive socket connections to close them fast on shutdown
    this.server.on('connection', (socket: Socket) => {
      const key: string = `${socket.remoteAddress}:${socket.remotePort}`
      this.sockets[key] = socket
      socket.on('close', () => delete this.sockets[key])
    })
  }

  /**
   * Stop the ExpressServer and close all keept alive socket connections.
   *
   * @returns {Promise<void>} Async void on success.
   */
  public async stop(): Promise<void> {
    logger.info('ExpressServer: shutdown...')
    return new Promise((resolve, reject) => {
      if (!this.server) {
        return resolve()
      }
      this.server.close((err?: Error) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
      // destroy existing socket connections (they prevent server.close() to finish)
      for (const key in this.sockets) {
        this.sockets[key].destroy()
      }
    })
  }

  /**
   * Configure express behaviour.
   */
  private configure(): void {
    // do not show express server signature for security reasons
    this.app.disable('x-powered-by')
  }

  /**
   * Configure routes.
   */
  private routes(): void {
    this.app.get('/', (req: Request, resp: Response) => resp.send(`${this.config.app.name} ${this.config.app.version}`))
  }

}

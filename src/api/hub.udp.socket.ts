/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceError } from '../error/service.error'
import { ValidationError } from '../error/validation.error'
import { BridgeService } from '../service/bridge.service'
import { HubAPI } from './hub.api'
import { logger } from '@strg/logging-winston'
import { createSocket, Socket } from 'dgram'
import { Gateway } from '../model/gateway'
import { MotionSensor } from '../model/motion.sensor'
import { WeatherSensor } from '../model/weather.sensor'
import { Button } from '../model/button'
import { MagnetSensor } from '../model/magnet.sensor'
import { Plug } from '../model/plug'
import { SmokeSensor } from '../model/smoke.sensor'
import { WaterSensor } from '../model/water.sensor'
import { Cube } from '../model/cube'

const MULTICAST_PORT: number = 9898
const WHOIS_CMD: string = '{"cmd": "whois"}'
const MIN_VOLTAGE: number = 2000
const MAX_VOLTAGE: number = 3300

export class HubUdpSocket implements HubAPI {

  private socket: Socket
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sensors: {[id: string]: {[key: string]: any } } = {}

  constructor(private service: BridgeService) {
    this.socket = createSocket({ type: 'udp4', reuseAddr: true })
    this.socket.on('message', this.messageHandler.bind(this))
    this.socket.on('error', this.errorHandler.bind(this))
    this.socket.on('listening', this.listeningHandler.bind(this))
    this.socket.bind(MULTICAST_PORT)
  }

  public stop(cb: () => void): void {
    logger.info('API: closing socket...')
    this.socket.close(cb)
  }

  private listeningHandler(): void {
    logger.info(`API: listening on ${MULTICAST_PORT}`)
    this.socket.setBroadcast(true)
    this.socket.setMulticastTTL(128)
    this.socket.addMembership('224.0.0.50')
    this.socket.send(WHOIS_CMD, 0, WHOIS_CMD.length, 4321, '224.0.0.50')
  }

  private errorHandler(err: Error): void {
    logger.error(err.message, err)
  }

  private messageHandler(msgBuffer: Buffer): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let msg: any
    try {
      msg = JSON.parse(msgBuffer.toString())
      if (msg.data) {
        msg.data = JSON.parse(msg.data)
      }
    } catch (e) {
      logger.error(e)
      return
    }
    logger.debug('API: messageHandler', msg)

    // transform msg.sid to match pattern from zigbee2mqtt
    while (msg.sid.length < 16) {
      msg.sid = `0${msg.sid}`
    }
    msg.sid = `0x${msg.sid}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sensor: any = this.sensors[msg.sid] || {
      sid: msg.sid,
      model: msg.model,
    }
    sensor.lastSeen = Date.now()

    if (msg.port) {
      sensor.port = Number(msg.port)
    }
    if (msg.proto_version) {
      sensor.protoVersion = msg.proto_version
    }
    if (msg.ip) {
      sensor.ip = msg.ip
    }
    if (msg.data) {
      if (msg.data.ip) {
        sensor.ip = msg.data.ip
      }
      if (msg.data.temperature !== undefined) {
        sensor.temperature = parseInt(msg.data.temperature, 10) / 100
      }
      if (msg.data.humidity !== undefined) {
        sensor.humidity = parseInt(msg.data.humidity, 10) / 100
      }
      if (msg.data.pressure !== undefined) {
        sensor.pressure = parseInt(msg.data.pressure, 10) / 100
      }
      if (msg.data.voltage !== undefined) {
        sensor.voltage = parseInt(msg.data.voltage, 10)
        const battery: number = (sensor.voltage - MIN_VOLTAGE) / (MAX_VOLTAGE - MIN_VOLTAGE)
        sensor.battery = Math.round(battery * 100)
      }
      if (msg.data.rgb !== undefined) {
        const hex: string = msg.data.rgb === 0 ? '00000000' : (msg.data.rgb).toString(16)
        sensor.brightness = parseInt(hex.substring(0,2), 16)
        sensor.color = {
          r: parseInt(hex.substring(2,4), 16),
          g: parseInt(hex.substring(4,6), 16),
          b: parseInt(hex.substring(6,8), 16),
        }
      }
      if (msg.data.illumination !== undefined) {
        sensor.illumination = msg.data.illumination
      }
      if (msg.data.lux !== undefined) {
        sensor.lux = parseInt(msg.data.lux, 10)
      }
    }

    // motion sensor handling
    if (msg.model === 'motion' || msg.model === 'sensor_motion.aq2') {
      sensor.occupancy = msg.data && msg.data.status === 'motion'
      if (sensor.occupancy) {
        delete(sensor.noOccupancySince)
      } else if (msg.data && msg.data.no_motion !== undefined) {
        sensor.noOccupancySince = parseInt(msg.data.no_motion)
      }
    }
    // button and cube handling
    if (msg.model === 'switch' || msg.model === 'sensor_switch.aq2' || msg.model === 'sensor_cube.aqgl01') {
      if (msg.data && msg.cmd === 'report') {
        sensor.event = msg.data.status
      } else {
        delete(sensor.event)
      }
    }
    // magnet sensor handling
    if (msg.model === 'magnet' || msg.model === 'sensor_magnet.aq2') {
      if (msg.data) {
        sensor.closed = msg.data.status === 'close'
      }
    }
    // plug handling
    if (msg.model === 'plug') {
      if (msg.data) {
        sensor.on = msg.data.status === 'on'
      }
    }
    // water sensor handling
    if (msg.model === 'sensor_wleak.aq1') {
      if (msg.data) {
        sensor.status = msg.data.status
      }
    }
    // smoke sensor handling
    if (msg.model === 'smoke') {
      if (msg.data) {
        sensor.density = parseFloat(msg.data.density) / 100
        sensor.alarm = msg.data.alarm === '1'
      }
    }

    this.sensors[msg.sid] = sensor

    this.handleSensorUpdate(sensor)
  }

  private async handleSensorUpdate(sensor: any): Promise<void> {
    logger.debug('API: handleSensorUpdate', sensor)
    try {
      if (sensor.model === 'gateway') {
        await this.gatewaySensorHandler(new Gateway(sensor))
      } else if (sensor.model === 'motion' || sensor.model === 'sensor_motion.aq2') {
        await this.motionSensorHandler(new MotionSensor(sensor))
      } else if (sensor.model === 'sensor_ht' || sensor.model === 'weather.v1') {
        await this.weatherSensorHandler(new WeatherSensor(sensor))
      } else if (sensor.model === 'switch' || sensor.model === 'sensor_switch.aq2') {
        await this.buttonHandler(new Button(sensor))
      } else if (sensor.model === 'magnet' || sensor.model === 'sensor_magnet.aq2') {
        await this.buttonHandler(new MagnetSensor(sensor))
      } else if (sensor.model === 'plug') {
        await this.plugHandler(new Plug(sensor))
      } else if (sensor.model === 'sensor_wleak.aq1') {
        await this.waterSensorHandler(new WaterSensor(sensor))
      } else if (sensor.model === 'smoke') {
        await this.smokeSensorHandler(new SmokeSensor(sensor))
      } else {
        logger.warn(`API: handleSensorUpdate => ${sensor.model} not implemented, please create an issue or pull request on Github`)
      }
    } catch (e) {
      if (e instanceof ValidationError || e instanceof ServiceError) {
        logger.error(e)
      } else {
        throw(e)
      }
    }
  }

  public async gatewaySensorHandler(gateway: Gateway): Promise<void> {
    await this.service.onGateway(gateway)
  }

  public async motionSensorHandler(motionSensor: MotionSensor): Promise<void> {
    await this.service.onMotion(motionSensor)
  }

  public async weatherSensorHandler(weatherSensor: WeatherSensor): Promise<void> {
    await this.service.onWeather(weatherSensor)
  }

  public async buttonHandler(button: Button): Promise<void> {
    await this.service.onButton(button)
  }

  public async magnetSensorHandler(magnetSensor: MagnetSensor): Promise<void> {
    await this.service.onMagnet(magnetSensor)
  }

  public async plugHandler(plug: Plug): Promise<void> {
    await this.service.onPlug(plug)
  }

  public async waterSensorHandler(waterSensor: WaterSensor): Promise<void> {
    await this.service.onWater(waterSensor)
  }

  public async smokeSensorHandler(smokeSensor: SmokeSensor): Promise<void> {
    await this.service.onSmoke(smokeSensor)
  }

  public async cubeHandler(cube: Cube): Promise<void> {
    await this.service.onCube(cube)
  }

}

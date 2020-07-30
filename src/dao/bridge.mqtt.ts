import { DAOError } from '../error/dao.error'
import { BridgeDAO } from './bridge.dao'
import { BridgeMqttOptions } from './bridge.mqtt.options'
import * as MQTT from 'async-mqtt'
import { logger } from '@strg/logging-winston'
import { Gateway } from '../model/gateway'
import { MotionSensor } from '../model/motion.sensor'
import { Button } from '../model/button'
import { MagnetSensor } from '../model/magnet.sensor'
import { WeatherSensor } from '../model/weather.sensor'
import { Plug } from '../model/plug'
import { Cube } from '../model/cube'
import { Sensor } from '../model/sensor'
import { SmokeSensor } from '../model/smoke.sensor'
import { WaterSensor } from '../model/water.sensor'

export class BridgeMQTT implements BridgeDAO {

  private client: MQTT.AsyncMqttClient
  private publishOptions: MQTT.IClientPublishOptions

  constructor(private options: BridgeMqttOptions) {
    this.publishOptions = {
      qos: this.options.qos,
      retain: false,
    }
    this.client = MQTT.connect(this.options.url, {
      will: {
        topic: `${this.options.baseTopic}/bridge/state`,
        payload: '0',
        qos: this.options.qos,
        retain: true
      },
      rejectUnauthorized: this.options.rejectUnauthorized
    })

    this.client.on('connect', this.onConnect.bind(this))
    this.client.on('error', (e) => {
      throw new DAOError(e.message, e) })
  }

  public async setGateway(gateway: Gateway): Promise<void> {
    return this.publish(gateway)
  }

  public async setMotion(motionSensor: MotionSensor): Promise<void> {
    return this.publish(motionSensor)
  }

  public async setButton(button: Button): Promise<void> {
    return this.publish(button)
  }

  public async setMagnet(magnetSensor: MagnetSensor): Promise<void> {
    return this.publish(magnetSensor)
  }

  public async setWeather(weatherSensor: WeatherSensor): Promise<void> {
    return this.publish(weatherSensor)
  }

  public async setPlug(plug: Plug): Promise<void> {
    return this.publish(plug)
  }

  public async setCube(cube: Cube): Promise<void> {
    return this.publish(cube)
  }

  public async setSmoke(smokeSensor: SmokeSensor): Promise<void> {
    return this.publish(smokeSensor)
  }

  public async setWater(waterSensor: WaterSensor): Promise<void> {
    return this.publish(waterSensor)
  }

  private onConnect(): void {
    logger.info(`DAO: connected to ${this.options.url}`)

    this.client.publish(`${this.options.baseTopic}/bridge/state`, '1', {
      qos: this.options.qos,
      retain: true,
    })

    // clarify
    // this.client.subscribe(`${this.options.baseTopic}/+/set`)
  }

  /**
   *
   * @param sid
   * @param {Sensor} sensor a sensor instance to publish
   * @param {MQTT.IClientPublishOptions} publishOptions
   */
  private async publish(sensor: Sensor, publishOptions?: MQTT.IClientPublishOptions): Promise<void> {
    try {
      const payload: string = JSON.stringify(sensor)
      const topic: string = `${this.options.baseTopic}/${sensor.sid}`
      logger.debug(`DAO: publish @${topic}`, sensor)
      await this.client.publish(
        topic,
        payload,
        publishOptions ? publishOptions : this.publishOptions
      )
    } catch(e) {
      throw new DAOError(e.message, e)
    }
  }
}

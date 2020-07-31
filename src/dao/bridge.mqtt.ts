import { DAOError } from '../error/dao.error'
import { BridgeDAO } from './bridge.dao'
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
import { IConfig, IDeviceConfig } from '../model/config'
import { IClientPublishOptions } from 'async-mqtt'
import { BridgeMqttHomeAssistant } from './bridge.mqtt.home.assistant'

export class BridgeMQTT implements BridgeDAO {

  private client: MQTT.AsyncMqttClient
  private ha: BridgeMqttHomeAssistant

  constructor(private config: IConfig) {
    this.client = MQTT.connect(this.config.mqtt.server, {
      will: {
        topic: `${this.config.mqtt.baseTopic}/bridge/state`,
        payload: 'offline',
        qos: this.config.mqtt.qos,
        retain: true,
      },
      rejectUnauthorized: this.config.mqtt.rejectUnauthorized,
    })
    this.ha = new BridgeMqttHomeAssistant(this.client, this.config)
    this.client.on('connect', this.onConnect.bind(this))
    this.client.on('error', (e) => {
      throw new DAOError(e.message, e)
    })
  }

  private static getPublishOptions(sensorConfig: IDeviceConfig): IClientPublishOptions {
    return {
      qos: sensorConfig.qos,
      retain: !!sensorConfig.retain,
    }
  }

  public async setGateway(gateway: Gateway): Promise<void> {
    return this.publish(gateway)
  }

  public async setMotion(motionSensor: MotionSensor): Promise<void> {
    await this.publish(motionSensor)
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
    logger.info(`DAO: connected to ${this.config.mqtt.server}`)

    this.client.publish(`${this.config.mqtt.baseTopic}/bridge/state`, 'online', {
      qos: this.config.mqtt.qos,
      retain: true,
    })

    // clarify
    // this.client.subscribe(`${this.options.baseTopic}/+/set`)
  }

  /**
   * publish a sensor state
   * @param {Sensor} sensor a sensor instance to publish
   */
  private async publish(sensor: Sensor): Promise<void> {
    try {
      const payload: string = JSON.stringify(sensor)
      const sensorConfig: IDeviceConfig = this.getSensorConfig(sensor)
      const topic: string = this.getTopic(sensorConfig)
      const pulbishOptions: IClientPublishOptions = BridgeMQTT.getPublishOptions(sensorConfig)
      logger.debug(`DAO: publish @${topic}`, sensor)
      await this.client.publish(topic, payload, pulbishOptions)
      await this.ha.propagateSensor(sensor, sensorConfig, topic)
    } catch(e) {
      throw new DAOError(e.message, e)
    }
  }

  private getTopic(sensorConfig: IDeviceConfig): string {
    return `${this.config.mqtt.baseTopic}/${sensorConfig.friendlyName}`
  }

  private getSensorConfig(sensor: Sensor): IDeviceConfig {
    return this.config.devices[sensor.sid] || {
      friendlyName: sensor.sid,
      qos: this.config.mqtt.qos,
      retain: false,
    }
  }
}

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
import { Iconfig, IdeviceConfig } from '../model/config'

export class BridgeMQTT implements BridgeDAO {

  private client: MQTT.AsyncMqttClient

  constructor(private config: Iconfig) {
    this.client = MQTT.connect(this.config.mqtt.server, {
      will: {
        topic: `${this.config.mqtt.base_topic}/bridge/state`,
        payload: 'offline',
        qos: this.config.mqtt.qos,
        retain: true,
      },
      rejectUnauthorized: this.config.mqtt.reject_unauthorized,
    })

    this.client.on('connect', this.onConnect.bind(this))
    this.client.on('error', (e) => {
      throw new DAOError(e.message, e)
    })
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
    logger.info(`DAO: connected to ${this.config.mqtt.server}`)

    this.client.publish(`${this.config.mqtt.base_topic}/bridge/state`, 'online', {
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
      const sensorConfig: IdeviceConfig = this.config.devices[sensor.sid] || {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        friendly_name: sensor.sid,
        qos: this.config.mqtt.qos,
        retain: false,
      }
      const topic: string = `${this.config.mqtt.base_topic}/${sensorConfig.friendly_name}`
      logger.debug(`DAO: publish @${topic}`, sensor)
      await this.client.publish(
        topic,
        payload,
        {
          qos: sensorConfig.qos,
          retain: !!sensorConfig.retain,
        }
      )
    } catch(e) {
      throw new DAOError(e.message, e)
    }
  }
}

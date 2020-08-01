/* eslint-disable @typescript-eslint/naming-convention */
import * as MQTT from 'async-mqtt'
import { Sensor } from '../model/sensor'
import { IDeviceConfig, IConfig } from '../model/config'
import { MotionSensor } from '../model/motion.sensor'
import { IClientPublishOptions } from 'async-mqtt'
import { WeatherSensor } from '../model/weather.sensor'
import { logger } from '@strg/logging-winston'

const deviceNames: {[key: string]: string} = {
  'motion': 'MiJia human body movement sensor (RTCGQ01LM)',
  'sensor_motion.aq2': 'Aqara human body movement and illuminance sensor (RTCGQ11LM)',
  'sensor_ht': 'MiJia temperature & humidity sensor (WSDCGQ01LM)',
  'weather.v1': 'Aqara temperature, humidity and pressure sensor (WSDCGQ11LM)',
  'magnet': 'MiJia door & window contact sensor (MCCGQ01LM)',
  'magnet.aq2': 'Aqara door & window contact sensor (MCCGQ11LM)',
}

export class BridgeMqttHomeAssistant {

  private propagated: string[] = []

  constructor(private client: MQTT.AsyncMqttClient, private config: IConfig) { }

  private hasBeenPropagated(sensor: Sensor): boolean {
    return !this.config.homeassistant || this.propagated.indexOf(sensor.sid) >= 0
  }

  public async propagateSensor(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    if (this.hasBeenPropagated(sensor)) {
      return
    }
    this.propagated.push(sensor.sid)
    if (sensor.model === 'motion' || sensor.model === 'sensor_motion.aq2')
      return this.propagateMotionSensor(sensor, sensorConfig, topic)
    if (sensor.model === 'sensor_ht' || sensor.model === 'weather.v1')
      return this.propagateWeatherSensor(sensor, sensorConfig, topic)
    if (sensor.model === 'magnet' || sensor.model === 'magnet.aq2')
      return this.propagateMagnetSensor(sensor, sensorConfig, topic)
    logger.warn(`DAO: BridgeMqttHomeAssistant => ${sensor.model} not implemented, please create an issue or pull request on Github`)
  }

  public async propagateMotionSensor(sensor: MotionSensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    const payload: {[key: string]: string | boolean} = {
      payload_on: true,
      payload_off: false,
      value_template: '{{ value_json.occupancy }}',
      device_class: 'motion',
    }
    await this.client.publish(
      `homeassistant/binary_sensor/${sensor.sid}/occupancy/config`,
      JSON.stringify({ ...this.getBasePayload(sensor, sensorConfig, topic), ...payload }),
      this.getPublishOptions(sensorConfig))
    await this.propagateBatterySensor(sensor, sensorConfig, topic)
    await this.propagateVoltageSensor(sensor, sensorConfig, topic)
  }

  public async propagateWeatherSensor(sensor: WeatherSensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    if (this.hasBeenPropagated(sensor)) {
      return
    }
    await this.propagateTemperatureSensor(sensor, sensorConfig, topic)
    await this.propagateHumiditySensor(sensor, sensorConfig, topic)
    if (sensor.model === 'weather.v1') {
      await this.propagatePressureSensor(sensor, sensorConfig, topic)
    }
    await this.propagateBatterySensor(sensor, sensorConfig, topic)
    await this.propagateVoltageSensor(sensor, sensorConfig, topic)
  }

  public async propagateMagnetSensor(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    if (this.hasBeenPropagated(sensor)) {
      return
    }
    const payload: {[key: string]: string | boolean} = {
      payload_on: false,
      payload_off: true,
      value_template: '{{ value_json.contact }}',
      device_class: 'door',
    }
    await this.client.publish(
      `homeassistant/binary_sensor/${sensor.sid}/contact/config`,
      JSON.stringify({ ...this.getBasePayload(sensor, sensorConfig, topic), ...payload }),
      this.getPublishOptions(sensorConfig))
    await this.propagateBatterySensor(sensor, sensorConfig, topic)
    await this.propagateVoltageSensor(sensor, sensorConfig, topic)
  }

  private async propagateBatterySensor(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    const payload: {[key: string]: string | boolean} = {
      unit_of_measurement: '%',
      device_class: 'battery',
      value_template: '{{ value_json.battery }}'
    }
    await this.client.publish(
      `homeassistant/sensor/${sensor.sid}/battery/config`,
      JSON.stringify({ ...this.getBasePayload(sensor, sensorConfig, topic), ...payload }),
      this.getPublishOptions(sensorConfig))
  }

  private async propagateVoltageSensor(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    const payload: {[key: string]: string | boolean} = {
      unit_of_measurement: 'mV',
      icon: 'mdi-battery-charging',
      value_template: '{{ value_json.voltage }}'
    }
    await this.client.publish(
      `homeassistant/sensor/${sensor.sid}/voltage/config`,
      JSON.stringify({ ...this.getBasePayload(sensor, sensorConfig, topic), ...payload }),
      this.getPublishOptions(sensorConfig))
  }

  private async propagateTemperatureSensor(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    const payload: {[key: string]: string | boolean} = {
      unit_of_measurement: '°C',
      device_class: 'temperature',
      value_template: '{{ value_json.temperature }}'
    }
    await this.client.publish(
      `homeassistant/sensor/${sensor.sid}/temperature/config`,
      JSON.stringify({ ...this.getBasePayload(sensor, sensorConfig, topic), ...payload }),
      this.getPublishOptions(sensorConfig))
  }

  private async propagateHumiditySensor(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    const payload: {[key: string]: string | boolean} = {
      unit_of_measurement: '%',
      device_class: 'humidity',
      value_template: '{{ value_json.humidity }}'
    }
    await this.client.publish(
      `homeassistant/sensor/${sensor.sid}/humidity/config`,
      JSON.stringify({ ...this.getBasePayload(sensor, sensorConfig, topic), ...payload }),
      this.getPublishOptions(sensorConfig))
  }

  private async propagatePressureSensor(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): Promise<void> {
    const payload: {[key: string]: string | boolean} = {
      unit_of_measurement: 'hPa',
      device_class: 'pressure',
      value_template: '{{ value_json.pressure }}'
    }
    await this.client.publish(
      `homeassistant/sensor/${sensor.sid}/pressure/config`,
      JSON.stringify({ ...this.getBasePayload(sensor, sensorConfig, topic), ...payload }),
      this.getPublishOptions(sensorConfig))
  }


  // eslint-disable-next-line @typescript-eslint/ban-types
  private getBasePayload(sensor: Sensor, sensorConfig: IDeviceConfig, topic: string): object {
    return {
      state_topic: topic,
      json_attributes_topic: topic,
      name: sensorConfig.friendlyName,
      unique_id: `${sensor.sid}_occupancy_${this.config.app.name}`,
      device: {
        identifiers:[
          `${this.config.app.name}_${sensor.sid}`
        ],
        name: sensorConfig.friendlyName,
        sw_version: `${this.config.app.name} ${this.config.app.version}`,
        model: deviceNames[sensor.model] || 'unknown',
        manufacturer: 'Xiaomi',
      },
      availability_topic: `${this.config.mqtt.baseTopic}/bridge/state`,
    }
  }

  private getPublishOptions(sensorConfig: IDeviceConfig): IClientPublishOptions {
    return {
      qos: sensorConfig.qos,
      retain: true,
    }
  }

}

import { Gateway } from '../model/gateway'
import { MotionSensor } from '../model/motion.sensor'
import { WeatherSensor } from '../model/weather.sensor'
import { WaterSensor } from '../model/water.sensor'
import { Plug } from '../model/plug'
import { MagnetSensor } from '../model/magnet.sensor'
import { Button } from '../model/button'
import { Cube } from '../model/cube'
import { SmokeSensor } from '../model/smoke.sensor'

export interface HubAPI {

  /**
   * gateway sensor handler
   * @param {Gateway} gateway the gateway sensor instance
   */
  gatewaySensorHandler(gateway: Gateway): unknown

  /**
   * motion sensor handler
   * @param {MotionSensor} motionSensor the motion sensor instance
   */
  motionSensorHandler(motionSensor: MotionSensor): unknown

  /**
   * weather sensor handler
   * @param {WeatherSensor} weatherSensor the weather sensor instance
   */
  weatherSensorHandler(weatherSensor: WeatherSensor): unknown

  /**
   * button handler
   * @param {Button} button the button instance
   */
  buttonHandler(button: Button): unknown

  /**
   * magnet sensor handler
   * @param {MagnetSensor} magnetSensor the magnet sensor instance
   */
  magnetSensorHandler(magnetSensor: MagnetSensor): unknown

  /**
   * plug handler
   * @param {Plug} plug the plug instance
   */
  plugHandler(plug: Plug): unknown

  /**
   * water sensor handler
   * @param {WaterSensor} waterSensor the water sensor instance
   */
  waterSensorHandler(waterSensor: WaterSensor): unknown

  /**
   * smoke sensor handler
   * @param {SmokeSensor} smokeSensor the smoke sensor instance
   */
  smokeSensorHandler(smokeSensor: SmokeSensor): unknown

  /**
   * cube handler
   * @param {Cubde} cube the cube instance
   */
  cubeHandler(cube: Cube): unknown

  /**
   * shutdown routine
   * @param cb
   */
  stop(cb: () => void): void
}

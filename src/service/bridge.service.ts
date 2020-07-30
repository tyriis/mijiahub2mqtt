import { Gateway } from '../model/gateway'
import { MotionSensor } from '../model/motion.sensor'
import { MagnetSensor } from '../model/magnet.sensor'
import { Button } from '../model/button'
import { Plug } from '../model/plug'
import { WeatherSensor } from '../model/weather.sensor'
import { WaterSensor } from '../model/water.sensor'
import { Cube } from '../model/cube'
import { SmokeSensor } from '../model/smoke.sensor'

export interface BridgeService {

  /**
   * on gateway handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {Gateway} gateway the gateway dto
   * @return {Promise<void>}
   */
  onGateway(gateway: Gateway): Promise<void>

  /**
   * on motion handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {MotionSensor} motionSensor the motion sensor dto
   * @return {Promise<void>}
   */
  onMotion(motionSensor: MotionSensor): Promise<void>

  /**
   * on button handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {Button} button the button dto
   */
  onButton(button: Button): Promise<void>

  /**
   * on magnet handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {MagnetSensor} magnetSensor the magnet sensor dto
   */
  onMagnet(magnetSensor: MagnetSensor): Promise<void>

  /**
   * on plug handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {Plug} plug the plug dto
   */
  onPlug(plug: Plug): Promise<void>

  /**
   * on water handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {WaterSensor} waterSensor the water sensor dto
   */
  onWater(waterSensor: WaterSensor): Promise<void>

  /**
   * on weather handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {WeatherSensor} weatherSensor the weather sensor dto
   */
  onWeather(weatherSensor: WeatherSensor): Promise<void>

  /**
   * on cube handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {Cube} cube the cube dto
   */
  onCube(cube: Cube): Promise<void>

  /**
   * on smoke handler
   * @throws {ValidationError} on invalid input
   * @throws {ServiceError} on internal failure
   * @param {SmokeSensor} smokeSensor the smoke sensor dto
   */
  onSmoke(smokeSensor: SmokeSensor): Promise<void>
}

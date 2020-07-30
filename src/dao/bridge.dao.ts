import { Gateway } from '../model/gateway'
import { MotionSensor } from '../model/motion.sensor'
import { Button } from '../model/button'
import { MagnetSensor } from '../model/magnet.sensor'
import { WeatherSensor } from '../model/weather.sensor'
import { Plug } from '../model/plug'
import { Cube } from '../model/cube'
import { SmokeSensor } from '../model/smoke.sensor'
import { WaterSensor } from '../model/water.sensor'

export interface BridgeDAO {

  setGateway(gateway: Gateway): Promise<void>

  setMotion(motionSensor: MotionSensor): Promise<void>

  setButton(button: Button): Promise<void>

  setMagnet(magnetSensor: MagnetSensor): Promise<void>

  setWeather(weatherSensor: WeatherSensor): Promise<void>

  setPlug(plug: Plug): Promise<void>

  setCube(cube: Cube): Promise<void>

  setSmoke(smokeSensor: SmokeSensor): Promise<void>

  setWater(waterSensor: WaterSensor): Promise<void>

}

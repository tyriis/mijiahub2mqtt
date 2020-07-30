import { ServiceError } from '../error/service.error'
import { DAOError } from '../error/dao.error'
import { BridgeService } from './bridge.service'
import { BridgeDAO } from '../dao/bridge.dao'
import { Gateway } from '../model/gateway'
import { MotionSensor } from '../model/motion.sensor'
import { Button } from '../model/button'
import { MagnetSensor } from '../model/magnet.sensor'
import { WeatherSensor } from '../model/weather.sensor'
import { Plug } from '../model/plug'
import { Cube } from '../model/cube'
import { WaterSensor } from '../model/water.sensor'
import { SmokeSensor } from '../model/smoke.sensor'
// import { ValidationError } from '../error/validation.error'

export class BridgeServiceImpl implements BridgeService {

  constructor(private dao: BridgeDAO) { }

  public async onGateway(gateway: Gateway): Promise<void> {
    // validate
    try {
      await this.dao.setGateway(gateway)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onMotion(motionSensor: MotionSensor): Promise<void> {
    // validate
    try {
      await this.dao.setMotion(motionSensor)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onButton(button: Button): Promise<void> {
    // validate
    try {
      await this.dao.setButton(button)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onMagnet(magnetSensor: MagnetSensor): Promise<void> {
    // validate
    try {
      await this.dao.setMagnet(magnetSensor)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onWeather(weatherSensor: WeatherSensor): Promise<void> {
    // validate
    try {
      await this.dao.setWeather(weatherSensor)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onPlug(plug: Plug): Promise<void> {
    // validate
    try {
      await this.dao.setPlug(plug)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onWater(waterSensor: WaterSensor): Promise<void> {
    // validate
    try {
      await this.dao.setWater(waterSensor)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onCube(cube: Cube): Promise<void> {
    // validate
    try {
      await this.dao.setCube(cube)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }

  public async onSmoke(smokeSensor: SmokeSensor): Promise<void> {
    // validate
    try {
      await this.dao.setSmoke(smokeSensor)
    } catch (e) {
      if (e instanceof DAOError) {
        throw new ServiceError(e.message, e)
      }
      throw e
    }
  }
}

import { Fire } from '../model/Fire';
import { redis, keys } from '../redis';

export const registerFire = async ({ coords, simulationTime: simulateTime }: Fire) => {
  return redis.xadd(keys.FIRE_QUEUE, '*', 'coords', JSON.stringify(coords), 'simulateTime', simulateTime)
    .then(id => {
      console.log('Registered fire, id: ', id);
    })
    .catch(console.error)
}
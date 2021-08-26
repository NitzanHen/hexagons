import { isLatLng, LatLng } from '../common/LatLng';

export interface Fire {
  coords: LatLng,

  /** How far to simulate, in hours. */
  simulationTime: number
}

export const isFire = (target: unknown): target is Fire => {
  if(typeof target !== 'object' || target === null) {
    return false;
  }

  const entries = Object.entries(target)

  if (entries.length !== 2) {
    return false;
  }

  entries.sort(([key1], [key2]) => key1.localeCompare(key2));

  return entries[0][0] === 'coords'
    && isLatLng(entries[0][1])
    && entries[1][0] === 'simulationTime'
    && typeof entries[1][1] === 'number'
}
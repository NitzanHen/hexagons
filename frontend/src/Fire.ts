import { Point } from './geo/Point';

export interface Fire {
  coords: Point,

  /** How far to simulate, in hours. */
  simulationTime: number
}
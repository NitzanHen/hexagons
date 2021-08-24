
export type LatLng = [number, number]

export function isLatLng(target: unknown): target is LatLng {
  return Array.isArray(target) && target.length === 2 && target.every(e => !!parseFloat(e))
}
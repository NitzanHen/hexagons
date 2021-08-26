import L from 'leaflet';
import { basemapLayer } from 'esri-leaflet';

const MAP_EL = document.querySelector('#map') as HTMLElement;

export function initMap() {
  const map = L.map(MAP_EL).setView([31.76245, 35.06116], 11);

  basemapLayer('Gray').addTo(map);
  basemapLayer('GrayLabels').addTo(map);

  return map;
}

let _map: L.Map | null = null;

export function getMap(): L.Map {
  if (!_map) {
    _map = initMap()
  }

  return _map;
}

import L from 'leaflet';
import { Point } from './geo/Point';
import { getMap } from './map';

const random = (min: number, max: number) => Math.random() * (max - min) + min
const socket = new WebSocket('ws://localhost:5000');

socket.onopen = () => {
  socket.send('\"Hello from client!\"')

  const coords = [random(34, 35).toFixed(3), random(34, 35).toFixed(3)];
  const fire = { coords, simulateTime: 2 }
  socket.send(JSON.stringify(fire))
}

socket.onmessage = (e) => {
  console.log('Message!');
  console.log(e.data)
}

const send = (data: unknown) => {
  socket.send(JSON.stringify(data))
}

let marker: L.Marker | null = null;

const map = getMap();

map.on('click', (e) => {
  const latlng = (e as any).latlng as Point;

  marker?.removeFrom(map);

  marker = L.marker(latlng)
  marker.addTo(map);

  const { lat, lng } = latlng;

  marker.bindPopup(`
  <form class="fire-form" onSubmit="submitFire(event, [${lat}, ${lng}])">
    <h1>Point</h1>
    <p>${lat.toFixed(5)} ${lng.toFixed(5)}</p>
    <input type="number" required/>
    <button type="submit">Send</button>
  </form>
  `).openPopup();
});

const submitFire = (e: Event & { target: HTMLFormElement }, point: Point) => {
  e.preventDefault();
  e.stopPropagation();

  const form = e.target;
  const simulationTime = form.querySelector('input')!.valueAsNumber
  const fire = { coords: point, simulationTime };

  console.log('Sending fire', fire);
  send(fire);
}

const { sin, cos, sqrt, PI } = Math;

function polarOffset(point: Point, r: number, theta: number) {
  const { lat, lng } = point;

  return { lat: lat + r * sin(theta), lng: lng + r * cos(theta) };
}

function createHexagon(point: Point, r: number) {
  // r = distanceToVertex * cos(PI / 6), cos(PI/6) = sqrt(3)/2, therefore:
  const distanceToVertex = r * (2 / sqrt(3));

  return [...Array(6).keys()].map(n => polarOffset(point, distanceToVertex, n * PI / 3))
}

const somePoint = { lat: random(31.6, 31.9), lng: random(34.8, 35.2) };
const dist = 0.005;

function centerAt(dx: number, dy: number, dz: number) {

}

L.polygon(createHexagon(somePoint, dist / 2), { color: 'red' }).addTo(map);
[...Array(6).keys()].forEach(n => {
  const nextPoint = polarOffset(somePoint, dist, PI / 6 + n * PI / 3);
  L.polygon(createHexagon(nextPoint, dist / 2), { color: 'blue' }).addTo(map);
})



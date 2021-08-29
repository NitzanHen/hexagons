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

const { abs, sin, cos, sqrt, PI } = Math;

function polarOffset(point: Point, r: number, theta: number) {
  const { lat, lng } = point;

  return { lat: lat + r * sin(theta), lng: lng + r * cos(theta) };
}

function createHexagon(center: Point, r: number) {
  // r = distanceToVertex * cos(PI / 6), cos(PI/6) = sqrt(3)/2, therefore:
  const distanceToVertex = r * (2 / sqrt(3));

  return [...Array(6).keys()].map(n => polarOffset(center, distanceToVertex, n * PI / 3))
}

const origin = { lat: random(31.6, 31.9), lng: random(34.8, 35.2) };

const R = 0.002;

const th1 = 0 + PI / 6;
const th2 = PI / 3 + PI / 6;
const th3 = 2 * PI / 3 + PI / 6;

function centerAt(x: number, y: number, z: number) {
  return {
    lng: origin.lng + x * R * cos(th1) + y * R * cos(th2) + z * R * cos(th3),
    lat: origin.lat + x * R * sin(th1) + y * R * sin(th2) + z * R * sin(th3)
  };
}

// x - y = z
// x, y, z <-> x - z, y + z, 0
// x, y, 0 <-> x + z, y - z, z, z real
// particularily x, y, 0 <-> x + y, 0, y

/**
 * Generates all `d`-tuples of integers whose elements' absolute values sum up to `s`.
 */
function* integerSums(s: number, d: number): Generator<[...number[]]> {
  if (d === 1) {
    yield [s];
    if (s !== 0) {
      yield [-s];
    }
    return
  }

  for (let i = -s; i <= s; i++) {
    for (const tailSum of integerSums(s - abs(i), d - 1)) {
      yield [i, ...tailSum]
    }
  }
}

function* generateHexagonRing(r: number): Generator<[...Point[]]> {
  if(r === 0) {
    yield createHexagon(origin, R / 2);
    return;
  }

  for (let i = 0; i < 6; i++) {
    const vertexAngle = (i * PI / 3) + PI / 6;
    const vertex = polarOffset(origin, r * R, vertexAngle)
    for (let j = 0; j < r; j++) {
      const center = polarOffset(vertex, j * R, vertexAngle + 2 * PI / 3)
      console.log(center)
      yield createHexagon(center, R / 2)
    }
  }

}

function* generateHexagons(maxR: number): Generator<[...Point[]]> {
  for (let r = 0; r <= maxR; r++) {
    console.log(r)
    for (const hexagon of generateHexagonRing(r)) {
      yield hexagon;
    }
  }
}

let i = 0;
for (const hexagon of generateHexagons(10)) {
  const color = `rgb(${255 / 330 * i}, 0, ${255 / 330 * i})`;
  L.polygon(hexagon, { color }).addTo(map);
  i++;
}

// for (let x = -10; x < 10; x++) {
//   for (let y = -10; y < 10; y++) {
//     for (let z = -10; z < 10; z++) {
//       const color = (() => {
//         if (x === 0 && y === 0 && z === 0) {
//           return 'black'
//         }
//         return ['#F08700 ', '#EFCA08', '#F49F0A', 'blue', '#00A6A6', '#BBDEF0', '#B744B8', '#EF476F'][abs(x + y + z) % 8]
//       })();
//       // L.polygon(createHexagon(centerAt(x, y, z), R / 2), { color }).addTo(map);
//     }
//   }
// }
// L.polygon(createHexagon(centerAt(0, 0, 0), R / 2), { color: 'black' }).addTo(map);
// L.polygon(createHexagon(centerAt(2, 5, 0), R / 2), { color: 'red' }).addTo(map);
// L.polygon(createHexagon(centerAt(7, 0, 5), R / 2), { color: 'blue' }).addTo(map);




const random = (min, max) => Math.random() * (max - min) + min
const socket = new WebSocket('ws://localhost:5000');

socket.onopen = (e) => {
  socket.send('\"Hello from client!\"')

  const coords = [random(34, 35).toFixed(3), random(34, 35).toFixed(3)];
  const fire = { coords, simulateTime: 2 }
  socket.send(JSON.stringify(fire))
}

socket.onmessage = (e) => {
  console.log('Message!');
  console.log(e.data)
}

const send = (data) => {
  socket.send(JSON.stringify(data))
}

const mapEl = document.querySelector('#map');
const map = L.map(mapEl).setView([31.76245, 35.06116], 11);

L.esri.basemapLayer('Gray').addTo(map);
L.esri.basemapLayer('GrayLabels').addTo(map);

let marker = null;

map.on('click', ({ latlng }) => {
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

const submitFire = (e, coords) => {
  e.preventDefault();
  e.stopPropagation();

  const form = e.target;
  const simulationTime = form.querySelector('input').valueAsNumber
  const fire = { coords, simulationTime };

  console.log('Sending fire', fire);
  send(fire);
}


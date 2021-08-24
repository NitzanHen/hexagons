const socket = new WebSocket('ws://localhost:5000');

socket.onopen = (e) => {
  socket.send('\"Hello from client!\"')

  //const coords = [random(34, 35).toFixed(3), random(34, 35).toFixed(3)];
  //const fire = { coords, simulateTime: 2 }
  //socket.send(JSON.stringify(fire))
}

socket.onmessage = (e) => {
  console.log('Message!');
  console.log(e.data)
}

const mapEl = document.querySelector('#map');
const map = L.map(mapEl).setView([31.762452387301852, 35.06116590516844], 11);

L.esri.basemapLayer('Gray').addTo(map);
L.esri.basemapLayer('GrayLabels').addTo(map);


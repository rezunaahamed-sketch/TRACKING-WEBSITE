const socket = io();
let map, marker, token;

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById('login').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    initMap();
  }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  alert('Registered! Please login.');
  document.getElementById('register').style.display = 'none';
  document.getElementById('login').style.display = 'block';
});

document.getElementById('showRegister').addEventListener('click', () => {
  document.getElementById('login').style.display = 'none';
  document.getElementById('register').style.display = 'block';
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 15,
  });
  marker = new google.maps.Marker({ position: { lat: 0, lng: 0 }, map });
}

document.getElementById('startTracking').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      socket.emit('locationUpdate', { userId: 'user_id_from_token', lat: latitude, lng: longitude });
    }, (error) => {
      alert('Location permission denied or error: ' + error.message);
    });
  } else {
    alert('Geolocation not supported');
  }
});

socket.on('locationUpdate', (data) => {
  marker.setPosition({ lat: data.lat, lng: data.lng });
  map.setCenter({ lat: data.lat, lng: data.lng });
});
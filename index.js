// index.js
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const calls = [];
const mqttHandler = require('./mqttHandler');
const JWT_SECRET = 'segredo-super-seguro';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/painel', express.static(path.join(__dirname, 'public')));

// Rota protegida com JWT
function authenticateJWT(req, res, next) {
  // const authHeader = req.headers.authorization;
  // if (!authHeader) return res.sendStatus(401);

  // const token = authHeader.split(' ')[1];
  // jwt.verify(token, JWT_SECRET, (err, user) => {
  //   if (err) return res.sendStatus(403);
  //   req.user = user;
  //   next();
  // });
  next();
}

// Rota para gerar token (exemplo simples)
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === '1234') {
    const token = jwt.sign({ usuario: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.sendStatus(403);
  }
});

// Rota protegida que retorna chamadas recebidas
app.get('/api/chamadas', authenticateJWT, (req, res) => {
  res.json(calls);
});

// Recebe chamadas via MQTT
mqttHandler.on('novaChamada', (data) => {
  calls.push(data);
});

// Painel web básico (sem login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});



// console.log("teste");

// // mqttHandler.js
// const mqtt = require('mqtt');
// const EventEmitter = require('events');

// const eventEmitter = new EventEmitter();

// const client = mqtt.connect('mqtt://broker.hivemq.com'); // Ou seu broker local

// client.on('connect', () => {
//   console.log('MQTT conectado');
//   client.subscribe('chamar_garcom/#'); // Ex: chamar_garcom/mesa1
// });

// client.on('message', (topic, message) => {
//   const mesa = topic.split('/')[1];
//   const payload = message.toString();
//   console.log(`Chamada recebida da ${mesa}: ${payload}`);
//   eventEmitter.emit('novaChamada', { mesa, payload, timestamp: Date.now() });
// });

// module.exports = eventEmitter;

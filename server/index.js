// app.js
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const callRoutes = require('./routes/callRoutes');
const callController = require('./controllers/callController');
const mqttService = require('./services/mqttService');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/calls', callRoutes);

const calls = [];

// Inicia MQTT
mqttService.initMQTT(io, callController);

// Inicializa WebSocket
socketHandler(io);

// Redireciona a rota raiz para /call
app.get('/', (req, res) => {
  res.redirect('/calls');
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

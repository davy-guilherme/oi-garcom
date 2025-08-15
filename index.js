// index.js
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const calls = [];
const mqttHandler = require('./mqttHandler');
const socketIo = require('socket.io');
const http = require('http'); // Importar o http para criar o servidor
const JWT_SECRET = 'segredo-super-seguro';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/painel', express.static(path.join(__dirname, 'public')));

// Rota protegida com JWT (placeholder)
function authenticateJWT(req, res, next) {
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

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Criar servidor HTTP manualmente para usar com socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Conexão WebSocket
io.on('connection', (socket) => {
  console.log('Cliente WebSocket conectado:', socket.id);

  // Enviar todas as chamadas atuais
  socket.emit('todasChamadas', calls);

  // Receber pedido de exclusão de chamada
  socket.on('excluirChamada', (index) => {
    const idxOriginal = calls.length - 1 - index; // corrigir ordem invertida
    if (calls[idxOriginal]) {
      calls.splice(idxOriginal, 1);
      io.emit('atualizarChamadas', calls);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Receber novas chamadas via MQTT
mqttHandler.on('novaChamada', (data) => {
  // Verifica se já foi chamado
  const existe = calls.some(chamada => chamada.mesa === data.mesa);
  
  if (!existe) {
    calls.push(data);
    io.emit('novaChamada', data);
  } else {
    console.log(`Mesa ${data.mesa} já está na lista de chamadas.`);
  }
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

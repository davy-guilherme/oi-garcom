// mqttHandler.js
const mqtt = require('mqtt');
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

// const client = mqtt.connect('mqtt://192.168.0.36:1883'); // Ou seu broker local
const client = mqtt.connect('mqtt://quintal.local:1883');

client.on('connect', () => {
  console.log('MQTT conectado');
  client.subscribe('chamar_garcom/#'); // Ex: chamar_garcom/mesa1
});

client.on('message', (topic, message) => {
  const mesa = topic.split('/')[1];
  const payload = message.toString();
  console.log(`Chamada recebida da ${mesa}: ${payload}`);
  eventEmitter.emit('novaChamada', { mesa, payload, timestamp: Date.now() });
});

module.exports = eventEmitter;




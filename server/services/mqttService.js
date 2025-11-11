const mqtt = require('mqtt');

function initMQTT(io, callController) {
    const client = mqtt.connect('mqtt://quintal.local:1883');
    // const client = mqtt.connect("mqtt://test.mosquitto.org")

    client.on('connect', () => {
        console.log('MQTT conectado');
        client.subscribe('chamar_garcom/#'); //change to call
    });

    client.on('message', (topic, message) => {
        const mesa = topic.split('/')[1];
        const payload = message.toString();
        console.log("-------------------------")
        console.log(`Chamada recebida da ${mesa}: ${payload}`);

        callController.novaChamada({ mesa, payload }, io);
    });

    client.on('reconnect', () => {
        console.log('Tentando reconectar...');
    });

    client.on('close', () => {
        console.log('Conexão fechada.');
    });

    client.on('offline', () => {
        console.log('Cliente está offline.');
    });

    client.on('error', (err) => {
        console.error('Erro de conexão:', err.message);
    });

    // setInterval(() => {
    //     if (client.connected) {
    //         console.log('MQTT Status: Ainda conectado');
    //     } else {
    //         console.log('MQTT Status: Não conectado');
    //     }
    // }, 2000);

    return client;
}

module.exports = { initMQTT };
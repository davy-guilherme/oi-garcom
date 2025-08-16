const callModel = require('../models/callModel');

function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('Cliente WebSocket conectado:', socket.id);

        // Enviar todas as chamadas atuais
        socket.emit('todasChamadas', callModel.getCalls());

        // Receber pedido de exclusão de chamada
        socket.on('excluirChamada', (index) => {
            const calls = callModel.getCalls();
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
}

module.exports = socketHandler;
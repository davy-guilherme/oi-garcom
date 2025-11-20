const callModel = require('../models/callModel');

function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('Cliente WebSocket conectado:', socket.id);

        // Enviar todas as chamadas atuais
        socket.emit('todasChamadas', callModel.getCalls());

        // Receber pedido de exclusão de chamada
        socket.on('excluirChamada', (id) => {
            const calls = callModel.getCalls();
            // encontra o índice pelo id
            const idx = calls.findIndex(c => String(c.id) === String(id) || String(c.timestamp) === String(id));

            if (idx !== -1) {
                calls.splice(idx, 1);

                io.emit('atualizarChamadas', calls);
            } else {
                console.log('chamada não encontrada para id=', id);
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
}

module.exports = socketHandler;
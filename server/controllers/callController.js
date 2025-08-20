const callModel = require('../models/callModel');

function novaChamada(data, io) {

    const chamadaComData = {
        ...data,
        timestamp: new Date().toISOString() // formato ISO (ex: 2025-08-19T22:30:00.000Z)
    };
    console.log(chamadaComData)

    const added = callModel.addCall(chamadaComData);
    if (added) {
        io.emit('novaChamada', data);
    }
}

function listarChamadas(req, res) {
    res.json(callModel.getCalls());
}

module.exports = { novaChamada, listarChamadas };

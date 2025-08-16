const callModel = require('../models/callModel');

function novaChamada(data, io) {
    const added = callModel.addCall(data);
    if (added) {
        io.emit('novaChamada', data);
    }
}

function listarChamadas(req, res) {
    res.json(callModel.getCalls());
}

module.exports = { novaChamada, listarChamadas };

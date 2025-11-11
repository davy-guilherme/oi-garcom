const callModel = require('../models/callModel');

async function novaChamada(data, io) {

    const chamadaComData = {
        ...data,
        // timestamp: new Date().toISOString() // formato ISO (ex: 2025-08-19T22:30:00.000Z)
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    console.log(chamadaComData)

    const added = await callModel.createCall(chamadaComData);
    if (added) {
        io.emit('novaChamada', chamadaComData);
    }
}

function listarChamadas(req, res) {
    res.json(callModel.getCalls());
}

// console.log('foi aqui');
// callModel.ChamadaModel.getAll()
//     .then(chamadas => {
//         console.log(chamadas)
//     })
//     .catch(err => {
//         console.log(err)
//     })

module.exports = { novaChamada, listarChamadas };

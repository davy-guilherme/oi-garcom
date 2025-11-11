// const pool = require('../config/db');

let calls = [];

async function createCall(call) {
    const exists = calls.some(c => c.mesa === call.mesa);
    if (!exists) {
        // add Call to database
        calls.push(call);
        try {
          // await pool.query(
          //       'INSERT INTO chamadas (mesa, payload, timestamp, status) VALUES (?, ?, ?, ?)',
          //       [call.mesa, 'chamou aui', call.timestamp, 'ativa']
          //   );
            
        } catch (err) {
          console.error("Erro ao inserir chamada:", err);
          return false;
        }
        // console.log(call)
        // console.log(calls)
        console.log(`chamada criada - mesa ${call.mesa}`);
        return true; // sucesso
    }
    console.log(`chamada DUPLICADA - mesa ${call.mesa}`);
    return false; // duplicado
}

function getCalls() {
    return calls;
}

function clearCalls() {
    calls = [];
}

const ChamadaModel = {
//   async getAll() {
//     const rows = await pool.query('SELECT * FROM chamadas');
//     return rows;
//   },
}


module.exports = { createCall, getCalls, clearCalls, ChamadaModel };

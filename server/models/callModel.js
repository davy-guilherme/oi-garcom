// models/callModel.js
let calls = [];

function addCall(call) {
    const exists = calls.some(c => c.mesa === call.mesa);
    if (!exists) {
        calls.push(call);
        return true; // sucesso
    }
    return false; // duplicado
}

function getCalls() {
    return calls;
}

function clearCalls() {
    calls = [];
}

module.exports = { addCall, getCalls, clearCalls };

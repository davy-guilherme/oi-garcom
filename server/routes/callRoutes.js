// routes/callRoutes.js
const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const authenticateJWT = require('../middlewares/auth');
const path = require('path');

// router.get('/', callController.listarChamadas);

// Página inicial
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
    // res.send('Lista de chamadas');
});
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../views/index.html'));
// });

module.exports = router;
const express = require('express');
const router = express.Router();
const {addClient} = require('../controllers/clientController.js');

router.post('/addclient', addClient);

module.exports = router;
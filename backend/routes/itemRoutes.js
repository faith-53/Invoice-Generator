const express = require('express');
const router = express.Router();
const {addItem} = require('../controllers/itemController.js');

router.post('/additem', addItem);

module.exports = router;
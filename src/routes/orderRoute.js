const express = require('express');

const { getHistory } = require('../controller/orderController');
const router = express.Router();

router.get('/history/:userId', getHistory)

module.exports = router;

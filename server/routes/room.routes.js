const express = require('express');
const roomCtrl = require('../controllers/room.controller');

const router = express.Router();

router.route('/:roomName/info')
  .post(roomCtrl.roomInfo);

module.exports = router;

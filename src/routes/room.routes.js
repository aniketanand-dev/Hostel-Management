const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');

// CRUD routes
router.post('/', roomController.createRoom);          // Create
router.get('/', roomController.getAllRooms);         // Read all
router.get('/:id', roomController.getRoomById);      // Read one
router.put('/:id', roomController.updateRoom);       // Update
router.delete('/:id', roomController.deleteRoom);    // Delete

module.exports = router;

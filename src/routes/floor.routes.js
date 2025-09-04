const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floor.controller');

// CRUD routes
router.post('/', floorController.createFloor);
router.get('/', floorController.getAllFloors);
router.get('/:id', floorController.getFloorById);
router.put('/:id', floorController.updateFloor);
router.delete('/:id', floorController.deleteFloor);

module.exports = router;

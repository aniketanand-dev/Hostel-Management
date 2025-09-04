const express = require('express');
const router = express.Router();
const { createBuilding, updateBuilding, deleteBuilding, getBuildingsByHostel } = require('../controllers/building.controller');

// Create building for hostel
router.post('/', createBuilding);

// Update building
router.put('/:id', updateBuilding);

// Delete building
router.delete('/:id', deleteBuilding);

// Get all buildings for a hostel
router.get('/hostel/:hostelId', getBuildingsByHostel);

module.exports = router;

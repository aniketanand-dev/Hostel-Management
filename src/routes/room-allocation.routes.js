const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/room-allocation.controller');

// CRUD routes
router.post('/', allocationController.createAllocation);         // Create
router.get('/', allocationController.getAllAllocations);        // Read all
router.get('/:id', allocationController.getAllocationById);     // Read one
router.put('/:id', allocationController.updateAllocation);      // Update
router.delete('/:id', allocationController.deleteAllocation);   // Delete

module.exports = router;

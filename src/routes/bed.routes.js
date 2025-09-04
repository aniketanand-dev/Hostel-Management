const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bed.controller');

// CRUD routes
router.post('/', bedController.createBed);          // Create
router.get('/', bedController.getAllBeds);         // Read all
router.get('/:id', bedController.getBedById);      // Read one
router.put('/:id', bedController.updateBed);       // Update
router.delete('/:id', bedController.deleteBed);    // Delete

module.exports = router;

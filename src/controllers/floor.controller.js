const { Floor, Building, Room } = require('./../../models/index');

// Create a new Floor
exports.createFloor = async (req, res) => {
    try {
        const { floorNumber, buildingId } = req.body;
        const floor = await Floor.create({ floorNumber, buildingId });
        res.status(201).json(floor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating floor', error });
    }
};

// Get all Floors with their Building and Rooms
exports.getAllFloors = async (req, res) => {
    try {
        const floors = await Floor.findAll({
            include: [
                { model: Building, as: 'building' },
                { model: Room, as: 'rooms' }
            ]
        });
        res.status(200).json(floors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching floors', error });
    }
};

// Get a Floor by ID
exports.getFloorById = async (req, res) => {
    try {
        const { id } = req.params;
        const floor = await Floor.findByPk(id, {
            include: [
                { model: Building, as: 'building' },
                { model: Room, as: 'rooms' }
            ]
        });
        if (!floor) return res.status(404).json({ message: 'Floor not found' });
        res.status(200).json(floor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching floor', error });
    }
};

// Update a Floor
exports.updateFloor = async (req, res) => {
    try {
        const { id } = req.params;
        const { floorNumber, buildingId } = req.body;
        const floor = await Floor.findByPk(id);
        if (!floor) return res.status(404).json({ message: 'Floor not found' });

        floor.floorNumber = floorNumber !== undefined ? floorNumber : floor.floorNumber;
        floor.buildingId = buildingId !== undefined ? buildingId : floor.buildingId;
        await floor.save();

        res.status(200).json(floor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating floor', error });
    }
};

// Delete a Floor
exports.deleteFloor = async (req, res) => {
    try {
        const { id } = req.params;
        const floor = await Floor.findByPk(id);
        if (!floor) return res.status(404).json({ message: 'Floor not found' });

        await floor.destroy();
        res.status(200).json({ message: 'Floor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting floor', error });
    }
};

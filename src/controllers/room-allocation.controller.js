const { RoomAllocation, User, Room, Bed } = require('./../../models/index');

// Create a new Room Allocation
exports.createAllocation = async (req, res) => {
    try {
        const { userId, roomId, bedId, startDate, endDate, status } = req.body;
        const allocation = await RoomAllocation.create({ userId, roomId, bedId, startDate, endDate, status });
        res.status(201).json(allocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating room allocation', error });
    }
};

// Get all Room Allocations with User, Room, and Bed
exports.getAllAllocations = async (req, res) => {
    try {
        const allocations = await RoomAllocation.findAll({
            include: [
                { model: User, as: 'user' },
                { model: Room, as: 'room' },
                { model: Bed, as: 'bed' }
            ]
        });
        res.status(200).json(allocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching allocations', error });
    }
};

// Get a Room Allocation by ID
exports.getAllocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const allocation = await RoomAllocation.findByPk(id, {
            include: [
                { model: User, as: 'user' },
                { model: Room, as: 'room' },
                { model: Bed, as: 'bed' }
            ]
        });
        if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
        res.status(200).json(allocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching allocation', error });
    }
};

// Update a Room Allocation
exports.updateAllocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, roomId, bedId, startDate, endDate, status } = req.body;
        const allocation = await RoomAllocation.findByPk(id);
        if (!allocation) return res.status(404).json({ message: 'Allocation not found' });

        allocation.userId = userId !== undefined ? userId : allocation.userId;
        allocation.roomId = roomId !== undefined ? roomId : allocation.roomId;
        allocation.bedId = bedId !== undefined ? bedId : allocation.bedId;
        allocation.startDate = startDate !== undefined ? startDate : allocation.startDate;
        allocation.endDate = endDate !== undefined ? endDate : allocation.endDate;
        allocation.status = status !== undefined ? status : allocation.status;

        await allocation.save();
        res.status(200).json(allocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating allocation', error });
    }
};

// Delete a Room Allocation
exports.deleteAllocation = async (req, res) => {
    try {
        const { id } = req.params;
        const allocation = await RoomAllocation.findByPk(id);
        if (!allocation) return res.status(404).json({ message: 'Allocation not found' });

        await allocation.destroy();
        res.status(200).json({ message: 'Allocation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting allocation', error });
    }
};

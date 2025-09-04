const { Bed, Room, RoomAllocation } = require('./../../models/index');

// Create a new Bed
exports.createBed = async (req, res) => {
    try {
        const { roomId, bedNumber } = req.body;
        const bed = await Bed.create({ roomId, bedNumber });
        res.status(201).json(bed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating bed', error });
    }
};

// Get all Beds with Room and Allocations
exports.getAllBeds = async (req, res) => {
    try {
        const beds = await Bed.findAll({
            include: [
                { model: Room, as: 'room' },
                { model: RoomAllocation, as: 'allocations' }
            ]
        });
        res.status(200).json(beds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching beds', error });
    }
};

// Get a Bed by ID
exports.getBedById = async (req, res) => {
    try {
        const { id } = req.params;
        const bed = await Bed.findByPk(id, {
            include: [
                { model: Room, as: 'room' },
                { model: RoomAllocation, as: 'allocations' }
            ]
        });
        if (!bed) return res.status(404).json({ message: 'Bed not found' });
        res.status(200).json(bed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bed', error });
    }
};

// Update a Bed
exports.updateBed = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomId, bedNumber } = req.body;
        const bed = await Bed.findByPk(id);
        if (!bed) return res.status(404).json({ message: 'Bed not found' });

        bed.roomId = roomId !== undefined ? roomId : bed.roomId;
        bed.bedNumber = bedNumber !== undefined ? bedNumber : bed.bedNumber;

        await bed.save();
        res.status(200).json(bed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating bed', error });
    }
};

// Delete a Bed
exports.deleteBed = async (req, res) => {
    try {
        const { id } = req.params;
        const bed = await Bed.findByPk(id);
        if (!bed) return res.status(404).json({ message: 'Bed not found' });

        await bed.destroy();
        res.status(200).json({ message: 'Bed deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting bed', error });
    }
};

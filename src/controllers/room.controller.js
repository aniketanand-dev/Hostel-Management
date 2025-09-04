const { Room, Floor, Bed, RoomAllocation } = require('./../../models/index');

// Create a new Room
exports.createRoom = async (req, res) => {
    try {
        const { roomNumber, price, floorId, type, capacity } = req.body;
        const room = await Room.create({ roomNumber, price, floorId, type, capacity });
        res.status(201).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating room', error });
    }
};

// Get all Rooms with Floor, Beds, and Allocations
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({
            include: [
                { model: Floor, as: 'floor' },
                { model: Bed, as: 'beds' },
                { model: RoomAllocation, as: 'allocations' }
            ]
        });
        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching rooms', error });
    }
};

// Get a Room by ID
exports.getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByPk(id, {
            include: [
                { model: Floor, as: 'floor' },
                { model: Bed, as: 'beds' },
                { model: RoomAllocation, as: 'allocations' }
            ]
        });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching room', error });
    }
};

// Update a Room
exports.updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomNumber, price, floorId, type, capacity } = req.body;
        const room = await Room.findByPk(id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        room.roomNumber = roomNumber !== undefined ? roomNumber : room.roomNumber;
        room.price = price !== undefined ? price : room.price;
        room.floorId = floorId !== undefined ? floorId : room.floorId;
        room.type = type !== undefined ? type : room.type;
        room.capacity = capacity !== undefined ? capacity : room.capacity;

        await room.save();
        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating room', error });
    }
};

// Delete a Room
exports.deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByPk(id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        await room.destroy();
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting room', error });
    }
};

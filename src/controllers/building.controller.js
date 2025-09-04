const { Building } = require('./../../models/index');

// Create Building
exports.createBuilding = async (req, res) => {
    try {
        const { buildingName, hostelId } = req.body;

        if (!buildingName || !hostelId) {
            return res.status(400).json({ message: "buildingName and hostelId are required" });
        }

        const building = await Building.create({ buildingName, hostelId });
        res.status(201).json({ message: "Building created successfully", building });
    } catch (error) {
        console.error("Error creating building:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//Update Building
exports.updateBuilding = async (req, res) => {
    try {
        const { id } = req.params;
        const { buildingName } = req.body;

        const building = await Building.findByPk(id);
        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        if (buildingName) building.buildingName = buildingName;

        await building.save();
        res.json({ message: "Building updated successfully", building });
    } catch (error) {
        console.error("Error updating building:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Building
exports.deleteBuilding = async (req, res) => {
    try {
        const { id } = req.params;

        const building = await Building.findByPk(id);
        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        await building.destroy();
        res.json({ message: "Building deleted successfully" });
    } catch (error) {
        console.error("Error deleting building:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Buildings for a Hostel
exports.getBuildingsByHostel = async (req, res) => {
    try {
        const { hostelId } = req.params;

        const buildings = await Building.findAll({
            where: { hostelId }
        });

        res.json({ buildings });
    } catch (error) {
        console.error("Error fetching buildings:", error);
        res.status(500).json({ message: "Server error" });
    }
};

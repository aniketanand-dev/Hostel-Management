const app = require('./app')
const db = require('./../models');
const PORT = 3000

const onboardingRouter = require('./routes/on-boarding.routes');

const buildingRouter = require('./routes/building.routes')

const floorRouter = require('./routes/floor.routes');

const roomRouter = require('./routes/room.routes');

const bedRouter = require('./routes/bed.routes');

const roomAllocationRouter = require('./routes/room-allocation.routes');




app.use('/api/v1', onboardingRouter);
app.use('/api/v1', buildingRouter);
app.use('/api/v1', floorRouter);
app.use('/api/v1', roomRouter);
app.use('/api/v1', bedRouter);
app.use('/api/v1', roomAllocationRouter);

db.sequelize.sync({ alter: false }).then(() => {
    console.log('Database synced');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


const app = require('./app');
const { sequelize } = require('./config/database');
const { schedulerService } = require('./services/schedulerService');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Sync database models
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);

            // Start the scheduler service
            schedulerService.start();
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
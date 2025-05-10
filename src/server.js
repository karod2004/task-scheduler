

const app = require('./app');
const { sequelize } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Sync database models
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
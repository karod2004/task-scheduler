

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    schedule: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Cron expression for task scheduling'
    },
    lastRunAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    nextRunAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'running', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    retryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    maxRetries: {
        type: DataTypes.INTEGER,
        defaultValue: 3
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Task;
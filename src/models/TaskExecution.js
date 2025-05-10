

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Task = require('./Task');

const TaskExecution = sequelize.define('TaskExecution', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Task,
            key: 'id'
        }
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('running', 'completed', 'failed'),
        defaultValue: 'running'
    },
    error: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    attempt: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: true
});

// Set up association
Task.hasMany(TaskExecution, { foreignKey: 'taskId' });
TaskExecution.belongsTo(Task, { foreignKey: 'taskId' });

module.exports = TaskExecution;


const Task = require('../../models/Task');
const { calculateNextRunTime } = require('../../utils/cronUtils');

// Get all tasks
exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// Get a single task by ID
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { name, description, schedule } = req.body;

        // Calculate the next run time based on the cron expression
        const nextRunAt = calculateNextRunTime(schedule);

        const task = await Task.create({
            name,
            description,
            schedule,
            nextRunAt
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// Update a task
exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { name, description, schedule, active } = req.body;

        // If schedule changed, recalculate next run time
        let updates = { name, description, active };
        if (schedule && schedule !== task.schedule) {
            updates.schedule = schedule;
            updates.nextRunAt = calculateNextRunTime(schedule);
        }

        await task.update(updates);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};


const Task = require('../models/Task');
const { Op } = require('sequelize');
const { executorService } = require('./executorService');

class SchedulerService {
    constructor() {
        this.isRunning = false;
        this.pollingInterval = 60000; // Check every minute
        this.timer = null;
    }

    // Start the scheduler
    start() {
        if (this.isRunning) {
            console.log('Scheduler is already running');
            return;
        }

        console.log('Starting scheduler service...');
        this.isRunning = true;

        // Do an initial check
        this.checkDueTasks();

        // Set up polling interval
        this.timer = setInterval(() => {
            this.checkDueTasks();
        }, this.pollingInterval);
    }

    // Stop the scheduler
    stop() {
        if (!this.isRunning) {
            console.log('Scheduler is not running');
            return;
        }

        console.log('Stopping scheduler service...');
        clearInterval(this.timer);
        this.isRunning = false;
    }

    // Check for tasks that are due to run
    async checkDueTasks() {
        try {
            console.log('Checking for due tasks...');

            // Find tasks that are:
            // 1. Active
            // 2. Have a nextRunAt time that is in the past
            // 3. Not currently running
            const dueTasks = await Task.findAll({
                where: {
                    active: true,
                    nextRunAt: {
                        [Op.lte]: new Date() // Due time is less than or equal to now
                    },
                    status: {
                        [Op.ne]: 'running' // Not currently running
                    }
                }
            });

            console.log(`Found ${dueTasks.length} tasks due for execution`);

            // Process each due task
            for (const task of dueTasks) {
                this.scheduleTask(task);
            }
        } catch (error) {
            console.error('Error checking due tasks:', error);
        }
    }

    // Schedule a task for execution
    async scheduleTask(task) {
        try {
            // Mark the task as running
            await task.update({
                status: 'running',
                lastRunAt: new Date()
            });

            // Send to executor service
            executorService.executeTask(task);
        } catch (error) {
            console.error(`Error scheduling task ${task.id}:`, error);
        }
    }
}

// Create a singleton instance
const schedulerService = new SchedulerService();

module.exports = { schedulerService };


const { schedulerService } = require('../../services/schedulerService');

// Get scheduler status
exports.getStatus = (req, res) => {
    res.json({
        isRunning: schedulerService.isRunning,
        pollingInterval: schedulerService.pollingInterval
    });
};

// Start the scheduler
exports.startScheduler = (req, res) => {
    schedulerService.start();
    res.json({ message: 'Scheduler started', isRunning: true });
};

// Stop the scheduler
exports.stopScheduler = (req, res) => {
    schedulerService.stop();
    res.json({ message: 'Scheduler stopped', isRunning: false });
};
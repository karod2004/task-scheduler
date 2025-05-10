

const cron = require('node-cron');

// Validate if a cron expression is valid
exports.validateCronExpression = (expression) => {
    return cron.validate(expression);
};

// Calculate the next run time for a cron expression
exports.calculateNextRunTime = (expression) => {
    if (!this.validateCronExpression(expression)) {
        throw new Error('Invalid cron expression');
    }

    // For a production system, consider using a library like 'cron-parser'
    // This is a simplification that adds one hour to current time as a placeholder
    const now = new Date();
    let nextDate = new Date(now);
    nextDate.setHours(nextDate.getHours() + 1);

    return nextDate;
};


const Task = require('../models/Task');
const TaskExecution = require('../models/TaskExecution');
const { calculateNextRunTime } = require('../utils/cronUtils');

class ExecutorService {
    // Execute a task
    async executeTask(task) {
        // Create execution record
        const execution = await TaskExecution.create({
            taskId: task.id,
            startTime: new Date(),
            status: 'running',
            attempt: task.retryCount + 1
        });

        try {
            console.log(`Executing task: ${task.name} (${task.id})`);

            // Simulate task execution
            await this.simulateTaskExecution(task);

            // Mark task as completed and calculate next run time
            const nextRunAt = calculateNextRunTime(task.schedule);
            await task.update({
                status: 'completed',
                nextRunAt,
                retryCount: 0 // Reset retry count on success
            });

            // Update execution record
            await execution.update({
                endTime: new Date(),
                status: 'completed'
            });

            console.log(`Task completed: ${task.name} (${task.id}), next run at: ${nextRunAt}`);
        } catch (error) {
            console.error(`Error executing task ${task.id}:`, error);

            // Update execution record
            await execution.update({
                endTime: new Date(),
                status: 'failed',
                error: error.message
            });

            await this.handleFailedTask(task, error);
        }
    }

    // Simulate task execution with random success/failure
    async simulateTaskExecution(task) {
        // Simulate task running for 1-3 seconds
        const executionTime = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(resolve => setTimeout(resolve, executionTime));

        // 85% chance of success, 15% chance of failure (for testing retry logic)
        const success = Math.random() < 0.85;
        if (!success) {
            throw new Error('Task execution failed (simulated)');
        }
    }

    // Handle a failed task
    async handleFailedTask(task, error) {
        try {
            // Check if we should retry
            if (task.retryCount < task.maxRetries) {
                // Increment retry count
                const retryCount = task.retryCount + 1;

                // Calculate next run time (retry in 1 minute)
                const nextRunAt = new Date();
                nextRunAt.setMinutes(nextRunAt.getMinutes() + 1);

                await task.update({
                    status: 'pending',
                    nextRunAt,
                    retryCount
                });

                console.log(`Task ${task.id} failed, scheduled for retry ${retryCount}/${task.maxRetries} at ${nextRunAt}`);
            } else {
                // No more retries, mark as failed
                const nextRunAt = calculateNextRunTime(task.schedule);

                await task.update({
                    status: 'failed',
                    nextRunAt,
                    retryCount: 0 // Reset for next regular run
                });

                console.log(`Task ${task.id} failed, no more retries. Next regular run at ${nextRunAt}`);
            }
        } catch (updateError) {
            console.error(`Error updating failed task ${task.id}:`, updateError);
        }
    }
}

// Create a singleton instance
const executorService = new ExecutorService();

module.exports = { executorService };
// const fs = require('fs');
// const path = require('path');

// const cronRefreshInterval = 1000; // 30 seconds

// class CronScheduler {
//     constructor(storagePath, refreshInterval) {
//         this.tasks = new Map();
//         this.storagePath = storagePath;
//         this.refreshInterval = refreshInterval;
//         this.initStorage();
//     }

//     initStorage() {
//         const locksPath = path.join(this.storagePath, 'locks');
//         if (!fs.existsSync(locksPath)) {
//             fs.mkdirSync(locksPath, { recursive: true });
//         }
//     }

//     addTask(taskName, schedule, taskFunction) {
//         const taskType = typeof schedule === 'number' ? 'interval' : 'specificTime';

//         if (taskType === 'interval' && schedule < this.refreshInterval) throw new Error(`The interval for task '${taskName}' cannot be less than the CRON refresh time (${this.refreshInterval}ms).`);

//         if (taskType === 'specificTime') {
//             const [scheduledHour, scheduledMinute] = schedule.split(':').map(s => parseInt(s, 10));

//             if (isNaN(scheduledHour) || isNaN(scheduledMinute)) throw new Error(`Invalid schedule format for task ${taskName}. Expected 'HH:MM'`);
//             if (scheduledHour < 0 || scheduledHour > 23) throw new Error(`Invalid hour value for task ${taskName}. Expected 0-23`);
//             if (scheduledMinute < 0 || scheduledMinute > 59) throw new Error(`Invalid minute value for task ${taskName}. Expected 0-59`);
//         }

//         this.tasks.set(taskName, {
//             schedule,
//             taskType,
//             lastRun: null,
//             taskFunction
//         });
//     }

//     shouldRun(taskDetails) {
//         const now = new Date();
//         const { schedule, taskType, lastRun } = taskDetails;

//         if (taskType === 'interval') {
//             return !lastRun || now - lastRun >= schedule;
//         }

//         if (taskType === 'specificTime') {
//             const [scheduledHour, scheduledMinute] = schedule.split(':').map(s => parseInt(s, 10));

//             const nowHour = now.getHours();
//             const nowMinute = now.getMinutes();

//             if (scheduledHour === nowHour && scheduledMinute === nowMinute) {
//                 const lastRunTime = lastRun ? new Date(lastRun) : null;
//                 if (!lastRunTime || lastRunTime.getHours() !== nowHour || lastRunTime.getMinutes() !== nowMinute) {
//                     return true;
//                 }
//             }
//         }

//         return false;
//     }

//     runTasks() {
//         const now = new Date();

//         for (const [taskName, taskDetails] of this.tasks.entries()) {
//             if (this.shouldRun(taskDetails)) {
//                 const lockFilePath = path.join(this.storagePath, 'locks', `${taskName}.lock`);
//                 if (!this.tryAcquireLock(lockFilePath)) {
//                     continue;
//                 }

//                 try {
//                     taskDetails.taskFunction();
//                     this.tasks.set(taskName, { ...taskDetails, lastRun: now });
//                 } catch (error) {
//                     console.error(`Error executing task ${taskName}:`, error);
//                 } finally {
//                     this.releaseLock(lockFilePath);
//                 }
//             }
//         }
//     }

//     tryAcquireLock(lockFilePath) {
//         try {
//             fs.writeFileSync(lockFilePath, 'lock', { flag: 'wx' });
//             return true;
//         } catch (error) {
//             if (error.code === 'EEXIST') {
//                 return false;
//             }
//             throw error;
//         }
//     }

//     releaseLock(lockFilePath) {
//         try {
//             fs.unlinkSync(lockFilePath);
//         } catch (error) {
//             console.error(`Error releasing lock for ${lockFilePath}:`, error);
//         }
//     }
// }

// const cronScheduler = new CronScheduler(path.join(__dirname, 'locks'), cronRefreshInterval);

// cronScheduler.addTask('intervalTask', 3000, () => {
//     console.log('Interval task executed');
// });

// cronScheduler.addTask('specificTimeTask', '1:50', () => {
//     console.log('Specific time task executed');
// });

// setInterval(() => cronScheduler.runTasks(), cronRefreshInterval);


const fs = require('fs');
const path = require('path');

const cronRefreshInterval = 1000; // Adjust as needed

class CronScheduler {
    constructor(storagePath, refreshInterval) {
        this.tasks = new Map();
        this.storagePath = storagePath;
        this.locksPath = path.join(this.storagePath, 'locks');
        this.refreshInterval = refreshInterval;
        this.initStorage();
    }

    initStorage() {
        if (!fs.existsSync(this.locksPath)) {
            fs.mkdirSync(this.locksPath, { recursive: true });
        }
    }

    addTask(taskName, schedule, taskFunction) {
        const taskType = typeof schedule === 'number' ? 'interval' : 'specificTime';
        if (taskType === 'interval' && schedule < this.refreshInterval) {
            throw new Error(`The interval for task '${taskName}' cannot be less than the CRON refresh time (${this.refreshInterval}ms).`);
        }
        this.tasks.set(taskName, {
            schedule,
            taskType,
            lastRun: null,
            taskFunction
        });
    }

    shouldRun(taskDetails) {
        const now = new Date();
        const { schedule, taskType, lastRun } = taskDetails;
        if (taskType === 'interval') {
            return !lastRun || now - lastRun >= schedule;
        }
        if (taskType === 'specificTime') {
            const [scheduledHour, scheduledMinute] = schedule.split(':').map(s => parseInt(s, 10));
            const nowHour = now.getHours();
            const nowMinute = now.getMinutes();
            if (scheduledHour === nowHour && scheduledMinute === nowMinute) {
                const lastRunTime = lastRun ? new Date(lastRun) : null;
                if (!lastRunTime || lastRunTime.getHours() !== nowHour || lastRunTime.getMinutes() !== nowMinute) {
                    return true;
                }
            }
        }
        return false;
    }

    runTasks() {
        const now = new Date();
        for (const [taskName, taskDetails] of this.tasks.entries()) {
            if (this.shouldRun(taskDetails)) {
                const lockFilePath = path.join(this.locksPath, `${taskName}.lock`);
                if (!this.tryAcquireLock(lockFilePath)) {
                    continue;
                }
                try {
                    taskDetails.taskFunction();
                    this.tasks.set(taskName, { ...taskDetails, lastRun: now });
                } catch (error) {
                    console.error(`Error executing task ${taskName}:`, error);
                } finally {
                    this.releaseLock(lockFilePath);
                }
            }
        }
    }

    tryAcquireLock(lockFilePath) {
        try {
            fs.writeFileSync(lockFilePath, 'lock', { flag: 'wx' });
            return true;
        } catch (error) {
            if (error.code === 'EEXIST') {
                return false;
            }
            throw error;
        }
    }

    releaseLock(lockFilePath) {
        try {
            fs.unlinkSync(lockFilePath);
        } catch (error) {
            console.error(`Error releasing lock for ${lockFilePath}:`, error);
        }
    }
}

const cronScheduler = new CronScheduler(path.join(__dirname), cronRefreshInterval);

cronScheduler.addTask('intervalTask', 3000, () => {
    console.log('Interval task executed');
});

cronScheduler.addTask('specificTimeTask', '1:50', () => {
    console.log('Specific time task executed');
});

setInterval(() => cronScheduler.runTasks(), cronRefreshInterval);

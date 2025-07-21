// backend/services/scheduler.js
const cron = require('node-cron');
const User = require('../models/User');
const { runMatchmaking } = require('./matchmaking');

const startSchedules = () => {
    // 1. Daily Matchmaking Job (runs every day at 5 AM)
    cron.schedule('0 5 * * *', () => {
        console.log('Kicking off the daily matchmaking job...');
        runMatchmaking();
    }, {
        timezone: "America/New_York" // Set to your target timezone
    });

    // 2. Unfreeze Job (runs every minute)
    cron.schedule('*/5 * * * *', async () => {
        console.log('Checking for users to unfreeze...');
        const now = new Date();
        const frozenUsers = await User.find({
            status: 'FROZEN',
            freezeUntil: { $lte: now }
        });

        if (frozenUsers.length > 0) {
            for (const user of frozenUsers) {
                user.status = 'AVAILABLE';
                user.freezeUntil = null;
                await user.save();
                console.log(`User ${user.name} has been unfrozen.`);
            }
        }
    });
};

module.exports = { startSchedules };
// backend/controllers/matchController.js
const Match = require('../models/Match');
const User = require('../models/User');

// @desc    Unpin a match
// @route   POST /api/matches/:id/unpin
// @access  Private
const unpinMatch = async (req, res) => {
    const matchId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    try {
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
        if (!match.isActive) {
            return res.status(400).json({ message: "Match is already inactive" });
        }
        
        // Update the match document
        match.isActive = false;
        match.unpinnedBy = userId;
        match.unpinReason = reason;
        await match.save();

        // Find the other user in the match
        const otherUserId = match.users.find(id => id.toString() !== userId);

        // Update the user who unpinned (the freezer)
        await User.findByIdAndUpdate(userId, {
            status: 'FROZEN',
            freezeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            currentMatchId: null
        });

        // Update the other user (gets a new match soon)
        const otherUser = await User.findByIdAndUpdate(otherUserId, {
            status: 'AVAILABLE',
            currentMatchId: null
        });
        
        // In a real app, you would use a proper job queue (like Agenda or BullMQ)
        // For this project, a simple setTimeout demonstrates the concept.
        console.log(`Scheduling new match for user ${otherUser.name} in 2 hours.`);
        setTimeout(() => {
            console.log(`Triggering special matchmaking for user ${otherUser.name}`);
            // Here you would call a specific matchmaking function for just this user.
            // For simplicity, we'll rely on the main cron job for now.
        }, 2 * 60 * 60 * 1000);

        res.json({ message: "Match unpinned successfully. Reflection period started." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { unpinMatch };
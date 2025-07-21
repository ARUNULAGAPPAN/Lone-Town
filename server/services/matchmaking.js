// backend/services/matchmaking.js
const User = require('../models/User');
const Match = require('../models/Match');

// A simple scoring function based on our 3LCS algorithm concept
const calculateCompatibility = (userA, userB) => {
    let score = 0;

    // Layer 1: Psychology & Values (40% weight)
    let psychScore = 0;
    if (userA.profile.psychology.conflictStyle === userB.profile.psychology.conflictStyle) psychScore += 10;
    if (userA.profile.psychology.loveLanguage === userB.profile.psychology.loveLanguage) psychScore += 10;
    // Lower distance is better for personality traits
    psychScore += 20 - (Math.abs(userA.profile.psychology.openness - userB.profile.psychology.openness) * 2);
    score += psychScore * 0.4;

    // Layer 2: Behavioral Intentionality (40% weight)
    // We prefer users who are both highly intentional
    let behavioralScore = (userA.behavioral.profileCompletion + userB.behavioral.profileCompletion) / 2;
    // Penalize for high unpin frequency
    behavioralScore -= (userA.behavioral.unpinFrequency + userB.behavioral.unpinFrequency) * 5;
    score += Math.max(0, behavioralScore) * 0.4;

    // Layer 3: Surface Preferences (20% weight) - Basic check
    // This part would be more complex, checking age overlap etc.
    // For now, let's assume it's a small boost.
    score += 10 * 0.2;

    return score;
};

const runMatchmaking = async () => {
    console.log('Running daily matchmaking...');
    const availableUsers = await User.find({ status: 'AVAILABLE' });
    const matchedUserIds = new Set();

    for (const user of availableUsers) {
        if (matchedUserIds.has(user.id)) continue; // Skip if already matched in this run

        let bestMatch = null;
        let highestScore = -1;

        for (const potentialPartner of availableUsers) {
            if (user.id === potentialPartner.id || matchedUserIds.has(potentialPartner.id)) continue;

            const score = calculateCompatibility(user, potentialPartner);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = potentialPartner;
            }
        }

        if (bestMatch) {
            console.log(`Match found: ${user.name} and ${bestMatch.name} with score ${highestScore}`);
            
            // Create the match
            const newMatch = await Match.create({ users: [user._id, bestMatch._id] });

            // Update both users
            const userUpdate = { status: 'MATCHED', currentMatchId: newMatch._id };
            await User.findByIdAndUpdate(user._id, userUpdate);
            await User.findByIdAndUpdate(bestMatch._id, userUpdate);

            // Add both to the set of matched users for this run
            matchedUserIds.add(user.id);
            matchedUserIds.add(bestMatch.id);
        }
    }
    console.log('Matchmaking finished.');
};

module.exports = { runMatchmaking };
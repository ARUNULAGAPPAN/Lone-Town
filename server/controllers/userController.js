// C:\Users\Arun\Desktop\Lone Town\server\controllers\userController.js

const Match = require('../models/Match');
const User = require('../models/User');
// @desc    Get current user's profile and state
// @route   GET /api/users/me
// @access  Private
const getAvailableUsers = async (req, res) => {
    try {
        // Find users who are 'AVAILABLE' and are not the current user
        const availableUsers = await User.find({ 
            status: 'AVAILABLE', 
            _id: { $ne: req.user.id } // $ne means "not equal"
        }).select('name profile.bio profile.profilePictureUrl'); // Only select public info

        res.json(availableUsers);
    } catch (error) {
        console.error("Error fetching available users:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.status === 'MATCHED' && user.currentMatchId) {
      const match = await Match.findById(user.currentMatchId).populate('users', 'name profile.bio');
      return res.json({ user, match });
    }
    
    res.json({ user });

  } catch (error) {
    console.error("Error in getMyProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =========================================================================
// == THIS IS THE FUNCTION THAT IS MISSING FROM YOUR FILE ==
// =========================================================================
// @desc    Update user profile after onboarding
// @route   PUT /api/users/onboarding
// @access  Private
const updateUserOnboarding = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.body.profile) {
            return res.status(400).json({ message: 'Profile data is missing in the request.' });
        }

        user.profile = req.body.profile;
        user.status = 'AVAILABLE';
        user.behavioral.profileCompletion = 100; 

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully!', user });

    } catch (error) {
        console.error("Error in updateUserOnboarding:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
// Paste this entire block into your userController.js file

// @desc    Get a user's public profile by their ID
// @route   GET /api/users/profile/:id
// @access  Private (so only logged-in users can view profiles)
const getUserProfileById = async (req, res) => {
    try {
        // Find the user by the ID from the URL parameter
        const user = await User.findById(req.params.id).select('name profile'); // Only send public info

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);

    } catch (error) {
        console.error("Error fetching user profile by ID:", error);
        // This handles cases where the provided ID is not a valid MongoDB ID format
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};


// =========================================================================
// == THIS IS THE EXPORT LINE THAT USES BOTH FUNCTIONS ==
// =========================================================================
// Now that BOTH functions are defined above, this line will work correctly.
module.exports = { 
    getMyProfile,
    updateUserOnboarding,
    getAvailableUsers,
    getUserProfileById   
};
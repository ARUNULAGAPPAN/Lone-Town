// backend/routes/userRoutes.js - CORRECTED AND CLEANED UP

const express = require('express');
const router = express.Router();

// --- ONE SINGLE IMPORT FOR ALL YOUR CONTROLLERS ---
const { 
    getMyProfile, 
    updateUserOnboarding, 
    getAvailableUsers,
    getUserProfileById // Including this for the ViewProfilePage functionality
} = require('../controllers/userController');

// --- ONE SINGLE IMPORT FOR YOUR MIDDLEWARE ---
const { protect } = require('../middleware/authMiddleware');

// --- YOUR ROUTES ---
router.get('/me', protect, getMyProfile);
router.put('/onboarding', protect, updateUserOnboarding);
router.get('/available', protect, getAvailableUsers);
router.get('/profile/:id', protect, getUserProfileById); // Route for the ViewProfilePage

module.exports = router;
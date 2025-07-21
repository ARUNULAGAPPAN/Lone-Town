// backend/models/User.js - FINAL CORRECTED SYNTAX

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // --- Core User Information ---
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },

  // --- Application State Management ---
  status: {
    type: String,
    enum: ['ONBOARDING', 'AVAILABLE', 'MATCHED', 'FROZEN'],
    default: 'ONBOARDING'
  },
  currentMatchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Match', 
    default: null 
  },
  freezeUntil: { type: Date, default: null },

  // --- Main Profile Object ---
  profile: {
    // --- Essential Identity & Contact Fields ---
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      default: 'other' 
    },
    interestedIn: { 
      type: String, 
      enum: ['male', 'female', 'everyone'], 
      default: 'everyone' 
    },
    profilePictureUrl: { 
      type: String, 
      default: ''
    },
    whatsappNumber: { 
      type: String, 
      default: ''
    },
    displayLocation: {
      type: String,
      default: ''
    },

    // --- Descriptive Fields ---
    bio: { type: String, default: '' },
    photos: { type: [String], default: [] },
    
    // --- Psychological & Value-Based Fields for Matching ---
    psychology: {
        conflictStyle: { type: String, default: 'collaborator' },
        loveLanguage: { type: String, default: 'quality_time' },
        openness: { type: Number, default: 3 },
        conscientiousness: { type: Number, default: 3 },
        extraversion: { type: Number, default: 3 },
    }, // <-- The closing brace for psychology is now in the correct place.
    
    preferences: {
        ageRange: { 
            min: { type: Number, default: 18 },
            max: { type: Number, default: 99 }
        },
    }
  }, // <-- The closing brace for the entire profile object is here.

  // --- Behavioral Tracking Section ---
  behavioral: {
    profileCompletion: { type: Number, default: 0 },
    unpinFrequency: { type: Number, default: 0 },
  }
}, { timestamps: true }); // This is now in a valid position after the main schema object.

module.exports = mongoose.model('User', UserSchema);
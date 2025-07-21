// backend/models/Match.js
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  
  isActive: { type: Boolean, default: true },
  
  unpinnedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  unpinReason: { type: String, default: null }, // e.g., 'no_spark', 'values_mismatch'
  
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  
  messageCount: { type: Number, default: 0 },
  
  videoCallUnlocked: { type: Boolean, default: false }
}, { timestamps: true }); // `createdAt` is the match start time

module.exports = mongoose.model('Match', MatchSchema);
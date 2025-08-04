const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  bloodType: { type: String, required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hospital: String,
  location: String,
  description: String,
  requestedDate: Date,
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);

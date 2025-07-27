const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['donor', 'recipient', 'hospital'], required: true },
  bloodGroup: String,
  location: String,
  lastDonationDate: Date
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  profilePhoto: { type: String },
  skillsOffered: [String],
  skillsWanted: [String],
  availability: {
    weekends: { type: Boolean, default: false },
    evenings: { type: Boolean, default: false }
  },
  isPublic: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  banned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

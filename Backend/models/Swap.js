const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillOffered: { type: String, required: true },
    skillRequested: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Swap', swapSchema);
  
  
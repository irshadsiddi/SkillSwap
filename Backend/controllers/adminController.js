const User = require('../models/User');
const Swap = require('../models/Swap');
const Feedback = require('../models/Feedback');

exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { banned: true }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSwapStats = async (req, res) => {
  try {
    const total = await Swap.countDocuments();
    const pending = await Swap.countDocuments({ status: 'pending' });
    const accepted = await Swap.countDocuments({ status: 'accepted' });
    res.status(200).json({ total, pending, accepted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

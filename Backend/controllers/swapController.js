const Swap = require('../models/Swap');

exports.requestSwap = async (req, res) => {
  try {
    const swap = await Swap.create(req.body);
    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserSwaps = async (req, res) => {
  try {
    const { userId } = req.params;
    const swaps = await Swap.find({
      $or: [{ requester: userId }, { receiver: userId }]
    }).populate('requester receiver');
    res.status(200).json(swaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected', 'cancelled'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const swap = await Swap.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicProfiles = async (req, res) => {
  try {
    const { skill } = req.query;
    const query = { isPublic: true };

    if (skill) {
      query.$or = [
        { skillsOffered: skill },
        { skillsWanted: skill }
      ];
    }

    const users = await User.find(query).select('-__v');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

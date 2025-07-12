const User = require('../models/User');
const Swap = require('../models/Swap');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, location, profilePhoto, skillsOffered, skillsWanted, availability, isPublic } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, location, profilePhoto, skillsOffered, skillsWanted, availability, isPublic });

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.status(200).json({ user, token });
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

    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const profileId = req.params.id;
  const viewer = req.user;

  const profile = await User.findById(profileId).select('-password');
  if (!profile) return res.status(404).json({ message: "User not found" });

  if (profile.isPublic || viewer?.id === profileId || viewer?.role === 'admin') {
    return res.status(200).json(profile);
  }

  const hasSwap = await Swap.exists({ requester: profileId, receiver: viewer.id });

  if (hasSwap) {
    return res.status(200).json(profile);
  }

  return res.status(403).json({ message: "This profile is private" });
};
exports.updateUserProfile = async (req, res) => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
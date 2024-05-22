const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getUsers, deleteUser, resetPassword, updateUserRole } = require('../controllers/adminController');


router.get('/users', auth, role('admin'), getUsers);
router.delete('/users/:id', auth, role('admin'), deleteUser);
router.put('/users/:id/reset-password', auth, role('admin'), resetPassword);
router.put('/users/:id/role', auth, role('admin'), updateUserRole);


// Get all users
router.get('/users', auth, role('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a new user
router.post('/users', auth, role('admin'), async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update a user
router.put('/users/:id', auth, role('admin'), async (req, res) => {
  const { username, email, role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a user
router.delete('/users/:id', auth, role('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Reset user password
router.put('/users/:id/reset-password', auth, role('admin'), async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash('newpassword', salt); // Reset to a default password
      await user.save();
  
      res.json({ msg: 'Password has been reset' });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).send('Server error');
    }
  });

module.exports = router;

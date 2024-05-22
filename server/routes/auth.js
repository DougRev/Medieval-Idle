const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/register', register);
router.post('/login', login);
router.get('/user', auth, getUser);

// Change password
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password successfully changed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Edit username
router.put('/edit-username', auth, async (req, res) => {
    const { username } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      user.username = username;
      await user.save();
  
      res.json({ msg: 'Username successfully updated' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;

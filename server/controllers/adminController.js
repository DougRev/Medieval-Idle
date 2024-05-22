const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.password = await bcrypt.hash('newpassword', 10);
    await user.save();
    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = req.body.role;
    await user.save();
    res.json({ msg: 'Role updated successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

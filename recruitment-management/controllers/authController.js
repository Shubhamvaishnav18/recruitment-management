const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signup = async (req, res) => {
  const { name, email, password, userType, profileHeadline, address } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, userType, profileHeadline, address });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).send({ error: 'Invalid login credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
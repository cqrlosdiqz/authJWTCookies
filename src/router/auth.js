const route = require('express').Router();
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

route.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new UserModel({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: 'Acount Created Successfully',
    });
  } catch (error) {
    const errorMessage = 'Error to create user';
    console.error(`${errorMessage}: `, error.message);
    next(new Error(errorMessage));
  }
});

route.get('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    const compare = await user.comparePassword(password);
    if (compare) {
      const token = jwt.sign({ userId: user._id }, user.secret_key, {
        expiresIn: '24h',
      });
      const userLogin = {
        token,
        email: user.email,
      };
      res.cookie('token', token);
      return res
        .status(200)
        .json({ success: true, message: 'Auth Successful', userLogin });
    } else {
      res.status(401).json({
        success: true,
        message: 'Password is Incorrect !',
      });
    }
  } catch (error) {
    const errorMessage = 'Error to login user';
    console.error(`${errorMessage}: `, error.message);
    next(new Error(errorMessage));
  }
});

module.exports = route;

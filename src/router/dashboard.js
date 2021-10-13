const route = require('express').Router();
const authenticateJWT = require('../utils/authenticateJWT');
const UserModel = require('../models/User');

route.get('/', authenticateJWT, async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await UserModel.findById(
      { _id: userId },
      { password: 0, secret_key: 0, __v: 0 }
    );

    res.send(
      `<h1>Dashboard</h1><h2>User Logged: ${user.username}</h2><p>Email: ${user.email}</p>`
    );

    
  } catch (error) {
    const errorMessage = 'User does not exist';
    console.error(`${errorMessage}: `, error.message);
    next(new Error(errorMessage));
  }
});

module.exports = route;

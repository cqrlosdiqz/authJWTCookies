const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.header(process.env.HEADER_AUTH);
  try {
    const token = authHeader.split(' ')[1];
    const { userId } = jwt.decode(token); // not verify

    const user = await UserModel.findById({ _id: userId }, { __v: 0 });
    if (user) {
      jwt.verify(token, user.secret_key, (err, userDecoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = userDecoded;
        next();
      });
    } else {
      res.status(403).json({ success: false, message: 'Unauthorized Access' });
    }
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized Access' });
  }
};

module.exports = authenticateJWT;

const jwt = require('jsonwebtoken');
const config = require('../config');
const User =require('../models/user');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded=await jwt.verify(token, config.accessTokenSecret);
      const user =await User.findById(decoded.id);
      if (!user) return res.status(403).json({'msg': 'not authorized'});

      req.user = user;
      next();
    } else {
      return res.status(401).json({'msg': 'not authenticated'});
    }
  } catch (err) {
    return res.status(403).json({'msg': 'not authorized'});
  }
};

module.exports = authenticateJWT;

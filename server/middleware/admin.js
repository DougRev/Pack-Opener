const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
  // Assuming the auth middleware has already run and set req.user
  console.log('Request user in admin middleware:', req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = admin;
